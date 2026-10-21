'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Globe, 
  Search, 
  Plus, 
  Trash2, 
  Wand2, 
  Lock, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Gavel, 
  ClipboardList, 
  Link2, 
  FileSpreadsheet, 
  FileText, 
  UploadCloud, 
  Loader2, 
  AlertCircle, 
  X, 
  FileUp, 
  Download,
  Zap,
  Image as ImageIcon,
  Shield,
  CheckCircle2,
  Layers,
  Camera,
  RotateCcw,
  Copy,
  AlertTriangle,
  Edit3
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { 
  PRESET_BUNDLES, 
  PresetDelegation, 
  lookupFlag, 
  parsePastedList, 
  parseCsvOrText, 
  parseGoogleSheetsShareUrl, 
  PresetBundle,
  COMMON_COMMITTEE_PRESETS,
  CommitteeTemplatePreset
} from '@/lib/sessionPresetsData';
import { CommitteeLogoBadge } from './CommitteeLogoBadges';
import { MunCommitteeType } from '@/types/mun';

interface QuickSessionCreatorStudioProps {
  onBack?: () => void;
  returnPath?: string;
}

interface DuplicateItem {
  country: string;
  flag: string;
  reason: 'Already in Roster' | 'Repeated in Paste';
  count: number;
}

const EMBLEM_BAR_OPTIONS = [
  { label: 'UN', logoKey: 'un', emoji: '🇺🇳' },
  { label: 'UNSC', logoKey: 'unsc', emoji: '🛡️' },
  { label: 'AIPPM', logoKey: 'aippm', emoji: '🏛️' },
  { label: 'LOK SABHA', logoKey: 'lok_sabha', emoji: '🇮🇳' },
  { label: 'DISEC', logoKey: 'disec', emoji: '🌐' },
  { label: 'ICJ', logoKey: 'icj', emoji: '⚖️' },
  { label: 'UNHRC', logoKey: 'unhrc', emoji: '🕊️' },
  { label: 'EU', logoKey: 'eu', emoji: '🇪🇺' },
  { label: 'WHO', logoKey: 'who', emoji: '🏥' },
  { label: 'COP', logoKey: 'cop', emoji: '🌍' },
  { label: 'NATO', logoKey: 'nato', emoji: '⚔️' },
  { label: 'G20', logoKey: 'g20', emoji: '🌐' },
];

export default function QuickSessionCreatorStudio({
  onBack,
  returnPath = '/committee',
}: QuickSessionCreatorStudioProps) {
  const router = useRouter();
  const { 
    addCustomCommittee, 
    setActiveCommitteeId, 
    createConference, 
    setActiveConferenceId, 
    setConferenceStatus 
  } = useMun();

  // Step 1: Committee Details
  const [committeeName, setCommitteeName] = useState('');
  const [topic, setTopic] = useState('');
  const [isEditingAgenda, setIsEditingAgenda] = useState(false);
  const [emblem, setEmblem] = useState('🇺🇳');
  const [selectedLogoKey, setSelectedLogoKey] = useState<string>('un');
  const [activePreset, setActivePreset] = useState<CommitteeTemplatePreset | null>(null);
  const [chairInput, setChairInput] = useState('');
  const [chairs, setChairs] = useState<string[]>([]);

  // Custom Icon / Emblem Upload State
  const [customIconUrl, setCustomIconUrl] = useState<string | null>(null);
  const iconInputRef = useRef<HTMLInputElement | null>(null);
  const [iconUploadError, setIconUploadError] = useState<string | null>(null);

  // Step 2: Delegations
  const [delegations, setDelegations] = useState<PresetDelegation[]>([]);
  const [countryInput, setCountryInput] = useState('');
  const [rosterSearch, setRosterSearch] = useState('');

  // Import Modes: 'paste' | 'link' | 'upload'
  const [importMode, setImportMode] = useState<'paste' | 'link' | 'upload'>('paste');
  const [pasteText, setPasteText] = useState('');
  
  // Link Import State
  const [urlInput, setUrlInput] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileSuccessMessage, setFileSuccessMessage] = useState<string | null>(null);

  // Duplicate Portfolio Detection Modal State
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [duplicateModalData, setDuplicateModalData] = useState<{
    duplicates: DuplicateItem[];
    uniqueNewItems: PresetDelegation[];
    allPastedItems: PresetDelegation[];
  } | null>(null);

  // Chairs management
  const handleAddChair = () => {
    if (!chairInput.trim()) return;
    if (!chairs.includes(chairInput.trim())) {
      setChairs([...chairs, chairInput.trim()]);
    }
    setChairInput('');
  };

  const handleRemoveChair = (idx: number) => {
    setChairs(chairs.filter((_, i) => i !== idx));
  };

  // Icon / Emblem Upload
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconUploadError(null);

    if (file.size > 3 * 1024 * 1024) {
      setIconUploadError('Image size exceeds 3MB. Please upload a smaller image.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setIconUploadError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomIconUrl(result);
      }
    };
    reader.onerror = () => {
      setIconUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomIcon = () => {
    setCustomIconUrl(null);
    if (iconInputRef.current) {
      iconInputRef.current.value = '';
    }
  };

  // Delegations management
  const handleAddCountry = () => {
    if (!countryInput.trim()) return;
    const name = countryInput.trim();
    const flag = lookupFlag(name);

    if (!delegations.some((d) => d.country.toLowerCase() === name.toLowerCase())) {
      setDelegations([...delegations, { country: name, flag }]);
    }
    setCountryInput('');
  };

  const handleApplyBundle = (bundle: PresetBundle) => {
    const existingNames = new Set(delegations.map((d) => d.country.toLowerCase()));
    const newItems = bundle.delegations.filter((d) => !existingNames.has(d.country.toLowerCase()));
    setDelegations([...delegations, ...newItems]);
    setFileSuccessMessage(`Added ${newItems.length} delegations from ${bundle.shortName}!`);
    setTimeout(() => setFileSuccessMessage(null), 3000);
  };

  // Committee Template Preset Selection with Configurable Portfolios
  const handleApplyPresetCommittee = (preset: CommitteeTemplatePreset) => {
    setActivePreset(preset);
    setCommitteeName(preset.name);
    setTopic(preset.topic);
    setEmblem(preset.emblem);
    setSelectedLogoKey(preset.logoKey);
    setCustomIconUrl(null);

    if (preset.defaultChairs && preset.defaultChairs.length > 0) {
      setChairs(preset.defaultChairs);
    }

    // Automatically load the committee's portfolio preset if current delegations is empty,
    // or merge seamlessly
    if (delegations.length === 0) {
      setDelegations(preset.portfolios);
      setFileSuccessMessage(`Loaded ${preset.name.replace(/_/g, ' ')} with ${preset.portfolios.length} official portfolios!`);
      setTimeout(() => setFileSuccessMessage(null), 3500);
    }
  };

  // Manual Trigger to Load / Overwrite with this Committee's Official Portfolio Preset
  const handleLoadCommitteePortfolios = (preset: CommitteeTemplatePreset) => {
    setDelegations(preset.portfolios);
    setFileSuccessMessage(`Configured official ${(preset.short || preset.name).replace(/_/g, ' ')} roster (${preset.portfolios.length} delegations)!`);
    setTimeout(() => setFileSuccessMessage(null), 3500);
  };

  // Duplicate Portfolio Detection when Pasting
  const handleAutoMatchPaste = () => {
    if (!pasteText.trim()) return;
    const parsed = parsePastedList(pasteText);
    if (parsed.length === 0) return;

    const existingNames = new Set(delegations.map((d) => d.country.toLowerCase().trim()));
    const seenInPaste = new Map<string, { item: PresetDelegation; count: number }>();

    for (const item of parsed) {
      const key = item.country.toLowerCase().trim();
      if (!key) continue;
      const prev = seenInPaste.get(key);
      if (prev) {
        prev.count += 1;
      } else {
        seenInPaste.set(key, { item, count: 1 });
      }
    }

    const duplicates: DuplicateItem[] = [];
    const uniqueNewItems: PresetDelegation[] = [];

    for (const [key, { item, count }] of seenInPaste.entries()) {
      const inRoster = existingNames.has(key);
      const repeatedInPaste = count > 1;

      if (inRoster) {
        duplicates.push({
          country: item.country,
          flag: item.flag || lookupFlag(item.country),
          reason: 'Already in Roster',
          count,
        });
      } else if (repeatedInPaste) {
        duplicates.push({
          country: item.country,
          flag: item.flag || lookupFlag(item.country),
          reason: 'Repeated in Paste',
          count,
        });
        // First instance is included in unique items
        uniqueNewItems.push(item);
      } else {
        uniqueNewItems.push(item);
      }
    }

    // If duplicates exist, trigger the popup modal!
    if (duplicates.length > 0) {
      setDuplicateModalData({
        duplicates,
        uniqueNewItems,
        allPastedItems: parsed,
      });
      setIsDuplicateModalOpen(true);
    } else {
      // Clean paste without duplicates
      setDelegations([...delegations, ...parsed]);
      setPasteText('');
      setFileSuccessMessage(`Successfully added all ${parsed.length} delegations!`);
      setTimeout(() => setFileSuccessMessage(null), 3500);
    }
  };

  // Actions from Duplicate Portfolios Modal
  const handleResolveSkipDuplicates = () => {
    if (!duplicateModalData) return;
    setDelegations([...delegations, ...duplicateModalData.uniqueNewItems]);
    setPasteText('');
    setIsDuplicateModalOpen(false);
    setFileSuccessMessage(
      `Added ${duplicateModalData.uniqueNewItems.length} unique delegations (skipped ${duplicateModalData.duplicates.length} duplicate portfolios).`
    );
    setTimeout(() => setFileSuccessMessage(null), 4000);
  };

  const handleResolveKeepAllAsDoubleDelegations = () => {
    if (!duplicateModalData) return;
    // Map duplicates to double delegation labels if needed
    const existingNames = new Set(delegations.map((d) => d.country.toLowerCase().trim()));
    const itemsToAdd = duplicateModalData.allPastedItems.map((item) => {
      const key = item.country.toLowerCase().trim();
      if (existingNames.has(key)) {
        return {
          ...item,
          country: `${item.country} (Del 2)`,
          subTitle: item.subTitle || 'Double Delegation Seat',
        };
      }
      return item;
    });

    setDelegations([...delegations, ...itemsToAdd]);
    setPasteText('');
    setIsDuplicateModalOpen(false);
    setFileSuccessMessage(`Added ${itemsToAdd.length} delegations including double delegations!`);
    setTimeout(() => setFileSuccessMessage(null), 4000);
  };

  const handleCancelDuplicateModal = () => {
    setIsDuplicateModalOpen(false);
  };

  // Link / URL Fetch Handler (Supports Google Sheets share links, CSV URLs, web lists)
  const handleFetchFromUrl = async () => {
    if (!urlInput.trim()) return;
    setIsFetchingUrl(true);
    setUrlError(null);

    try {
      let targetUrl = urlInput.trim();
      const sheetCsvUrl = parseGoogleSheetsShareUrl(targetUrl);
      if (sheetCsvUrl) {
        targetUrl = sheetCsvUrl;
      }

      const res = await fetch(targetUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch link (${res.status} ${res.statusText}). Ensure sheet or URL is publicly accessible.`);
      }

      const text = await res.text();
      const parsed = parseCsvOrText(text);

      if (parsed.length === 0) {
        throw new Error('No recognizable delegations could be parsed from this link. Ensure the sheet has country or portfolio names.');
      }

      const existingNames = new Set(delegations.map((d) => d.country.toLowerCase()));
      const newItems = parsed.filter((d) => !existingNames.has(d.country.toLowerCase()));
      setDelegations([...delegations, ...newItems]);
      setUrlInput('');
      setFileSuccessMessage(`Imported ${newItems.length} delegations from link!`);
      setTimeout(() => setFileSuccessMessage(null), 4000);
    } catch (err: any) {
      setUrlError(err?.message || 'Could not fetch from URL. Make sure it is public or export as CSV.');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  // File Upload Handler (Supports CSV, Sheet TSV, TXT, and PDF text)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setFileError(null);
    setFileSuccessMessage(null);

    try {
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.csv') || fileName.endsWith('.tsv') || fileName.endsWith('.txt')) {
        const text = await file.text();
        const parsed = parseCsvOrText(text);

        if (parsed.length === 0) {
          throw new Error('No delegation rows found in this file.');
        }

        const existingNames = new Set(delegations.map((d) => d.country.toLowerCase()));
        const newItems = parsed.filter((d) => !existingNames.has(d.country.toLowerCase()));
        setDelegations([...delegations, ...newItems]);
        setFileSuccessMessage(`Successfully added ${newItems.length} delegations from ${file.name}!`);
        setTimeout(() => setFileSuccessMessage(null), 4000);
      } else if (fileName.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const rawContent = decoder.decode(arrayBuffer);

        const matches = rawContent.match(/\(([^()]{2,40})\)/g) || [];
        const rawStrings = matches.map((m) => m.slice(1, -1).trim()).filter((s) => s.length > 2);

        const candidates = rawStrings.length > 5 ? rawStrings : rawContent.split(/[\r\n\t]+/);
        const parsed: PresetDelegation[] = [];
        const seen = new Set<string>();

        for (const candidate of candidates) {
          const clean = candidate.replace(/[^a-zA-Z\s]/g, '').trim();
          if (clean.length >= 3 && clean.length <= 40) {
            const flag = lookupFlag(clean);
            if (flag !== '🌐' && !seen.has(clean.toLowerCase())) {
              seen.add(clean.toLowerCase());
              parsed.push({ country: clean, flag });
            }
          }
        }

        if (parsed.length === 0) {
          throw new Error('Could not automatically identify country names in this PDF. Try exporting to CSV or copying into the Paste tab.');
        }

        const existingNames = new Set(delegations.map((d) => d.country.toLowerCase()));
        const newItems = parsed.filter((d) => !existingNames.has(d.country.toLowerCase()));
        setDelegations([...delegations, ...newItems]);
        setFileSuccessMessage(`Extracted ${newItems.length} delegations from PDF!`);
        setTimeout(() => setFileSuccessMessage(null), 4000);
      } else {
        const text = await file.text();
        const parsed = parseCsvOrText(text);
        if (parsed.length > 0) {
          const existingNames = new Set(delegations.map((d) => d.country.toLowerCase()));
          const newItems = parsed.filter((d) => !existingNames.has(d.country.toLowerCase()));
          setDelegations([...delegations, ...newItems]);
          setFileSuccessMessage(`Imported ${newItems.length} delegations!`);
        } else {
          throw new Error('For Excel files (.xlsx), please save as CSV (.csv) or copy-paste the column into the Paste tab.');
        }
      }
    } catch (err: any) {
      setFileError(err?.message || 'Failed to process file.');
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveDelegation = (index: number) => {
    setDelegations(delegations.filter((_, i) => i !== index));
  };

  const handleClearAllDelegations = () => {
    setDelegations([]);
  };

  // Launch Validation for standard button
  const isReadyToLaunch = committeeName.trim().length > 0 && topic.trim().length > 0 && delegations.length >= 2;

  // 1. STANDARD LAUNCH SESSION
  const handleLaunchSession = () => {
    if (!isReadyToLaunch) return;

    let type: MunCommitteeType = 'OTHER';
    const norm = committeeName.toUpperCase();
    if (norm.includes('UNSC') || norm.includes('SECURITY COUNCIL')) type = 'UNSC';
    else if (norm.includes('UNHRC') || norm.includes('HUMAN RIGHTS')) type = 'UNHRC';
    else if (norm.includes('DISEC')) type = 'DISEC';
    else if (norm.includes('ECOSOC')) type = 'ECOSOC';
    else if (norm.includes('WHO') || norm.includes('HEALTH')) type = 'WHO';
    else if (norm.includes('UNESCO')) type = 'UNESCO';
    else if (norm.includes('UNEP') || norm.includes('ENVIRONMENT')) type = 'UNEP';
    else if (norm.includes('ICJ') || norm.includes('COURT OF JUSTICE')) type = 'ICJ';
    else if (norm.includes('COP') || norm.includes('CLIMATE')) type = 'COP';
    else if (norm.includes('NATO')) type = 'NATO';
    else if (norm.includes('G20')) type = 'G20';
    else if (norm.includes('ARAB LEAGUE')) type = 'ARAB_LEAGUE';
    else if (norm.includes('AU') || norm.includes('AFRICAN UNION')) type = 'AU';
    else if (norm.includes('LOK SABHA')) type = 'LOK_SABHA';
    else if (norm.includes('AIPPM')) type = 'AIPPM';
    else if (norm.includes('CRISIS') || norm.includes('HCC')) type = 'CRISIS';

    const created = addCustomCommittee({
      name: committeeName.trim(),
      shortName: committeeName.slice(0, 10).toUpperCase().trim(),
      agenda: topic.trim(),
      type,
      totalDelegates: delegations.length,
      emblem: customIconUrl ? '🏛️' : emblem,
      logoKey: selectedLogoKey,
      iconUrl: customIconUrl || undefined,
      dais: {
        chair: chairs[0] || 'Session Moderator',
        viceChair: chairs[1] || 'Deputy Rapporteur',
        rapporteur: chairs[2] || '',
      },
    });

    try {
      const rollCallEntries = delegations.map((d) => ({
        country: d.country,
        flag: d.flag,
        subTitle: d.subTitle,
        isP5: Boolean(d.isP5),
        status: 'absent',
      }));
      localStorage.setItem(`zenvitra_rollcall_${created.id}`, JSON.stringify(rollCallEntries));
      if (customIconUrl) {
        localStorage.setItem(`zenvitra_committee_icon_${created.id}`, customIconUrl);
      }
    } catch {}

    // Provision / activate live conference so /committee opens Dais Chamber immediately
    const now = new Date();
    const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newConf = createConference({
      name: `${committeeName.trim()} Summit 2026`,
      shortName: committeeName.slice(0, 8).toUpperCase().trim(),
      tagline: topic.trim(),
      startDate: todayYMD,
      endDate: todayYMD,
      status: 'DAY_1',
      location: 'Digital Plenary Enclave',
      committees: [{
        id: created.id,
        name: committeeName.trim(),
        shortName: committeeName.slice(0, 10).toUpperCase().trim(),
        type,
        agenda: topic.trim(),
        totalDelegates: delegations.length,
      }],
    });

    if (newConf?.id) {
      try {
        localStorage.setItem('zenvitra_mun_active_conference_v3_clean', newConf.id);
        localStorage.setItem('zenvitra_mun_active_committee_v3_clean', created.id);
      } catch {}
      setActiveConferenceId(newConf.id);
      setConferenceStatus(newConf.id, 'DAY_1');
    }

    setActiveCommitteeId(created.id);
    router.push('/committee');
  };

  // 2. ⚡ START INSTANT SESSION (Auto-seeds missing items & immediately starts)
  const handleStartInstantSession = () => {
    const finalName = committeeName.trim() || activePreset?.name || 'United Nations Security Council';
    const finalTopic = topic.trim() || activePreset?.topic || 'Non-Proliferation, Nuclear Safeguards & Maritime Security';
    const finalChairs = chairs.length > 0 ? chairs : (activePreset?.defaultChairs || ['President of the Dais', 'Vice-President']);

    let finalDelegations = delegations;
    if (finalDelegations.length === 0) {
      if (activePreset && activePreset.portfolios.length > 0) {
        finalDelegations = activePreset.portfolios;
      } else {
        const defaultBundle = PRESET_BUNDLES.find((b) => b.id === 'unsc_2026') || PRESET_BUNDLES[0];
        finalDelegations = defaultBundle?.delegations || [];
      }
    }

    let type: MunCommitteeType = activePreset?.type || 'UNSC';
    const norm = finalName.toUpperCase();
    if (norm.includes('UNSC') || norm.includes('SECURITY COUNCIL')) type = 'UNSC';
    else if (norm.includes('UNHRC') || norm.includes('HUMAN RIGHTS')) type = 'UNHRC';
    else if (norm.includes('DISEC')) type = 'DISEC';
    else if (norm.includes('ECOSOC')) type = 'ECOSOC';
    else if (norm.includes('WHO')) type = 'WHO';
    else if (norm.includes('UNESCO')) type = 'UNESCO';
    else if (norm.includes('UNEP')) type = 'UNEP';
    else if (norm.includes('ICJ')) type = 'ICJ';
    else if (norm.includes('COP')) type = 'COP';
    else if (norm.includes('NATO')) type = 'NATO';
    else if (norm.includes('G20')) type = 'G20';
    else if (norm.includes('ARAB LEAGUE')) type = 'ARAB_LEAGUE';
    else if (norm.includes('AU') || norm.includes('AFRICAN UNION')) type = 'AU';
    else if (norm.includes('LOK SABHA')) type = 'LOK_SABHA';
    else if (norm.includes('AIPPM')) type = 'AIPPM';
    else if (norm.includes('CRISIS') || norm.includes('HCC')) type = 'CRISIS';

    const created = addCustomCommittee({
      name: finalName,
      shortName: finalName.slice(0, 10).toUpperCase().trim(),
      agenda: finalTopic,
      type,
      totalDelegates: finalDelegations.length,
      emblem: customIconUrl ? '🏛️' : emblem,
      logoKey: selectedLogoKey,
      iconUrl: customIconUrl || undefined,
      dais: {
        chair: finalChairs[0] || 'President of the Dais',
        viceChair: finalChairs[1] || 'Vice-President',
        rapporteur: finalChairs[2] || '',
      },
    });

    try {
      const rollCallEntries = finalDelegations.map((d) => ({
        country: d.country,
        flag: d.flag,
        subTitle: d.subTitle,
        isP5: Boolean(d.isP5),
        status: 'absent',
      }));
      localStorage.setItem(`zenvitra_rollcall_${created.id}`, JSON.stringify(rollCallEntries));
      if (customIconUrl) {
        localStorage.setItem(`zenvitra_committee_icon_${created.id}`, customIconUrl);
      }
    } catch {}

    // Provision / activate live conference so /committee opens Dais Chamber immediately
    const now = new Date();
    const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newConf = createConference({
      name: `${finalName} Summit 2026`,
      shortName: (finalName.slice(0, 8) + ' SUMMIT').toUpperCase().trim(),
      tagline: finalTopic,
      startDate: todayYMD,
      endDate: todayYMD,
      status: 'DAY_1',
      location: 'Digital Plenary Enclave',
      committees: [{
        id: created.id,
        name: finalName,
        shortName: finalName.slice(0, 10).toUpperCase().trim(),
        type,
        agenda: finalTopic,
        totalDelegates: finalDelegations.length,
      }],
    });

    if (newConf?.id) {
      try {
        localStorage.setItem('zenvitra_mun_active_conference_v3_clean', newConf.id);
        localStorage.setItem('zenvitra_mun_active_committee_v3_clean', created.id);
      } catch {}
      setActiveConferenceId(newConf.id);
      setConferenceStatus(newConf.id, 'DAY_1');
    }

    setActiveCommitteeId(created.id);
    router.push('/committee');
  };

  // Filtered roster
  const filteredDelegations = useMemo(() => {
    if (!rosterSearch.trim()) return delegations;
    const q = rosterSearch.toLowerCase();
    return delegations.filter((d) => d.country.toLowerCase().includes(q));
  }, [delegations, rosterSearch]);

  const totalCount = delegations.length;
  const quorumNeeded = Math.ceil(totalCount / 3);
  const simpleMajority = Math.floor(totalCount / 2) + 1;
  const twoThirdsMajority = Math.ceil((totalCount * 2) / 3);
  const p5Count = delegations.filter((d) => d.isP5).length;

  return (
    <div className="min-h-screen bg-[#05070d] text-white flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Background Ambience & Cyber Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[450px] bg-gradient-to-b from-amber-500/12 via-orange-500/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-10 w-[700px] h-[450px] bg-gradient-to-bl from-cyan-500/12 via-blue-500/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-[800px] h-[500px] bg-gradient-to-t from-emerald-500/8 via-purple-500/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 mx-auto w-full max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 backdrop-blur-xl bg-black/40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack ? onBack : () => router.push(returnPath)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/15 border border-white/10 text-xs font-sans font-bold text-neutral-300 hover:text-white transition cursor-pointer active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK</span>
          </button>
          <div className="h-4 w-px bg-white/15 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              ZENVITRA DAIS OS &bull; V1
            </span>
            <span className="text-xs sm:text-sm font-display font-extrabold text-white hidden md:inline">
              Chamber &amp; Dais Setup Studio
            </span>
          </div>
        </div>

        {/* Right Top Header Controls: ⚡ Start Instant Session Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleStartInstantSession}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-black font-sans font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-95 group"
            title="Instant 1-Click Launch: Auto-seeds defaults if fields are empty and opens Dais Chamber"
          >
            <Zap className="w-3.5 h-3.5 fill-black group-hover:scale-125 transition-transform" />
            <span>START INSTANT SESSION</span>
          </button>

          <div className="h-4 w-px bg-white/15 hidden sm:block" />

          <div className="items-center gap-2 hidden lg:flex">
            <span className="text-[11px] font-mono text-neutral-400">
              Zero Login &bull; Live Quorum Synced
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main 2-Column Grid */}
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 lg:p-8">
        
        {/* Left Column: Step 1 (Committee & Dais) + Step 2 (Delegations & Import) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Section 1: Committee & Dais Architecture */}
          <section className="rounded-3xl bg-gradient-to-b from-[#0c1020]/95 via-[#080b16]/95 to-[#06080e]/95 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] p-5 sm:p-7 space-y-6 relative overflow-hidden backdrop-blur-md">
            
            {/* Top Section Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-black font-sans font-black text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  1
                </span>
                <div>
                  <h2 className="text-lg font-display font-black text-white tracking-tight">
                    Chamber &amp; Dais Architecture
                  </h2>
                  <p className="text-xs text-neutral-400 font-sans">
                    Configure official insignia, assembly credentials, topic, and presiding officers
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400/90 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md hidden sm:inline">
                STEP 1 OF 2
              </span>
            </div>

            {/* Live Chamber Credential Pass Preview */}
            <div className="relative rounded-2xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-amber-500/[0.04] border border-white/10 p-4 sm:p-5 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                
                {/* Emblem / Custom Icon / Vector Logo Box */}
                <div className="relative group shrink-0">
                  <div 
                    onClick={() => iconInputRef.current?.click()}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/60 border-2 border-white/20 group-hover:border-amber-400/80 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl cursor-pointer transition overflow-hidden relative"
                    title="Click to Upload Custom Icon / Crest"
                  >
                    {customIconUrl ? (
                      <img 
                        src={customIconUrl} 
                        alt="Custom Emblem" 
                        className="w-full h-full object-cover rounded-2xl" 
                      />
                    ) : selectedLogoKey ? (
                      <div className="flex items-center justify-center">
                        <CommitteeLogoBadge logoKey={selectedLogoKey} size={64} />
                      </div>
                    ) : (
                      <span>{emblem}</span>
                    )}

                    {/* Camera overlay hover badge */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[10px] font-sans font-bold text-white">
                      <Camera className="w-5 h-5 text-amber-400" />
                      <span>Upload</span>
                    </div>
                  </div>

                  {customIconUrl ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCustomIcon();
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center text-xs shadow-md transition cursor-pointer"
                      title="Remove Custom Icon & Revert to Emblem"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-sans font-black shadow-md pointer-events-none">
                      EMBLEM
                    </div>
                  )}
                </div>

                {/* Identity & Chamber Meta Details */}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                      OFFICIAL CHAMBER CREDENTIAL
                    </span>
                  </div>

                  <p className="text-lg sm:text-xl font-display font-extrabold text-white truncate">
                    {committeeName.trim() || 'United Nations Security Council (UNSC)'}
                  </p>

                  <div className="bg-black/40 border border-white/10 p-2.5 rounded-xl space-y-1.5 shadow-inner">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] font-mono shrink-0">
                          AGENDA:
                        </span>
                        {!isEditingAgenda && (
                          <span className="text-xs font-sans text-neutral-200 line-clamp-1 truncate">
                            {topic.trim() || 'Universal Peace, Multilateral Cooperation & Security'}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const nextState = !isEditingAgenda;
                          setIsEditingAgenda(nextState);
                          if (nextState) {
                            setTimeout(() => {
                              const el = document.getElementById('chamber-topic-inline-input') || document.getElementById('chamber-topic-input');
                              el?.focus();
                            }, 50);
                          }
                        }}
                        className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-amber-400/20 text-neutral-300 hover:text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 transition shrink-0 border border-white/10 hover:border-amber-400/30 cursor-pointer active:scale-95"
                        title="Edit Chamber Agenda & Topic"
                      >
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        <span>{isEditingAgenda ? 'Done' : 'Edit'}</span>
                      </button>
                    </div>

                    {isEditingAgenda ? (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          id="chamber-topic-inline-input"
                          type="text"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          placeholder="Enter chamber agenda / topic of deliberation..."
                          className="w-full bg-black/60 border border-amber-400/50 rounded-lg px-2.5 py-1 text-xs text-white placeholder-neutral-500 focus:outline-none font-sans"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              setIsEditingAgenda(false);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setIsEditingAgenda(false)}
                          className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold font-sans shrink-0 transition cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs font-sans text-neutral-300 line-clamp-2 pl-0.5">
                        {topic.trim() || 'Universal Peace, Multilateral Cooperation & Security'}
                      </p>
                    )}
                  </div>

                  {chairs.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">DAIS:</span>
                      {chairs.map((c, i) => (
                        <span key={i} className="text-[10px] font-mono bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded-md text-neutral-300">
                          ⚖️ {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Emblem Bar & Custom Icon Studio (Matching Screenshot 1 Exactly) */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3.5">
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    Chamber Insignia &amp; Crest
                  </span>
                  <span className="text-[10px] text-neutral-400 font-sans">
                    (Upload custom crest or choose an official emblem)
                  </span>
                </div>

                {/* Upload Button */}
                <div className="flex items-center gap-2">
                  <input
                    ref={iconInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleIconUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => iconInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 font-sans font-bold text-xs transition cursor-pointer active:scale-95 shadow-sm"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Custom Crest</span>
                  </button>

                  {customIconUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveCustomIcon}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 text-xs font-mono transition cursor-pointer"
                      title="Reset to default emblem"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Error Banner if any */}
              {iconUploadError && (
                <div className="flex items-center gap-2 text-rose-400 text-xs font-sans bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{iconUploadError}</span>
                </div>
              )}

              {/* EMBLEM: row matching Screenshot 1 */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
                <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
                  EMBLEM:
                </span>
                {EMBLEM_BAR_OPTIONS.map((item) => {
                  const isSelected = selectedLogoKey === item.logoKey && !customIconUrl;
                  return (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => {
                        setSelectedLogoKey(item.logoKey);
                        setEmblem(item.emoji);
                        setCustomIconUrl(null);

                        // Intelligently sync with matching committee preset so chamber details update!
                        const matched = COMMON_COMMITTEE_PRESETS.find(
                          p => p.logoKey === item.logoKey || p.id === item.logoKey || p.short.toLowerCase() === item.label.toLowerCase()
                        );
                        if (matched) {
                          setActivePreset(matched);
                          setCommitteeName(matched.name.replace(/_/g, ' '));
                          setTopic(matched.topic);
                          if (matched.defaultChairs && matched.defaultChairs.length > 0) {
                            setChairs(matched.defaultChairs);
                          }
                          if (delegations.length === 0) {
                            setDelegations(matched.portfolios);
                          }
                        }
                      }}
                      className={`h-9 px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-sans font-bold transition cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)] ring-2 ring-amber-300'
                          : 'bg-white/[0.04] text-neutral-300 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      <CommitteeLogoBadge logoKey={item.logoKey} size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Template Presets with Logos (Matching Screenshot 1 Exactly + Expanded) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>QUICK TEMPLATE PRESETS:</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {COMMON_COMMITTEE_PRESETS.length} Official Committees
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 p-0.5">
                {COMMON_COMMITTEE_PRESETS.map((p) => {
                  const isCurrent = activePreset?.id === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => handleApplyPresetCommittee(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 group ${
                        isCurrent
                          ? 'bg-amber-400/20 border-2 border-amber-400 text-white shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                          : 'bg-white/[0.04] hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white'
                      }`}
                      title={p.description}
                    >
                      {/* Crisp Committee Logo Badge */}
                      <CommitteeLogoBadge logoKey={p.logoKey} size={18} />
                      <span>{(p.short || p.name).replace(/_/g, ' ')}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Preset Configurable Portfolios Action Bar */}
              {activePreset && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 mt-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CommitteeLogoBadge logoKey={activePreset.logoKey} size={22} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-amber-300 truncate">
                        {activePreset.name.replace(/_/g, ' ')} Preset Selected
                      </p>
                      <p className="text-[10px] text-neutral-400 font-sans truncate">
                        Includes {activePreset.portfolios.length} official member portfolios with verified country flags.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLoadCommitteePortfolios(activePreset)}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-sans font-bold shrink-0 shadow-md active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 fill-black" />
                    <span>Load Portfolio Preset ({activePreset.portfolios.length})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Inputs: Committee Name & Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                  COMMITTEE NAME <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={committeeName}
                  onChange={(e) => setCommitteeName(e.target.value)}
                  placeholder="e.g. Human Rights Council or HRC"
                  className="w-full h-11 rounded-xl bg-black/50 border border-white/15 hover:border-white/30 px-3.5 text-xs sm:text-sm font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                  TOPIC <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. The right to education"
                  className="w-full h-11 rounded-xl bg-black/50 border border-white/15 hover:border-white/30 px-3.5 text-xs sm:text-sm font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition shadow-inner"
                />
              </div>
            </div>

            {/* Chairs (Optional) */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <label className="block text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                PRESIDING OFFICERS / DAIS CHAIRS <span className="text-neutral-500 font-normal">(OPTIONAL)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chairInput}
                  onChange={(e) => setChairInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChair();
                    }
                  }}
                  placeholder="e.g. Hon. Chair or Alexander Vance"
                  className="flex-1 h-10 rounded-xl bg-black/50 border border-white/15 hover:border-white/30 px-3 text-xs font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition shadow-inner"
                />
                <button
                  type="button"
                  onClick={handleAddChair}
                  className="px-4 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-sans font-bold text-white transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Chair</span>
                </button>
              </div>

              {/* Added Chairs Pills */}
              {chairs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {chairs.map((c, i) => (
                    <span
                      key={c + i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-sans font-semibold shadow-sm"
                    >
                      <span>⚖️ {c}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChair(i)}
                        className="text-neutral-400 hover:text-white transition cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Delegations Builder & Import Matrix (Matching Screenshot 2 Exactly) */}
          <section className="rounded-3xl bg-gradient-to-b from-[#0c1020]/95 via-[#080b16]/95 to-[#06080e]/95 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] p-5 sm:p-7 space-y-6 relative overflow-hidden backdrop-blur-md">
            
            {/* Top Section Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-black font-sans font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  2
                </span>
                <div>
                  <h2 className="text-xl font-display font-black text-white tracking-tight flex items-center gap-2">
                    <span>Delegations</span>
                  </h2>
                  <p className="text-xs text-neutral-400 font-sans">
                    Pick quick bundles with official logos, search countries, or import lists with duplicate detection
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-1 rounded-lg">
                {delegations.length} Selected
              </span>
            </div>

            {/* Single Country Input with Live Flag Match (Matching Screenshot 2 Exactly) */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={countryInput}
                    onChange={(e) => setCountryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCountry();
                      }
                    }}
                    placeholder="Type a country, or any custom name"
                    className="w-full h-12 pl-10 pr-12 rounded-2xl bg-black/50 border border-white/15 hover:border-white/30 text-xs sm:text-sm font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition shadow-inner"
                  />
                  {countryInput.trim() && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-2xl drop-shadow-md">
                      {lookupFlag(countryInput)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAddCountry}
                  disabled={!countryInput.trim()}
                  className="px-6 h-12 rounded-2xl bg-white/20 hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed text-white font-sans font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Quick Geo-Political Bundles with Circular Logos (Matching Screenshot 2 Exactly) */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 p-1">
                {PRESET_BUNDLES.map((bundle) => (
                  <button
                    type="button"
                    key={bundle.id}
                    onClick={() => handleApplyBundle(bundle)}
                    className="group px-3.5 py-2 rounded-full bg-white/[0.05] hover:bg-white/15 border border-white/15 text-xs font-sans font-bold text-neutral-200 hover:text-white transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                    title={bundle.description}
                  >
                    {/* Official Circular Logo Badge matching Screenshot 2 */}
                    <CommitteeLogoBadge logoKey={bundle.logoKey || bundle.id} size={20} />
                    <span>{bundle.shortName}</span>
                    <span className="text-[11px] font-mono opacity-60 group-hover:opacity-100">
                      +{bundle.delegations.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Import Modes Switcher Tabs (Paste a List | Link URL | Sheet / PDF / CSV Upload) */}
            <div className="pt-2 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                <button
                  type="button"
                  onClick={() => setImportMode('paste')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-bold transition cursor-pointer active:scale-95 ${
                    importMode === 'paste'
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                      : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>PASTE A LIST</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMode('link')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-bold transition cursor-pointer active:scale-95 ${
                    importMode === 'link'
                      ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20'
                      : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>GOOGLE SHEETS / URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMode('upload')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-bold transition cursor-pointer active:scale-95 ${
                    importMode === 'upload'
                      ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/20'
                      : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>SHEET / PDF / CSV FILE</span>
                </button>
              </div>

              {/* Mode 1: Paste a List with Smart Duplicate Detection */}
              {importMode === 'paste' && (
                <div className="space-y-2">
                  <div className="relative">
                    <textarea
                      rows={5}
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                      placeholder={`Paste delegations separated by commas or line breaks:\nUnited States\nUnited Kingdom\nFrance, Germany, India...\nDelegate of Japan`}
                      className="w-full rounded-2xl bg-black/60 border border-white/15 hover:border-white/30 p-3.5 pb-14 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition resize-none leading-relaxed shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={handleAutoMatchPaste}
                      disabled={!pasteText.trim()}
                      className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-30 disabled:cursor-not-allowed text-black font-sans font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>AUTO-MATCH &amp; CHECK DUPLICATES</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 2: Link / URL Paste */}
              {importMode === 'link' && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Google Sheets Share Link or CSV URL</span>
                    </label>
                    <p className="text-[11px] text-neutral-400 font-sans">
                      Paste a public Google Sheets share link, CSV export URL, or delegations matrix web link.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/... or raw CSV URL"
                      className="flex-1 h-11 rounded-xl bg-black/50 border border-white/15 px-3.5 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                    />
                    <button
                      type="button"
                      onClick={handleFetchFromUrl}
                      disabled={!urlInput.trim() || isFetchingUrl}
                      className="px-4 h-11 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-sans font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {isFetchingUrl ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Fetching...</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-3.5 h-3.5" />
                          <span>Import URL</span>
                        </>
                      )}
                    </button>
                  </div>

                  {urlError && (
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-sans bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{urlError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 3: Sheet / PDF / CSV Upload */}
              {importMode === 'upload' && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Upload Spreadsheet, PDF, or CSV Matrix</span>
                    </label>
                    <p className="text-[11px] text-neutral-400 font-sans">
                      Select a .csv, .xlsx, .pdf, or .txt file containing country or delegate names.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.tsv,.txt,.pdf,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-emerald-400/80 rounded-2xl p-6 text-center cursor-pointer transition hover:bg-emerald-500/[0.03] space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-neutral-400 group-hover:text-emerald-400 group-hover:scale-110 transition">
                      {isProcessingFile ? (
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                      ) : (
                        <UploadCloud className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                        {isProcessingFile ? 'Parsing Document Roster...' : 'Click to select CSV, PDF, or Excel File'}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        Accepts .CSV &bull; .PDF &bull; .XLSX &bull; .TXT
                      </p>
                    </div>
                  </div>

                  {fileError && (
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-sans bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{fileError}</span>
                    </div>
                  )}

                  {fileSuccessMessage && (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-sans bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{fileSuccessMessage}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Live Roster Console & Dais Launchpad */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <section className="flex-1 rounded-3xl bg-gradient-to-b from-[#0c1020]/95 via-[#080b16]/95 to-[#06080e]/95 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] p-5 sm:p-7 flex flex-col justify-between backdrop-blur-md">
            
            {/* Top Roster Telemetry Header */}
            <div className="space-y-4">
              
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight">
                      {totalCount}
                    </span>
                    <span className="text-sm font-sans font-extrabold text-neutral-300 tracking-wider uppercase">
                      DELEGATIONS
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">
                    Quorum: <span className="text-amber-400 font-bold">{quorumNeeded} needed</span> to commence session
                  </p>
                </div>

                {totalCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllDelegations}
                    className="text-xs font-sans font-semibold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 transition cursor-pointer active:scale-95"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* High-Tech Quorum Telemetry HUD */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
                <div className="space-y-0.5 text-center border-r border-white/10 pr-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">1/3 Quorum</span>
                  <p className="text-sm font-display font-black text-white">{quorumNeeded}</p>
                </div>
                <div className="space-y-0.5 text-center border-r border-white/10 px-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Simple (50%+1)</span>
                  <p className="text-sm font-display font-black text-cyan-300">{simpleMajority}</p>
                </div>
                <div className="space-y-0.5 text-center pl-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">2/3 Majority</span>
                  <p className="text-sm font-display font-black text-amber-300">{twoThirdsMajority}</p>
                </div>
              </div>

              {/* Roster Search (if > 5) */}
              {totalCount > 5 && (
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    placeholder="Search in added roster..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl bg-black/50 border border-white/10 text-xs font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              {/* Roster List with Flags beside Portfolios */}
              <div className="min-h-[300px] max-h-[460px] overflow-y-auto custom-scrollbar rounded-2xl bg-black/50 border border-white/10 p-2 shadow-inner">
                {filteredDelegations.length > 0 ? (
                  <div className="space-y-1.5">
                    {filteredDelegations.map((del, idx) => (
                      <div
                        key={del.country + idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Flag beside portfolio */}
                          <span className="text-xl shrink-0 drop-shadow-sm">{del.flag}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-sans font-bold text-white truncate">
                              {del.country}
                            </p>
                            {del.subTitle && (
                              <p className="text-[10px] font-sans text-neutral-400 truncate">
                                {del.subTitle}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {del.isP5 && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25">
                              P5
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveDelegation(idx)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                            title="Remove Delegation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty State with Quick-load shortcuts */
                  <div className="flex flex-col items-center justify-center min-h-[290px] text-center px-4 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-400 shadow-inner">
                      <Globe className="w-7 h-7 stroke-[1.5] text-amber-400/80" />
                    </div>
                    <div className="space-y-1 max-w-xs">
                      <h4 className="text-sm font-bold text-white">
                        No Delegates Yet
                      </h4>
                      <p className="text-xs text-neutral-400 font-sans">
                        Add countries, paste a list, or load a quick bundle below
                      </p>
                    </div>

                    <div className="flex flex-col w-full max-w-xs gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const g20 = PRESET_BUNDLES.find((b) => b.id === 'g20');
                          if (g20) handleApplyBundle(g20);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-sans font-bold text-neutral-200 hover:text-white transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <CommitteeLogoBadge logoKey="g20" size={18} />
                        <span>Load G20 Summit Matrix (19)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const unsc = PRESET_BUNDLES.find((b) => b.id === 'unsc_2026');
                          if (unsc) handleApplyBundle(unsc);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-sans font-bold text-neutral-200 hover:text-white transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <CommitteeLogoBadge logoKey="unsc" size={18} />
                        <span>Load UNSC 2026 Matrix (15)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Launchpad */}
            <div className="pt-5 space-y-3 border-t border-white/10 mt-4">
              
              {/* PRIMARY ⚡ START INSTANT SESSION BUTTON */}
              <button
                type="button"
                onClick={handleStartInstantSession}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-black font-sans font-black text-sm tracking-wider uppercase transition shadow-[0_0_30px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-95 group"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-black group-hover:scale-125 transition-transform" />
                  <span>START INSTANT SESSION</span>
                </div>
                <span className="text-[10px] font-mono font-medium opacity-80">
                  Instant launch &bull; Auto-seeds standard matrix if empty
                </span>
              </button>

              {/* SECONDARY: START CONFIGURED SESSION */}
              <button
                type="button"
                onClick={handleLaunchSession}
                disabled={!isReadyToLaunch}
                className={`w-full py-3 rounded-2xl font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isReadyToLaunch
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 cursor-pointer active:scale-95'
                    : 'bg-white/[0.02] text-neutral-600 border border-white/5 cursor-not-allowed'
                }`}
              >
                {!isReadyToLaunch ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Start Configured Session (Requires Name &amp; Delegations)</span>
                  </>
                ) : (
                  <>
                    <Gavel className="w-3.5 h-3.5 text-amber-400" />
                    <span>Launch Configured Chamber ({totalCount} Delegations)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-neutral-400 pt-1">
                <span>Free &bull; Zero Login</span>
                <span>&bull;</span>
                <span>Instant Roll Call Sync</span>
                <span>&bull;</span>
                <span>Live Dais OS</span>
              </div>
            </div>

          </section>
        </div>

      </main>

      {/* POPUP MODAL: DUPLICATE PORTFOLIOS DETECTED */}
      {isDuplicateModalOpen && duplicateModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#121626] to-[#0a0d18] border border-amber-400/40 shadow-[0_0_50px_rgba(245,158,11,0.25)] p-6 sm:p-7 space-y-5">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-display font-black text-white">
                  Duplicate Portfolio Found
                </h3>
                <p className="text-xs text-neutral-300 font-sans mt-0.5">
                  Detected {duplicateModalData.duplicates.length} duplicate portfolio(s) in your paste. Each delegation on the dais should typically have a unique seat.
                </p>
              </div>
            </div>

            {/* List of Duplicate Portfolios with Flags */}
            <div className="rounded-2xl bg-black/60 border border-white/10 p-3 max-h-52 overflow-y-auto custom-scrollbar space-y-1.5">
              {duplicateModalData.duplicates.map((dup, i) => (
                <div
                  key={dup.country + i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl drop-shadow-sm">{dup.flag}</span>
                    <span className="text-xs font-sans font-bold text-white truncate">
                      {dup.country}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold shrink-0 ${
                      dup.reason === 'Already in Roster'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {dup.reason === 'Already in Roster'
                      ? 'Already in Roster'
                      : `Repeated ${dup.count}x in Paste`}
                  </span>
                </div>
              ))}
            </div>

            {/* Configurable Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleResolveSkipDuplicates}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black font-sans font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Skip Duplicates &amp; Add Unique ({duplicateModalData.uniqueNewItems.length})</span>
              </button>

              <button
                type="button"
                onClick={handleResolveKeepAllAsDoubleDelegations}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-sans font-bold text-xs uppercase tracking-wider transition cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Keep All (Allow Double Delegations)</span>
              </button>

              <button
                type="button"
                onClick={handleCancelDuplicateModal}
                className="w-full py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-mono transition cursor-pointer"
              >
                Cancel &amp; Edit Pasted List
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
