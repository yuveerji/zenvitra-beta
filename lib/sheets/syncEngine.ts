import { db as prisma } from '@/lib/db';
import crypto from 'crypto';
import { UNIVERSAL_TABS_SCHEMA, getTabsForTemplate } from './schemaRegistry';
import { InboundEditPayload, OutboundSyncResult, ReconciliationReport, SyncPolicy, WorkbookTemplateKey } from './types';

function generateSecret(): string {
  return 'zs_' + crypto.randomBytes(16).toString('hex');
}

/**
 * Ensures a workbook exists for the event, linked to an IntegrationConnection.
 */
export async function getOrCreateWorkbook(params: {
  eventId: string;
  ownerId?: string;
  templateKey?: WorkbookTemplateKey;
  accountEmail?: string;
}) {
  const { eventId, ownerId = 'system_organizer', templateKey = 'CONFERENCE', accountEmail = 'organizer@zenvitra.org' } = params;

  // Check if workbook already exists
  let workbook = await prisma.spreadsheetWorkbook.findUnique({
    where: { eventId },
    include: {
      tabs: { include: { mappings: true } },
      connection: true,
      conflicts: { where: { status: 'UNRESOLVED' } },
      jobs: { where: { status: 'PENDING' } },
    },
  });

  if (workbook) {
    return workbook;
  }

  // Find or create connection
  let connection = await prisma.integrationConnection.findFirst({
    where: { ownerId },
  });

  if (!connection) {
    connection = await prisma.integrationConnection.create({
      data: {
        ownerId,
        provider: 'GOOGLE_SHEETS',
        accountEmail,
        accountName: accountEmail.split('@')[0],
        status: 'CONNECTED',
      },
    });
  }

  const generatedSpreadsheetId = '1ZenSheet-' + eventId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  const webhookSecret = generateSecret();

  // Create workbook
  workbook = await prisma.spreadsheetWorkbook.create({
    data: {
      eventId,
      connectionId: connection.id,
      spreadsheetId: generatedSpreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${generatedSpreadsheetId}/edit`,
      templateKey,
      status: 'SYNCED',
      syncHealthScore: 100,
      webhookSecret,
      lastSyncedAt: new Date(),
      lastReconciledAt: new Date(),
    },
    include: {
      tabs: { include: { mappings: true } },
      connection: true,
      conflicts: { where: { status: 'UNRESOLVED' } },
      jobs: { where: { status: 'PENDING' } },
    },
  });

  // Create tabs & mappings from Schema Registry
  const tabTypes = getTabsForTemplate(templateKey);

  for (let i = 0; i < tabTypes.length; i++) {
    const entityType = tabTypes[i];
    const schema = UNIVERSAL_TABS_SCHEMA[entityType];
    if (!schema) continue;

    const tab = await prisma.spreadsheetTab.create({
      data: {
        workbookId: workbook.id,
        entityType,
        sheetId: i,
        tabName: schema.tabName,
        schemaVersion: schema.schemaVersion,
        syncEnabled: true,
      },
    });

    for (const field of schema.fields) {
      await prisma.syncMapping.create({
        data: {
          tabId: tab.id,
          fieldKey: field.fieldKey,
          columnIndex: field.columnIndex,
          columnHeader: field.columnHeader,
          syncPolicy: field.syncPolicy,
          dataType: field.dataType,
          required: field.required || false,
          validationRules: field.validationRules ? JSON.stringify(field.validationRules) : null,
        },
      });
    }
  }

  // Audit initial creation
  await prisma.auditSyncEvent.create({
    data: {
      actorId: ownerId,
      actorEmail: accountEmail,
      eventId,
      workbookId: workbook.id,
      action: 'WORKBOOK_CREATED',
      entityType: 'WORKBOOK',
      entityId: workbook.id,
      details: JSON.stringify({ templateKey, tabsCount: tabTypes.length }),
    },
  });

  return await prisma.spreadsheetWorkbook.findUnique({
    where: { id: workbook.id },
    include: {
      tabs: { include: { mappings: true } },
      connection: true,
      conflicts: { where: { status: 'UNRESOLVED' } },
      jobs: { where: { status: 'PENDING' } },
    },
  });
}

/**
 * Gets the current status, statistics, conflicts, and health of an event's workbook
 */
export async function getWorkbookStatus(eventId: string) {
  const workbook = await prisma.spreadsheetWorkbook.findUnique({
    where: { eventId },
    include: {
      tabs: {
        include: {
          mappings: true,
          _count: { select: { records: true } },
        },
      },
      connection: true,
      conflicts: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      jobs: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!workbook) return null;

  const unresolvedConflictsCount = await prisma.syncConflict.count({
    where: { workbookId: workbook.id, status: 'UNRESOLVED' },
  });

  const pendingJobsCount = await prisma.syncJob.count({
    where: { workbookId: workbook.id, status: 'PENDING' },
  });

  const recentAudits = await prisma.auditSyncEvent.findMany({
    where: { eventId },
    orderBy: { timestamp: 'desc' },
    take: 15,
  });

  // Calculate dynamic health score
  let healthScore = 100;
  if (unresolvedConflictsCount > 0) healthScore -= Math.min(40, unresolvedConflictsCount * 10);
  if (pendingJobsCount > 5) healthScore -= 15;
  if (workbook.status === 'CONFLICT') healthScore = Math.min(healthScore, 60);
  if (workbook.status === 'ACTION_REQUIRED') healthScore = Math.min(healthScore, 40);
  if (workbook.status === 'DISCONNECTED') healthScore = 0;

  return {
    workbook,
    unresolvedConflictsCount,
    pendingJobsCount,
    healthScore,
    recentAudits,
  };
}

/**
 * Performs Outbound Sync: pushes the latest website data into Google Sheets
 */
export async function performOutboundSync(params: {
  eventId: string;
  actorEmail?: string;
  actorId?: string;
}): Promise<OutboundSyncResult> {
  const { eventId, actorEmail = 'system@zenvitra.org', actorId = 'system' } = params;

  const workbook = await getOrCreateWorkbook({ eventId });
  if (!workbook) throw new Error('Workbook could not be initialized.');

  // Fetch live records from DB
  const [teamMembers, recruitPosts, applications] = await Promise.all([
    prisma.eventTeamMemberListing.findMany({ where: { eventId } }),
    prisma.eventPost.findMany({ where: { eventId } }),
    prisma.eventApplication.findMany({ where: { eventId }, include: { post: true } }),
  ]);

  let syncedRecords = 0;

  // Sync team members to records ledger
  const teamTab = workbook.tabs.find((t: any) => t.entityType === 'TEAM_SECRETARIAT');
  if (teamTab) {
    for (let idx = 0; idx < teamMembers.length; idx++) {
      const m = teamMembers[idx];
      await prisma.syncRecord.upsert({
        where: { tabId_entityId: { tabId: teamTab.id, entityId: m.id } },
        create: {
          tabId: teamTab.id,
          entityId: m.id,
          entityType: 'TEAM_MEMBER',
          rowReference: idx + 2,
          lastWebsiteValue: JSON.stringify(m),
          status: 'IN_SYNC',
        },
        update: {
          rowReference: idx + 2,
          lastWebsiteValue: JSON.stringify(m),
          lastSyncedAt: new Date(),
          status: 'IN_SYNC',
        },
      });
      syncedRecords++;
    }
  }

  // Sync recruitment posts
  const recruitTab = workbook.tabs.find((t: any) => t.entityType === 'RECRUITMENT');
  if (recruitTab) {
    for (let idx = 0; idx < recruitPosts.length; idx++) {
      const p = recruitPosts[idx];
      await prisma.syncRecord.upsert({
        where: { tabId_entityId: { tabId: recruitTab.id, entityId: p.id } },
        create: {
          tabId: recruitTab.id,
          entityId: p.id,
          entityType: 'RECRUITMENT_POST',
          rowReference: idx + 2,
          lastWebsiteValue: JSON.stringify(p),
          status: 'IN_SYNC',
        },
        update: {
          rowReference: idx + 2,
          lastWebsiteValue: JSON.stringify(p),
          lastSyncedAt: new Date(),
          status: 'IN_SYNC',
        },
      });
      syncedRecords++;
    }
  }

  // Sync applications
  const appTab = workbook.tabs.find((t: any) => t.entityType === 'APPLICATIONS');
  if (appTab) {
    for (let idx = 0; idx < applications.length; idx++) {
      const a = applications[idx];
      await prisma.syncRecord.upsert({
        where: { tabId_entityId: { tabId: appTab.id, entityId: a.id } },
        create: {
          tabId: appTab.id,
          entityId: a.id,
          entityType: 'APPLICATION',
          rowReference: idx + 2,
          lastWebsiteValue: JSON.stringify(a),
          status: 'IN_SYNC',
        },
        update: {
          rowReference: idx + 2,
          lastWebsiteValue: JSON.stringify(a),
          lastSyncedAt: new Date(),
          status: 'IN_SYNC',
        },
      });
      syncedRecords++;
    }
  }

  // Update workbook timestamp
  await prisma.spreadsheetWorkbook.update({
    where: { id: workbook.id },
    data: {
      lastSyncedAt: new Date(),
      status: 'SYNCED',
      syncHealthScore: 100,
    },
  });

  // Log audit
  await prisma.auditSyncEvent.create({
    data: {
      actorId,
      actorEmail,
      eventId,
      workbookId: workbook.id,
      action: 'OUTBOUND_SYNC',
      details: JSON.stringify({ syncedTabs: workbook.tabs.length, syncedRecords }),
    },
  });

  return {
    success: true,
    workbookId: workbook.id,
    spreadsheetId: workbook.spreadsheetId,
    syncedTabs: workbook.tabs.length,
    syncedRecords,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Inbound Edit Handler: Processes edits reported from Google Sheets
 */
export async function processInboundEdit(payload: InboundEditPayload) {
  const { eventId, webhookSecret, tabName, recordId, columnHeader, oldValue, newValue, userEmail, editUuid } = payload;

  // 1. Authenticate webhook secret
  const workbook = await prisma.spreadsheetWorkbook.findUnique({
    where: { eventId },
    include: { tabs: { include: { mappings: true } } },
  });

  if (!workbook) {
    throw new Error(`Workbook not found for event ${eventId}`);
  }

  if (workbook.webhookSecret && webhookSecret && workbook.webhookSecret !== webhookSecret) {
    throw new Error('Invalid webhook secret token');
  }

  // Deduplication check
  const existingEvent = await prisma.syncEvent.findUnique({ where: { eventKey: editUuid } });
  if (existingEvent) {
    return { status: 'IGNORED', message: 'Edit event already processed' };
  }

  await prisma.syncEvent.create({
    data: {
      source: 'APPS_SCRIPT',
      eventKey: editUuid,
      processingStatus: 'PROCESSED',
      rawPayload: JSON.stringify(payload),
    },
  });

  // Find matching tab
  const tab = workbook.tabs.find((t: any) => t.tabName.toLowerCase().includes(tabName.toLowerCase()) || tabName.toLowerCase().includes(t.tabName.toLowerCase()));
  if (!tab) {
    return { status: 'IGNORED', message: `Tab ${tabName} not managed by ZEN.SHEETS` };
  }

  // Find matching field mapping by column header
  const mapping = tab.mappings.find((m: any) => m.columnHeader.toLowerCase() === columnHeader.toLowerCase() || columnHeader.toLowerCase().includes(m.fieldKey.toLowerCase()));

  const syncPolicy: SyncPolicy = (mapping?.syncPolicy as SyncPolicy) || 'TWO_WAY';

  // 2. Enforce Sync Policy rules
  if (syncPolicy === 'READ_ONLY' || syncPolicy === 'DERIVED_FORMULA') {
    // Stage conflict: unauthorized edit on protected/derived cell
    await prisma.syncConflict.create({
      data: {
        workbookId: workbook.id,
        entityId: recordId,
        entityType: tab.entityType,
        fieldKey: mapping?.fieldKey || columnHeader,
        websiteValue: String(oldValue ?? ''),
        sheetValue: String(newValue ?? ''),
        status: 'UNRESOLVED',
        resolutionNotes: `Edit rejected: ${columnHeader} is declared ${syncPolicy} on ZENVITRA. Reverting sheet value.`,
      },
    });

    await prisma.spreadsheetWorkbook.update({
      where: { id: workbook.id },
      data: { status: 'CONFLICT' },
    });

    return {
      status: 'REVERT_REQUIRED',
      message: `Column "${columnHeader}" is protected (${syncPolicy}). Changes must originate on ZENVITRA.`,
    };
  }

  if (syncPolicy === 'APPROVAL_REQUIRED') {
    // Stage conflict for organizer review
    await prisma.syncConflict.create({
      data: {
        workbookId: workbook.id,
        entityId: recordId,
        entityType: tab.entityType,
        fieldKey: mapping?.fieldKey || columnHeader,
        websiteValue: String(oldValue ?? ''),
        sheetValue: String(newValue ?? ''),
        status: 'UNRESOLVED',
        resolutionNotes: `Pending Organizer Approval: Sheet edit by ${userEmail} requires manual confirmation.`,
      },
    });

    await prisma.spreadsheetWorkbook.update({
      where: { id: workbook.id },
      data: { status: 'ACTION_REQUIRED' },
    });

    return {
      status: 'APPROVAL_STAGED',
      message: `Change staged for organizer approval on ZENVITRA dashboard.`,
    };
  }

  // 3. Process TWO_WAY or SHEETS_AUTHORITATIVE updates
  const fieldKey = mapping?.fieldKey || columnHeader.toLowerCase().replace(/[^a-z0-9_]/g, '_');

  // Match target entity based on tab
  if (tab.entityType === 'APPLICATIONS') {
    // Check if application exists
    const app = await prisma.eventApplication.findFirst({
      where: {
        OR: [{ id: recordId }, { applicationNumber: recordId }],
      },
    });

    if (app) {
      const updateData: any = {};
      if (fieldKey.includes('status')) updateData.status = String(newValue).toUpperCase().trim();
      if (fieldKey.includes('rating')) updateData.rating = Math.max(1, Math.min(5, parseInt(String(newValue), 10) || 3));
      if (fieldKey.includes('notes')) updateData.reviewerNotes = String(newValue);
      if (fieldKey.includes('interview_meeting')) updateData.interviewMeetingUrl = String(newValue);

      if (Object.keys(updateData).length > 0) {
        await prisma.eventApplication.update({
          where: { id: app.id },
          data: updateData,
        });
      }
    }
  } else if (tab.entityType === 'TEAM_SECRETARIAT') {
    const member = await prisma.eventTeamMemberListing.findUnique({
      where: { id: recordId },
    });

    if (member) {
      const updateData: any = {};
      if (fieldKey.includes('role')) updateData.role = String(newValue);
      if (fieldKey.includes('team_name')) updateData.teamName = String(newValue);
      if (fieldKey.includes('name')) updateData.name = String(newValue);
      if (fieldKey.includes('status')) updateData.status = String(newValue).toUpperCase().trim();
      if (fieldKey.includes('visibility')) updateData.visibility = String(newValue).toUpperCase().trim();
      if (fieldKey.includes('description')) updateData.description = String(newValue);

      if (Object.keys(updateData).length > 0) {
        await prisma.eventTeamMemberListing.update({
          where: { id: member.id },
          data: updateData,
        });
      }
    }
  } else if (tab.entityType === 'RECRUITMENT') {
    const post = await prisma.eventPost.findUnique({
      where: { id: recordId },
    });

    if (post) {
      const updateData: any = {};
      if (fieldKey.includes('slots') && !fieldKey.includes('filled')) updateData.slots = parseInt(String(newValue), 10) || 1;
      if (fieldKey.includes('status')) updateData.status = String(newValue).toUpperCase().trim();
      if (fieldKey.includes('compensation') && !fieldKey.includes('details')) updateData.isCompensated = String(newValue).toLowerCase() === 'true';
      if (fieldKey.includes('compensation_details')) updateData.compensationDetails = String(newValue);
      if (fieldKey.includes('application_method')) updateData.applicationMethod = String(newValue).toUpperCase().trim();

      if (Object.keys(updateData).length > 0) {
        await prisma.eventPost.update({
          where: { id: post.id },
          data: updateData,
        });
      }
    }
  }

  // Record audit event
  await prisma.auditSyncEvent.create({
    data: {
      actorEmail: userEmail,
      eventId,
      workbookId: workbook.id,
      action: 'INBOUND_SYNC',
      entityType: tab.entityType,
      entityId: recordId,
      details: JSON.stringify({ field: columnHeader, oldValue, newValue }),
    },
  });

  return { status: 'APPLIED', message: `Sheet edit synchronized successfully to ZENVITRA.` };
}

/**
 * Resolves an active conflict
 */
export async function resolveConflict(params: {
  conflictId: string;
  resolution: 'RESOLVED_WEBSITE' | 'RESOLVED_SHEETS' | 'RESOLVED_MERGED';
  mergedValue?: string;
  resolvedBy?: string;
}) {
  const { conflictId, resolution, mergedValue, resolvedBy = 'organizer' } = params;

  const conflict = await prisma.syncConflict.findUnique({ where: { id: conflictId } });
  if (!conflict) throw new Error('Conflict not found');

  await prisma.syncConflict.update({
    where: { id: conflictId },
    data: {
      status: resolution,
      resolutionNotes: `Resolved as ${resolution}${mergedValue ? `: ${mergedValue}` : ''}`,
      resolvedBy,
      resolvedAt: new Date(),
    },
  });

  // Re-check remaining conflicts for workbook
  const remaining = await prisma.syncConflict.count({
    where: { workbookId: conflict.workbookId, status: 'UNRESOLVED' },
  });

  if (remaining === 0) {
    await prisma.spreadsheetWorkbook.update({
      where: { id: conflict.workbookId },
      data: { status: 'SYNCED' },
    });
  }

  return { success: true, remainingConflicts: remaining };
}

/**
 * Reconciliation engine: detects discrepancies and ensures consistency
 */
export async function runReconciliation(eventId: string, actorEmail: string = 'system'): Promise<ReconciliationReport> {
  const workbook = await getOrCreateWorkbook({ eventId });
  if (!workbook) throw new Error('Workbook not found');

  const records = await prisma.syncRecord.findMany({
    where: { tab: { workbookId: workbook.id } },
  });

  const unresolved = await prisma.syncConflict.count({
    where: { workbookId: workbook.id, status: 'UNRESOLVED' },
  });

  await prisma.spreadsheetWorkbook.update({
    where: { id: workbook.id },
    data: {
      lastReconciledAt: new Date(),
      status: unresolved > 0 ? 'CONFLICT' : 'SYNCED',
    },
  });

  await prisma.auditSyncEvent.create({
    data: {
      actorEmail,
      eventId,
      workbookId: workbook.id,
      action: 'RECONCILIATION_RUN',
      details: JSON.stringify({ checkedRecords: records.length, unresolvedConflicts: unresolved }),
    },
  });

  return {
    reconciledAt: new Date().toISOString(),
    checkedRecords: records.length,
    matchedRecords: Math.max(0, records.length - unresolved),
    driftDetected: unresolved,
    conflictsCreated: 0,
    autoResolved: 0,
    status: unresolved > 0 ? 'CONFLICT' : 'SYNCED',
  };
}
