'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  Edit3,
  Trash2,
  AlertCircle,
  X,
  Check,
  Star,
  RefreshCw,
  Send,
  Link as LinkIcon,
  ShieldCheck,
  Building2,
  FileText,
  Mail,
  ChevronDown,
  Sparkles,
  Layout,
  Eye,
  EyeOff,
  Coins,
  ArrowUpDown,
  Sliders,
  Award
} from 'lucide-react';
import { 
  RECRUITMENT_TEMPLATES, 
  TEAM_STRUCTURE_TEMPLATES 
} from '@/lib/recruit/recruitmentTemplates';

interface EventRecruitmentWorkspaceProps {
  eventId: string;
  eventTitle: string;
}

export function EventRecruitmentWorkspace({ eventId, eventTitle }: EventRecruitmentWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'page_builder' | 'team' | 'posts' | 'pipeline' | 'settings'>('page_builder');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Data states
  const [config, setConfig] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [groupedTeam, setGroupedTeam] = useState<Record<string, any[]>>({});
  const [pipelineStats, setPipelineStats] = useState<any>({
    total: 0,
    submitted: 0,
    underReview: 0,
    shortlisted: 0,
    interview: 0,
    offerSent: 0,
    accepted: 0,
    rejected: 0,
    waitlisted: 0,
  });

  // Filter states
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedPostFilter, setSelectedPostFilter] = useState<string>('ALL');
  const [selectedTeamDeptFilter, setSelectedTeamDeptFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [showAddPostModal, setShowAddPostModal] = useState<boolean>(false);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [showTeamTemplateModal, setShowTeamTemplateModal] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [activeReviewCandidate, setActiveReviewCandidate] = useState<any>(null);

  // Page Builder state
  const [layoutMode, setLayoutMode] = useState<string>('BOTH');
  const [showTeamSection, setShowTeamSection] = useState<boolean>(true);
  const [showRecruitSection, setShowRecruitSection] = useState<boolean>(true);
  const [teamHeadline, setTeamHeadline] = useState<string>('Our Team & Leadership');
  const [teamDescription, setTeamDescription] = useState<string>('Meet the Secretariat, Executive Board, and Organising Committee behind this convening.');
  const [sectionOrder, setSectionOrder] = useState<string>('overview,team,recruitment');
  const [savingPageBuilder, setSavingPageBuilder] = useState(false);
  const [pageBuilderSuccess, setPageBuilderSuccess] = useState(false);

  // Add/Edit Team Member form state
  const [memberTeamName, setMemberTeamName] = useState('Secretariat');
  const [memberRole, setMemberRole] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberHandle, setMemberHandle] = useState('');
  const [memberProfileUrl, setMemberProfileUrl] = useState('');
  const [memberAvatarUrl, setMemberAvatarUrl] = useState('');
  const [memberDesc, setMemberDesc] = useState('');
  const [memberOrder, setMemberOrder] = useState<number>(0);
  const [memberVisibility, setMemberVisibility] = useState('PUBLIC');
  const [memberStatus, setMemberStatus] = useState('CONFIRMED');
  const [savingMember, setSavingMember] = useState(false);

  // Add post state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDept, setNewPostDept] = useState('Organising Committee');
  const [newPostSlots, setNewPostSlots] = useState(1);
  const [newPostDesc, setNewPostDesc] = useState('');
  const [newPostResp, setNewPostResp] = useState('');
  const [newPostReq, setNewPostReq] = useState('');
  const [newPostCompensated, setNewPostCompensated] = useState(false);
  const [newPostCompDetails, setNewPostCompDetails] = useState('');
  const [newPostMethod, setNewPostMethod] = useState('DEFAULT');
  const [newPostExternalUrl, setNewPostExternalUrl] = useState('');
  const [newPostDeadline, setNewPostDeadline] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);

  // Settings form state
  const [settingsEnabled, setSettingsEnabled] = useState(true);
  const [settingsMethod, setSettingsMethod] = useState('ZEN_FORMS');
  const [settingsGoogleFormsUrl, setSettingsGoogleFormsUrl] = useState('');
  const [settingsHeadline, setSettingsHeadline] = useState('');
  const [settingsDesc, setSettingsDesc] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Candidate review drawer state
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewUrl, setInterviewUrl] = useState('');
  const [offerRoleInput, setOfferRoleInput] = useState('');
  const [updatingCandidate, setUpdatingCandidate] = useState(false);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [configRes, postsRes, appsRes, teamRes] = await Promise.all([
          fetch(`/api/events/recruit/config?eventId=${encodeURIComponent(eventId)}`),
          fetch(`/api/events/recruit/posts?eventId=${encodeURIComponent(eventId)}`),
          fetch(`/api/events/recruit/applications?eventId=${encodeURIComponent(eventId)}`),
          fetch(`/api/events/team?eventId=${encodeURIComponent(eventId)}&includeHidden=true`)
        ]);

        const configData = await configRes.json();
        const postsData = await postsRes.json();
        const appsData = await appsRes.json();
        const teamData = await teamRes.json();

        if (isMounted) {
          if (configData.success && configData.config) {
            setConfig(configData.config);
            setSettingsEnabled(Boolean(configData.config.enabled));
            setSettingsMethod(configData.config.method || 'ZEN_FORMS');
            setSettingsGoogleFormsUrl(configData.config.googleFormsUrl || '');
            setSettingsHeadline(configData.config.headline || 'Join the Organizing & Executive Team');
            setSettingsDesc(configData.config.description || 'Recruiting Secretariat, Executive Board, Committee Leads, and Event Staff.');
            
            // Page Builder values
            setLayoutMode(configData.config.layoutMode || 'BOTH');
            setShowTeamSection(configData.config.showTeam !== undefined ? Boolean(configData.config.showTeam) : true);
            setShowRecruitSection(configData.config.showRecruitment !== undefined ? Boolean(configData.config.showRecruitment) : true);
            setTeamHeadline(configData.config.teamHeadline || 'Our Team & Leadership');
            setTeamDescription(configData.config.teamDescription || 'Meet the Secretariat, Executive Board, and Organising Committee behind this convening.');
            setSectionOrder(configData.config.sectionOrder || 'overview,team,recruitment');
          }
          if (postsData.success && Array.isArray(postsData.posts)) {
            setPosts(postsData.posts);
          }
          if (appsData.success && Array.isArray(appsData.applications)) {
            setApplications(appsData.applications);
            if (appsData.stats) setPipelineStats(appsData.stats);
          }
          if (teamData.success && Array.isArray(teamData.members)) {
            setTeamMembers(teamData.members);
            setGroupedTeam(teamData.grouped || {});
          }
        }
      } catch (err) {
        console.error('Failed to load recruitment workspace', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [eventId, refreshKey]);

  // Page Builder Option Selector Handler
  const handleSelectLayoutMode = (mode: string) => {
    setLayoutMode(mode);
    if (mode === 'SHOWCASE_ONLY') {
      setShowTeamSection(true);
      setShowRecruitSection(false);
    } else if (mode === 'RECRUIT_ONLY') {
      setShowTeamSection(false);
      setShowRecruitSection(true);
    } else if (mode === 'BOTH') {
      setShowTeamSection(true);
      setShowRecruitSection(true);
    } else if (mode === 'NEITHER') {
      setShowTeamSection(false);
      setShowRecruitSection(false);
    }
  };

  // Save Page Builder Configuration
  const handleSavePageBuilder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingPageBuilder(true);
      setPageBuilderSuccess(false);
      const res = await fetch('/api/events/recruit/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          layoutMode,
          showTeam: showTeamSection,
          showRecruitment: showRecruitSection,
          teamHeadline: teamHeadline.trim(),
          teamDescription: teamDescription.trim(),
          headline: settingsHeadline.trim(),
          description: settingsDesc.trim(),
          sectionOrder
        })
      });
      const data = await res.json();
      if (data.success) {
        setPageBuilderSuccess(true);
        setTimeout(() => setPageBuilderSuccess(false), 3000);
      }
    } catch (_) {
    } finally {
      setSavingPageBuilder(false);
    }
  };

  // Handle Save Team Member (Create or Edit)
  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberRole.trim()) return;

    try {
      setSavingMember(true);
      const isEditing = Boolean(editingMember?.id);
      const url = '/api/events/team';
      const method = isEditing ? 'PATCH' : 'POST';
      const body: any = {
        eventId,
        teamName: memberTeamName.trim(),
        role: memberRole.trim(),
        name: memberName.trim(),
        handle: memberHandle ? memberHandle.replace(/^@/, '').trim() : null,
        profileUrl: memberProfileUrl.trim() || null,
        avatarUrl: memberAvatarUrl.trim() || null,
        description: memberDesc.trim() || null,
        displayOrder: Number(memberOrder) || 0,
        visibility: memberVisibility,
        status: memberStatus
      };
      if (isEditing) body.id = editingMember.id;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddMemberModal(false);
        setEditingMember(null);
        resetMemberForm();
        setRefreshKey((k) => k + 1);
      }
    } catch (_) {
    } finally {
      setSavingMember(false);
    }
  };

  const resetMemberForm = () => {
    setMemberTeamName('Secretariat');
    setMemberRole('');
    setMemberName('');
    setMemberHandle('');
    setMemberProfileUrl('');
    setMemberAvatarUrl('');
    setMemberDesc('');
    setMemberOrder(0);
    setMemberVisibility('PUBLIC');
    setMemberStatus('CONFIRMED');
  };

  const openEditMemberModal = (m: any) => {
    setEditingMember(m);
    setMemberTeamName(m.teamName || 'Secretariat');
    setMemberRole(m.role || '');
    setMemberName(m.name || '');
    setMemberHandle(m.handle || '');
    setMemberProfileUrl(m.profileUrl || '');
    setMemberAvatarUrl(m.avatarUrl || '');
    setMemberDesc(m.description || '');
    setMemberOrder(m.displayOrder || 0);
    setMemberVisibility(m.visibility || 'PUBLIC');
    setMemberStatus(m.status || 'CONFIRMED');
    setShowAddMemberModal(true);
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Remove this member from the event directory?')) return;
    try {
      await fetch(`/api/events/team?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      setRefreshKey((k) => k + 1);
    } catch (_) {}
  };

  // Batch import team structure from template
  const handleImportTeamStructure = async (templateRoles: any[]) => {
    try {
      setLoading(true);
      for (const tRole of templateRoles) {
        await fetch('/api/events/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId,
            teamName: tRole.teamName,
            role: tRole.role,
            name: `${tRole.role} (Designate)`,
            description: tRole.description,
            status: 'INVITED',
            visibility: 'PUBLIC'
          })
        });
      }
      setShowTeamTemplateModal(false);
      setRefreshKey((k) => k + 1);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostDesc.trim()) return;

    try {
      setCreatingPost(true);
      const res = await fetch('/api/events/recruit/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          title: newPostTitle.trim(),
          department: newPostDept.trim(),
          slots: Number(newPostSlots) || 1,
          description: newPostDesc.trim(),
          responsibilities: newPostResp ? newPostResp.split('\n').filter(Boolean) : [],
          requirements: newPostReq ? newPostReq.split('\n').filter(Boolean) : [],
          isCompensated: newPostCompensated,
          compensationDetails: newPostCompDetails.trim() || null,
          applicationMethod: newPostMethod,
          externalFormUrl: newPostExternalUrl.trim() || null,
          deadline: newPostDeadline || null
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowAddPostModal(false);
        setNewPostTitle('');
        setNewPostDesc('');
        setNewPostResp('');
        setNewPostReq('');
        setNewPostCompensated(false);
        setNewPostCompDetails('');
        setNewPostMethod('DEFAULT');
        setNewPostExternalUrl('');
        setNewPostDeadline('');
        setRefreshKey((k) => k + 1);
      }
    } catch (_) {
    } finally {
      setCreatingPost(false);
    }
  };

  // Seed posts from template
  const handleSeedTemplate = async (category: string) => {
    try {
      setLoading(true);
      await fetch('/api/events/recruit/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          templateCategory: category
        })
      });
      setShowTemplateModal(false);
      setRefreshKey((k) => k + 1);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  // Save Recruitment & Forms Intake Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      setSettingsSuccess(false);
      const res = await fetch('/api/events/recruit/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          enabled: settingsEnabled,
          method: settingsMethod,
          googleFormsUrl: settingsGoogleFormsUrl.trim(),
          headline: settingsHeadline.trim(),
          description: settingsDesc.trim(),
          layoutMode,
          showTeam: showTeamSection,
          showRecruitment: showRecruitSection,
          teamHeadline: teamHeadline.trim(),
          teamDescription: teamDescription.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (_) {
    } finally {
      setSavingSettings(false);
    }
  };

  // Candidate review drawer open
  const openCandidateReview = (cand: any) => {
    setActiveReviewCandidate(cand);
    setReviewNotes(cand.reviewerNotes || '');
    setReviewRating(cand.rating || 0);
    setInterviewDate(cand.interviewDate ? new Date(cand.interviewDate).toISOString().slice(0, 16) : '');
    setInterviewUrl(cand.interviewMeetingUrl || '');
    setOfferRoleInput(cand.offerRole || cand.post?.title || '');
  };

  // Update candidate status
  const handleUpdateCandidateStatus = async (newStatus: string) => {
    if (!activeReviewCandidate) return;
    try {
      setUpdatingCandidate(true);
      const res = await fetch('/api/events/recruit/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeReviewCandidate.id,
          status: newStatus,
          reviewerNotes: reviewNotes,
          rating: reviewRating,
          interviewDate: interviewDate || undefined,
          interviewMeetingUrl: interviewUrl.trim() || undefined,
          offerRole: offerRoleInput.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveReviewCandidate(null);
        setRefreshKey((k) => k + 1);
      }
    } catch (_) {
    } finally {
      setUpdatingCandidate(false);
    }
  };

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    if (selectedStatusFilter !== 'ALL' && app.status !== selectedStatusFilter) return false;
    if (selectedPostFilter !== 'ALL' && app.postId !== selectedPostFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.applicantName?.toLowerCase().includes(q);
      const matchEmail = app.applicantEmail?.toLowerCase().includes(q);
      const matchHandle = app.applicantHandle?.toLowerCase().includes(q);
      const matchNum = app.applicationNumber?.toLowerCase().includes(q);
      return matchName || matchEmail || matchHandle || matchNum;
    }
    return true;
  });

  // Filtered team members
  const teamDepartments = Array.from(new Set(teamMembers.map((m) => m.teamName)));
  const displayedTeamMembers = selectedTeamDeptFilter === 'ALL'
    ? teamMembers
    : teamMembers.filter((m) => m.teamName === selectedTeamDeptFilter);

  return (
    <div className="space-y-6 text-left">
      {/* ─── WORKSPACE HEADER & EXECUTIVE TABS ─── */}
      <div className="p-6 rounded-3xl bg-[#090c16] border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Users className="w-3 h-3 text-white" />
                <span>ZEN.TEAMS &amp; ZEN.RECRUIT</span>
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                {eventTitle}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
              Event Teams &amp; Recruitment Command Center
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/events/${eventId}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition flex items-center gap-1.5"
            >
              <span>View Event Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={`/events/${eventId}/recruit`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition flex items-center gap-1.5"
            >
              <span>Recruit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Executive Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#0c0f1b] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Team Members</span>
            <div className="text-xl font-bold font-mono text-white">{teamMembers.length}</div>
            <span className="text-[10px] text-neutral-400">Public roster</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c0f1b] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Open Posts</span>
            <div className="text-xl font-bold font-mono text-white">{posts.filter((p) => p.status === 'OPEN').length}</div>
            <span className="text-[10px] text-neutral-400">{posts.length} total posts</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c0f1b] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Applications</span>
            <div className="text-xl font-bold font-mono text-white">{applications.length}</div>
            <span className="text-[10px] text-neutral-400">{pipelineStats.submitted} pending review</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c0f1b] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Interviews</span>
            <div className="text-xl font-bold font-mono text-white">{pipelineStats.interview}</div>
            <span className="text-[10px] text-neutral-400">{pipelineStats.shortlisted} shortlisted</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c0f1b] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Appointments</span>
            <div className="text-xl font-bold font-mono text-emerald-400">{pipelineStats.accepted}</div>
            <span className="text-[10px] text-neutral-400">{pipelineStats.offerSent} pending offers</span>
          </div>
        </div>

        {/* 5-Tab Navigation Strip */}
        <div className="flex items-center gap-1.5 border-t border-white/5 pt-4 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('page_builder')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'page_builder'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Page Builder &amp; Modes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'team'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Directory ({teamMembers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'posts'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Open Posts ({posts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'pipeline'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Applicant Pipeline ({applications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'settings'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>ZEN.FORMS &amp; Intake Engine</span>
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 1: EVENT PAGE BUILDER & DISPLAY MODES ─── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'page_builder' && (
        <form onSubmit={handleSavePageBuilder} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090c16] border border-white/10 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <Layout className="w-4 h-4 text-white" />
                <span>Event Page Presentation Modes</span>
              </h3>
              <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                Choose how this event is presented to the public. You can showcase your current team, publish recruitment forms, do both on the same page, or keep it as a clean standalone event.
              </p>
            </div>

            {/* 4 Interactive Presentation Option Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Showcase the team */}
              <div
                onClick={() => handleSelectLayoutMode('SHOWCASE_ONLY')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                  layoutMode === 'SHOWCASE_ONLY'
                    ? 'bg-white/10 border-white ring-1 ring-white/30'
                    : 'bg-[#0c0f1b] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-sans">Option A — Showcase the Team</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                    Public
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  Display committees, Executive Board, Secretariat, organisers, judges, mentors, hosts, and other team members. No public recruitment section.
                </p>
              </div>

              {/* Option B: Recruit people */}
              <div
                onClick={() => handleSelectLayoutMode('RECRUIT_ONLY')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                  layoutMode === 'RECRUIT_ONLY'
                    ? 'bg-white/10 border-white ring-1 ring-white/30'
                    : 'bg-[#0c0f1b] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-sans">Option B — Recruit People</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                    Recruitment
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  Publish forms to hire for positions, committees, the EB, Secretariat or any custom event role. No public team directory is shown.
                </p>
              </div>

              {/* Option C: Both (Recommended) */}
              <div
                onClick={() => handleSelectLayoutMode('BOTH')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                  layoutMode === 'BOTH'
                    ? 'bg-white/10 border-white ring-1 ring-white/30'
                    : 'bg-[#0c0f1b] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-sans">Option C — Both (Recommended)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-black font-bold">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  Show the current team and invite new applicants for available positions on the same page with dedicated navigation tabs.
                </p>
              </div>

              {/* Option D: Neither */}
              <div
                onClick={() => handleSelectLayoutMode('NEITHER')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                  layoutMode === 'NEITHER'
                    ? 'bg-white/10 border-white ring-1 ring-white/30'
                    : 'bg-[#0c0f1b] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-sans">Option D — Neither</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-400 font-bold">
                    Simple
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  Publish a simple event page without a public team directory or recruitment section. Ideal for closed convenings or webinars.
                </p>
              </div>
            </div>

            {/* Granular Section Toggles & Configuration */}
            <div className="pt-4 border-t border-white/5 space-y-5">
              <h4 className="text-sm font-bold text-white font-sans">
                Granular Section Controls
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Team Section Controls */}
                <div className="p-4 rounded-2xl bg-[#0c0f1b] border border-white/5 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showTeamSection}
                      onChange={(e) => setShowTeamSection(e.target.checked)}
                      className="rounded bg-black border-white/20 text-white focus:ring-0"
                    />
                    <span className="text-xs font-bold text-white">Enable Team Showcase Section</span>
                  </label>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400">Team Section Headline</span>
                      <input
                        type="text"
                        value={teamHeadline}
                        onChange={(e) => setTeamHeadline(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400">Team Section Subtitle</span>
                      <textarea
                        rows={2}
                        value={teamDescription}
                        onChange={(e) => setTeamDescription(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Recruitment Section Controls */}
                <div className="p-4 rounded-2xl bg-[#0c0f1b] border border-white/5 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showRecruitSection}
                      onChange={(e) => setShowRecruitSection(e.target.checked)}
                      className="rounded bg-black border-white/20 text-white focus:ring-0"
                    />
                    <span className="text-xs font-bold text-white">Enable Recruitment &amp; Vacancies Section</span>
                  </label>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400">Recruitment Section Headline</span>
                      <input
                        type="text"
                        value={settingsHeadline}
                        onChange={(e) => setSettingsHeadline(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400">Recruitment Section Subtitle</span>
                      <textarea
                        rows={2}
                        value={settingsDesc}
                        onChange={(e) => setSettingsDesc(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Ordering */}
              <div className="p-4 rounded-2xl bg-[#0c0f1b] border border-white/5 space-y-2 text-xs">
                <span className="font-bold text-white">Section Display Order</span>
                <select
                  value={sectionOrder}
                  onChange={(e) => setSectionOrder(e.target.value)}
                  className="w-full sm:w-80 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none"
                >
                  <option value="overview,team,recruitment">Overview → Our Team → Join the Team</option>
                  <option value="overview,recruitment,team">Overview → Join the Team → Our Team</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              {pageBuilderSuccess && (
                <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                  <Check className="w-4 h-4" />
                  <span>Page presentation settings saved successfully!</span>
                </span>
              )}
              {!pageBuilderSuccess && <div />}

              <button
                type="submit"
                disabled={savingPageBuilder}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs font-sans transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                {savingPageBuilder ? 'Saving...' : 'Save Page Presentation'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 2: TEAM DIRECTORY BUILDER (ZEN.TEAMS) ─── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedTeamDeptFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer shrink-0 ${
                  selectedTeamDeptFilter === 'ALL'
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                All ({teamMembers.length})
              </button>
              {teamDepartments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedTeamDeptFilter(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer shrink-0 ${
                    selectedTeamDeptFilter === dept
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  {dept} ({groupedTeam[dept]?.length || 0})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowTeamTemplateModal(true)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Import Structure</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingMember(null);
                  resetMemberForm();
                  setShowAddMemberModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>
          </div>

          {/* Team Members List */}
          {displayedTeamMembers.length === 0 ? (
            <div className="py-16 text-center space-y-4 rounded-3xl bg-[#090c16] border border-white/10 p-8 max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-lg text-white">No Team Members Listed Yet</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Build your event team directory manually or import a standard department hierarchy to showcase your dais, Executive Board, and organisers.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowTeamTemplateModal(true)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition"
                >
                  Import Hierarchy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingMember(null);
                    resetMemberForm();
                    setShowAddMemberModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition"
                >
                  Add First Member
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-5 rounded-2xl bg-[#090a12] border border-white/10 hover:border-white/20 transition flex flex-col justify-between space-y-4 shadow-lg text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-white border border-white/10 truncate">
                        {member.teamName}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        member.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-white/5 text-neutral-400 border-white/10'
                      }`}>
                        {member.status}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold font-mono shrink-0">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-mono text-neutral-400 truncate">{member.role}</p>
                        <h4 className="text-base font-bold text-white font-sans truncate">{member.name}</h4>
                        {member.handle && (
                          <p className="text-xs text-neutral-500 font-mono">@{member.handle}</p>
                        )}
                      </div>
                    </div>

                    {member.description && (
                      <p className="text-xs text-neutral-300 font-sans line-clamp-2">
                        {member.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-neutral-500">
                      Order: #{member.displayOrder} &bull; {member.visibility}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditMemberModal(member)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 transition"
                        title="Edit Member"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-400 transition"
                        title="Remove Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 3: CONFIGURED POSTS & VACANCIES (ZEN.RECRUIT) ─── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-400">
              Create and manage all positions for this event. Applicants can only apply to OPEN posts.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTemplateModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Import Post Template</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddPostModal(true)}
                className="px-4 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Post</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => {
              const spotsLeft = Math.max(0, (post.slots || 1) - (post.filledSlots || 0));

              return (
                <div
                  key={post.id}
                  className="p-5 rounded-2xl bg-[#090a12] border border-white/10 hover:border-white/20 transition flex flex-col justify-between space-y-4 shadow-lg text-left"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10 truncate">
                        {post.department}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        post.status === 'OPEN'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : post.status === 'PAUSED'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          : 'bg-white/5 text-neutral-400 border-white/10'
                      }`}>
                        {post.status}
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-base text-white">
                      {post.title}
                    </h4>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed line-clamp-3">
                      {post.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                      <span className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                        {spotsLeft} of {post.slots} seats open
                      </span>

                      {post.isCompensated ? (
                        <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                          <Coins className="w-3 h-3 text-emerald-400" />
                          <span>{post.compensationDetails || 'Compensated'}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                          Voluntary
                        </span>
                      )}

                      {post.applicationMethod && post.applicationMethod !== 'DEFAULT' && (
                        <span className="text-[10px] text-neutral-300 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                          {post.applicationMethod}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-mono">
                      {post._count?.applications || 0} Applications
                    </span>

                    <div className="flex items-center gap-1.5">
                      {post.status === 'OPEN' ? (
                        <button
                          type="button"
                          onClick={async () => {
                            await fetch('/api/events/recruit/posts', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: post.id, status: 'PAUSED' })
                            });
                            setRefreshKey((k) => k + 1);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-mono transition"
                        >
                          Pause
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            await fetch('/api/events/recruit/posts', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: post.id, status: 'OPEN' })
                            });
                            setRefreshKey((k) => k + 1);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-mono transition"
                        >
                          Open
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirm(`Delete position "${post.title}"?`)) return;
                          await fetch(`/api/events/recruit/posts?id=${encodeURIComponent(post.id)}`, { method: 'DELETE' });
                          setRefreshKey((k) => k + 1);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 4: APPLICANT PIPELINE & DOSSIER ─── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          {/* Filters & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search candidate by name, email, handle, or reference number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090c16] border border-white/10 text-white text-xs focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#090c16] border border-white/10 text-neutral-200 text-xs font-mono focus:outline-none"
              >
                <option value="ALL">All Statuses ({applications.length})</option>
                <option value="SUBMITTED">Submitted ({pipelineStats.submitted})</option>
                <option value="UNDER_REVIEW">Under Review ({pipelineStats.underReview})</option>
                <option value="SHORTLISTED">Shortlisted ({pipelineStats.shortlisted})</option>
                <option value="INTERVIEW">Interview ({pipelineStats.interview})</option>
                <option value="OFFER_SENT">Offer Sent ({pipelineStats.offerSent})</option>
                <option value="ACCEPTED">Accepted ({pipelineStats.accepted})</option>
                <option value="DECLINED">Declined</option>
                <option value="REJECTED">Rejected</option>
                <option value="WAITLISTED">Waitlisted</option>
              </select>

              <select
                value={selectedPostFilter}
                onChange={(e) => setSelectedPostFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#090c16] border border-white/10 text-neutral-200 text-xs font-mono focus:outline-none max-w-[180px] truncate"
              >
                <option value="ALL">All Posts</option>
                {posts.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Applications Table */}
          {filteredApplications.length === 0 ? (
            <div className="py-16 text-center space-y-4 rounded-3xl bg-[#090c16] border border-white/10 p-8 max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-lg text-white">No Applications Match Filter</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  As candidates apply for Secretariat, Executive Board, or team posts, their structured evaluations and references will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#090c16] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-neutral-400 font-mono text-[11px] uppercase">
                      <th className="py-3 px-4">Ref Code</th>
                      <th className="py-3 px-4">Applicant</th>
                      <th className="py-3 px-4">Role Applied</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredApplications.map((cand) => (
                      <tr key={cand.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {cand.applicationNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{cand.applicantName}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            {cand.applicantHandle ? `@${cand.applicantHandle}` : cand.applicantEmail}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-200">
                          {cand.post?.title || 'General Post'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= (cand.rating || 0) ? 'fill-amber-400' : 'text-neutral-700'}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            cand.status === 'OFFER_SENT'
                              ? 'bg-white text-black border-white'
                              : cand.status === 'ACCEPTED'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : cand.status === 'INTERVIEW'
                              ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                              : cand.status === 'SHORTLISTED'
                              ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                              : 'bg-white/5 text-neutral-400 border-white/10'
                          }`}>
                            {cand.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-400 text-[11px]">
                          {new Date(cand.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => openCandidateReview(cand)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs font-sans transition cursor-pointer shadow-sm"
                          >
                            Review Dossier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 5: ZEN.FORMS INTAKE & SETTINGS ─── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090c16] border border-white/10 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <Sliders className="w-4 h-4 text-white" />
                <span>Application Intake &amp; Form Methods</span>
              </h3>
              <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
                Configure how candidates apply. Choose between native ZEN.FORMS with in-platform candidate scoring, embedded Google Forms, or external URLs.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <label className="text-xs font-bold text-white block">
                Primary Intake Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div
                  onClick={() => setSettingsMethod('ZEN_FORMS')}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-1.5 ${
                    settingsMethod === 'ZEN_FORMS'
                      ? 'bg-white/10 border-white ring-1 ring-white/20'
                      : 'bg-[#0c0f1b] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-white">Native ZEN.FORMS</div>
                  <p className="text-[11px] text-neutral-400">
                    Branded multi-step form with cryptographic reference tracking and candidate dossiers.
                  </p>
                </div>

                <div
                  onClick={() => setSettingsMethod('GOOGLE_FORMS_EMBED')}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-1.5 ${
                    settingsMethod === 'GOOGLE_FORMS_EMBED'
                      ? 'bg-white/10 border-white ring-1 ring-white/20'
                      : 'bg-[#0c0f1b] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-white">Embed Google Forms</div>
                  <p className="text-[11px] text-neutral-400">
                    Display your existing Google Form inside the event page without leaving the platform.
                  </p>
                </div>

                <div
                  onClick={() => setSettingsMethod('GOOGLE_FORMS_LINK')}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-1.5 ${
                    settingsMethod === 'GOOGLE_FORMS_LINK' || settingsMethod === 'EXTERNAL_URL'
                      ? 'bg-white/10 border-white ring-1 ring-white/20'
                      : 'bg-[#0c0f1b] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-white">External Form / Portal</div>
                  <p className="text-[11px] text-neutral-400">
                    Open an external application form or website in a new tab with an exit disclaimer.
                  </p>
                </div>
              </div>

              {(settingsMethod === 'GOOGLE_FORMS_EMBED' || settingsMethod === 'GOOGLE_FORMS_LINK' || settingsMethod === 'EXTERNAL_URL') && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-mono text-neutral-400 block">
                    Google Form or External Application URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/forms/d/e/.../viewform"
                    value={settingsGoogleFormsUrl}
                    onChange={(e) => setSettingsGoogleFormsUrl(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                  />
                  <p className="text-[10px] text-neutral-500">
                    Google Forms embedding requires embedding permission enabled in Google Form settings.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              {settingsSuccess && (
                <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                  <Check className="w-4 h-4" />
                  <span>Settings updated successfully!</span>
                </span>
              )}
              {!settingsSuccess && <div />}

              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs font-sans transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL: ADD / EDIT TEAM MEMBER (ZEN.TEAMS) ─── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#090c16] border border-white/15 p-6 sm:p-8 space-y-5 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <Users className="w-4 h-4 text-white" />
                <span>{editingMember ? 'Edit Team Member' : 'Add Team Member to Directory'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddMemberModal(false);
                  setEditingMember(null);
                }}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeamMember} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-neutral-400 block mb-1">Team / Committee Name</label>
                <input
                  type="text"
                  placeholder="e.g. Secretariat, Executive Board, Adjudication Core, Technical Team"
                  value={memberTeamName}
                  onChange={(e) => setMemberTeamName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Role / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Secretary-General, Chairperson, Judge"
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Person's Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Eleanor Roosevelt"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">ZENVITRA Handle (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. eleanor (without @)"
                    value={memberHandle}
                    onChange={(e) => setMemberHandle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Photo / Avatar URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={memberAvatarUrl}
                    onChange={(e) => setMemberAvatarUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Description / Responsibilities (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Responsibilities or bio..."
                  value={memberDesc}
                  onChange={(e) => setMemberDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={memberOrder}
                    onChange={(e) => setMemberOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Visibility</label>
                  <select
                    value={memberVisibility}
                    onChange={(e) => setMemberVisibility(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white focus:outline-none"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="HIDDEN">Hidden</option>
                    <option value="MEMBERS_ONLY">Members Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Status</label>
                  <select
                    value={memberStatus}
                    onChange={(e) => setMemberStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white focus:outline-none"
                  >
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="INVITED">Invited</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-neutral-400 leading-relaxed font-mono">
                Notice: Being listed in the public team directory does not grant platform admin or organizer dashboard rights. Event permissions remain managed in the Host Command Center.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setEditingMember(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMember}
                  className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition shadow-sm disabled:opacity-50"
                >
                  {savingMember ? 'Saving...' : editingMember ? 'Save Changes' : 'Add to Directory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL: IMPORT DEPARTMENT STRUCTURE TEMPLATES ─── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {showTeamTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-[#090c16] border border-white/15 p-6 sm:p-8 space-y-5 shadow-2xl text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Import Department Hierarchy</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Initialize clean departmental structures ready for your committee appointments.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTeamTemplateModal(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {TEAM_STRUCTURE_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.category}
                  className="p-4 rounded-2xl bg-[#0c0f1b] border border-white/10 hover:border-white/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white font-sans">{tmpl.name}</h4>
                    <p className="text-xs text-neutral-400 font-light">{tmpl.tagline}</p>
                    <div className="text-[10px] font-mono text-neutral-500">
                      Includes {tmpl.roles.length} roles: {tmpl.roles.slice(0, 3).map((r) => r.role).join(', ')}...
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleImportTeamStructure(tmpl.roles)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs font-sans transition shrink-0 shadow-sm"
                  >
                    Import {tmpl.category}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL: ADD POST (ZEN.RECRUIT) ─── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {showAddPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#090c16] border border-white/15 p-6 sm:p-8 space-y-5 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-white" />
                <span>Create Recruitment Post</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddPostModal(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-neutral-400 block mb-1">Post Title</label>
                <input
                  type="text"
                  placeholder="e.g. Committee Chairperson / Head of Design"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Secretariat, Executive Board, Logistics"
                    value={newPostDept}
                    onChange={(e) => setNewPostDept(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Seats / Slots</label>
                  <input
                    type="number"
                    min={1}
                    value={newPostSlots}
                    onChange={(e) => setNewPostSlots(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Description &amp; Overview</label>
                <textarea
                  rows={2}
                  placeholder="Responsibilities, scope of leadership..."
                  value={newPostDesc}
                  onChange={(e) => setNewPostDesc(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none resize-none"
                />
              </div>

              {/* Compensation Settings */}
              <div className="p-3.5 rounded-2xl bg-[#0c0f1b] border border-white/5 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPostCompensated}
                    onChange={(e) => setNewPostCompensated(e.target.checked)}
                    className="rounded bg-black border-white/20 text-white focus:ring-0"
                  />
                  <span className="text-xs font-bold text-white">This role includes compensation or stipend</span>
                </label>

                {newPostCompensated && (
                  <input
                    type="text"
                    placeholder="e.g. Stipend of ₹10,000 / Travel Allowance / Honors Certificate"
                    value={newPostCompDetails}
                    onChange={(e) => setNewPostCompDetails(e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none"
                  />
                )}
              </div>

              {/* Per-post Application Method */}
              <div className="p-3.5 rounded-2xl bg-[#0c0f1b] border border-white/5 space-y-2">
                <label className="text-neutral-400 block text-xs">Application Method for this Post</label>
                <select
                  value={newPostMethod}
                  onChange={(e) => setNewPostMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none"
                >
                  <option value="DEFAULT">Use Default Event Intake Method</option>
                  <option value="ZEN_FORMS">Native ZEN.FORMS Form</option>
                  <option value="EXTERNAL_URL">External Application URL</option>
                </select>

                {newPostMethod === 'EXTERNAL_URL' && (
                  <input
                    type="url"
                    placeholder="https://external-application-portal.com"
                    value={newPostExternalUrl}
                    onChange={(e) => setNewPostExternalUrl(e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs font-mono focus:outline-none"
                  />
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPostModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPost}
                  className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition shadow-sm disabled:opacity-50"
                >
                  {creatingPost ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL: IMPORT POST TEMPLATES ─── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-[#090c16] border border-white/15 p-6 sm:p-8 space-y-5 shadow-2xl text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Import Post Templates</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Choose an archetype track to populate positions instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {RECRUITMENT_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.category}
                  className="p-4 rounded-2xl bg-[#0c0f1b] border border-white/10 hover:border-white/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white font-sans">{tmpl.name}</h4>
                    <p className="text-xs text-neutral-400 font-light">{tmpl.tagline}</p>
                    <div className="text-[10px] font-mono text-neutral-500">
                      Includes {tmpl.posts.length} roles: {tmpl.posts.map((p) => p.title).join(', ')}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSeedTemplate(tmpl.category)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs font-sans transition shrink-0 shadow-sm"
                  >
                    Import {tmpl.category}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ─── DRAWER / MODAL: CANDIDATE DOSSIER EVALUATION ─── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeReviewCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[#090c16] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
                    {activeReviewCandidate.applicationNumber}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Applying for <strong className="text-white">{activeReviewCandidate.post?.title}</strong>
                  </span>
                </div>
                <h3 className="text-xl font-black font-sans text-white mt-1">
                  {activeReviewCandidate.applicantName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveReviewCandidate(null)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Applicant Profile Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Contact Email</span>
                <p className="text-white font-mono">{activeReviewCandidate.applicantEmail}</p>
              </div>
              {activeReviewCandidate.applicantHandle && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">ZENVITRA Handle</span>
                  <Link
                    href={`/profile/${activeReviewCandidate.applicantHandle}`}
                    target="_blank"
                    className="text-white hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>@{activeReviewCandidate.applicantHandle}</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </Link>
                </div>
              )}
            </div>

            {/* Motivation & Experience */}
            <div className="space-y-4 pt-2">
              {activeReviewCandidate.motivation && (
                <div className="p-4 rounded-2xl bg-[#0c0f1b] border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">Motivation &amp; Objectives</span>
                  <p className="text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {activeReviewCandidate.motivation}
                  </p>
                </div>
              )}

              {activeReviewCandidate.experience && (
                <div className="p-4 rounded-2xl bg-[#0c0f1b] border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">Past Track Record &amp; Experience</span>
                  <p className="text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {activeReviewCandidate.experience}
                  </p>
                </div>
              )}

              {/* Portfolio / Resume Links */}
              <div className="flex flex-wrap items-center gap-2">
                {activeReviewCandidate.portfolioUrl && (
                  <a
                    href={activeReviewCandidate.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white font-mono flex items-center gap-1.5 transition"
                  >
                    <span>View Portfolio / Samples</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                )}
                {activeReviewCandidate.resumeUrl && (
                  <a
                    href={activeReviewCandidate.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white font-mono flex items-center gap-1.5 transition"
                  >
                    <span>CV / Dossier Document</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Structured Evaluation Section */}
            <div className="p-5 rounded-2xl bg-[#0c0f1b] border border-white/10 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-sans">Candidate Rating (1–5 Stars)</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Private Reviewer Notes</label>
                <textarea
                  rows={2}
                  placeholder="Internal assessment notes (confidential to organizers)..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none resize-none"
                />
              </div>

              {/* Interview Scheduling Box */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <span className="font-bold text-white block">Schedule Interview (Optional)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 text-[10px] block mb-1">Interview Date &amp; Time</label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#090c16] border border-white/10 text-white text-xs font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 text-[10px] block mb-1">Meeting Link (Meet / Zoom)</label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={interviewUrl}
                      onChange={(e) => setInterviewUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#090c16] border border-white/10 text-white text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Formal Offer Role Input */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <span className="font-bold text-white block">Formal Appointment Role</span>
                <input
                  type="text"
                  placeholder="e.g. Committee Chairperson"
                  value={offerRoleInput}
                  onChange={(e) => setOfferRoleInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090c16] border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Decision Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={updatingCandidate}
                  onClick={() => handleUpdateCandidateStatus('SHORTLISTED')}
                  className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-xs font-bold transition"
                >
                  Shortlist
                </button>

                <button
                  type="button"
                  disabled={updatingCandidate}
                  onClick={() => handleUpdateCandidateStatus('INTERVIEW')}
                  className="px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 text-xs font-bold transition"
                >
                  Invite to Interview
                </button>

                <button
                  type="button"
                  disabled={updatingCandidate}
                  onClick={() => handleUpdateCandidateStatus('REJECTED')}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-bold transition"
                >
                  Reject
                </button>
              </div>

              <button
                type="button"
                disabled={updatingCandidate}
                onClick={() => handleUpdateCandidateStatus('OFFER_SENT')}
                className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-black" />
                <span>Dispatch Appointment Offer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
