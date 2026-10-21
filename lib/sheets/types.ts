export type SyncPolicy =
  | 'TWO_WAY'
  | 'WEBSITE_AUTHORITATIVE'
  | 'SHEETS_AUTHORITATIVE'
  | 'APPROVAL_REQUIRED'
  | 'READ_ONLY'
  | 'DERIVED_FORMULA';

export type WorkbookTemplateKey =
  | 'CONFERENCE'
  | 'COMPETITION'
  | 'TALENT_SHOW'
  | 'WORKSHOP'
  | 'FESTIVAL'
  | 'CUSTOM';

export type TabEntityType =
  | 'DASHBOARD'
  | 'EVENT_CONFIG'
  | 'TEAM_SECRETARIAT'
  | 'COMMITTEES_ROLES'
  | 'RECRUITMENT'
  | 'APPLICATIONS'
  | 'ALLOCATIONS'
  | 'REGISTRATIONS'
  | 'ATTENDANCE'
  | 'TASKS_OPERATIONS'
  | 'PAYMENTS_SUMMARY'
  | 'AUDIT_SYNC_LOG'
  | 'CUSTOM';

export type SyncStatus =
  | 'SYNCED'
  | 'SYNCING'
  | 'CONFLICT'
  | 'ACTION_REQUIRED'
  | 'DISCONNECTED'
  | 'PAUSED';

export interface FieldMappingDefinition {
  fieldKey: string;
  columnHeader: string;
  columnIndex: string;
  syncPolicy: SyncPolicy;
  dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'JSON';
  required?: boolean;
  description?: string;
  validationRules?: {
    allowedValues?: string[];
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface TabDefinition {
  entityType: TabEntityType;
  tabName: string;
  description: string;
  schemaVersion: number;
  syncPolicy: SyncPolicy;
  fields: FieldMappingDefinition[];
  defaultFormulaNotes?: string[];
}

export interface InboundEditPayload {
  editUuid: string;
  eventId: string;
  webhookSecret: string;
  tabName: string;
  row: number;
  column: string;
  columnHeader: string;
  recordId: string; // Stable internal ID from column A
  fieldKey: string;
  oldValue: any;
  newValue: any;
  userEmail: string;
  timestamp: string;
}

export interface OutboundSyncResult {
  success: boolean;
  workbookId: string;
  spreadsheetId: string;
  syncedTabs: number;
  syncedRecords: number;
  errors?: string[];
  timestamp: string;
}

export interface ReconciliationReport {
  reconciledAt: string;
  checkedRecords: number;
  matchedRecords: number;
  driftDetected: number;
  conflictsCreated: number;
  autoResolved: number;
  status: SyncStatus;
}
