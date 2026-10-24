'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Share2, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  MinusCircle, 
  ScrollText, 
  Shield, 
  Users, 
  Calendar, 
  Sparkles,
  FileCheck,
  Newspaper,
  FileText,
  MessageSquare,
  Scale,
  Quote,
  Send,
  Plus,
  ChevronDown,
  ChevronRight,
  Filter,
  CheckCircle2,
  Gavel,
  AlertCircle,
  Handshake,
  Zap,
  Scissors,
  FileEdit,
  Layers,
  ArrowRight,
  Timer,
  Clock,
  Award,
  Coins,
  Gift,
  Copy,
  Activity,
  History,
  FilePlus,
  Table as TableIcon,
  Trash2,
  Edit3,
  Lock
} from 'lucide-react';
import { 
  SolutionDocument, 
  DocumentClause, 
  ClauseAmendment, 
  ClauseDiscussion,
  ClauseSubItem,
  AmendmentActionType,
  AmendmentProceduralClass,
  AmendmentImpactCategory,
  DocumentSchedule
} from '@/types/solutions';
import { useAuth } from '@/context/AuthContext';
import { SolutionExportModal } from './SolutionExportModal';
import { PassportRewardsPlaceholderModal } from './PassportRewardsPlaceholderModal';
import { SolutionRichContent } from './SolutionRichContent';
import {
  getUserPassportPoints,
  calculateDynamicMultiplier,
  getUserStakeForDocument,
  placeBillStake,
  settleBillStake,
  recordVoteAndEarn,
  BillStakeRecord
} from '@/lib/solutionsStaking';
import { sheetSync } from '@/lib/googleSheets';

interface DocumentReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: SolutionDocument | null;
  onVote?: (docId: string, voteType: 'IN_FAVOR' | 'AGAINST' | 'ABSTAIN') => void;
  onUpdateDocument?: (doc: SolutionDocument) => void;
  onEditDocument?: (doc: SolutionDocument) => void;
  onRedeemClick?: () => void; // Modular trigger for Passport Points rewards redemption
}

export function DocumentReaderModal({ isOpen, onClose, document: initialDoc, onVote, onUpdateDocument, onEditDocument, onRedeemClick }: DocumentReaderModalProps) {
  const { profile, user } = useAuth();
  const [doc, setDoc] = useState<SolutionDocument | null>(() => {
    if (!initialDoc) return null;
    if (initialDoc.votes?.inFavor === 142 && initialDoc.votes?.against === 18 && initialDoc.votes?.abstain === 9) {
      return { ...initialDoc, votes: { inFavor: 0, against: 0, abstain: 0 }, votedUserIds: [] };
    }
    return initialDoc;
  });
  const [copied, setCopied] = useState(false);
  const [citedClauseNumber, setCitedClauseNumber] = useState<string | null>(null);
  const [citedSubClauseKey, setCitedSubClauseKey] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<'IN_FAVOR' | 'AGAINST' | 'ABSTAIN' | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  // PIB Authentic Original Source View State
  const [readerMode, setReaderMode] = useState<'clauses' | 'pib_source'>('clauses');
  const [pibFont, setPibFont] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [pibCopied, setPibCopied] = useState(false);

  const isDownloadAllowed = Boolean(
    doc?.originalDocument?.allowDownload !== false &&
    doc?.allowOriginalDownload !== false
  );

  const handleDownloadOriginal = () => {
    if (!doc) return;
    if (!isDownloadAllowed) {
      alert('🔒 Public download of the original source document has been restricted by the author. You can view the authentic dispatch online.');
      return;
    }

    if (doc.originalDocument?.dataUrl) {
      const a = document.createElement('a');
      a.href = doc.originalDocument.dataUrl;
      a.download = doc.originalDocument.name || `${doc.documentCode}_source.${doc.originalDocument.type || 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Fallback: Generate clean text/markdown file
    const rawTextContent = doc.originalDocument?.rawContent || doc.fullText || (
      `${doc.title}\n\n${doc.committee}\n\n${doc.enactingFormula || ''}\n\n` +
      doc.clauses.map(c => `Clause ${c.clauseNumber}: ${c.title || ''}\n${c.text}`).join('\n\n')
    );
    const blob = new Blob([rawTextContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.originalDocument?.name || `${doc.documentCode}_source.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyPibText = () => {
    if (!doc) return;
    const textToCopy = doc.originalDocument?.rawContent || doc.fullText || doc.clauses.map(c => `Clause ${c.clauseNumber}: ${c.text}`).join('\n\n');
    navigator.clipboard?.writeText(textToCopy);
    setPibCopied(true);
    setTimeout(() => setPibCopied(false), 2000);
  };

  // Active Interactive Drawer for Clause (either 'discuss' or 'amend')
  const [activeClauseInteraction, setActiveClauseInteraction] = useState<{
    clauseId: string;
    type: 'discuss' | 'amend';
  } | null>(null);

  // Discussion Form State
  const [newCommentText, setNewCommentText] = useState('');

  // Parliamentary Amendment Form State
  const [proceduralClass, setProceduralClass] = useState<AmendmentProceduralClass>('UNFRIENDLY');
  const [actionType, setActionType] = useState<AmendmentActionType>('MODIFY');
  const [targetSubClause, setTargetSubClause] = useState<string>('ENTIRE_CLAUSE');
  const [selectedSubClauseText, setSelectedSubClauseText] = useState<string>('');
  const [moverHandle, setMoverHandle] = useState<string>('');
  const [moverDelegation, setMoverDelegation] = useState<string>('');
  const [additionalSignatories, setAdditionalSignatories] = useState<string>('');
  const [countdownDuration, setCountdownDuration] = useState<number>(60);
  const [secondedBy, setSecondedBy] = useState<string>('');
  const [amendmentText, setAmendmentText] = useState('');
  const [amendmentRationale, setAmendmentRationale] = useState('');
  const [impactCategory, setImpactCategory] = useState<AmendmentImpactCategory>('GENERAL');
  const [impactAssessment, setImpactAssessment] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Maker Schedule Creation States
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
  const [scheduleNumberInput, setScheduleNumberInput] = useState('THE FIRST SCHEDULE');
  const [scheduleTitleInput, setScheduleTitleInput] = useState('');
  const [scheduleContentInput, setScheduleContentInput] = useState('');
  const [schedulePresetChoice, setSchedulePresetChoice] = useState<'PENALTY' | 'FISCAL' | 'TIMELINE' | 'CUSTOM'>('CUSTOM');

  // Live Timer Ticker for Division Countdowns
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  // User Passport Points Balance & Staking States
  const activeUsername = profile?.username || user?.email?.split('@')[0] || 'yuveer';
  const [passportPoints, setPassportPoints] = useState<number>(100);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [stakeAmount, setStakeAmount] = useState<number>(25);
  const [stakeOutcome, setStakeOutcome] = useState<'PASS' | 'FAIL'>('PASS');
  const [stakeReasoning, setStakeReasoning] = useState<string>('');
  const [stakeMessage, setStakeMessage] = useState<string | null>(null);
  const [voteEarnMessage, setVoteEarnMessage] = useState<string | null>(null);
  const [activeStake, setActiveStake] = useState<BillStakeRecord | null>(() => {
    return initialDoc ? getUserStakeForDocument(activeUsername, initialDoc.id) : null;
  });

  // Dynamic Multiplier calculation based on Vote Quality
  const calculatedMultiplier = React.useMemo(() => {
    if (!doc) return { multiplier: 1.0, breakdown: [] };
    return calculateDynamicMultiplier(doc, stakeReasoning, Boolean(doc.isOfficial));
  }, [doc, stakeReasoning]);

  // Sync points & active stake when doc or profile changes
  React.useEffect(() => {
    setPassportPoints(getUserPassportPoints(activeUsername, profile?.display_name));
    if (doc) {
      setActiveStake(getUserStakeForDocument(activeUsername, doc.id));
    }
  }, [doc, activeUsername, profile?.display_name]);

  // Handler: Place Stake with Passport Points
  const handlePlaceStake = () => {
    setStakeMessage(null);
    if (!doc) return;
    try {
      const stake = placeBillStake(activeUsername, doc, {
        outcome: stakeOutcome,
        points: stakeAmount,
        reasoning: stakeReasoning,
        hasSourceBacking: Boolean(doc.isOfficial)
      });
      setActiveStake(stake);
      setPassportPoints(getUserPassportPoints(activeUsername, profile?.display_name));
      setStakeMessage(`✅ Successfully staked ${stake.pointsStaked} Passport Points on ${stake.stakedOutcome === 'PASS' ? 'AYE (PASS)' : 'NO (FAIL)'} at ${stake.multiplier}x multiplier!`);

      // Asynchronously dispatch to Register 43 Legislation Bills
      sheetSync.bill({
        Bill_ID: doc.id,
        Document_Code: doc.documentCode || (doc as any).documentNumber || doc.id,
        Title: doc.title,
        Category: doc.category || doc.documentType || 'POLICY',
        Committee: doc.committee || 'General Assembly',
        Status: doc.status || 'PROPOSED',
        Lead_Sponsors: (doc.leadSponsors || []).join(', '),
        Proposed_By_Username: doc.proposedByUsername || 'yuveer',
        Votes_In_Favor: doc.votes?.inFavor ?? 0,
        Votes_Against: doc.votes?.against ?? 0,
        Votes_Abstain: doc.votes?.abstain ?? 0,
        Total_Staked_Points: stake.pointsStaked,
        Multiplier: `${stake.multiplier}x`,
        Is_Official: doc.isOfficial ? 'Yes' : 'No',
        Created_At: doc.createdAt,
        Updated_At: new Date().toISOString(),
        Notes: `Stake: @${stake.username} staked ${stake.pointsStaked} pts on ${stake.stakedOutcome} (${stake.multiplier}x)`
      }).catch(() => {});
    } catch (err: any) {
      setStakeMessage(`⚠ ${err.message || 'Failed to place stake'}`);
    }
  };

  // Handler: Settle Stake
  const handleSettleStake = () => {
    setStakeMessage(null);
    if (!doc) return;
    const result = settleBillStake(activeUsername, doc);
    if (!result.settled) {
      setStakeMessage('Chamber roll-call is still active with 0 recorded votes. Cast votes to establish floor quorum.');
      return;
    }
    if (result.won) {
      setStakeMessage(`🎉 Prediction Won! Payout of ${result.payout} Passport Points credited to your sovereign passport ledger.`);
    } else {
      setStakeMessage('Outcome resolved opposite to stake. Position closed.');
    }
    setActiveStake(null);
    setPassportPoints(getUserPassportPoints(activeUsername, profile?.display_name));
  };

  // Modular trigger for Rewards Redemption
  const handleRedeemClick = () => {
    if (onRedeemClick) {
      onRedeemClick();
    } else {
      setIsRewardsModalOpen(true);
    }
  };

  // Chapter Filter
  const [selectedChapter, setSelectedChapter] = useState<string>('ALL');

  // Helper to parse and sanitize handles (must start with @)
  const parseHandles = (primary: string, additional?: string): string[] => {
    const rawList = [primary, ...(additional ? additional.split(/[,\s]+/) : [])];
    const cleaned = rawList
      .map(h => h.trim())
      .filter(Boolean)
      .map(h => (h.startsWith('@') ? h : `@${h}`));
    return Array.from(new Set(cleaned));
  };

  // Helper to credit points to signatories in local storage
  const creditPointsToSignatories = (handles: string[], pts: number) => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('zenvitra_delegate_points') || '{}';
      const pointsMap: Record<string, number> = JSON.parse(raw);
      handles.forEach(h => {
        const key = h.toLowerCase().trim();
        pointsMap[key] = (pointsMap[key] || 0) + pts;
      });
      localStorage.setItem('zenvitra_delegate_points', JSON.stringify(pointsMap));
    } catch (err) {
      console.warn('Failed to update delegate points', err);
    }
  };

  // Interval to tick currentTime every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Floor Vote Resolution Engine (Auto when countdown ends or on manual conclude)
  const resolveAmendmentVote = (clauseId: string, amendmentId: string) => {
    setDoc(prevDoc => {
      if (!prevDoc) return prevDoc;

      const nextClauses = prevDoc.clauses.map(clause => {
        if (clause.id !== clauseId || !clause.amendments) return clause;

        const amend = clause.amendments.find(a => a.id === amendmentId);
        if (!amend || (amend.disposition && amend.disposition !== 'TABLED')) return clause;

        const ayeCount = amend.votingRecord?.aye ?? (amend.votes || 0);
        const noCount = amend.votingRecord?.no ?? 0;
        const passedMajority = ayeCount > noCount && ayeCount > 0;

        let nextText = clause.text;
        let nextSubClauses = clause.subClauses ? [...clause.subClauses] : [];
        let nextAmendedBy = clause.amendedBy;

        const updatedAmendments = clause.amendments.map(a => {
          if (a.id !== amendmentId) return a;

          if (passedMajority) {
            // 1. Format and update clause / subclauses
            if (a.actionType === 'MODIFY') {
              if (a.targetSubClause && a.targetSubClause !== `Clause ${clause.clauseNumber}` && nextSubClauses.length > 0) {
                nextSubClauses = nextSubClauses.map(s => {
                  if (a.targetSubClause?.includes(s.number)) {
                    return { ...s, text: a.proposedText };
                  }
                  return s;
                });
              } else {
                nextText = a.proposedText;
              }
            } else if (a.actionType === 'INSERT') {
              const newNumber = `(${nextSubClauses.length + 1})`;
              nextSubClauses.push({
                number: newNumber,
                text: a.proposedText
              });
            } else if (a.actionType === 'STRIKE') {
              if (a.targetSubClause && a.targetSubClause !== `Clause ${clause.clauseNumber}`) {
                nextSubClauses = nextSubClauses.filter(s => !a.targetSubClause?.includes(s.number));
              } else {
                nextText = '[STRUCK OUT BY ADOPTED AMENDMENT]';
              }
            }

            // 2. Divide points among all signatories (handle is mandatory)
            const handles = (a.contributorHandles && a.contributorHandles.length > 0)
              ? a.contributorHandles
              : [(a.authorUsername && a.authorUsername.startsWith('@')) ? a.authorUsername : `@${a.authorUsername || a.author || 'yuveer'}`];

            const totalPoints = 100;
            const pointsPerUser = Math.max(1, Math.round(totalPoints / handles.length));

            nextAmendedBy = {
              handles,
              totalPoints,
              pointsPerUser,
              adoptedAt: new Date().toISOString(),
              amendmentId: a.id,
              docketNumber: a.targetSubClause || `Clause ${clause.clauseNumber}`
            };

            creditPointsToSignatories(handles, pointsPerUser);

            // Asynchronously dispatch ratification to Register 44 Bill Amendments
            sheetSync.amendment({
              Amendment_ID: a.id,
              Bill_Code: prevDoc.documentCode || (prevDoc as any).documentNumber || prevDoc.title || prevDoc.id,
              Clause_Number: clause.clauseNumber,
              Submitter_Handle: a.authorUsername || a.author,
              Signatories: handles.join(', '),
              Original_Text: a.originalText,
              Proposed_Text: a.proposedText,
              Rationale_Tag: a.impactCategory || 'GENERAL',
              Rationale_Note: a.rationale || '',
              Status: 'RATIFIED',
              Vote_Count: (a.votingRecord?.aye || 0) + (a.votingRecord?.no || 0),
              Ratified_At: new Date().toISOString(),
              Points_Per_Signatory: pointsPerUser,
              Notes: `Ratified via Division (${a.votingRecord?.aye || 0} Ayes to ${a.votingRecord?.no || 0} Noes)`
            }).catch(() => {});

            return {
              ...a,
              disposition: 'ADOPTED_DIVISION' as const,
              totalPointsAwarded: totalPoints
            };
          } else {
            // Asynchronously dispatch rejection to Register 44 Bill Amendments
            sheetSync.amendment({
              Amendment_ID: a.id,
              Bill_Code: prevDoc.documentCode || (prevDoc as any).documentNumber || prevDoc.title || prevDoc.id,
              Clause_Number: clause.clauseNumber,
              Submitter_Handle: a.authorUsername || a.author,
              Signatories: (a.contributorHandles || []).join(', '),
              Original_Text: a.originalText,
              Proposed_Text: a.proposedText,
              Rationale_Tag: a.impactCategory || 'GENERAL',
              Rationale_Note: a.rationale || '',
              Status: 'REJECTED',
              Vote_Count: (a.votingRecord?.aye || 0) + (a.votingRecord?.no || 0),
              Ratified_At: '',
              Points_Per_Signatory: 0,
              Notes: `Failed Division (${a.votingRecord?.aye || 0} Ayes to ${a.votingRecord?.no || 0} Noes)`
            }).catch(() => {});

            return {
              ...a,
              disposition: 'REJECTED' as const
            };
          }
        });

        return {
          ...clause,
          text: nextText,
          subClauses: nextSubClauses,
          amendedBy: nextAmendedBy,
          amendments: updatedAmendments
        };
      });

      const updated = { ...prevDoc, clauses: nextClauses };
      if (onUpdateDocument) onUpdateDocument(updated);
      return updated;
    });
  };

  // Auto-resolve any tabled amendments whose voting deadline has expired
  React.useEffect(() => {
    if (!doc) return;

    let hasExpired = false;
    doc.clauses.forEach(clause => {
      clause.amendments?.forEach(amend => {
        if (
          amend.disposition === 'TABLED' &&
          amend.votingDeadline &&
          new Date(amend.votingDeadline).getTime() <= currentTime
        ) {
          hasExpired = true;
        }
      });
    });

    if (hasExpired) {
      setDoc(prevDoc => {
        if (!prevDoc) return prevDoc;
        let modified = false;

        const nextClauses = prevDoc.clauses.map(clause => {
          if (!clause.amendments) return clause;

          let nextText = clause.text;
          let nextSubClauses = clause.subClauses ? [...clause.subClauses] : [];
          let nextAmendedBy = clause.amendedBy;

          const nextAmendments = clause.amendments.map(amend => {
            if (
              amend.disposition === 'TABLED' &&
              amend.votingDeadline &&
              new Date(amend.votingDeadline).getTime() <= currentTime
            ) {
              modified = true;
              const ayeCount = amend.votingRecord?.aye ?? (amend.votes || 0);
              const noCount = amend.votingRecord?.no ?? 0;
              const passed = ayeCount > noCount && ayeCount > 0;

              if (passed) {
                if (amend.actionType === 'MODIFY') {
                  if (amend.targetSubClause && amend.targetSubClause !== `Clause ${clause.clauseNumber}` && nextSubClauses.length > 0) {
                    nextSubClauses = nextSubClauses.map(s => {
                      if (amend.targetSubClause?.includes(s.number)) {
                        return { ...s, text: amend.proposedText };
                      }
                      return s;
                    });
                  } else {
                    nextText = amend.proposedText;
                  }
                } else if (amend.actionType === 'INSERT') {
                  const newNumber = `(${nextSubClauses.length + 1})`;
                  nextSubClauses.push({
                    number: newNumber,
                    text: amend.proposedText
                  });
                } else if (amend.actionType === 'STRIKE') {
                  if (amend.targetSubClause && amend.targetSubClause !== `Clause ${clause.clauseNumber}`) {
                    nextSubClauses = nextSubClauses.filter(s => !amend.targetSubClause?.includes(s.number));
                  } else {
                    nextText = '[STRUCK OUT BY ADOPTED AMENDMENT]';
                  }
                }

                const handles = (amend.contributorHandles && amend.contributorHandles.length > 0)
                  ? amend.contributorHandles
                  : [(amend.authorUsername && amend.authorUsername.startsWith('@')) ? amend.authorUsername : `@${amend.authorUsername || amend.author || 'yuveer'}`];

                const totalPoints = 100;
                const pointsPerUser = Math.max(1, Math.round(totalPoints / handles.length));

                nextAmendedBy = {
                  handles,
                  totalPoints,
                  pointsPerUser,
                  adoptedAt: new Date().toISOString(),
                  amendmentId: amend.id,
                  docketNumber: amend.targetSubClause || `Clause ${clause.clauseNumber}`
                };

                creditPointsToSignatories(handles, pointsPerUser);

                return {
                  ...amend,
                  disposition: 'ADOPTED_DIVISION' as const,
                  totalPointsAwarded: totalPoints
                };
              } else {
                return {
                  ...amend,
                  disposition: 'REJECTED' as const
                };
              }
            }
            return amend;
          });

          return {
            ...clause,
            text: nextText,
            subClauses: nextSubClauses,
            amendedBy: nextAmendedBy,
            amendments: nextAmendments
          };
        });

        if (modified) {
          const updated = { ...prevDoc, clauses: nextClauses };
          if (onUpdateDocument) onUpdateDocument(updated);
          return updated;
        }
        return prevDoc;
      });
    }
  }, [currentTime, doc, onUpdateDocument]);

  React.useEffect(() => {
    if (initialDoc) {
      if (initialDoc.votes?.inFavor === 142 && initialDoc.votes?.against === 18 && initialDoc.votes?.abstain === 9) {
        setDoc({ ...initialDoc, votes: { inFavor: 0, against: 0, abstain: 0 }, votedUserIds: [] });
      } else {
        setDoc(initialDoc);
      }
    } else {
      setDoc(null);
    }
  }, [initialDoc]);

  // All Proposed Amendments across the entire bill
  const allProposedAmendments = React.useMemo(() => {
    if (!doc) return [];
    const list: { clause: DocumentClause; amendment: ClauseAmendment }[] = [];
    doc.clauses?.forEach(clause => {
      clause.amendments?.forEach(amend => {
        list.push({ clause, amendment: amend });
      });
    });
    return list;
  }, [doc]);

  const openProposedAmendments = allProposedAmendments.filter(
    item => !item.amendment.disposition || item.amendment.disposition === 'TABLED'
  );

  // Group open proposed amendments by target clause for unified legislative blocks
  const amendmentsByClause = useMemo<{ clause: DocumentClause; amendments: ClauseAmendment[] }[]>(() => {
    const map = new Map<string, { clause: DocumentClause; amendments: ClauseAmendment[] }>();
    openProposedAmendments.forEach(({ clause, amendment }) => {
      const key = clause.id || clause.clauseNumber;
      if (!map.has(key)) {
        map.set(key, { clause, amendments: [] });
      }
      map.get(key)!.amendments.push(amendment);
    });
    return Array.from(map.values());
  }, [openProposedAmendments]);

  if (!isOpen || !doc) return null;

  const isDocAuthor = Boolean(
    (profile?.username && doc.proposedByUsername === profile.username) ||
    (profile?.display_name && doc.leadSponsors.includes(profile.display_name)) ||
    (profile?.username && doc.leadSponsors.some(s => s.toLowerCase().includes(profile.username.toLowerCase())))
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCiteClause = (clause: DocumentClause) => {
    const citation = `[Clause ${clause.clauseNumber}: ${clause.title || ''}, ${doc.title}] (${window.location.origin}/solutions?doc=${doc.id}&clause=${clause.clauseNumber})`;
    navigator.clipboard?.writeText(citation);
    setCitedClauseNumber(clause.clauseNumber);
    setTimeout(() => setCitedClauseNumber(null), 2500);
  };

  const handleCiteSubClause = (clause: DocumentClause, subNumber: string, subText: string) => {
    const cleanSub = subNumber.replace(/[^a-zA-Z0-9]/g, '');
    const citation = `[Section ${clause.clauseNumber}(${cleanSub}), ${doc.title}]: "${subText.trim()}" (${window.location.origin}/solutions?doc=${doc.id}&clause=${clause.clauseNumber}&sub=${cleanSub})`;
    navigator.clipboard?.writeText(citation);
    setCitedSubClauseKey(`${clause.id || clause.clauseNumber}-${subNumber}`);
    setTimeout(() => setCitedSubClauseKey(null), 2500);
  };

  const handleCastVote = (type: 'IN_FAVOR' | 'AGAINST' | 'ABSTAIN') => {
    if (userVote === type) return;
    const prevVote = userVote;
    setUserVote(type);

    setDoc(prev => {
      if (!prev) return prev;
      const votes = { ...prev.votes };
      if (prevVote === 'IN_FAVOR') votes.inFavor = Math.max(0, votes.inFavor - 1);
      if (prevVote === 'AGAINST') votes.against = Math.max(0, votes.against - 1);
      if (prevVote === 'ABSTAIN') votes.abstain = Math.max(0, votes.abstain - 1);

      if (type === 'IN_FAVOR') votes.inFavor += 1;
      if (type === 'AGAINST') votes.against += 1;
      if (type === 'ABSTAIN') votes.abstain += 1;

      const updated = { ...prev, votes };

      // Requirement 2: Vote & Earn Mechanism
      const earnResult = recordVoteAndEarn(activeUsername, updated, type);
      setVoteEarnMessage(earnResult.message);
      setTimeout(() => setVoteEarnMessage(null), 5000);
      setPassportPoints(getUserPassportPoints(activeUsername, profile?.display_name));

      if (onUpdateDocument) onUpdateDocument(updated);
      return updated;
    });

    if (onVote) onVote(doc.id, type);
  };

  // Add Comment on Clause
  const handleAddComment = (clauseId: string) => {
    if (!newCommentText.trim()) return;

    const authorName = profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'Diplomat';
    const authorUsername = profile?.username || 'member';

    const newComment: ClauseDiscussion = {
      id: `comm_${Date.now()}`,
      author: authorName,
      authorUsername,
      text: newCommentText.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedClauses = doc.clauses.map(c => {
      if (c.id === clauseId) {
        return {
          ...c,
          discussions: [...(c.discussions || []), newComment]
        };
      }
      return c;
    });

    const updatedDoc = { ...doc, clauses: updatedClauses };
    setDoc(updatedDoc);
    if (onUpdateDocument) onUpdateDocument(updatedDoc);
    setNewCommentText('');
  };

  // Open Detailed Parliamentary Amendment Form
  const openAmendmentForm = (clause: DocumentClause) => {
    setActiveClauseInteraction({ clauseId: clause.id!, type: 'amend' });
    setProceduralClass(isDocAuthor ? 'FRIENDLY' : 'UNFRIENDLY');
    setActionType('MODIFY');
    setTargetSubClause('ENTIRE_CLAUSE');
    setSelectedSubClauseText(clause.text || '');
    const userHandle = profile?.username
      ? (profile.username.startsWith('@') ? profile.username : `@${profile.username}`)
      : '@yuveer';
    setMoverHandle(userHandle);
    setMoverDelegation(profile?.display_name || userHandle);
    setAdditionalSignatories('');
    setCountdownDuration(60);
    setSecondedBy('');
    setAmendmentText('');
    setAmendmentRationale('');
    setImpactCategory('GENERAL');
    setImpactAssessment('');
    setFormError(null);
  };

  // Handle Target Provision change within the form
  const handleTargetSubClauseChange = (clause: DocumentClause, targetKey: string) => {
    setTargetSubClause(targetKey);
    if (targetKey === 'ENTIRE_CLAUSE') {
      setSelectedSubClauseText(clause.text || '');
    } else {
      const sub = clause.subClauses?.find(s => s.number === targetKey);
      setSelectedSubClauseText(sub ? `${sub.number} ${sub.text}` : clause.text);
    }
  };

  // Propose Table Amendment on Clause (Rule 54 Admissibility)
  const handleProposeAmendment = (clause: DocumentClause) => {
    setFormError(null);
    if (actionType !== 'STRIKE' && !amendmentText.trim()) {
      setFormError('Proposed wording is required to redline or insert into the clause.');
      return;
    }
    if (proceduralClass === 'UNFRIENDLY' && !secondedBy.trim()) {
      setFormError('Under Parliamentary Rule 54, an unfriendly floor amendment requires a recognized Seconder delegation.');
      return;
    }

    const parsedHandles = parseHandles(moverHandle, additionalSignatories);
    if (parsedHandles.length === 0) {
      setFormError('At least one contributor handle starting with @ is required.');
      return;
    }

    const durationSeconds = countdownDuration || 60;
    const deadline = new Date(Date.now() + durationSeconds * 1000).toISOString();

    const authorName = profile?.display_name || profile?.username || user?.email?.split('@')[0] || moverHandle;
    const authorUsername = moverHandle.startsWith('@') ? moverHandle.slice(1) : moverHandle;

    const newAmendment: ClauseAmendment = {
      id: `amend_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      author: authorName,
      authorUsername,
      authorDelegation: moverDelegation.trim() || authorName,
      secondedBy: secondedBy.trim() || undefined,
      proceduralClass,
      actionType,
      targetSubClause: targetSubClause === 'ENTIRE_CLAUSE' ? `Clause ${clause.clauseNumber}` : `Sub-clause ${targetSubClause}`,
      originalText: selectedSubClauseText,
      proposedText: actionType === 'STRIKE' ? '[STRUCK OUT BY AMENDMENT]' : amendmentText.trim(),
      rationale: amendmentRationale.trim() || 'Substantive alignment with parliamentary consensus and statutory clarity.',
      impactAssessment: impactAssessment.trim() || undefined,
      impactCategory,
      disposition: 'TABLED',
      contributorHandles: parsedHandles,
      votingDeadline: deadline,
      votingDurationSeconds: durationSeconds,
      votes: 0,
      votingRecord: {
        aye: 0,
        no: 0,
        abstain: 0,
        voters: {}
      },
      votedUserIds: [],
      createdAt: new Date().toISOString()
    };

    const updatedClauses = doc.clauses.map(c => {
      if (c.id === clause.id) {
        return {
          ...c,
          amendments: [...(c.amendments || []), newAmendment]
        };
      }
      return c;
    });

    const updatedDoc = { ...doc, clauses: updatedClauses };
    setDoc(updatedDoc);
    if (onUpdateDocument) onUpdateDocument(updatedDoc);

    // Asynchronously dispatch to Register 44 Bill Amendments
    sheetSync.amendment({
      Amendment_ID: newAmendment.id,
      Bill_Code: doc.documentCode || (doc as any).documentNumber || doc.title || doc.id,
      Clause_Number: clause.clauseNumber,
      Submitter_Handle: moverHandle,
      Signatories: parsedHandles.join(', '),
      Original_Text: selectedSubClauseText,
      Proposed_Text: newAmendment.proposedText,
      Rationale_Tag: impactCategory,
      Rationale_Note: newAmendment.rationale,
      Status: 'TABLED',
      Vote_Count: 0,
      Ratified_At: '',
      Points_Per_Signatory: 0,
      Notes: `Procedural Class: ${proceduralClass} | Target: ${newAmendment.targetSubClause}`
    }).catch(() => {});

    setActiveClauseInteraction(null);
    setFormError(null);
  };

  // Parliamentary Division Vote on an Amendment (Aye / No / Abstain)
  const handleVoteOnAmendment = (
    clauseId: string,
    amendmentId: string,
    vote: 'AYE' | 'NO' | 'ABSTAIN'
  ) => {
    const voterKey = profile?.username || user?.id || 'citizen_voter';
    const updatedClauses = doc.clauses.map(c => {
      if (c.id === clauseId && c.amendments) {
        const nextAmendments = c.amendments.map(a => {
          if (a.id === amendmentId) {
            const currentRec = a.votingRecord || { aye: 0, no: 0, abstain: 0, voters: {} };
            const prevVote = currentRec.voters?.[voterKey];
            if (prevVote === vote) return a;

            const newRec = {
              aye: currentRec.aye,
              no: currentRec.no,
              abstain: currentRec.abstain,
              voters: { ...currentRec.voters, [voterKey]: vote }
            };

            if (prevVote === 'AYE') newRec.aye = Math.max(0, newRec.aye - 1);
            if (prevVote === 'NO') newRec.no = Math.max(0, newRec.no - 1);
            if (prevVote === 'ABSTAIN') newRec.abstain = Math.max(0, newRec.abstain - 1);

            if (vote === 'AYE') newRec.aye += 1;
            if (vote === 'NO') newRec.no += 1;
            if (vote === 'ABSTAIN') newRec.abstain += 1;

            const netVotes = newRec.aye - newRec.no;

            return {
              ...a,
              votingRecord: newRec,
              votes: Math.max(0, netVotes),
              votedUserIds: Object.keys(newRec.voters)
            };
          }
          return a;
        });
        return { ...c, amendments: nextAmendments };
      }
      return c;
    });

    const updatedDoc = { ...doc, clauses: updatedClauses };
    setDoc(updatedDoc);
    if (onUpdateDocument) onUpdateDocument(updatedDoc);
  };

  // Sponsor Concurrence: Accept Friendly Amendment into Statutory Text
  const handleAcceptFriendlyAmendment = (clauseId: string, amendmentId: string) => {
    const updatedClauses = doc.clauses.map(c => {
      if (c.id === clauseId && c.amendments) {
        const amend = c.amendments.find(a => a.id === amendmentId);
        if (!amend) return c;

        let nextText = c.text;
        let nextSubClauses = c.subClauses ? [...c.subClauses] : [];

        if (amend.actionType === 'MODIFY') {
          if (amend.targetSubClause && amend.targetSubClause !== `Clause ${c.clauseNumber}` && nextSubClauses.length > 0) {
            nextSubClauses = nextSubClauses.map(s => {
              if (amend.targetSubClause?.includes(s.number)) {
                return { ...s, text: amend.proposedText };
              }
              return s;
            });
          } else {
            nextText = amend.proposedText;
          }
        } else if (amend.actionType === 'INSERT') {
          const newNumber = `(${nextSubClauses.length + 1})`;
          nextSubClauses.push({
            number: newNumber,
            text: amend.proposedText
          });
        } else if (amend.actionType === 'STRIKE') {
          if (amend.targetSubClause && amend.targetSubClause !== `Clause ${c.clauseNumber}`) {
            nextSubClauses = nextSubClauses.filter(s => !amend.targetSubClause?.includes(s.number));
          } else {
            nextText = '[STRUCK OUT BY ADOPTED AMENDMENT]';
          }
        }

        // Divide points among all signatories (handle is mandatory)
        const handles = (amend.contributorHandles && amend.contributorHandles.length > 0)
          ? amend.contributorHandles
          : [(amend.authorUsername && amend.authorUsername.startsWith('@')) ? amend.authorUsername : `@${amend.authorUsername || amend.author || 'yuveer'}`];

        const totalPoints = 100;
        const pointsPerUser = Math.max(1, Math.round(totalPoints / handles.length));

        const nextAmendedBy = {
          handles,
          totalPoints,
          pointsPerUser,
          adoptedAt: new Date().toISOString(),
          amendmentId: amend.id,
          docketNumber: amend.targetSubClause || `Clause ${c.clauseNumber}`
        };

        creditPointsToSignatories(handles, pointsPerUser);

        // Asynchronously dispatch ratification to Register 44 Bill Amendments
        sheetSync.amendment({
          Amendment_ID: amend.id,
          Bill_Code: doc.documentCode || (doc as any).documentNumber || doc.title || doc.id,
          Clause_Number: c.clauseNumber,
          Submitter_Handle: amend.authorUsername || amend.author,
          Signatories: handles.join(', '),
          Original_Text: amend.originalText,
          Proposed_Text: amend.proposedText,
          Rationale_Tag: amend.impactCategory || 'GENERAL',
          Rationale_Note: amend.rationale || '',
          Status: 'RATIFIED',
          Vote_Count: (amend.votingRecord?.aye || 0) + (amend.votingRecord?.no || 0),
          Ratified_At: new Date().toISOString(),
          Points_Per_Signatory: pointsPerUser,
          Notes: `Incorporated via Sponsor Friendly Concurrence`
        }).catch(() => {});

        const nextAmendments = c.amendments.map(a => {
          if (a.id === amendmentId) {
            return {
              ...a,
              disposition: 'INCORPORATED_FRIENDLY' as const,
              totalPointsAwarded: totalPoints
            };
          }
          return a;
        });

        return {
          ...c,
          text: nextText,
          subClauses: nextSubClauses,
          amendedBy: nextAmendedBy,
          amendments: nextAmendments
        };
      }
      return c;
    });

    const updatedDoc = { ...doc, clauses: updatedClauses };
    setDoc(updatedDoc);
    if (onUpdateDocument) onUpdateDocument(updatedDoc);
  };

  // Schedule Presets & Builder for Maker
  const applySchedulePreset = (preset: 'PENALTY' | 'FISCAL' | 'TIMELINE' | 'CUSTOM') => {
    setSchedulePresetChoice(preset);
    if (preset === 'PENALTY') {
      setScheduleNumberInput('THE FIRST SCHEDULE');
      setScheduleTitleInput('Statutory Infractions, Compliance Thresholds & Penalty Matrix');
      setScheduleContentInput(`| Offence / Infraction Provision | Default Sanction / Base Fine | Repeat Violation Compound Penalty | Competent Enforcement Authority |
| :--- | :--- | :--- | :--- |
| Section 4(1): Failure to disclose algorithmic transparency metrics | ₹ 2,50,000 | ₹ 10,00,000 + Daily recurring penalty of ₹ 25,000 | Central Regulatory Tribunal |
| Section 7(3): Unauthorized secondary data distribution | ₹ 15,00,000 | ₹ 50,00,000 + Revocation of statutory operational license | Data Protection Authority |
| Section 11(2): Non-compliance with environmental waste disposal | ₹ 5,00,000 | ₹ 20,00,000 + Immediate cease & desist order | State Pollution Control Board |
| Section 16(4): Obstruction of authorized parliamentary audit | ₹ 1,00,000 | ₹ 5,00,000 + Summary contempt proceedings | Parliamentary Oversight Committee |`);
    } else if (preset === 'FISCAL') {
      setScheduleNumberInput('THE SECOND SCHEDULE');
      setScheduleTitleInput('Consolidated Fiscal Outlay & Annual Allocation Matrix');
      setScheduleContentInput(`| Statutory Head / Program Objective | FY 2026-27 Outlay | FY 2027-28 Allocation | Implementing Nodal Agency |
| :--- | :--- | :--- | :--- |
| Digital Governance Infrastructure Fund | ₹ 120,00,00,000 | ₹ 180,00,00,000 | Ministry of Electronics & IT |
| Citizen Grievance Redressal Cells | ₹ 35,00,00,000 | ₹ 45,00,00,000 | Department of Administrative Reforms |
| Public Research & Independent Audit Board | ₹ 25,00,00,000 | ₹ 30,00,00,000 | National Science Foundation |
| Sovereign Cloud Resilience Reserve | ₹ 60,00,00,000 | ₹ 75,00,00,000 | Central Data Infrastructure Bureau |`);
    } else if (preset === 'TIMELINE') {
      setScheduleNumberInput('THE THIRD SCHEDULE');
      setScheduleTitleInput('Statutory Implementation & Phased Rollout Roadmap');
      setScheduleContentInput(`| Phase Milestone | Operational Scope | Statutory Compliance Deadline | Monitoring Dais |
| :--- | :--- | :--- | :--- |
| Phase I: Enactment & Gazetting | Notification in Official Gazette & Rules formulation | Within 30 days of presidential assent | Law Commission |
| Phase II: Platform Integration | Deployment of APIs & Citizen Grievance Portal | Within 90 days of notification | Ministry nodal office |
| Phase III: Mandatory Audits | First nationwide compliance audit cycle | Within 180 days of notification | Comptroller & Auditor General |
| Phase IV: Full Enforcement | Enforcement of statutory penalties across all sectors | Within 365 days of notification | Regulatory Tribunal |`);
    } else {
      setScheduleNumberInput(`SCHEDULE ${(doc?.schedules?.length || 0) + 1}`);
      setScheduleTitleInput('');
      setScheduleContentInput('');
    }
  };

  // Add Statutory Schedule by Maker
  const handleAddSchedule = () => {
    if (!doc || !scheduleNumberInput.trim() || !scheduleTitleInput.trim()) return;

    const makerHandle = profile?.username
      ? (profile.username.startsWith('@') ? profile.username : `@${profile.username}`)
      : (doc.proposedByUsername || '@maker');

    const newSchedule: DocumentSchedule = {
      id: `sched_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      number: scheduleNumberInput.trim(),
      title: scheduleTitleInput.trim(),
      content: scheduleContentInput.trim() || 'No statutory provisions specified in this schedule.',
      proposedBy: makerHandle,
      proposedAt: new Date().toISOString(),
      isMakerSchedule: true
    };

    const updatedSchedules = [...(doc.schedules || []), newSchedule];
    const updatedDoc = { ...doc, schedules: updatedSchedules };
    setDoc(updatedDoc);
    if (onUpdateDocument) onUpdateDocument(updatedDoc);

    setIsAddScheduleModalOpen(false);
    setScheduleNumberInput('');
    setScheduleTitleInput('');
    setScheduleContentInput('');
  };

  // Delete Schedule by Maker
  const handleDeleteSchedule = (scheduleId: string) => {
    if (!doc || !isDocAuthor) return;
    const updatedSchedules = (doc.schedules || []).filter(s => s.id !== scheduleId);
    const updatedDoc = { ...doc, schedules: updatedSchedules };
    setDoc(updatedDoc);
    if (onUpdateDocument) onUpdateDocument(updatedDoc);
  };

  const totalVotes = (doc.votes?.inFavor || 0) + (doc.votes?.against || 0) + (doc.votes?.abstain || 0);
  const inFavorPercent = totalVotes > 0 ? Math.round(((doc.votes?.inFavor || 0) / totalVotes) * 100) : 0;
  const againstPercent = totalVotes > 0 ? Math.round(((doc.votes?.against || 0) / totalVotes) * 100) : 0;
  const abstainPercent = totalVotes > 0 ? Math.round(((doc.votes?.abstain || 0) / totalVotes) * 100) : 0;

  // Filter clauses by selected chapter
  const displayedClauses = selectedChapter === 'ALL'
    ? doc.clauses
    : doc.clauses.filter(c => c.chapterNumber === selectedChapter);

  const isDuplicateTitle = (title?: string, clauseNumber?: string) => {
    if (!title) return true;
    const cleanT = title.trim().toLowerCase().replace(/^[#\s*—:-]+/, '').replace(/[.—–-]+$/, '').trim();
    const cleanNum = (clauseNumber || '').trim().toLowerCase();
    return (
      cleanT === `clause ${cleanNum}` ||
      cleanT === `section ${cleanNum}` ||
      cleanT === cleanNum ||
      cleanT === `${cleanNum}` ||
      cleanT === 'clause' ||
      cleanT === 'section'
    );
  };

  const cleanClauseTitle = (title: string) => {
    return title.replace(/^[#\s*—:;–.-]+/, '').replace(/[;.:—–-]+$/, '').trim();
  };

  return (
    <>
      <AnimatePresence>
        <div
          key="document-reader-backdrop"
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md"
        >
          <motion.div
            key="document-reader-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative w-full max-w-5xl rounded-3xl bg-[#090a12] border border-cyan-500/25 p-3.5 sm:p-7 md:p-9 shadow-[0_30px_100px_rgba(0,0,0,0.95)] z-10 text-left space-y-4 sm:space-y-6 my-auto max-h-[92dvh] overflow-y-auto text-white font-sans"
          >
          {/* Top Bar Controls */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 sm:pb-4 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">
                {doc.documentType.replace(/_/g, ' ')}
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-neutral-400 truncate">
                Ref: <strong className="text-white">{doc.documentCode}</strong>
              </span>
            </div>

            {/* View Mode Toggle: Interactive Clauses vs PIB Authentic Source */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setReaderMode('clauses')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  readerMode === 'clauses'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clauses ({doc.clauses.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setReaderMode('pib_source')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  readerMode === 'pib_source'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ScrollText className="w-3.5 h-3.5 text-amber-400" />
                <span>Read Original</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Direct Download Original Source File Button (If Allowed by Uploader) */}
              {isDownloadAllowed ? (
                <button
                  type="button"
                  onClick={handleDownloadOriginal}
                  className="p-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition cursor-pointer text-xs font-mono flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  title={`Download authentic source file (${doc.originalDocument?.name || 'original file'})`}
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">Download Source</span>
                </button>
              ) : (
                <div
                  className="p-2 px-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-500 text-[10px] font-mono flex items-center gap-1 cursor-not-allowed"
                  title="Author has disabled public download for this source file"
                >
                  <Shield className="w-3 h-3 text-neutral-500" />
                  <span className="hidden md:inline">Download Restricted</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-cyan-300 transition cursor-pointer text-xs font-mono flex items-center gap-1.5"
                title="Share reference link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
              </button>

              {/* Edit Bill Action (Maximum 2 Edits Permitted for Author/Sponsors) */}
              {isDocAuthor && (
                (doc.editCount || 0) >= (doc.maxEdits || 2) ? (
                  <div
                    className="p-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-1.5 cursor-not-allowed"
                    title="Statutory edit limit reached: 2/2 edits used. This bill is now permanently sealed as an Enacted Draft."
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">2/2 Edits Used (Locked)</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onEditDocument) onEditDocument(doc);
                    }}
                    className="p-2 px-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-purple-500/40 text-purple-200 transition cursor-pointer text-xs font-mono flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                    title={`Edit Bill in Drafting Studio (${Math.max(0, (doc.maxEdits || 2) - (doc.editCount || 0))} of 2 edits remaining)`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-300" />
                    <span>Edit Bill ({Math.max(0, (doc.maxEdits || 2) - (doc.editCount || 0))}/2 left)</span>
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer text-xs font-mono flex items-center gap-1.5"
                title="Print or Export Bill"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Official Document Header */}
          <div className="text-center space-y-3 py-3 border-b border-white/10">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-400 font-bold block">
              {doc.committee}
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
              {doc.title}
            </h1>

            {/* Author & Metrics */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Proposed by: <strong className="text-white">@{doc.proposedByUsername || doc.leadSponsors[0] || 'member'}</strong></span>
              </span>
              <span>•</span>
              <span className="text-neutral-300">
                <strong>{doc.clauses.length} Clauses</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          {readerMode === 'clauses' ? (
            <>
              {/* Enacting Formula / Preamble (if present) */}
              {(doc.enactingFormula || doc.preamble || doc.abstract) && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                    PURPOSE &amp; ENACTING STATEMENT
                  </span>
                  <p className="text-neutral-300 italic font-serif leading-relaxed text-sm">
                    {doc.enactingFormula || doc.preamble || doc.abstract}
                  </p>
                </div>
              )}

          {/* Voting & Sentiment Bar */}
          <div className="p-4 rounded-2xl bg-[#0e121e] border border-white/10 space-y-4">
            {/* Header: Sentiment & Status Label */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-400 font-bold uppercase tracking-wider">
                PARLIAMENTARY ROLL-CALL SENTIMENT
              </span>
              {totalVotes === 0 ? (
                <span className="font-mono text-neutral-500 text-xs font-semibold">
                  No votes
                </span>
              ) : (
                <span className="font-mono text-neutral-400">
                  {totalVotes} Total Votes Recorded
                </span>
              )}
            </div>

            {/* Voting Bar: Solid Neutral Grey Fallback if totalVotes === 0 */}
            {totalVotes > 0 ? (
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                <div style={{ width: `${inFavorPercent}%` }} className="bg-emerald-400 transition-all duration-500" title={`In Favor: ${inFavorPercent}%`} />
                <div style={{ width: `${againstPercent}%` }} className="bg-rose-400 transition-all duration-500" title={`Against: ${againstPercent}%`} />
                <div style={{ width: `${abstainPercent}%` }} className="bg-neutral-500 transition-all duration-500" title={`Abstain: ${abstainPercent}%`} />
              </div>
            ) : (
              <div className="h-2 w-full bg-neutral-700/80 rounded-full transition-all" title="No votes" />
            )}

            {/* Voting Numbers & Roll-Call Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pt-0.5">
              <div className="grid grid-cols-3 sm:flex sm:items-center gap-1 sm:gap-4 text-[10px] sm:text-xs font-mono text-center sm:text-left">
                {totalVotes === 0 ? (
                  <span className="text-neutral-500 text-[11px] font-mono">
                    No votes • Chamber awaiting floor quorum
                  </span>
                ) : (
                  <>
                    <span className={(doc.votes?.inFavor || 0) > 0 ? "text-emerald-400 font-bold" : "text-neutral-500"}>
                      Aye: <strong>{doc.votes?.inFavor || 0}</strong> ({inFavorPercent}%)
                    </span>
                    <span className={(doc.votes?.against || 0) > 0 ? "text-rose-400 font-bold" : "text-neutral-500"}>
                      No: <strong>{doc.votes?.against || 0}</strong> ({againstPercent}%)
                    </span>
                    <span className={(doc.votes?.abstain || 0) > 0 ? "text-neutral-400 font-bold" : "text-neutral-500"}>
                      Abs: <strong>{doc.votes?.abstain || 0}</strong> ({abstainPercent}%)
                    </span>
                  </>
                )}
              </div>

              {/* Vote Buttons */}
              <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 font-mono text-xs w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleCastVote('IN_FAVOR')}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    userVote === 'IN_FAVOR'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:text-emerald-300'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Aye</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCastVote('AGAINST')}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    userVote === 'AGAINST'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:text-rose-300'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>No</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCastVote('ABSTAIN')}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    userVote === 'ABSTAIN'
                      ? 'bg-neutral-500/20 border-neutral-400 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <MinusCircle className="w-3.5 h-3.5" />
                  <span>Abstain</span>
                </button>
              </div>
            </div>

            {/* Requirement 2: Vote & Earn Mechanism Prompt/Badge */}
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1.5 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Vote &amp; Earn Points</span>
                </span>
                <span className="text-neutral-300 text-xs font-sans leading-relaxed">
                  Users who cast a vote on a bill earn <strong className="text-cyan-300 font-mono">+25 Passport Points</strong> if the bill passes.
                </span>
              </div>
              {voteEarnMessage && (
                <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0 animate-pulse">
                  {voteEarnMessage}
                </span>
              )}
            </div>

            {/* Requirement 3: Staking ("Bet Your Points" with Passport Points) */}
            <div className="p-3.5 rounded-xl bg-[#090b14] border border-purple-500/30 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <Coins className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                        BET YOUR POINTS • CIVIC PREDICTION
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-[9px] font-bold">
                        PASSPORT STAKING
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans">
                      Stake your Passport Points on this bill's outcome. Multiplier scales dynamically with vote quality.
                    </p>
                  </div>
                </div>

                {/* Available Passport Points */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono">
                  <span className="text-neutral-400">Available:</span>
                  <span className="text-cyan-300 font-bold font-display">{passportPoints} PTS</span>
                </div>
              </div>

              {/* Active Stake Card if User already staked */}
              {activeStake ? (
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 font-bold">
                        ACTIVE STAKE: {activeStake.pointsStaked} PTS
                      </span>
                      <span className="text-neutral-300">
                        Target: <strong className={activeStake.stakedOutcome === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}>
                          {activeStake.stakedOutcome === 'PASS' ? 'AYE (PASSES)' : 'NO (FAILS)'}
                        </strong>
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold">
                      {activeStake.multiplier}x Multiplier
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-300 pt-1.5 border-t border-purple-500/20">
                    <span>
                      Projected Payout: <strong className="text-emerald-400">{activeStake.projectedPayout} PTS</strong> (+{activeStake.projectedPayout - activeStake.pointsStaked} Net Gain)
                    </span>
                    <button
                      type="button"
                      onClick={handleSettleStake}
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <span>Settle Stake</span>
                    </button>
                  </div>

                  {stakeMessage && (
                    <p className="text-[11px] font-mono text-emerald-400 pt-1">{stakeMessage}</p>
                  )}
                </div>
              ) : (
                /* Staking Interactive Form */
                <div className="space-y-3 pt-0.5">
                  {/* Outcome Selection */}
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setStakeOutcome('PASS')}
                      className={`py-2 px-3 rounded-xl border font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        stakeOutcome === 'PASS'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Stake on PASS (Aye)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStakeOutcome('FAIL')}
                      className={`py-2 px-3 rounded-xl border font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        stakeOutcome === 'FAIL'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                          : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Stake on FAIL (Nay)</span>
                    </button>
                  </div>

                  {/* Stake Points Selection */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span>CHOOSE STAKE POINTS:</span>
                      <span>Available: {passportPoints} PTS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[10, 25, 50, 100].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          disabled={passportPoints < amt}
                          onClick={() => setStakeAmount(amt)}
                          className={`flex-1 py-1.5 rounded-xl border font-mono text-xs font-bold transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                            stakeAmount === amt
                              ? 'bg-purple-500/30 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                              : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {amt} PTS
                        </button>
                      ))}
                      <input
                        type="number"
                        min={1}
                        max={passportPoints}
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(Math.max(1, Math.min(passportPoints, Number(e.target.value) || 0)))}
                        className="w-20 px-2 py-1.5 rounded-xl bg-black border border-white/15 text-white font-mono text-xs text-center outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  {/* Optional Reasoning for Multiplier Booster */}
                  <div>
                    <input
                      type="text"
                      value={stakeReasoning}
                      onChange={(e) => setStakeReasoning(e.target.value)}
                      placeholder="Add legislative rationale to unlock up to +0.20x multiplier boost..."
                      className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-neutral-200 text-xs outline-none focus:border-purple-400 font-sans placeholder-neutral-500"
                    />
                  </div>

                  {/* Live Dynamic Multiplier & Projected Payout Preview */}
                  <div className="p-3 rounded-xl bg-black/60 border border-purple-500/20 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">Active Multiplier:</span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/25 border border-purple-500/40 text-purple-300 font-bold text-sm">
                          {calculatedMultiplier.multiplier.toFixed(2)}x
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">Projected Payout:</span>
                        <span className="text-emerald-400 font-bold text-sm font-mono">
                          {Math.round(stakeAmount * calculatedMultiplier.multiplier)} PTS
                        </span>
                        <span className="text-[10px] text-emerald-400/80">
                          (+{Math.round(stakeAmount * calculatedMultiplier.multiplier) - stakeAmount} Net)
                        </span>
                      </div>
                    </div>

                    {/* Multiplier Breakdown Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono">
                      {calculatedMultiplier.breakdown.map((b, idx) => (
                        <span
                          key={idx}
                          className={`px-1.5 py-0.5 rounded border ${
                            b.active
                              ? 'bg-purple-500/15 border-purple-500/30 text-purple-300 font-semibold'
                              : 'bg-white/5 border-white/10 text-neutral-500'
                          }`}
                        >
                          {b.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Confirmation Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] font-mono text-neutral-500 text-center sm:text-left">
                      * Staked points are held in sovereign escrow until bill vote resolves
                    </span>

                    <button
                      type="button"
                      disabled={stakeAmount <= 0 || passportPoints < stakeAmount}
                      onClick={handlePlaceStake}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-mono text-xs font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Confirm Stake ({stakeAmount} Passport Points)</span>
                    </button>
                  </div>

                  {stakeMessage && (
                    <p className="text-xs font-mono text-emerald-400 pt-1">{stakeMessage}</p>
                  )}
                </div>
              )}
            </div>

            {/* Requirement 4: Points Redemption Placeholder Link (Modular Architecture) */}
            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] font-mono">
              <button
                type="button"
                onClick={handleRedeemClick}
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer transition flex items-center gap-1.5"
              >
                <Gift className="w-3.5 h-3.5 text-cyan-400" />
                <span>Passport Points can be redeemed for rewards.</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
              </button>
              <span className="text-neutral-500 hidden sm:inline">Modular Redemption Protocol</span>
            </div>
          </div>

          {/* Quick-Jump Table of Contents (Smooth Scroll, Never hides clauses or divides the document) */}
          {doc.chapters && doc.chapters.length > 1 && (
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-2 overflow-x-auto text-xs font-mono scrollbar-none">
              <span className="text-neutral-400 text-[11px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Chapters ({doc.chapters.length}):</span>
              </span>
              {doc.chapters.map((chap, cIdx) => {
                const isPart = chap.type === 'PART' || (chap.number || '').toUpperCase().startsWith('PART');
                return (
                  <button
                    key={chap.id || `toc-${cIdx}`}
                    type="button"
                    onClick={() => {
                      const targetId = `chapter-${(chap.id || chap.number || '').replace(/\s+/g, '-').toLowerCase()}`;
                      const el = document.getElementById(targetId) || document.getElementById(`chapter-${(chap.number || '').replace(/\s+/g, '-').toLowerCase()}`);
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 ${
                      isPart 
                        ? 'hover:bg-purple-500/15 hover:border-purple-500/40 text-neutral-300 hover:text-purple-300' 
                        : 'hover:bg-amber-500/15 hover:border-amber-500/40 text-neutral-300 hover:text-amber-300'
                    } transition text-[11px] whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer`}
                  >
                    <span className={isPart ? 'text-purple-400 font-bold' : 'text-amber-400 font-bold'}>{chap.number}</span>
                    <span className="text-neutral-400 max-w-[150px] truncate">{chap.title}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── CONTINUOUS LEGISLATIVE PROVISIONS (GROUPED IN NATURAL CHAPTERS) ── */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold">
                STRUCTURED LEGISLATIVE PROVISIONS ({doc.clauses.length})
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                Click Discuss or Propose Amendment on any clause
              </span>
            </div>

            <div className="space-y-4">
              {doc.clauses.map((clause, clIdx) => {
                const isInteracting = activeClauseInteraction?.clauseId === clause.id;
                const interactionType = activeClauseInteraction?.type;
                const ratifiedClauseAmendments = clause.amendments?.filter(
                  a => a.disposition === 'ADOPTED_DIVISION' || a.disposition === 'INCORPORATED_FRIENDLY'
                ) || [];
                const tabledClauseAmendments = clause.amendments?.filter(
                  a => !a.disposition || a.disposition === 'TABLED'
                ) || [];
                const hasTabledAmendments = tabledClauseAmendments.length > 0;
                const hasAmendments = (clause.amendments?.length || 0) > 0;
                const hasDiscussions = (clause.discussions?.length || 0) > 0;
                const isCited = citedClauseNumber === clause.clauseNumber;

                const isNewChapter = Boolean(
                  (clause.chapterId && (clIdx === 0 || doc.clauses[clIdx - 1]?.chapterId !== clause.chapterId)) ||
                  (clause.chapterNumber && (clIdx === 0 || doc.clauses[clIdx - 1]?.chapterNumber !== clause.chapterNumber))
                );
                const currentChapterObj = isNewChapter ? (
                  doc.chapters?.find(ch => ch.id === clause.chapterId) ||
                  doc.chapters?.find(ch => ch.number === clause.chapterNumber && (!clause.chapterTitle || ch.title === clause.chapterTitle)) ||
                  doc.chapters?.find(ch => ch.number === clause.chapterNumber)
                ) : null;
                const isPartUnit = currentChapterObj?.type === 'PART' || 
                                   (clause.chapterNumber || '').toUpperCase().startsWith('PART') ||
                                   Boolean(clause.partNumber);

                return (
                  <React.Fragment key={clause.id || `clause-frag-${clause.clauseNumber || clIdx}`}>
                    {/* Chapter / Part Section Masthead Banner */}
                    {isNewChapter && (
                      <div
                        id={`chapter-${(clause.chapterId || clause.chapterNumber || '').replace(/\s+/g, '-').toLowerCase()}`}
                        className="pt-6 first:pt-2 space-y-2"
                      >
                        <div className={`p-4 sm:p-5 rounded-2xl ${
                          isPartUnit 
                            ? 'bg-gradient-to-r from-purple-500/15 via-white/[0.02] to-transparent border-l-4 border-l-purple-500' 
                            : 'bg-gradient-to-r from-amber-500/15 via-white/[0.02] to-transparent border-l-4 border-l-amber-500'
                        } border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg`}>
                          <div className="flex items-center gap-3">
                            {clause.partNumber && !isPartUnit && (
                              <span className="text-[11px] font-mono text-purple-400 uppercase font-bold tracking-wider">
                                {clause.partNumber} &rsaquo;
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-xl border font-mono text-xs font-bold uppercase tracking-wider shadow-sm ${
                              isPartUnit
                                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            }`}>
                              {clause.chapterNumber}
                            </span>
                            <h3 className="font-serif font-black text-lg sm:text-xl text-white uppercase tracking-wide">
                              {clause.chapterTitle || currentChapterObj?.title || 'General Provisions'}
                            </h3>
                          </div>
                          {currentChapterObj?.isDataChapter && (
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                              <Activity className="w-3.5 h-3.5 text-purple-400" />
                              <span>DATA CHAPTER &amp; FISCAL SCHEDULE</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div
                      id={`clause-${clause.clauseNumber}`}
                      className="py-6 sm:py-8 border-b border-white/[0.08] last:border-b-0 space-y-3.5 relative group"
                    >
                      {/* Prominent Legislative Clause Heading with sleek utility actions */}
                      {(() => {
                        const isTextDuplicate = Boolean(
                          clause.text &&
                          clause.title &&
                          cleanClauseTitle(clause.title).toLowerCase() === cleanClauseTitle(clause.text).toLowerCase()
                        );
                        const hasTextToShow = Boolean(clause.text && clause.text.trim().length > 0 && !isTextDuplicate);
                        const hasSubClauses = Boolean(clause.subClauses && clause.subClauses.length > 0);
                        const hasBodyContent = hasTextToShow || hasSubClauses;

                        return (
                          <>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h4 className="font-serif font-bold text-white text-base sm:text-lg tracking-tight leading-snug">
                                  <span className="font-mono text-cyan-400 font-bold mr-2 text-sm sm:text-base">
                                    {clause.clauseNumber}.
                                  </span>
                                  {clause.title && !isDuplicateTitle(clause.title, clause.clauseNumber) && (
                                    <span>{cleanClauseTitle(clause.title)}{hasTextToShow ? ' \u2014 ' : ''}</span>
                                  )}
                                </h4>
                              </div>

                              {/* Compact utility controls (Debate, Amend, Cite) */}
                              <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isInteracting && interactionType === 'discuss') {
                                      setActiveClauseInteraction(null);
                                    } else {
                                      setActiveClauseInteraction({ clauseId: clause.id!, type: 'discuss' });
                                    }
                                  }}
                                  className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 cursor-pointer text-xs font-mono ${
                                    isInteracting && interactionType === 'discuss'
                                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-cyan-300 hover:bg-white/10'
                                  }`}
                                  title="Debate this clause"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                                  <span className="hidden sm:inline">Debate</span>
                                  {hasDiscussions && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px]">
                                      {clause.discussions!.length}
                                    </span>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isInteracting && interactionType === 'amend') {
                                      setActiveClauseInteraction(null);
                                    } else {
                                      openAmendmentForm(clause);
                                    }
                                  }}
                                  className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 cursor-pointer text-xs font-mono ${
                                    isInteracting && interactionType === 'amend'
                                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                      : 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-300 hover:border-purple-400'
                                  }`}
                                  title="Propose Amendment"
                                >
                                  <Scale className="w-3.5 h-3.5 text-purple-400" />
                                  <span className="hidden sm:inline">Amend</span>
                                  {hasAmendments && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-purple-400/20 text-purple-300 text-[10px]">
                                      {clause.amendments!.length}
                                    </span>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleCiteClause(clause)}
                                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-400 text-red-300 transition flex items-center gap-1.5 cursor-pointer text-xs font-mono font-medium"
                                  title="Copy statutory citation link for whole clause"
                                >
                                  {isCited ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="font-bold text-emerald-300">Cited</span>
                                    </>
                                  ) : (
                                    <>
                                      <Quote className="w-3.5 h-3.5 text-red-400" />
                                      <span>Cite whole clause</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Continuous unified legislative block: entire text + all subclauses with left vertical boundary bracket */}
                            {hasBodyContent && (
                              <div className="relative pl-6 sm:pl-8 text-neutral-200 font-serif text-[14px] sm:text-[15px] leading-relaxed space-y-3 group/clauseblock">
                                {/* Overarching continuous vertical bracket / spine matching reference image */}
                                <div
                                  onClick={() => handleCiteClause(clause)}
                                  title="Click to cite whole clause"
                                  className="absolute left-0 top-0 bottom-0 w-5 cursor-pointer group/rail flex items-center justify-center select-none"
                                >
                                  <div className="absolute left-1.5 top-1 bottom-1 w-[2.5px] rounded-full bg-white/15 group-hover/rail:bg-red-500 group-hover/clauseblock:bg-red-500/70 transition-colors shadow-sm" />
                                  <svg className="absolute left-0 top-0 w-full h-full stroke-white/15 group-hover/rail:stroke-red-500 group-hover/clauseblock:stroke-red-500/70 fill-none transition-colors pointer-events-none" preserveAspectRatio="none" viewBox="0 0 16 100">
                                    <path d="M 14,2 C 6,2 6,14 6,30 L 6,44 C 6,48 1,50 1,50 C 1,50 6,52 6,56 L 6,70 C 6,86 6,98 14,98" strokeWidth="2" strokeLinecap="round" />
                                  </svg>
                                </div>

                                {hasTextToShow && (
                                  <div className="text-neutral-100">
                                    <SolutionRichContent content={clause.text} />
                                  </div>
                                )}

                                {hasSubClauses && (
                                  <div className="space-y-1.5 pt-1">
                                    {clause.subClauses!.map((sub, sIdx) => {
                                      const subKey = `${clause.id || clause.clauseNumber}-${sub.number}`;
                                      const isSubCited = citedSubClauseKey === subKey;
                                      return (
                                        <div
                                          key={`sub-${clause.id || clause.clauseNumber}-${sub.number || sIdx}`}
                                          className="group/sub flex items-start justify-between gap-3 p-2 rounded-xl border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/[0.04] text-[13px] sm:text-[14px] text-neutral-300 font-serif leading-relaxed transition-all"
                                        >
                                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                            <span className="font-mono text-cyan-400 font-bold shrink-0 mt-0.5 select-none text-xs sm:text-sm">
                                              {sub.number}
                                            </span>
                                            <span className="text-neutral-200 leading-relaxed">{sub.text}</span>
                                          </div>

                                          {/* Interactive Cite Subclause Action Button */}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCiteSubClause(clause, sub.number, sub.text);
                                            }}
                                            className="opacity-0 group-hover/sub:opacity-100 transition-all duration-150 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-black font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer select-none"
                                            title={`Cite Subclause ${sub.number}`}
                                          >
                                            {isSubCited ? (
                                              <>
                                                <Check className="w-3 h-3 text-emerald-400" />
                                                <span>Cited</span>
                                              </>
                                            ) : (
                                              <>
                                                <Quote className="w-3 h-3" />
                                                <span>Cite subclause</span>
                                              </>
                                            )}
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        );
                      })()}

                    {/* RIGHT-END SIDE: List of Amendments Made with Full Parliamentary Record */}
                    {(ratifiedClauseAmendments.length > 0 || clause.amendedBy) && (
                      <div className="flex justify-end pt-3 w-full">
                        <div className="w-full sm:max-w-xl p-3.5 rounded-2xl bg-neutral-950/95 border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.08)] space-y-2.5">
                          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                            <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-emerald-400">
                              <History className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="uppercase tracking-wider">Record of Amendments Made ({ratifiedClauseAmendments.length || 1})</span>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              Integrated into Statutory Text
                            </span>
                          </div>

                          <div className="space-y-2">
                            {ratifiedClauseAmendments.length > 0 ? (
                              ratifiedClauseAmendments.map((amend, rIdx) => {
                                const handles = (amend.contributorHandles && amend.contributorHandles.length > 0)
                                  ? amend.contributorHandles
                                  : [(amend.authorUsername && amend.authorUsername.startsWith('@')) ? amend.authorUsername : `@${amend.authorUsername || amend.author || 'contributor'}`];
                                const pointsEach = Math.max(1, Math.round((amend.totalPointsAwarded || 100) / handles.length));

                                return (
                                  <div key={`ratified-${amend.id || rIdx}`} className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-2 text-xs">
                                    <div className="flex items-center justify-between text-[11px]">
                                      <div className="flex items-center gap-1.5 font-mono">
                                        <span className="font-bold text-white">#AMD-{rIdx + 1}</span>
                                        <span className="text-neutral-500">•</span>
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                          amend.actionType === 'MODIFY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                          amend.actionType === 'INSERT' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                        }`}>
                                          {amend.actionType === 'MODIFY' ? 'MODIFIED' : amend.actionType === 'INSERT' ? 'INSERTED' : 'STRUCK OUT'}
                                        </span>
                                        <span className="text-neutral-400 text-[10px]">({amend.targetSubClause || `Clause ${clause.clauseNumber}`})</span>
                                      </div>
                                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                        +{pointsEach} PTS EACH
                                      </span>
                                    </div>

                                    {/* Contributors / Signatories */}
                                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-300">
                                      <span className="text-neutral-500">Mover &amp; Signatories:</span>
                                      <span className="text-purple-300 font-bold">{handles.join(', ')}</span>
                                    </div>

                                    {/* Redline comparison */}
                                    <div className="p-2 rounded-lg bg-neutral-900/90 border border-white/5 space-y-1 font-serif text-[11px]">
                                      {amend.originalText && amend.actionType !== 'INSERT' && (
                                        <div className="text-rose-400/80 line-through text-[10px]">
                                          <span className="font-mono text-[9px] uppercase tracking-wider text-rose-500/60 mr-1">[Prior Text]:</span>
                                          {amend.originalText}
                                        </div>
                                      )}
                                      <div className="text-emerald-300 leading-relaxed">
                                        <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-500/60 mr-1">[Enacted Text]:</span>
                                        {amend.proposedText}
                                      </div>
                                    </div>

                                    {/* Ratification Record / Disposition */}
                                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1 border-t border-white/5">
                                      <div className="flex items-center gap-1.5 text-neutral-300">
                                        <Gavel className="w-3 h-3 text-emerald-400 shrink-0" />
                                        <span>
                                          {amend.disposition === 'ADOPTED_DIVISION'
                                            ? `Adopted via Division (${amend.votingRecord?.aye || 0} Ayes to ${amend.votingRecord?.no || 0} Noes)`
                                            : 'Incorporated via Sponsor Concurrence'}
                                        </span>
                                      </div>
                                      <span className="text-neutral-500 text-[9px]">
                                        {amend.createdAt ? new Date(amend.createdAt).toLocaleDateString() : 'Ratified'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            ) : clause.amendedBy ? (
                              <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1.5 text-xs">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-mono font-bold text-white">#AMD-1</span>
                                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                    +{clause.amendedBy.pointsPerUser} PTS EACH
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-300">
                                  <span className="text-neutral-500">Signatories:</span>
                                  <span className="text-purple-300 font-bold">{clause.amendedBy.handles.join(', ')}</span>
                                </div>
                                <div className="text-[10px] font-mono text-neutral-400 pt-1 border-t border-white/5 flex items-center gap-1.5">
                                  <Gavel className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span>Adopted via Chamber Division</span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Proposed Amendments Badge / Highlights */}
                    {hasTabledAmendments && (
                      <div className="pt-2">
                        <div className="p-3.5 rounded-2xl bg-purple-500/[0.08] border border-purple-500/30 space-y-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-purple-300 uppercase tracking-widest font-bold flex items-center gap-1.5">
                              <Scale className="w-3.5 h-3.5 text-purple-400" />
                              <span>TABLED AMENDMENTS ({tabledClauseAmendments.length})</span>
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              Assembly Rule 54 Docket
                            </span>
                          </div>

                          {tabledClauseAmendments.map((amend, aIdx) => {
                            const isFriendly = amend.proceduralClass === 'FRIENDLY';
                            const isIncorporated = amend.disposition === 'INCORPORATED_FRIENDLY';
                            const isAdoptedDivision = amend.disposition === 'ADOPTED_DIVISION';
                            const isRejected = amend.disposition === 'REJECTED';
                            const isTabled = !amend.disposition || amend.disposition === 'TABLED';

                            const deadlineTime = amend.votingDeadline ? new Date(amend.votingDeadline).getTime() : 0;
                            const msRemaining = Math.max(0, deadlineTime - currentTime);
                            const secondsRemaining = Math.ceil(msRemaining / 1000);
                            const totalDuration = amend.votingDurationSeconds || 60;
                            const percentRemaining = Math.min(100, Math.max(0, (secondsRemaining / totalDuration) * 100));

                            const voterKey = profile?.username || user?.id || 'citizen_voter';
                            const userVoteOnAmend = amend.votingRecord?.voters?.[voterKey];
                            const ayeCount = amend.votingRecord?.aye ?? (amend.votes || 0);
                            const noCount = amend.votingRecord?.no ?? 0;
                            const absCount = amend.votingRecord?.abstain ?? 0;

                            const signatoryHandles = (amend.contributorHandles && amend.contributorHandles.length > 0)
                              ? amend.contributorHandles
                              : [(amend.authorUsername && amend.authorUsername.startsWith('@')) ? amend.authorUsername : `@${amend.authorUsername || amend.author || 'yuveer'}`];
                            const pointsEach = Math.max(1, Math.round(100 / signatoryHandles.length));

                            return (
                              <div
                                key={amend.id || `amend-${clause.id}-${aIdx}`}
                                className={`p-3.5 rounded-xl border space-y-2.5 transition-all ${
                                  isIncorporated || isAdoptedDivision
                                    ? 'bg-emerald-950/20 border-emerald-500/30'
                                    : isRejected
                                    ? 'bg-rose-950/20 border-rose-500/30'
                                    : 'bg-black/60 border-purple-500/20'
                                }`}
                              >
                                {/* Header / Docket Pill & Badges */}
                                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                                      #AMD-{aIdx + 1}
                                    </span>
                                    {isIncorporated ? (
                                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        <span>INCORPORATED (FRIENDLY)</span>
                                      </span>
                                    ) : isAdoptedDivision ? (
                                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        <span>ADOPTED BY DIVISION (ENACTED)</span>
                                      </span>
                                    ) : isRejected ? (
                                      <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 text-rose-400" />
                                        <span>REJECTED BY DIVISION (FAILED)</span>
                                      </span>
                                    ) : isFriendly ? (
                                      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1">
                                        <Handshake className="w-3 h-3" />
                                        <span>FRIENDLY • SPONSOR CONSENT PENDING</span>
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        <span>UNFRIENDLY • DIVISION REQUIRED</span>
                                      </span>
                                    )}

                                    {amend.actionType && (
                                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 uppercase">
                                        {amend.actionType === 'MODIFY' ? '✏️ Strike & Replace' : amend.actionType === 'INSERT' ? '➕ Insertion' : '✂️ Strike Out'}
                                      </span>
                                    )}

                                    {amend.targetSubClause && (
                                      <span className="text-neutral-400">
                                        Target: {amend.targetSubClause}
                                      </span>
                                    )}
                                  </div>

                                  <span className="text-neutral-500">
                                    {new Date(amend.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>

                                {/* Live Countdown Timer Bar for Active Floor Divisions */}
                                {isTabled && deadlineTime > 0 && (
                                  <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1.5">
                                    <div className="flex items-center justify-between text-[11px] font-mono">
                                      <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                                        <Timer className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                                        <span>
                                          DIVISION COUNTDOWN: {secondsRemaining > 0 ? `${secondsRemaining}s REMAINING` : 'CONCLUDING...'}
                                        </span>
                                      </div>
                                      <span className="text-[10px] text-neutral-400">
                                        Simple Majority Required (Aye &gt; No)
                                      </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                                      <div
                                        className={`h-full transition-all duration-300 ${
                                          secondsRemaining <= 10 ? 'bg-rose-500 animate-pulse' : 'bg-purple-500'
                                        }`}
                                        style={{ width: `${percentRemaining}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Signatories & Legislative Points Division Badge */}
                                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                                  <div className="flex flex-wrap items-center gap-1.5 text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-lg">
                                    <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                    <span>
                                      Signatories ({signatoryHandles.length}): <strong className="text-white">{signatoryHandles.join(', ')}</strong>
                                    </span>
                                    <span className="text-neutral-500">•</span>
                                    {isAdoptedDivision ? (
                                      <span className="text-emerald-400 font-bold">
                                        +{pointsEach} pts awarded to each handle!
                                      </span>
                                    ) : (
                                      <span className="text-neutral-300">
                                        +{pointsEach} pts each on division majority
                                      </span>
                                    )}
                                  </div>

                                  {amend.secondedBy && (
                                    <span className="text-neutral-400 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                                      Seconded by: <strong className="text-neutral-200">{amend.secondedBy}</strong>
                                    </span>
                                  )}
                                </div>

                                {/* Comparative Redline Diff */}
                                <div className="p-2.5 rounded-lg bg-black/70 border border-white/5 space-y-1.5">
                                  {amend.actionType === 'MODIFY' && (
                                    <>
                                      {amend.originalText && (
                                        <div className="text-[11px] font-serif text-rose-300/80 line-through bg-rose-500/[0.08] p-1.5 rounded border border-rose-500/20 leading-relaxed">
                                          "{amend.originalText}"
                                        </div>
                                      )}
                                      <div className="text-xs font-serif text-emerald-300 bg-emerald-500/[0.08] p-1.5 rounded border border-emerald-500/20 leading-relaxed font-medium">
                                        "{amend.proposedText}"
                                      </div>
                                    </>
                                  )}

                                  {amend.actionType === 'INSERT' && (
                                    <div className="text-xs font-serif text-emerald-300 bg-emerald-500/[0.08] p-1.5 rounded border border-emerald-500/20 leading-relaxed">
                                      <span className="font-mono text-[10px] text-emerald-400 font-bold mr-1.5">[+ INSERTED PROVISION]</span>
                                      "{amend.proposedText}"
                                    </div>
                                  )}

                                  {amend.actionType === 'STRIKE' && (
                                    <div className="text-xs font-serif text-rose-300 bg-rose-500/[0.08] p-1.5 rounded border border-rose-500/20 leading-relaxed line-through">
                                      <span className="font-mono text-[10px] text-rose-400 font-bold mr-1.5">[- STRUCK OUT]</span>
                                      "{amend.originalText || amend.proposedText}"
                                    </div>
                                  )}

                                  {/* Fallback for legacy simple amendments */}
                                  {!amend.actionType && (
                                    <p className="text-neutral-200 font-serif italic text-xs">
                                      "{amend.proposedText}"
                                    </p>
                                  )}
                                </div>

                                {/* Rationale & Impact Assessment */}
                                <div className="space-y-1 text-[11px]">
                                  {amend.rationale && (
                                    <p className="text-neutral-300 font-sans">
                                      <strong className="font-mono text-[10px] text-neutral-400 uppercase">Statement of Objects:</strong> {amend.rationale}
                                    </p>
                                  )}

                                  {amend.impactAssessment && (
                                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 pt-0.5">
                                      <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20 uppercase font-bold">
                                        Impact ({amend.impactCategory || 'GENERAL'})
                                      </span>
                                      <span className="text-neutral-300 font-sans">{amend.impactAssessment}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Floor Actions & Voting */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                                  {/* Division Roll-Call Buttons */}
                                  <div className="flex items-center gap-1 font-mono text-[10px]">
                                    <span className="text-neutral-500 pr-1">Division:</span>
                                    <button
                                      type="button"
                                      disabled={!isTabled}
                                      onClick={() => handleVoteOnAmendment(clause.id!, amend.id, 'AYE')}
                                      className={`px-2 py-1 rounded transition flex items-center gap-1 cursor-pointer font-bold ${
                                        userVoteOnAmend === 'AYE'
                                          ? 'bg-emerald-500/30 border border-emerald-400 text-emerald-300'
                                          : 'bg-white/5 hover:bg-emerald-500/20 text-neutral-300 hover:text-emerald-300 disabled:opacity-50'
                                      }`}
                                    >
                                      <span>Aye ({ayeCount})</span>
                                    </button>
                                    <button
                                      type="button"
                                      disabled={!isTabled}
                                      onClick={() => handleVoteOnAmendment(clause.id!, amend.id, 'NO')}
                                      className={`px-2 py-1 rounded transition flex items-center gap-1 cursor-pointer font-bold ${
                                        userVoteOnAmend === 'NO'
                                          ? 'bg-rose-500/30 border border-rose-400 text-rose-300'
                                          : 'bg-white/5 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-300 disabled:opacity-50'
                                      }`}
                                    >
                                      <span>No ({noCount})</span>
                                    </button>
                                    <button
                                      type="button"
                                      disabled={!isTabled}
                                      onClick={() => handleVoteOnAmendment(clause.id!, amend.id, 'ABSTAIN')}
                                      className={`px-2 py-1 rounded transition flex items-center gap-1 cursor-pointer font-bold ${
                                        userVoteOnAmend === 'ABSTAIN'
                                          ? 'bg-neutral-500/30 border border-neutral-400 text-white'
                                          : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-50'
                                      }`}
                                    >
                                      <span>Abs ({absCount})</span>
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {/* Conclude Division Early & Auto-Resolve Floor Vote */}
                                    {isTabled && (
                                      <button
                                        type="button"
                                        onClick={() => resolveAmendmentVote(clause.id!, amend.id)}
                                        className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-mono text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                                        title="Conclude division vote now and resolve floor majority"
                                      >
                                        <Zap className="w-3 h-3 text-purple-400" />
                                        <span>⚡ Conclude &amp; Resolve</span>
                                      </button>
                                    )}

                                    {/* Author / Sponsor Concurrence Action */}
                                    {isDocAuthor && !isIncorporated && !isAdoptedDivision && !isRejected && (
                                      <button
                                        type="button"
                                        onClick={() => handleAcceptFriendlyAmendment(clause.id!, amend.id)}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                                        title="Accept as Friendly Amendment and incorporate directly into enacted text"
                                      >
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span>Accept as Friendly (Incorporate into Bill)</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}



                    {/* Interactive Drawer for Clause (Debate / Discussions) */}
                    {isInteracting && interactionType === 'discuss' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 border-t border-cyan-500/20 space-y-3"
                      >
                        <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-bold block">
                          CLAUSE {clause.clauseNumber} LEGISLATIVE DEBATE
                        </span>

                        {/* Existing Comments */}
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {(clause.discussions || []).length === 0 ? (
                            <p className="text-[11px] text-neutral-500 italic">No debate remarks yet on this clause. Be the first to table an argument.</p>
                          ) : (
                            clause.discussions!.map((d, dIdx) => (
                              <div key={d.id || `disc-${clause.id}-${dIdx}`} className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1 text-xs">
                                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                                  <strong className="text-white">@{d.authorUsername || d.author}</strong>
                                  <span>{new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-neutral-300 font-sans leading-relaxed">{d.text}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Comment Input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            placeholder="Add your parliamentary argument or interpretation on this clause..."
                            className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs outline-none focus:border-cyan-400 font-sans"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(clause.id!);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(clause.id!)}
                            className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-bold font-mono text-xs hover:bg-cyan-300 transition cursor-pointer flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Post</span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Interactive Drawer for Clause (Detailed Parliamentary Table Amendment Form) */}
                    {isInteracting && interactionType === 'amend' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-4 border-t border-purple-500/30 space-y-4"
                      >
                        {/* Drawer Header */}
                        <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                          <div>
                            <span className="font-mono text-xs text-purple-300 uppercase tracking-widest font-black flex items-center gap-2">
                              <Gavel className="w-4 h-4 text-purple-400" />
                              <span>TABLE AMENDMENT TO CLAUSE {clause.clauseNumber}</span>
                            </span>
                            <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                              Assembly Rule of Procedure 54 • Requires Germaneness and Floor Admissibility
                            </p>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold uppercase">
                            Procedural Form
                          </span>
                        </div>

                        {/* Error Banner */}
                        {formError && (
                          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                            <span>{formError}</span>
                          </div>
                        )}

                        {/* STEP 1: Procedural Classification (Friendly vs. Unfriendly) */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-bold">
                            1. Procedural Classification (Rule 54A / 54B)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setProceduralClass('FRIENDLY')}
                              className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                                proceduralClass === 'FRIENDLY'
                                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                  : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                              }`}
                            >
                              <Handshake className={`w-4 h-4 shrink-0 mt-0.5 ${proceduralClass === 'FRIENDLY' ? 'text-amber-400' : 'text-neutral-500'}`} />
                              <div>
                                <span className="font-mono text-xs font-bold block text-amber-300">
                                  Friendly Amendment (Rule 54A)
                                </span>
                                <span className="text-[10px] text-neutral-400 font-sans leading-tight block mt-0.5">
                                  Subject to Lead Drafter concurrence. If accepted, directly incorporated into statutory text without division vote.
                                </span>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setProceduralClass('UNFRIENDLY')}
                              className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                                proceduralClass === 'UNFRIENDLY'
                                  ? 'bg-purple-500/15 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                  : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                              }`}
                            >
                              <Zap className={`w-4 h-4 shrink-0 mt-0.5 ${proceduralClass === 'UNFRIENDLY' ? 'text-purple-400' : 'text-neutral-500'}`} />
                              <div>
                                <span className="font-mono text-xs font-bold block text-purple-300">
                                  Unfriendly Amendment (Rule 54B)
                                </span>
                                <span className="text-[10px] text-neutral-400 font-sans leading-tight block mt-0.5">
                                  Tabled from the floor. Requires a recognized Seconder delegation and a plenary division vote (simple majority).
                                </span>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* STEP 2: Amendment Motion Action */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-bold">
                            2. Motion Action (Standard Parliamentary Forms)
                          </label>
                          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                            <button
                              type="button"
                              onClick={() => setActionType('MODIFY')}
                              className={`py-2 px-3 rounded-xl border font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                actionType === 'MODIFY'
                                  ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                  : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                              }`}
                            >
                              <FileEdit className="w-3.5 h-3.5" />
                              <span>Strike &amp; Replace</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActionType('INSERT')}
                              className={`py-2 px-3 rounded-xl border font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                actionType === 'INSERT'
                                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                  : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                              }`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Insert / Add</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActionType('STRIKE')}
                              className={`py-2 px-3 rounded-xl border font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                actionType === 'STRIKE'
                                  ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                                  : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                              }`}
                            >
                              <Scissors className="w-3.5 h-3.5" />
                              <span>Strike Out</span>
                            </button>
                          </div>
                        </div>

                        {/* STEP 3: Target Provision Scope */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-bold">
                            3. Target Provision in Clause {clause.clauseNumber}
                          </label>
                          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                            <button
                              type="button"
                              onClick={() => handleTargetSubClauseChange(clause, 'ENTIRE_CLAUSE')}
                              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                                targetSubClause === 'ENTIRE_CLAUSE'
                                  ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold'
                                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                              }`}
                            >
                              Entire Clause {clause.clauseNumber}
                            </button>

                            {clause.subClauses?.map((sub) => (
                              <button
                                key={`target-${sub.number}`}
                                type="button"
                                onClick={() => handleTargetSubClauseChange(clause, sub.number)}
                                className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                                  targetSubClause === sub.number
                                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold'
                                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                                }`}
                              >
                                Sub-clause {sub.number}
                              </button>
                            ))}
                          </div>

                          {/* Current Target Statutory Language Display */}
                          <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-bold block">
                              CURRENT STATUTORY LANGUAGE (TARGET)
                            </span>
                            <p className="text-xs font-serif text-neutral-300 italic leading-relaxed">
                              "{selectedSubClauseText || clause.text}"
                            </p>
                          </div>
                        </div>

                        {/* STEP 4: Signatory Handles & Legislative Points Division */}
                        <div className="space-y-3 p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono text-purple-300 uppercase tracking-wider block font-bold flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-purple-400" />
                              <span>4. Signatories &amp; Legislative Points Pool (100 PTS POOL)</span>
                            </label>
                            <span className="text-[10px] font-mono text-neutral-400">
                              Handle starting with @ is required
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1 font-bold">
                                4A. Primary Drafter / Mover Handle *
                              </label>
                              <input
                                type="text"
                                value={moverHandle}
                                onChange={(e) => setMoverHandle(e.target.value)}
                                placeholder="@yuveer"
                                className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono text-xs outline-none focus:border-purple-400"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1 font-bold">
                                4B. Additional Co-Signatories Handles (Optional)
                              </label>
                              <input
                                type="text"
                                value={additionalSignatories}
                                onChange={(e) => setAdditionalSignatories(e.target.value)}
                                placeholder="@delegate2, @delegate3"
                                className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono text-xs outline-none focus:border-purple-400"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1 font-bold">
                                4C. Primary Mover Delegation Representation
                              </label>
                              <input
                                type="text"
                                value={moverDelegation}
                                onChange={(e) => setMoverDelegation(e.target.value)}
                                placeholder="e.g. Delegate of India / MP for New Delhi"
                                className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono text-xs outline-none focus:border-purple-400"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1 font-bold">
                                4D. Seconded By Delegation {proceduralClass === 'UNFRIENDLY' ? '(Mandatory under Rule 54)' : '(Optional)'}
                              </label>
                              <input
                                type="text"
                                value={secondedBy}
                                onChange={(e) => setSecondedBy(e.target.value)}
                                placeholder="e.g. Delegate of Germany"
                                className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono text-xs outline-none focus:border-purple-400"
                              />
                              {proceduralClass === 'UNFRIENDLY' && !secondedBy.trim() && (
                                <span className="text-[10px] text-amber-400/90 font-mono block mt-1">
                                  ⚠ An unfriendly floor motion requires a recognized Seconder under Rule 54.
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Points Division Pool Preview */}
                          {moverHandle.trim() && (
                            <div className="p-2.5 rounded-xl bg-black/60 border border-purple-500/20 text-[11px] font-mono text-purple-200 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>
                                  Signatories ({parseHandles(moverHandle, additionalSignatories).length}):{' '}
                                  <strong className="text-white">{parseHandles(moverHandle, additionalSignatories).join(', ')}</strong>
                                </span>
                              </div>
                              <span className="text-emerald-400 font-bold shrink-0">
                                +{Math.max(1, Math.round(100 / Math.max(1, parseHandles(moverHandle, additionalSignatories).length)))} PTS EACH UPON PASSAGE
                              </span>
                            </div>
                          )}
                        </div>

                        {/* STEP 4.5: Division Voting Countdown Duration */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-bold flex items-center gap-1.5">
                            <Timer className="w-3.5 h-3.5 text-purple-400" />
                            <span>Division Roll-Call Countdown Duration</span>
                          </label>
                          <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                            {[
                              { label: '30s Blitz', val: 30 },
                              { label: '60s Standard', val: 60 },
                              { label: '90s Extended', val: 90 },
                              { label: '120s Chamber', val: 120 }
                            ].map(t => (
                              <button
                                key={t.val}
                                type="button"
                                onClick={() => setCountdownDuration(t.val)}
                                className={`py-2 px-2 rounded-xl border font-bold transition text-center cursor-pointer ${
                                  countdownDuration === t.val
                                    ? 'bg-purple-500/25 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                                    : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                                }`}
                              >
                                {t.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* STEP 5: Proposed Language & Comparative Redline Preview */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-bold">
                            5. Proposed Statutory Text
                          </label>

                          {actionType === 'MODIFY' && (
                            <div>
                              <textarea
                                value={amendmentText}
                                onChange={(e) => setAmendmentText(e.target.value)}
                                placeholder="Enter the exact replacement wording for the selected target clause..."
                                rows={3}
                                className="w-full p-3 rounded-xl bg-black border border-white/15 text-white font-serif text-xs outline-none focus:border-purple-400 leading-relaxed"
                              />
                            </div>
                          )}

                          {actionType === 'INSERT' && (
                            <div>
                              <textarea
                                value={amendmentText}
                                onChange={(e) => setAmendmentText(e.target.value)}
                                placeholder="Enter the new sub-clause, condition, or proviso text to be inserted..."
                                rows={3}
                                className="w-full p-3 rounded-xl bg-black border border-white/15 text-white font-serif text-xs outline-none focus:border-emerald-400 leading-relaxed"
                              />
                            </div>
                          )}

                          {actionType === 'STRIKE' && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono space-y-1">
                              <span className="font-bold flex items-center gap-1.5">
                                <Scissors className="w-3.5 h-3.5 text-rose-400" />
                                <span>Motion to Strike Out Selected Target</span>
                              </span>
                              <p className="text-[11px] font-sans text-neutral-300">
                                This motion proposes to excise and completely delete the targeted provision ({targetSubClause === 'ENTIRE_CLAUSE' ? `Clause ${clause.clauseNumber}` : `Sub-clause ${targetSubClause}`}) from the enacted instrument.
                              </p>
                            </div>
                          )}

                          {/* Live Comparative Redline Diff Box */}
                          {(amendmentText.trim() || actionType === 'STRIKE') && (
                            <div className="p-3 rounded-xl bg-black/80 border border-purple-500/30 space-y-2">
                              <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest font-bold block">
                                LIVE COMPARATIVE REDLINE PREVIEW
                              </span>

                              {actionType === 'MODIFY' && (
                                <div className="space-y-1.5 text-xs font-serif leading-relaxed">
                                  <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 line-through">
                                    "{selectedSubClauseText || clause.text}"
                                  </div>
                                  <div className="p-2 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
                                    "{amendmentText}"
                                  </div>
                                </div>
                              )}

                              {actionType === 'INSERT' && (
                                <div className="p-2 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-serif text-xs leading-relaxed">
                                  <span className="font-mono text-[10px] text-emerald-400 font-bold mr-1.5">[+ INSERTION]</span>
                                  "{amendmentText}"
                                </div>
                              )}

                              {actionType === 'STRIKE' && (
                                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-serif text-xs leading-relaxed line-through">
                                  <span className="font-mono text-[10px] text-rose-400 font-bold mr-1.5">[- STRUCK OUT]</span>
                                  "{selectedSubClauseText || clause.text}"
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* STEP 6: Legislative Justification & Impact Matrix */}
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1 font-bold">
                              6A. Statement of Objects &amp; Legislative Justification
                            </label>
                            <input
                              type="text"
                              value={amendmentRationale}
                              onChange={(e) => setAmendmentRationale(e.target.value)}
                              placeholder="Why must this clause be modified? (e.g. clarify penalties, align with constitutional due process, prevent arbitrary closure)"
                              className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs outline-none focus:border-purple-400 font-sans"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1 font-bold">
                                6B. Impact Category
                              </label>
                              <select
                                value={impactCategory}
                                onChange={(e) => setImpactCategory(e.target.value as any)}
                                className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono text-xs outline-none focus:border-purple-400"
                              >
                                <option value="GENERAL">General Statutory Clarity</option>
                                <option value="COMPLIANCE">Regulatory Compliance</option>
                                <option value="PENALTY">Penalties &amp; Enforcement</option>
                                <option value="TIMELINE">Timeline &amp; Grace Period</option>
                                <option value="FISCAL">Fiscal / Budgetary Impact</option>
                                <option value="HUMAN_RIGHTS">Human Rights &amp; Due Process</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1 font-bold">
                                6C. Practical / Enforcement Consequence
                              </label>
                              <input
                                type="text"
                                value={impactAssessment}
                                onChange={(e) => setImpactAssessment(e.target.value)}
                                placeholder="e.g. Extends grace period by 60 days to prevent immediate operational shutdowns"
                                className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs outline-none focus:border-purple-400 font-sans"
                              />
                            </div>
                          </div>
                        </div>

                        {/* FORM FOOTER ACTIONS */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-xs">
                          <span className="text-[10px] text-neutral-500">
                            Subject to Rule 54 Admissibility
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveClauseInteraction(null);
                                setFormError(null);
                              }}
                              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white transition cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleProposeAmendment(clause)}
                              disabled={actionType !== 'STRIKE' && !amendmentText.trim()}
                              className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold transition cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                            >
                              <Scale className="w-3.5 h-3.5" />
                              <span>Table Amendment under Rule 54</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
            </div>
          </div>

          {/* 📜 STATUTORY SCHEDULES & ANNEXURES SECTION (Directly Under Bill Clauses) */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/30">
              <div className="flex items-center gap-2.5">
                <TableIcon className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-amber-300 font-bold">
                    STATUTORY SCHEDULES &amp; ANNEXURES ({(doc.schedules || []).length})
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-serif">
                    Enacted statutory schedules, penalty matrices, and fiscal outlay tables attached to this Act
                  </p>
                </div>
              </div>

              {isDocAuthor && (
                <button
                  type="button"
                  onClick={() => {
                    applySchedulePreset('CUSTOM');
                    setIsAddScheduleModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.15)] shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Propose Statutory Schedule</span>
                </button>
              )}
            </div>

            {/* Schedules List or Empty State */}
            {doc.schedules && doc.schedules.length > 0 ? (
              <div className="space-y-4">
                {doc.schedules.map((schedule, sIdx) => (
                  <div
                    key={schedule.id || `sched-${sIdx}`}
                    className="py-6 sm:py-8 border-b border-amber-500/20 last:border-b-0 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-amber-500/15 pb-2.5">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold block">
                          {schedule.number || `THE ${sIdx + 1} SCHEDULE`}
                        </span>
                        <h4 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide mt-1">
                          {schedule.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {schedule.proposedBy && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                            Proposed by {schedule.proposedBy}
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                          Statutory Schedule
                        </span>
                        {isDocAuthor && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                            title="Remove Schedule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Complete Schedule Text grouped into one unified block */}
                    <div className="rounded-r-xl border-l-2 border-amber-400/40 bg-gradient-to-r from-amber-950/[0.12] via-amber-950/[0.04] to-transparent pl-4 sm:pl-5 pr-3 py-3 my-2 text-neutral-200 font-serif text-[13px] sm:text-[14px] leading-relaxed overflow-x-auto">
                      <SolutionRichContent content={schedule.content} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                <TableIcon className="w-8 h-8 text-neutral-500 mx-auto opacity-50" />
                <p className="text-xs font-mono text-neutral-400">
                  No statutory schedules currently attached to this bill.
                </p>
                {isDocAuthor ? (
                  <p className="text-[11px] text-amber-300/80">
                    As the bill sponsor, you can propose statutory schedules (penalty matrices, fiscal outlays, implementation timelines) under the bill.
                  </p>
                ) : (
                  <p className="text-[11px] text-neutral-500">
                    Schedules and statutory annexures proposed by the bill sponsor will appear directly here.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ⚖️ AMENDMENTS PROPOSED: PARLIAMENTARY FLOOR DOCKET (Directly Under Bill) */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-500/[0.08] border border-purple-500/30">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-purple-300 font-bold">
                      AMENDMENTS PROPOSED UNDER THE BILL ({openProposedAmendments.length})
                    </h3>
                    {openProposedAmendments.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 font-serif">
                    Parliamentary Floor Docket under Assembly Rule 54 • Each clause appears as one unified block with all its subclauses and proposed amendments in sequence.
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 font-bold w-fit">
                Division Floor Roll-Call
              </span>
            </div>

            {openProposedAmendments.length > 0 ? (
              <div className="space-y-6">
                {amendmentsByClause.map(({ clause, amendments }: { clause: DocumentClause; amendments: ClauseAmendment[] }) => {
                  return (
                    <div
                      key={`floor-clause-${clause.id || clause.clauseNumber}`}
                      className="py-6 sm:py-8 border-b border-purple-500/20 last:border-b-0 space-y-4"
                    >
                      {/* Main Clause Heading */}
                      {(() => {
                        const isTextDuplicate = Boolean(
                          clause.text &&
                          clause.title &&
                          cleanClauseTitle(clause.title).toLowerCase() === cleanClauseTitle(clause.text).toLowerCase()
                        );
                        const hasTextToShow = Boolean(clause.text && clause.text.trim().length > 0 && !isTextDuplicate);
                        const hasSubClauses = Boolean(clause.subClauses && clause.subClauses.length > 0);
                        const hasBodyContent = hasTextToShow || hasSubClauses;

                        return (
                          <>
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/[0.08] pb-2.5">
                              <h4 className="font-serif font-bold text-white text-base sm:text-lg tracking-tight leading-snug">
                                <span className="font-mono text-cyan-400 font-bold mr-2 text-sm sm:text-base">
                                  Clause {clause.clauseNumber}.
                                </span>
                                {clause.title && !isDuplicateTitle(clause.title, clause.clauseNumber) && (
                                  <span>{cleanClauseTitle(clause.title)}{hasTextToShow ? ' \u2014 ' : ''}</span>
                                )}
                              </h4>
                              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold w-fit">
                                {amendments.length} {amendments.length === 1 ? 'Amendment Tabled' : 'Amendments Tabled'}
                              </span>
                            </div>

                            {/* Continuous unified legislative block: entire text + all subclauses */}
                            {hasBodyContent && (
                              <div className="rounded-r-xl border-l-2 border-purple-400/40 bg-gradient-to-r from-purple-950/[0.12] via-purple-950/[0.04] to-transparent pl-4 sm:pl-5 pr-3 py-3 my-2 text-neutral-200 font-serif text-[14px] sm:text-[15px] leading-relaxed space-y-3">
                                {hasTextToShow && (
                                  <div className="text-neutral-100">
                                    <SolutionRichContent content={clause.text} />
                                  </div>
                                )}

                                {hasSubClauses && (
                                  <div className="space-y-2.5 pt-1">
                                    {clause.subClauses!.map((sub: ClauseSubItem, sIdx: number) => (
                                      <div
                                        key={`floor-sub-${clause.id || clause.clauseNumber}-${sub.number || sIdx}`}
                                        className="flex items-start gap-2.5 text-[13px] sm:text-[14px] text-neutral-300 leading-relaxed"
                                      >
                                        <span className="font-mono text-purple-300 font-semibold text-xs sm:text-[13px] shrink-0 mt-0.5 select-none bg-purple-950/60 border border-purple-500/25 px-1.5 py-0.5 rounded text-center min-w-[24px]">
                                          {sub.number}
                                        </span>
                                        <div className="text-neutral-200 flex-1">
                                          <SolutionRichContent content={sub.text} />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        );
                      })()}

                      {/* Amendments Proposed on this Clause */}
                      <div className="space-y-3 pt-2">
                        {amendments.map((amend: ClauseAmendment, aIdx: number) => {
                          const deadlineTime = amend.votingDeadline ? new Date(amend.votingDeadline).getTime() : 0;
                          const msRemaining = Math.max(0, deadlineTime - currentTime);
                          const secondsRemaining = Math.ceil(msRemaining / 1000);
                          const totalDuration = amend.votingDurationSeconds || 60;
                          const percentRemaining = Math.min(100, Math.max(0, (secondsRemaining / totalDuration) * 100));

                          const voterKey = profile?.username || user?.id || 'citizen_voter';
                          const userVoteOnAmend = amend.votingRecord?.voters?.[voterKey];
                          const ayeCount = amend.votingRecord?.aye ?? (amend.votes || 0);
                          const noCount = amend.votingRecord?.no ?? 0;
                          const absCount = amend.votingRecord?.abstain ?? 0;

                          const signatoryHandles = (amend.contributorHandles && amend.contributorHandles.length > 0)
                            ? amend.contributorHandles
                            : [(amend.authorUsername && amend.authorUsername.startsWith('@')) ? amend.authorUsername : `@${amend.authorUsername || amend.author || 'yuveer'}`];
                          const pointsEach = Math.max(1, Math.round(100 / signatoryHandles.length));

                          return (
                            <div
                              key={`floor-docket-${amend.id || aIdx}`}
                              className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/25 space-y-3"
                            >
                              {/* Amendment Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5 text-xs font-mono">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                                    #AMD-{aIdx + 1}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    amend.actionType === 'MODIFY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                    amend.actionType === 'INSERT' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                    'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  }`}>
                                    {amend.actionType === 'MODIFY' ? 'MODIFY PROVISION' : amend.actionType === 'INSERT' ? 'INSERT NEW PROVISION' : 'STRIKE OUT'}
                                  </span>
                                  <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                    {amend.proceduralClass === 'FRIENDLY' ? 'Friendly Motion' : 'Floor Division'}
                                  </span>
                                  {amend.targetSubClause && (
                                    <span className="text-neutral-400 text-[11px]">
                                      Target: {amend.targetSubClause}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                                  <span>Mover:</span>
                                  <strong className="text-white">
                                    {amend.authorUsername ? (amend.authorUsername.startsWith('@') ? amend.authorUsername : `@${amend.authorUsername}`) : amend.author}
                                  </strong>
                                  {amend.authorDelegation && (
                                    <span className="text-neutral-500">({amend.authorDelegation})</span>
                                  )}
                                </div>
                              </div>

                              {/* Live Division Countdown Bar */}
                              {deadlineTime > 0 && (
                                <div className="p-2.5 rounded-lg bg-black/60 border border-purple-500/20 space-y-1.5">
                                  <div className="flex items-center justify-between text-xs font-mono">
                                    <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                                      <Timer className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                                      <span>
                                        DIVISION COUNTDOWN: {secondsRemaining > 0 ? `${secondsRemaining}s REMAINING` : 'CONCLUDING DIVISION...'}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-neutral-400">
                                      Simple Majority Required (Aye &gt; No)
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
                                    <div
                                      className={`h-full transition-all duration-300 ${
                                        secondsRemaining <= 10 ? 'bg-rose-500 animate-pulse' : 'bg-purple-500'
                                      }`}
                                      style={{ width: `${percentRemaining}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Signatories & Passport Points Share */}
                              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                                <div className="flex flex-wrap items-center gap-1.5 text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                                  <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                  <span>
                                    Co-Signatories ({signatoryHandles.length}): <strong className="text-white">{signatoryHandles.join(', ')}</strong>
                                  </span>
                                  <span className="text-neutral-500">•</span>
                                  <span className="text-emerald-300 font-bold">
                                    +{pointsEach} pts each on division passage
                                  </span>
                                </div>
                                {amend.secondedBy && (
                                  <span className="text-neutral-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                                    Seconded by: <strong className="text-neutral-200">{amend.secondedBy}</strong>
                                  </span>
                                )}
                              </div>

                              {/* Comparative Redline Diff */}
                              <div className="p-3 rounded-lg bg-black/70 border border-white/5 space-y-2 font-serif">
                                {amend.actionType === 'MODIFY' && (
                                  <>
                                    {amend.originalText && (
                                      <div className="text-xs text-rose-300/80 line-through bg-rose-500/[0.08] p-2 rounded border border-rose-500/20 leading-relaxed">
                                        <span className="font-mono text-[9px] uppercase tracking-wider text-rose-500/80 mr-1.5 select-none">[Prior Text]:</span>
                                        &ldquo;{amend.originalText}&rdquo;
                                      </div>
                                    )}
                                    <div className="text-xs sm:text-sm text-emerald-300 bg-emerald-500/[0.08] p-2 rounded border border-emerald-500/20 leading-relaxed font-medium">
                                      <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 mr-1.5 select-none">[Proposed Replacement]:</span>
                                      &ldquo;{amend.proposedText}&rdquo;
                                    </div>
                                  </>
                                )}

                                {amend.actionType === 'INSERT' && (
                                  <div className="text-xs sm:text-sm text-emerald-300 bg-emerald-500/[0.08] p-2 rounded border border-emerald-500/20 leading-relaxed">
                                    <span className="font-mono text-[10px] text-emerald-400 font-bold mr-1.5 select-none">[+ INSERTED PROVISION]</span>
                                    &ldquo;{amend.proposedText}&rdquo;
                                  </div>
                                )}

                                {amend.actionType === 'STRIKE' && (
                                  <div className="text-xs sm:text-sm text-rose-300 bg-rose-500/[0.08] p-2 rounded border border-rose-500/20 leading-relaxed line-through">
                                    <span className="font-mono text-[10px] text-rose-400 font-bold mr-1.5 select-none">[- MOTION TO STRIKE OUT]</span>
                                    &ldquo;{amend.originalText || amend.proposedText}&rdquo;
                                  </div>
                                )}
                              </div>

                              {/* Rationale & Impact Assessment */}
                              <div className="space-y-1 text-xs">
                                {amend.rationale && (
                                  <p className="text-neutral-300 font-sans">
                                    <strong className="font-mono text-[10px] text-neutral-400 uppercase">Statement of Objects:</strong> {amend.rationale}
                                  </p>
                                )}
                                {amend.impactAssessment && (
                                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 pt-0.5">
                                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 uppercase font-bold">
                                      Impact ({amend.impactCategory || 'GENERAL'})
                                    </span>
                                    <span className="text-neutral-300 font-sans">{amend.impactAssessment}</span>
                                  </div>
                                )}
                              </div>

                              {/* Division Roll-Call Voting & Resolution Actions */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                                <div className="flex items-center gap-1.5 font-mono text-xs">
                                  <span className="text-neutral-500 pr-1">Chamber Roll-Call:</span>
                                  <button
                                    type="button"
                                    onClick={() => handleVoteOnAmendment(clause.id!, amend.id, 'AYE')}
                                    className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer font-bold ${
                                      userVoteOnAmend === 'AYE'
                                        ? 'bg-emerald-500/30 border border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                        : 'bg-white/5 hover:bg-emerald-500/20 border border-white/10 text-neutral-300 hover:text-emerald-300'
                                    }`}
                                  >
                                    <span>Aye ({ayeCount})</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleVoteOnAmendment(clause.id!, amend.id, 'NO')}
                                    className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer font-bold ${
                                      userVoteOnAmend === 'NO'
                                        ? 'bg-rose-500/30 border border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                                        : 'bg-white/5 hover:bg-rose-500/20 border border-white/10 text-neutral-300 hover:text-rose-300'
                                    }`}
                                  >
                                    <span>No ({noCount})</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleVoteOnAmendment(clause.id!, amend.id, 'ABSTAIN')}
                                    className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer font-bold ${
                                      userVoteOnAmend === 'ABSTAIN'
                                        ? 'bg-neutral-500/30 border border-neutral-400 text-white'
                                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white'
                                    }`}
                                  >
                                    <span>Abs ({absCount})</span>
                                  </button>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => resolveAmendmentVote(clause.id!, amend.id)}
                                    className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                    title="Conclude division vote now and resolve floor majority"
                                  >
                                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                                    <span>⚡ Conclude &amp; Resolve</span>
                                  </button>

                                  {isDocAuthor && (
                                    <button
                                      type="button"
                                      onClick={() => handleAcceptFriendlyAmendment(clause.id!, amend.id)}
                                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                      title="Accept as Friendly Amendment and incorporate directly into enacted text"
                                    >
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>✓ Concur &amp; Incorporate into Bill</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                <Scale className="w-8 h-8 text-neutral-500 mx-auto opacity-50" />
                <p className="text-xs font-mono text-neutral-400">
                  No floor amendments currently tabled on this bill.
                </p>
                <p className="text-[11px] text-neutral-500">
                  Delegates can propose amendments directly on any individual clause above. When passed, amendments format and integrate directly into the bill.
                </p>
              </div>
            )}
          </div>

          {/* Ratifying Signatories Section */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                CO-SPONSORS &amp; RATIFIERS ({(doc.signatories?.length || 0) + (isSigned ? 1 : 0)})
              </span>
              <button
                type="button"
                onClick={() => setIsSigned(!isSigned)}
                className={`px-3 py-1 rounded-full border text-xs font-mono font-bold transition cursor-pointer ${
                  isSigned
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                    : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
                }`}
              >
                {isSigned ? '✓ Co-Sponsorship Attached' : '+ Add Co-Sponsorship'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {doc.signatories?.map((sig, idx) => (
                <span
                  key={`sig-${sig || idx}`}
                  className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300"
                >
                  {sig}
                </span>
              ))}
              {isSigned && (
                <span className="px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-400 text-xs font-mono text-purple-300 font-bold">
                  @{profile?.username || 'Your Delegation'}
                </span>
              )}
            </div>
          </div>
            </>
          ) : (
            /* 🏛️ PIB / SOVEREIGN LEGISLATIVE ORIGINAL SOURCE DISPATCH */
            <div className="space-y-6 pt-2">
              {/* PIB Gazette Masthead Header */}
              <div className="p-6 rounded-2xl bg-[#090d16] border border-amber-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 space-y-4">
                  {/* Sovereign Emblem & Header Banner */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4 text-center sm:text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-lg">
                        <Scale className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold">
                            ORIGINAL SUBMISSION / SOURCE DOCUMENT
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-mono text-emerald-300 font-semibold">
                            AUTHENTIC SOURCE TEXT
                          </span>
                        </div>
                        <h2 className="text-sm sm:text-base font-serif font-bold text-white tracking-wide">
                          Student Solutions &amp; Policy Repository • Author&apos;s Original Text
                        </h2>
                      </div>
                    </div>

                    {/* Submission Reference */}
                    <div className="text-center sm:text-right font-mono text-[11px] text-neutral-400 space-y-0.5">
                      <div>
                        <span className="text-neutral-500">Document Code: </span>
                        <strong className="text-amber-300 font-bold">{doc.documentCode || doc.id}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500">Author: </span>
                        <span className="text-neutral-300">@{doc.proposedByUsername || doc.leadSponsors[0] || 'author'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Dated: </span>
                        <span className="text-neutral-300">{new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* PIB Toolbar: Font Switcher, File Info, Download & Copy Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                    {/* Font Family Switcher */}
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="text-neutral-400 mr-1">Typography:</span>
                      {(['serif', 'sans', 'mono'] as const).map(font => (
                        <button
                          key={font}
                          type="button"
                          onClick={() => setPibFont(font)}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition cursor-pointer uppercase ${
                            pibFont === font
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-sm'
                              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {font}
                        </button>
                      ))}
                    </div>

                    {/* Source File Badge & Download Status */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="max-w-[150px] sm:max-w-[220px] truncate" title={doc.originalDocument?.name || doc.fileName || 'Original Document'}>
                          {doc.originalDocument?.name || doc.fileName || 'Original Document'}
                        </span>
                        {doc.originalDocument?.size && (
                          <span className="text-neutral-500 text-[10px]">({Math.round(doc.originalDocument.size / 1024)} KB)</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyPibText}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300 hover:text-white flex items-center gap-1 cursor-pointer transition"
                        title="Copy full authentic verbatim text"
                      >
                        {pibCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{pibCopied ? 'Copied' : 'Copy'}</span>
                      </button>

                      {isDownloadAllowed ? (
                        <button
                          type="button"
                          onClick={handleDownloadOriginal}
                          className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Original</span>
                        </button>
                      ) : (
                        <div
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-500 text-[10px] font-mono flex items-center gap-1 cursor-not-allowed"
                          title="Author has disabled public download for this source file"
                        >
                          <Shield className="w-3 h-3 text-neutral-500" />
                          <span>Download Restricted</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gazette Parchment Authentic Reader Canvas */}
              <div className="p-6 sm:p-10 rounded-2xl bg-[#07090e] border border-white/10 shadow-2xl relative">
                {/* Official Dispatch Header within Gazette */}
                <div className="text-center space-y-2 pb-6 border-b border-white/10 max-w-2xl mx-auto">
                  <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400 font-semibold">
                    {doc.committee || 'PARLIAMENTARY AFFAIRS & LEGISLATIVE FLOOR'}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-serif font-black text-white leading-snug">
                    {doc.title}
                  </h1>
                  <div className="text-xs font-mono text-neutral-400 pt-1">
                    Authentic unedited release posted by <strong className="text-neutral-200">@{doc.proposedByUsername || doc.leadSponsors[0] || 'author'}</strong>
                  </div>
                </div>

                {/* Opening Attribution */}
                <div className="my-6 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-400 text-xs font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <span>
                    <strong>AUTHENTIC SOURCE:</strong> The following is the unedited verbatim text of the original document as submitted by the student author(s).
                  </span>
                </div>

                {/* Verbatim Source Content Body */}
                <div
                  className={`leading-relaxed text-sm sm:text-base text-neutral-200 space-y-4 whitespace-pre-wrap select-text ${
                    pibFont === 'serif'
                      ? 'font-serif text-[15px] sm:text-[16px] tracking-normal'
                      : pibFont === 'mono'
                      ? 'font-mono text-xs sm:text-sm text-neutral-300'
                      : 'font-sans text-sm sm:text-base'
                  }`}
                >
                  {doc.originalDocument?.rawContent || doc.fullText || (
                    doc.clauses.map(c => `Clause ${c.clauseNumber}: ${c.title || ''}\n${c.text}${c.subClauses?.length ? '\n' + c.subClauses.map(s => `  ${s.number} ${s.text}`).join('\n') : ''}`).join('\n\n')
                  )}
                </div>

                {/* Authentic Submission Signoff & Integrity Seal */}
                <div className="mt-12 pt-6 border-t border-white/10 text-center space-y-3 font-mono">
                  <div className="text-xs font-bold text-amber-400 tracking-widest uppercase">
                    *** END OF ORIGINAL SUBMISSION ***
                  </div>
                  <div className="text-[11px] text-neutral-500 space-y-1">
                    <div>Document Reference: <strong className="text-neutral-300">{doc.documentCode || doc.id}</strong></div>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tamper-evident repository record • Authentic Student Solution Submission</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Immutable Sovereign Legislative Post</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition cursor-pointer"
            >
              Close Document
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>

    {/* Sovereign Document Export Studio */}
    {isExportModalOpen && doc && (
      <SolutionExportModal
        key="solution-export-modal"
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        document={doc}
      />
    )}

    {/* Modular Passport Points Rewards Redemption Hub */}
    <PassportRewardsPlaceholderModal
      isOpen={isRewardsModalOpen}
      onClose={() => setIsRewardsModalOpen(false)}
      userPoints={passportPoints}
    />

    {/* Maker Schedule Creation Modal */}
    {isAddScheduleModalOpen && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-[#0b0e14] border border-amber-500/30 rounded-3xl p-6 space-y-5 shadow-2xl relative text-left"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <TableIcon className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  Propose Statutory Schedule &amp; Annexure
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Schedules attach directly under the bill provisions and form part of the enacted instrument.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAddScheduleModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preset Choices */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
              Schedule Preset Templates
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applySchedulePreset('PENALTY')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  schedulePresetChoice === 'PENALTY'
                    ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-mono font-bold">Penalty Matrix</div>
                <div className="text-[10px] text-neutral-400">Fines &amp; sanctions</div>
              </button>

              <button
                type="button"
                onClick={() => applySchedulePreset('FISCAL')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  schedulePresetChoice === 'FISCAL'
                    ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-mono font-bold">Fiscal Outlay</div>
                <div className="text-[10px] text-neutral-400">Budget allocations</div>
              </button>

              <button
                type="button"
                onClick={() => applySchedulePreset('TIMELINE')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  schedulePresetChoice === 'TIMELINE'
                    ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-mono font-bold">Rollout Roadmap</div>
                <div className="text-[10px] text-neutral-400">Enforcement phases</div>
              </button>

              <button
                type="button"
                onClick={() => applySchedulePreset('CUSTOM')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  schedulePresetChoice === 'CUSTOM'
                    ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-mono font-bold">Custom Blank</div>
                <div className="text-[10px] text-neutral-400">Blank schedule</div>
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-3.5">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-1">
                Schedule Identifier / Number
              </label>
              <input
                type="text"
                value={scheduleNumberInput}
                onChange={(e) => setScheduleNumberInput(e.target.value)}
                placeholder="e.g. THE FIRST SCHEDULE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white font-mono text-xs outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-1">
                Schedule Title
              </label>
              <input
                type="text"
                value={scheduleTitleInput}
                onChange={(e) => setScheduleTitleInput(e.target.value)}
                placeholder="e.g. Statutory Fines and Penalties Matrix"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white font-serif text-sm outline-none focus:border-amber-400 font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-1">
                Schedule Provisions / Table Content (Markdown supported)
              </label>
              <textarea
                value={scheduleContentInput}
                onChange={(e) => setScheduleContentInput(e.target.value)}
                placeholder="Enter markdown table (| Head 1 | Head 2 |) or statutory text..."
                rows={8}
                className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-white font-mono text-xs outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-[11px] font-mono text-neutral-500">
              Directly integrates into {doc.documentCode || 'this legislation'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddScheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-mono text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSchedule}
                disabled={!scheduleNumberInput.trim() || !scheduleTitleInput.trim()}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition cursor-pointer disabled:opacity-40 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                Attach Schedule to Bill
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </>
);
}
