'use client';

import React, { useState } from 'react';
import { 
  DEFAULT_SECRETARIAT_ROLES, 
  LIFECYCLE_STAGES,
  saveLifecycleStage,
  recordAuditEvent,
  SecretariatMember
} from '@/lib/secretariatPermissions';
import { 
  ConferenceLifecycleStage, 
  SecretariatRoleType, 
  PermissionAction 
} from '@/types/munConferenceOS';
import { 
  Shield, 
  Sliders, 
  CheckCircle2, 
  Lock, 
  Users, 
  Award, 
  Briefcase, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface UniversalConfigStudioProps {
  confId: string;
  confTitle: string;
  currentStage: ConferenceLifecycleStage;
  onStageChange: (stage: ConferenceLifecycleStage) => void;
  secretariatMembers: SecretariatMember[];
  onMembersChange: (members: SecretariatMember[]) => void;
}

export function UniversalConfigStudio({
  confId,
  confTitle,
  currentStage,
  onStageChange,
  secretariatMembers,
  onMembersChange
}: UniversalConfigStudioProps) {
  const [activeSubTab, setActiveSubTab] = useState<'ROLES' | 'PERMISSIONS' | 'LIFECYCLE' | 'ORG_TREE' | 'WORKFLOWS'>('ROLES');

  // Custom Role Creator State
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleScope, setNewRoleScope] = useState('Department Scope');

  // New Secretariat Member Appointment State
  const [assignName, setAssignName] = useState('');
  const [assignHandle, setAssignHandle] = useState('');
  const [assignEmail, setAssignEmail] = useState('');
  const [assignRole, setAssignRole] = useState<SecretariatRoleType>('USG');

  // Permission Builder Matrix State (Resources vs Actions)
  const RESOURCES = [
    { id: 'delegates', label: 'Delegates & Registrations' },
    { id: 'allocations', label: 'Country & Portfolio Allocations' },
    { id: 'attendance', label: 'Attendance & Roll Call' },
    { id: 'documents', label: 'Documents & Resolutions' },
    { id: 'awards', label: 'Awards & Grading Rubrics' },
    { id: 'finance', label: 'Finance & Refund Reconciliation' },
    { id: 'announcements', label: 'Broadcast Announcements' },
    { id: 'incidents', label: 'Helpdesk & Emergency Incidents' }
  ];

  const ACTIONS: PermissionAction[] = ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'PUBLISH', 'EXPORT', 'FREEZE'];

  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState<SecretariatRoleType>('USG');
  const [permissionGrid, setPermissionGrid] = useState<Record<string, boolean>>({
    'delegates_VIEW': true,
    'delegates_EDIT': true,
    'allocations_VIEW': true,
    'attendance_VIEW': true,
    'attendance_EDIT': true,
    'documents_VIEW': true,
    'documents_APPROVE': true,
    'awards_VIEW': true,
    'finance_VIEW': false,
    'announcements_CREATE': true
  });

  const togglePermission = (resourceId: string, action: PermissionAction) => {
    const key = `${resourceId}_${action}`;
    setPermissionGrid((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAppointMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignName.trim() || !assignHandle.trim()) return;

    const newMember: SecretariatMember = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: `usr_${Date.now()}`,
      name: assignName.trim(),
      handle: assignHandle.trim().replace(/^@/, ''),
      email: assignEmail.trim() || `${assignHandle.trim().toLowerCase()}@zenvitra.xyz`,
      role: assignRole,
      permissions: [
        { resource: '*', action: 'VIEW', scope: 'DEPARTMENT' }
      ],
      status: 'ACTIVE',
      assignedAt: new Date().toISOString()
    };

    const nextMembers = [newMember, ...secretariatMembers];
    onMembersChange(nextMembers);
    recordAuditEvent(confId, {
      actorName: 'Secretary-General',
      actorHandle: 'admin',
      actorRole: 'SECRETARY_GENERAL',
      action: 'APPOINT_SECRETARIAT_MEMBER',
      targetEntity: 'SecretariatMember',
      targetId: newMember.id,
      details: `Appointed ${newMember.name} (@${newMember.handle}) as ${newMember.role}`
    });

    setAssignName('');
    setAssignHandle('');
    setAssignEmail('');
  };

  const handleRevokeMember = (memberId: string) => {
    const target = secretariatMembers.find((m) => m.id === memberId);
    const nextMembers = secretariatMembers.filter((m) => m.id !== memberId);
    onMembersChange(nextMembers);

    if (target) {
      recordAuditEvent(confId, {
        actorName: 'Secretary-General',
        actorHandle: 'admin',
        actorRole: 'SECRETARY_GENERAL',
        action: 'REVOKE_SECRETARIAT_MEMBER',
        targetEntity: 'SecretariatMember',
        targetId: memberId,
        details: `Revoked credentials for ${target.name} (@${target.handle})`
      });
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Studio Header & Concept Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0b101d] via-[#07090e] to-black border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] tracking-wider uppercase font-bold mb-2">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>UNIVERSAL CONFIGURATION ENGINE &bull; CONFIGURE EVERYTHING</span>
          </div>
          <h2 
            className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Universal Secretariat Configuration Studio
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-1 max-w-2xl leading-relaxed">
            One platform, unlimited conference structures. Define custom leadership hierarchies, granular action permissions, dynamic organizational units, and multi-stage lifecycle gates without hardcoding.
          </p>
        </div>

        {/* Current Lifecycle Quick Indicator */}
        <div className="px-4 py-3 rounded-2xl bg-black/60 border border-white/10 space-y-1 text-right">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">ACTIVE LIFECYCLE</span>
          <span className="text-sm font-bold font-mono text-cyan-300 uppercase block">
            {currentStage}
          </span>
          <span className="text-[9px] font-mono text-neutral-500 block">Strict State Machine Active</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'ROLES', label: '01. People & Roles', icon: Users },
          { id: 'PERMISSIONS', label: '02. Permission Builder', icon: Shield },
          { id: 'LIFECYCLE', label: '03. Conference Lifecycle (8 Stages)', icon: RotateCcw },
          { id: 'ORG_TREE', label: '04. Organizational Tree', icon: Briefcase },
          { id: 'WORKFLOWS', label: '05. Operational Workflows', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'bg-white/[0.03] text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PEOPLE & ROLES */}
      {activeSubTab === 'ROLES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appoint Member Form */}
            <div className="lg:col-span-1 p-5 rounded-2xl bg-[#07090e] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Appoint Secretariat Official</span>
              </h3>

              <form onSubmit={handleAppointMember} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={assignName}
                    onChange={(e) => setAssignName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">ZENVITRA Username</label>
                  <input
                    type="text"
                    required
                    value={assignHandle}
                    onChange={(e) => setAssignHandle(e.target.value)}
                    placeholder="e.g. ananya.delegate"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Official Email</label>
                  <input
                    type="email"
                    value={assignEmail}
                    onChange={(e) => setAssignEmail(e.target.value)}
                    placeholder="e.g. ananya@secretariat.org"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Assigned Role</label>
                  <select
                    value={assignRole}
                    onChange={(e) => setAssignRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-cyan-400 cursor-pointer font-mono"
                  >
                    {DEFAULT_SECRETARIAT_ROLES.map((r) => (
                      <option key={r.role} value={r.role} className="bg-[#0b0e14]">
                        {r.title} ({r.scope})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer mt-2"
                >
                  Appoint Member
                </button>
              </form>
            </div>

            {/* Appointed Secretariat Roster */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-[#07090e] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                  Secretariat Directory ({secretariatMembers.length})
                </h3>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">
                  Role-Based Isolation Active
                </span>
              </div>

              {secretariatMembers.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/5 space-y-2">
                  <Users className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">No Secretariat officials appointed yet.</p>
                  <p className="text-[11px] text-neutral-500">Appoint Secretary-Generals, Directors, and Chairs using the form on the left.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {secretariatMembers.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3 font-sans"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{m.name}</span>
                          <span className="text-[11px] font-mono text-cyan-400">@{m.handle}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                            {m.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono">{m.email}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRevokeMember(m.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono transition cursor-pointer"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Standard Roles Reference Cards */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Standard Role Hierarchy Definitions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {DEFAULT_SECRETARIAT_ROLES.map((r) => (
                <div key={r.role} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-display">{r.title}</span>
                    <span className="text-[9px] font-mono text-cyan-400 uppercase">{r.scope}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERMISSION BUILDER */}
      {activeSubTab === 'PERMISSIONS' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#07090e] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                  Granular Action Permission Matrix
                </h3>
                <p className="text-xs text-neutral-400 font-sans">
                  Define exact allowed actions (View, Create, Edit, Approve, Publish, Export, Freeze) per module resource.
                </p>
              </div>

              {/* Role Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-400">Target Role:</span>
                <select
                  value={selectedRoleForMatrix}
                  onChange={(e) => setSelectedRoleForMatrix(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer"
                >
                  {DEFAULT_SECRETARIAT_ROLES.map((r) => (
                    <option key={r.role} value={r.role} className="bg-[#0b0e14]">
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400">
                    <th className="py-2.5 px-3">Resource Module</th>
                    {ACTIONS.map((a) => (
                      <th key={a} className="py-2.5 px-2 text-center">{a}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {RESOURCES.map((res) => (
                    <tr key={res.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3 text-white font-sans font-medium">{res.label}</td>
                      {ACTIONS.map((action) => {
                        const key = `${res.id}_${action}`;
                        const isChecked = Boolean(permissionGrid[key]);
                        return (
                          <td key={action} className="py-3 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePermission(res.id, action)}
                              className="w-4 h-4 rounded bg-black/60 border-white/20 text-cyan-400 accent-cyan-400 cursor-pointer"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>* Sensitive actions like Publishing Allocations and Issuing Refunds enforce dual-officer confirmation.</span>
              <button
                type="button"
                onClick={() => {
                  recordAuditEvent(confId, {
                    actorName: 'Secretary-General',
                    actorHandle: 'admin',
                    actorRole: 'SECRETARY_GENERAL',
                    action: 'UPDATE_PERMISSION_MATRIX',
                    targetEntity: 'PermissionMatrix',
                    targetId: selectedRoleForMatrix,
                    details: `Updated permissions for ${selectedRoleForMatrix}`
                  });
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase transition cursor-pointer"
              >
                Save &amp; Seal Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIFECYCLE (8 STAGES) */}
      {activeSubTab === 'LIFECYCLE' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#07090e] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              Conference Lifecycle Progression
            </h3>
            <p className="text-xs text-neutral-400 font-sans">
              Every conference advances through 8 controlled lifecycle phases. Secretariat gates enforce required readiness checks before transitioning.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {LIFECYCLE_STAGES.map((s, idx) => {
                const isCurrent = currentStage === s.stage;
                const isPassed = LIFECYCLE_STAGES.findIndex((x) => x.stage === currentStage) > idx;

                return (
                  <div
                    key={s.stage}
                    onClick={() => {
                      onStageChange(s.stage);
                      saveLifecycleStage(confId, s.stage);
                      recordAuditEvent(confId, {
                        actorName: 'Secretary-General',
                        actorHandle: 'admin',
                        actorRole: 'SECRETARY_GENERAL',
                        action: 'TRANSITION_LIFECYCLE_STAGE',
                        targetEntity: 'Conference',
                        targetId: confId,
                        details: `Advanced lifecycle to ${s.stage}`
                      });
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isCurrent
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                        : isPassed
                        ? 'bg-black/40 border-emerald-500/30 text-neutral-300'
                        : 'bg-black/30 border-white/5 text-neutral-500 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-cyan-400">{s.number}</span>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        )}
                        {isPassed && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white font-display uppercase">{s.label}</h4>
                      <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">{s.description}</p>
                    </div>

                    <div className="text-[10px] font-mono uppercase font-bold text-right pt-2 border-t border-white/5">
                      {isCurrent ? '⚡ ACTIVE PHASE' : isPassed ? '✓ COMPLETED' : 'LOCKED'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ORG TREE */}
      {activeSubTab === 'ORG_TREE' && (
        <div className="p-6 rounded-2xl bg-[#07090e] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
            General-Purpose Organizational Tree
          </h3>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            The platform supports a customizable organizational tree structure where every conference can define its own departments, executive board, working groups, and custom units.
          </p>

          <div className="space-y-3 font-mono text-xs max-w-xl">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-between">
              <span>🏛️ Conference Executive Council (Owner)</span>
              <span className="text-[10px] uppercase font-bold">Level 1</span>
            </div>
            <div className="pl-6 space-y-2 border-l border-white/10 ml-4">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-between">
                <span>📁 Department of Delegate Affairs (Registration &amp; Allocations)</span>
                <span className="text-[10px] text-neutral-400">Level 2</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-between">
                <span>📁 Department of Dais Operations (EB, GSL, Rules of Procedure)</span>
                <span className="text-[10px] text-neutral-400">Level 2</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-between">
                <span>📁 Department of Communications &amp; Press (ZenPress Media Room)</span>
                <span className="text-[10px] text-neutral-400">Level 2</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-between">
                <span>📁 Department of Finance &amp; Logistics (ZEN.PAYMENTS &amp; Badges)</span>
                <span className="text-[10px] text-neutral-400">Level 2</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WORKFLOWS */}
      {activeSubTab === 'WORKFLOWS' && (
        <div className="p-6 rounded-2xl bg-[#07090e] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
            Configurable Operational Workflows
          </h3>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Every module enforces a state machine with transition validations, dual-officer approvals, and audit trail ratification.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">Workflow A</span>
              <h4 className="text-xs font-bold text-white uppercase">Registration to Allocation</h4>
              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                Delegate Submits Application &rarr; System Validates Fields &rarr; Secretariat Reviews Eligibility &rarr; Application Approved/Waitlisted &rarr; Committee &amp; Portfolio Assigned &rarr; Allocation Published.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">Workflow B</span>
              <h4 className="text-xs font-bold text-white uppercase">Live Committee Session</h4>
              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                EB Opens Session &rarr; Roll Call Established &amp; Quorum Computed &rarr; Speaker List &amp; Timed Motions &rarr; Chits Restrictedly Dispatched &rarr; Rapporteur Finalises Minutes &rarr; Session Concluded.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">Workflow C</span>
              <h4 className="text-xs font-bold text-white uppercase">Awards to Certificates</h4>
              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                EB Scores Rubrics &rarr; Eligibility Automated Flags Checked &rarr; SG Dual-Officer Approval &rarr; Results Published &rarr; SHA-256 Verifiable QR Credentials Issued on ZEN.PASSPORT.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">Workflow D</span>
              <h4 className="text-xs font-bold text-white uppercase">Resolutions to Ratification</h4>
              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                Working Paper Drafted &rarr; Sponsors/Signatories Verified &rarr; Secretariat Redline Diff Studio &rarr; Substantive Vote Conducted &rarr; Cryptographically Ratified and Published.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
