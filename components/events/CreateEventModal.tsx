'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  Tag, 
  DollarSign, 
  Users, 
  Check, 
  Upload, 
  Lock, 
  Ticket, 
  Plus, 
  Trash2, 
  AlertCircle,
  FileText,
  CreditCard,
  Zap,
  FilePlus,
  Layers,
  Search,
  Globe2,
  Sliders,
  Maximize2,
  Radio,
  Image as ImageIcon,
  CheckCircle2,
  Video,
  ChevronRight,
  ChevronLeft,
  Building,
  Award,
  ShieldCheck,
  Briefcase,
  Shirt,
  Coffee,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';
import { useZenPass } from '@/context/ZenPassContext';
import { EventCategory, EventType } from '@/types/events';
import { getPublicForms } from '@/lib/formsStorage';
import { ZenForm } from '@/types/forms';
import { WorldLocationPickerModal, WorldLocation } from '@/components/common/WorldLocationPickerModal';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
];

const KNOWN_CITIES = [
  { name: 'New Delhi & NCR', value: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Gurugram', value: 'Gurugram', lat: 28.4595, lng: 77.0266 },
  { name: 'Mumbai', value: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bengaluru', value: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Pune', value: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Hyderabad', value: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Kolkata', value: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Chennai', value: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Geneva', value: 'Geneva', lat: 46.2044, lng: 6.1432 },
  { name: 'London', value: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', value: 'New York', lat: 40.7128, lng: -74.0060 },
];

export type StudioTab = 'LOGISTICS' | 'TICKETS' | 'INTAKE' | 'AGENDA' | 'ARTWORK';

interface ScheduleSession {
  id: string;
  day: string;
  time: string;
  title: string;
  location: string;
}

interface IntakeFieldOption {
  id: string;
  label: string;
  type: 'text' | 'tel' | 'select' | 'file';
  required: boolean;
  enabled: boolean;
}

interface CustomQuestion {
  id: string;
  title: string;
  type: 'text' | 'textarea' | 'select' | 'file';
  options?: string;
  required: boolean;
}

export function CreateEventModal() {
  const router = useRouter();
  const { profile } = useAuth();
  const { createEvent, setActiveView, events, currentUserUsername, currentUserId } = useZenEvents();
  const { setShowPassWalletModal } = useZenPass();

  // Active Studio Stepper Tab
  const [activeTab, setActiveTab] = useState<StudioTab>('LOGISTICS');

  // ── Tab 1: Core Logistics State ──
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [type, setType] = useState<EventType>('physical');
  const [category, setCategory] = useState<EventCategory>('SUMMIT');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:30');
  const [endTime, setEndTime] = useState('18:00');
  const [timezone, setTimezone] = useState('IST (UTC+5:30)');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [capacity, setCapacity] = useState<number | string>('150');
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat?: number; lng?: number }>({});

  const handleStartDateChange = (val: string) => {
    setDate(val);
    if (!endDate || endDate < val) {
      setEndDate(val);
    }
  };
  
  // Google Places API Location Search
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [placesQuery, setPlacesQuery] = useState('');
  const [placesSuggestions, setPlacesSuggestions] = useState<any[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [showPlacesDropdown, setShowPlacesDropdown] = useState(false);

  // ── Tab 2: Pricing, Pass Tiers & Bank Offers State ──
  type PricingMode = 'FREE' | 'NORMAL' | 'TIERED';
  const [pricingMode, setPricingMode] = useState<PricingMode>('FREE');
  const [ticketPrice, setTicketPrice] = useState<number | string>(499);
  type PaymentCollectionMethod = 'ONLINE_CASHFREE' | 'APPROVAL_FIRST' | 'AT_VENUE';
  const [paymentCollectionMethod, setPaymentCollectionMethod] = useState<PaymentCollectionMethod>('ONLINE_CASHFREE');
  
  interface EventCustomTier {
    id: string;
    name: string;
    price: number;
    description: string;
    perks: string;
    capacity?: number;
    badge?: string;
    salePhase: 'NOW' | 'SCHEDULED';
    saleStartDate?: string;
    exclusiveOfferEnabled: boolean;
    cardType: 'RUPAY' | 'VISA' | 'MASTERCARD' | 'STUDENT' | 'EARLY_ACCESS';
    discountMode?: 'FLAT' | 'PERCENT';
    offerTitle: string;
    discountFlat: number;
    discountPercent?: number;
    badgeText: string;
  }

  const [eventTiers, setEventTiers] = useState<EventCustomTier[]>([]);

  // ── Tab 3: Delegate Intake Form State ──
  type FormTimingOption = 'CREATE_NOW_SCRATCH' | 'CREATE_NOW_TEMPLATE' | 'LINK_EXISTING' | 'CREATE_AFTER';
  const [formTiming, setFormTiming] = useState<FormTimingOption>('CREATE_AFTER');
  const [selectedExistingFormId, setSelectedExistingFormId] = useState<string>('');
  const [existingForms, setExistingForms] = useState<ZenForm[]>([]);

  const [intakeFields, setIntakeFields] = useState<IntakeFieldOption[]>([
    { id: 'fullName', label: 'Full Legal Delegate Name', type: 'text', required: true, enabled: true },
    { id: 'whatsapp', label: 'WhatsApp / Contact Phone Number', type: 'tel', required: true, enabled: true },
    { id: 'institution', label: 'Educational Institution / Delegation', type: 'text', required: true, enabled: true },
    { id: 'committeePref', label: 'Committee & Portfolio Preferences (1st, 2nd, 3rd choice)', type: 'select', required: true, enabled: true },
    { id: 'experience', label: 'Prior Diplomatic / MUN Experience Level', type: 'select', required: false, enabled: true },
    { id: 'dietary', label: 'Dietary Preference (Veg / Non-Veg / Jain)', type: 'select', required: false, enabled: true },
    { id: 'emergencyContact', label: 'Emergency Contact Person & Phone', type: 'text', required: false, enabled: false },
    { id: 'idProof', label: 'Student / Government ID Card Document Upload', type: 'file', required: false, enabled: false },
  ]);

  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);

  // ── Tab 4: Agenda, Protocols & Secretariat State ──
  type ItineraryTiming = 'NOW' | 'AFTER';
  const [itineraryTiming, setItineraryTiming] = useState<ItineraryTiming>('NOW');
  const [rawItineraryText, setRawItineraryText] = useState('');
  const [itineraryViewMode, setItineraryViewMode] = useState<'PASTE' | 'CARDS'>('PASTE');

  const [scheduleItems, setScheduleItems] = useState<ScheduleSession[]>([
    { id: 'sess_1', day: 'Day 1', time: '09:00 - 10:30', title: 'Registration & Dais Accreditation', location: 'Main Entrance & Secretariat Desk' },
    { id: 'sess_2', day: 'Day 1', time: '10:30 - 12:00', title: 'Opening Plenary & Ambassadorial Keynote', location: 'Plenary Grand Hall' },
    { id: 'sess_3', day: 'Day 1', time: '13:00 - 15:30', title: 'Committee Session I: Procedural Motions & Setting Agenda', location: 'Designated Committee Chambers' },
    { id: 'sess_4', day: 'Day 1', time: '16:00 - 18:00', title: 'Moderated & Unmoderated Caucus: Working Papers', location: 'Committee Chambers' }
  ]);

  const [hostOrganization, setHostOrganization] = useState('');
  const [secretaryGeneral, setSecretaryGeneral] = useState('');
  const [secretariatEmail, setSecretariatEmail] = useState('');
  const [secretariatPhone, setSecretariatPhone] = useState('');
  const [dressCode, setDressCode] = useState('Western Business Formal (Suits, Ties, Blazers)');
  const [description, setDescription] = useState('');
  
  const [selectedPerks, setSelectedPerks] = useState<string[]>([
    'Official Verified Certificate of Participation',
    'Diplomatic Delegate Kit & Country Placard',
    'Executive High Tea & Working Lunch'
  ]);

  // ── Tab 5: Artwork & Tags State ──
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0]);
  const [customCover, setCustomCover] = useState('');
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [pendingArtwork, setPendingArtwork] = useState<string>('');
  const [artworkPosition, setArtworkPosition] = useState<'top' | 'center' | 'bottom'>('center');
  const [artworkFit, setArtworkFit] = useState<'cover' | 'contain'>('cover');
  const [artworkZoom, setArtworkZoom] = useState<number>(100);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize existing forms
  useEffect(() => {
    try {
      const forms = getPublicForms();
      setExistingForms(forms);
      if (forms.length > 0 && !selectedExistingFormId) {
        setSelectedExistingFormId(forms[0].id);
      }
    } catch {}
  }, [selectedExistingFormId]);

  // Google Places API Search Debounce
  useEffect(() => {
    if (!placesQuery.trim() || placesQuery.length < 2) {
      setPlacesSuggestions([]);
      setShowPlacesDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setIsSearchingPlaces(true);
        const res = await fetch(`/api/places?query=${encodeURIComponent(placesQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.places)) {
            setPlacesSuggestions(data.places.slice(0, 6));
            setShowPlacesDropdown(true);
          }
        }
      } catch (err) {
        console.warn('Google Places API search error', err);
      } finally {
        setIsSearchingPlaces(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [placesQuery]);

  // Tier Helpers
  const handleAddEventTier = (template?: { 
    name: string; 
    price: number; 
    badge?: string;
    exclusiveOfferEnabled?: boolean;
    cardType?: 'RUPAY' | 'VISA' | 'MASTERCARD' | 'STUDENT' | 'EARLY_ACCESS';
    discountMode?: 'FLAT' | 'PERCENT';
    offerTitle?: string;
    discountFlat?: number;
    discountPercent?: number;
    badgeText?: string;
  }) => {
    const newTier: EventCustomTier = {
      id: `tier_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: template?.name || 'New Attendee Pass',
      price: template?.price ?? 599,
      description: 'Official event admission pass.',
      perks: 'Event Admission, Digital Certificate',
      capacity: 50,
      badge: template?.badge,
      salePhase: 'NOW',
      saleStartDate: '',
      exclusiveOfferEnabled: template?.exclusiveOfferEnabled ?? false,
      cardType: template?.cardType || 'RUPAY',
      discountMode: template?.discountMode || 'FLAT',
      offerTitle: template?.offerTitle || 'RUPAY CARD OFFER • BUY TICKETS NOW',
      discountFlat: template?.discountFlat ?? 150,
      discountPercent: template?.discountPercent ?? 20,
      badgeText: template?.badgeText || 'RUPAY SALE'
    };
    setEventTiers((prev) => [...prev, newTier]);
  };

  const handleRemoveEventTier = (id: string) => {
    setEventTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateEventTier = (id: string, field: keyof EventCustomTier, value: any) => {
    setEventTiers((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  // Schedule Helpers
  const handleAddScheduleSession = () => {
    setScheduleItems((prev) => [
      ...prev,
      {
        id: `sess_${Date.now()}`,
        day: date && endDate && endDate > date ? `Day ${Math.min(prev.length + 1, 3)}` : 'Day 1',
        time: '14:00 - 15:30',
        title: 'New Committee Session',
        location: type === 'virtual' ? 'Virtual Chamber' : 'Committee Hall'
      }
    ]);
  };

  const handleParsePastedItinerary = () => {
    if (!rawItineraryText.trim()) {
      setToastMessage('Please paste your itinerary text first before converting.');
      return;
    }
    const lines = rawItineraryText.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsedSessions: ScheduleSession[] = [];
    let currentDay = 'Day 1';

    lines.forEach((line, idx) => {
      if (/^day\s*\d+/i.test(line)) {
        currentDay = line.split(/[:\-–]/)[0].trim();
        return;
      }
      const timeMatch = line.match(/^(\d{1,2}:\d{2}(?:\s*(?:am|pm|ist))?(?:\s*[-–to]\s*\d{1,2}:\d{2}(?:\s*(?:am|pm|ist))?)?)(?:\s*[:\-–]\s*|\s+)(.*)$/i);
      if (timeMatch) {
        parsedSessions.push({
          id: `sess_p_${Date.now()}_${idx}`,
          day: currentDay,
          time: timeMatch[1].trim(),
          title: timeMatch[2].trim() || 'Session',
          location: type === 'virtual' ? 'Virtual Chamber' : 'Main Hall'
        });
      } else {
        parsedSessions.push({
          id: `sess_p_${Date.now()}_${idx}`,
          day: currentDay,
          time: `Session ${parsedSessions.length + 1}`,
          title: line,
          location: type === 'virtual' ? 'Virtual Chamber' : 'Main Hall'
        });
      }
    });

    if (parsedSessions.length > 0) {
      setScheduleItems(parsedSessions);
      setItineraryViewMode('CARDS');
      setToastMessage(`Converted ${parsedSessions.length} sessions from your pasted itinerary!`);
    }
  };

  const handleRemoveScheduleSession = (id: string) => {
    setScheduleItems((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateScheduleSession = (id: string, field: keyof ScheduleSession, val: string) => {
    setScheduleItems((prev) => prev.map((s) => s.id === id ? { ...s, [field]: val } : s));
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        setToastMessage('File size must be under 12MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultUrl = event.target.result as string;
          setPendingArtwork(resultUrl);
          setIsArtworkModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyArtwork = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (pendingArtwork) {
      setCustomCover(pendingArtwork);
      setCoverImage(pendingArtwork);
    }
    setIsArtworkModalOpen(false);
  };

  const handleSelectPlaceSuggestion = (place: any) => {
    const placeName = place.name || place.address || '';
    setLocation(placeName);
    setPlacesQuery(placeName);
    if (place.city) {
      setCity(place.city);
    }
    if (place.lat && place.lng) {
      setSelectedCoordinates({ lat: place.lat, lng: place.lng });
    }
    setShowPlacesDropdown(false);
  };

  const isVirtual = type === 'virtual';

  // Toggle Perk helper
  const togglePerk = (perk: string) => {
    setSelectedPerks((prev) => 
      prev.includes(perk) ? prev.filter((p) => p !== perk) : [...prev, perk]
    );
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setActiveTab('LOGISTICS');
      setToastMessage('Please enter a convening title.');
      return;
    }
    if (!date) {
      setActiveTab('LOGISTICS');
      setToastMessage('Please select a convening date.');
      return;
    }
    if (!isVirtual && !location.trim()) {
      setActiveTab('LOGISTICS');
      setToastMessage('Please enter a physical venue or select on Google Maps.');
      return;
    }

    const tags = tagInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const finalLocation = isVirtual ? 'Virtual Online Chamber' : location.trim();
    const finalCity = isVirtual ? 'Virtual' : city;
    const finalCover = customCover || coverImage;
    const lat = isVirtual ? undefined : (selectedCoordinates.lat || 28.6139);
    const lng = isVirtual ? undefined : (selectedCoordinates.lng || 77.2090);

    // Calculate effective ticket price and plans
    let effectivePrice = 0;
    let finalPlans = undefined;

    if (pricingMode === 'NORMAL') {
      effectivePrice = Math.max(0, Number(ticketPrice) || 0);
      finalPlans = [{
        id: 'standard_admission',
        name: 'Standard Admission',
        price: effectivePrice,
        description: 'Official admission pass to the convening.',
        perks: ['Event Admission', 'Digital Certificate'],
        status: 'active' as const
      }];
    } else if (pricingMode === 'TIERED') {
      finalPlans = eventTiers.map((t) => ({
        id: t.id,
        name: t.name,
        price: Number(t.price),
        description: t.description,
        perks: t.perks.split(',').map((p) => p.trim()).filter(Boolean),
        capacity: t.capacity,
        badge: t.badge,
        status: 'active' as const,
        salePhase: t.salePhase,
        saleStartDate: t.saleStartDate,
        exclusiveOffer: t.exclusiveOfferEnabled ? {
          enabled: true,
          cardType: t.cardType,
          title: t.offerTitle,
          discountFlat: t.discountFlat,
          discountPercent: t.discountPercent,
          badgeText: t.badgeText
        } : undefined
      }));
      effectivePrice = eventTiers[0] ? Math.max(0, Number(eventTiers[0].price)) : 0;
    }

    const timeWindow = `${startTime} - ${endTime} ${timezone}`;

    const createdId = createEvent({
      title: title.trim(),
      description: description.trim() || tagline.trim() || `${title.trim()} — Official Convening on ZENVITRA`,
      coverImage: finalCover,
      type,
      category,
      date,
      endDate: endDate || date,
      time: timeWindow,
      location: finalLocation,
      city: finalCity,
      meetingUrl: isVirtual && meetingUrl ? meetingUrl.trim() : undefined,
      latitude: lat,
      longitude: lng,
      ticketPrice: effectivePrice,
      plans: finalPlans,
      capacity: capacity ? Number(capacity) : undefined,
      tags,
      formTiming: formTiming === 'CREATE_AFTER' ? 'CREATE_AFTER' : 'CREATE_NOW',
      formId: formTiming === 'LINK_EXISTING' ? selectedExistingFormId : undefined,
      paymentTiming: paymentCollectionMethod === 'APPROVAL_FIRST' ? 'ACCEPT_AFTER' : 'ACCEPT_NOW',
      paymentCollectionMethod,
      tagline: tagline.trim() || undefined,
      startTime,
      endTime,
      timezone,
      isMultiDay: Boolean(date && endDate && endDate > date),
      itineraryTiming,
      itineraryText: rawItineraryText.trim() || undefined,
      dressCode,
      perks: selectedPerks,
      schedule: itineraryTiming === 'NOW' ? scheduleItems : undefined,
      secretariatContact: {
        name: secretaryGeneral.trim() || profile?.display_name || undefined,
        email: secretariatEmail.trim() || profile?.email || undefined,
        phone: secretariatPhone.trim() || undefined,
        role: 'Secretary-General / Convenor'
      }
    });

    // Also sync to backend conference listings database
    fetch('/api/events/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        shortName: tagline.trim() || title.trim(),
        category,
        format: type,
        venue: finalLocation,
        city: finalCity,
        startDate: date,
        endDate: endDate || date,
        itineraryTiming,
        itineraryText: rawItineraryText.trim() || undefined,
        schedule: itineraryTiming === 'NOW' ? scheduleItems : undefined,
        organizerName: profile?.display_name || 'Event Organizer',
        organizerEmail: profile?.email || 'organizer@zenvitra.xyz',
        organizerPhone: secretariatPhone.trim() || undefined,
        description: description.trim() || tagline.trim() || `${title} — Convening on ZENVITRA`,
        coverImage: finalCover,
        ticketPrice: effectivePrice,
        tierPlans: finalPlans,
        userId: profile?.id || null,
        formTiming,
        paymentTiming: paymentCollectionMethod === 'APPROVAL_FIRST' ? 'ACCEPT_AFTER' : 'ACCEPT_NOW'
      }),
    }).catch(() => {});

    // Route based on form strategy
    if (formTiming === 'CREATE_NOW_SCRATCH') {
      router.push(`/forms/edit/new?originEventId=${createdId}&eventTitle=${encodeURIComponent(title.trim())}`);
    } else if (formTiming === 'CREATE_NOW_TEMPLATE') {
      router.push(`/forms?originEventId=${createdId}&eventTitle=${encodeURIComponent(title.trim())}`);
    } else {
      setActiveView('list');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#080b11] border border-cyan-500/25 shadow-2xl p-5 sm:p-7 space-y-6 my-6 max-h-[92vh] overflow-y-auto font-sans">
        
        {/* Toast Warning */}
        {toastMessage && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-sm rounded-2xl bg-neutral-900 border border-amber-500/40 p-5 space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white tracking-wide font-mono uppercase">
                  Action Required
                </h4>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {toastMessage}
                </p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setToastMessage(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-mono text-xs font-bold transition shadow-lg cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {/* ── SET THE ARTWORK MODAL ── */}
        {isArtworkModalOpen && (
          <div 
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={(e) => {
              e.stopPropagation();
              if (e.target === e.currentTarget) {
                setIsArtworkModalOpen(false);
              }
            }}
          >
            <div 
              className="relative w-full max-w-2xl rounded-3xl bg-[#0a0e17] border border-cyan-500/40 p-5 sm:p-7 space-y-5 shadow-[0_0_50px_rgba(0,242,254,0.15)] font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              
              <div className="flex items-start justify-between border-b border-white/10 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      <ImageIcon className="w-4 h-4" />
                    </span>
                    <h3 className="text-base font-bold text-white font-display">Set &amp; Frame Cover Artwork</h3>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Preview and adjust how your summit artwork displays on delegate cards and event passes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsArtworkModalOpen(false);
                  }}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Return to Event Form"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 16:9 Live Widescreen Canvas Preview */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl flex items-center justify-center group">
                {/* Ambient Blurred Background if Contain */}
                {artworkFit === 'contain' && pendingArtwork && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-40 scale-110"
                    style={{ backgroundImage: `url(${pendingArtwork})` }}
                  />
                )}

                {/* Actual Image with position and scale */}
                {pendingArtwork && (
                  <img
                    src={pendingArtwork}
                    alt="Event Artwork Preview"
                    className="w-full h-full relative z-10 transition-all duration-200"
                    style={{
                      objectFit: artworkFit,
                      objectPosition: artworkPosition,
                      transform: `scale(${artworkZoom / 100})`,
                    }}
                  />
                )}

                {/* Live Summit Overlay Preview */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-4 sm:p-6 flex flex-col justify-between pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/30 backdrop-blur-md border border-cyan-400/40 text-cyan-200 text-[10px] font-mono font-bold uppercase tracking-wider">
                      {category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono">
                      {type.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                      ZENVITRA OFFICIAL CONVENING
                    </p>
                    <h4 className="text-base sm:text-xl font-display font-extrabold text-white tracking-tight drop-shadow-md truncate">
                      {title.trim() || 'Convening Title Preview'}
                    </h4>
                    <p className="text-xs text-neutral-300 font-mono">
                      {date || 'Date Pending'} &bull; {isVirtual ? 'Virtual Online' : (location || city || 'Venue')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Artwork Adjustment Controls */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Focal Alignment */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-neutral-400 block font-semibold">Focal Alignment:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['top', 'center', 'bottom'] as const).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setArtworkPosition(pos)}
                          className={`py-1.5 px-2 rounded-xl text-center text-[10px] uppercase font-bold transition cursor-pointer border ${
                            artworkPosition === pos
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fit Mode */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-neutral-400 block font-semibold">Fit Mode:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setArtworkFit('cover')}
                        className={`py-1.5 px-2 rounded-xl text-center text-[10px] font-bold uppercase transition cursor-pointer border ${
                          artworkFit === 'cover'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Cover (Full)
                      </button>
                      <button
                        type="button"
                        onClick={() => setArtworkFit('contain')}
                        className={`py-1.5 px-2 rounded-xl text-center text-[10px] font-bold uppercase transition cursor-pointer border ${
                          artworkFit === 'contain'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Contain (Frame)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scale / Zoom Slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Artwork Scale / Zoom:</span>
                    <span className="text-white font-bold">{artworkZoom}%</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="140"
                    value={artworkZoom}
                    onChange={(e) => setArtworkZoom(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Choose Another Image</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsArtworkModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-mono transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleApplyArtwork(e);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-mono font-bold text-xs transition shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Adjust Artwork &amp; Continue</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Sparkles className="w-4 h-4 fill-black" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                  <span>Convening Setup Studio</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                    Executive Suite
                  </span>
                </h2>
                <p className="text-xs text-neutral-400 font-sans">
                  Deploy your diplomatic summit, MUN, or youth parliament with granular ticketing, bank sales, custom intake forms, and multi-day agenda.
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('list')}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── STEPPER / TAB NAVIGATION BAR ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('LOGISTICS')}
            className={`py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 ${
              activeTab === 'LOGISTICS'
                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/20 border border-cyan-400/60 text-white font-bold shadow-md shadow-cyan-500/10'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">1. Logistics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TICKETS')}
            className={`py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 ${
              activeTab === 'TICKETS'
                ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/20 border border-purple-400/60 text-white font-bold shadow-md shadow-purple-500/10'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">2. Passes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('INTAKE')}
            className={`py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 ${
              activeTab === 'INTAKE'
                ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 border border-amber-400/60 text-white font-bold shadow-md shadow-amber-500/10'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">3. Intake Form</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AGENDA')}
            className={`py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 ${
              activeTab === 'AGENDA'
                ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/20 border border-emerald-400/60 text-white font-bold shadow-md shadow-emerald-500/10'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">4. Agenda</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ARTWORK')}
            className={`py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 col-span-2 sm:col-span-1 ${
              activeTab === 'ARTWORK'
                ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/20 border border-cyan-400/60 text-white font-bold shadow-md shadow-blue-500/10'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">5. Artwork</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ════════════════════════════════════════════════════════════════
              TAB 1: LOGISTICS & VENUE
              ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'LOGISTICS' && (
            <div className="space-y-5 animate-fade-in">
              {/* Title & Tagline */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-semibold text-neutral-300">
                      CONVENING TITLE *
                    </label>
                    <span className="text-[10px] font-mono text-cyan-400">Required</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Geneva Global Diplomatic Summit 2026 / National Lok Sabha Simulation"
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm font-semibold text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold text-neutral-300">
                    CONVENING TAGLINE / MISSION SUBTITLE
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Simulating multilateral crisis diplomacy and legislative leadership for the 21st century"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              {/* Format & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold text-neutral-300">FORMAT TYPE</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                  >
                    <option value="physical">Physical In-Person Venue</option>
                    <option value="virtual">Virtual Online Assembly (Remote Digital Chamber)</option>
                    <option value="hybrid">Hybrid (Physical &amp; Virtual)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold text-neutral-300">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                  >
                    <option value="SUMMIT">Diplomatic Summit</option>
                    <option value="MUN">Model United Nations (MUN)</option>
                    <option value="PARLIAMENT">Parliamentary / Youth Sabha</option>
                    <option value="POLICY">Policy Roundtable</option>
                    <option value="WORKSHOP">Academy &amp; Workshop</option>
                    <option value="KEYNOTE">Keynote &amp; Plenary</option>
                    <option value="HACKATHON">Civic Hackathon</option>
                    <option value="OTHER">Other Assembly</option>
                  </select>
                </div>
              </div>

              {/* Convening Dates: Start Date & End Date */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      CONVENING DATES &amp; TIMELINE
                    </span>
                  </div>
                  {date && (
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                      {!endDate || date === endDate ? '1-Day Convening' : `${Math.max(1, Math.round((new Date(endDate).getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)) + 1)} Days Assembly`}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-neutral-300 font-semibold">
                      START DATE *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-neutral-300 font-semibold">
                      END DATE *
                    </label>
                    <input
                      type="date"
                      required
                      min={date || undefined}
                      value={endDate || date}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                    />
                    <p className="text-[10px] font-mono text-neutral-500">
                      Auto-synced with Start Date for single-day events; choose later date for multi-day summits.
                    </p>
                  </div>
                </div>

                {/* Time Window & Timezone */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-neutral-400">START TIME</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-neutral-400">CONCLUDING TIME</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-neutral-400">TIMEZONE</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                    >
                      <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                      <option value="GMT / UTC">GMT / UTC</option>
                      <option value="CET (UTC+1)">CET (UTC+1)</option>
                      <option value="EST (UTC-5)">EST (UTC-5)</option>
                      <option value="PST (UTC-8)">PST (UTC-8)</option>
                      <option value="SGT (UTC+8)">SGT (UTC+8)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location: Online vs Google Maps API Venue */}
              {isVirtual ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2.5 text-cyan-300 font-mono text-xs font-bold">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>VIRTUAL ONLINE CONVENING &bull; NO PHYSICAL LOCATION NEEDED</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                    Delegates will convene and debate live inside the embedded Zenvitra Digital Chamber with real-time voting and dais controls.
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-mono font-semibold text-cyan-200">
                      EXTERNAL MEETING / BROADCAST LINK (OPTIONAL)
                    </label>
                    <div className="relative">
                      <Video className="w-4 h-4 absolute left-3.5 top-3 text-cyan-400" />
                      <input
                        type="url"
                        value={meetingUrl}
                        onChange={(e) => setMeetingUrl(e.target.value)}
                        placeholder="https://meet.google.com/xyz or Zoom / YouTube Live link (optional)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-mono font-semibold text-neutral-300">
                          VENUE / LOCATION (GOOGLE MAPS API) *
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsLocationPickerOpen(true)}
                          className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer"
                        >
                          <Globe2 className="w-3 h-3" />
                          <span>Map &amp; GPS Search</span>
                        </button>
                      </div>

                      {/* Autocomplete Input with Google Places API */}
                      <div className="relative">
                        <div className="relative">
                          <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-cyan-400" />
                          <input
                            type="text"
                            required={!isVirtual}
                            value={location}
                            onChange={(e) => {
                              setLocation(e.target.value);
                              setPlacesQuery(e.target.value);
                            }}
                            onFocus={() => {
                              if (placesSuggestions.length > 0) setShowPlacesDropdown(true);
                            }}
                            placeholder="Search venue or address (e.g. India International Centre, Vigyan Bhawan)..."
                            className="w-full pl-10 pr-24 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                          />
                          {isSearchingPlaces && (
                            <div className="absolute right-3.5 top-3.5 text-cyan-400 text-[10px] font-mono animate-pulse">
                              Searching...
                            </div>
                          )}
                        </div>

                        {/* Google Places Live Suggestions Dropdown */}
                        {showPlacesDropdown && placesSuggestions.length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-2xl bg-[#0d121f] border border-cyan-500/30 shadow-2xl p-1.5 space-y-1 max-h-60 overflow-y-auto">
                            <div className="px-3 py-1 text-[9px] font-mono text-neutral-400 uppercase tracking-widest border-b border-white/5 flex items-center justify-between">
                              <span>Google Maps Places Results</span>
                              <span className="text-cyan-400">Live API</span>
                            </div>
                            {placesSuggestions.map((place, idx) => (
                              <div
                                key={idx}
                                onClick={() => handleSelectPlaceSuggestion(place)}
                                className="p-2.5 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 text-xs cursor-pointer transition flex items-start gap-2.5"
                              >
                                <MapPin className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                                <div className="space-y-0.5 min-w-0">
                                  <p className="font-bold text-white truncate">{place.name}</p>
                                  {place.address && (
                                    <p className="text-[10px] text-neutral-400 truncate">{place.address}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metro City / Region */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-semibold text-neutral-300">METRO CITY</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                      >
                        {KNOWN_CITIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Seating Capacity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-semibold text-neutral-300">
                    TOTAL DELEGATE ASSEMBLY CAPACITY
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[50, 150, 300, 500, 1000].map((presetCap) => (
                      <button
                        key={presetCap}
                        type="button"
                        onClick={() => setCapacity(presetCap)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer border ${
                          Number(capacity) === presetCap
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {presetCap}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Next Tab Step Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('TICKETS')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Passes &amp; Bank Offers</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB 2: TICKETS, PASSES & BANK OFFERS
              ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'TICKETS' && (
            <div className="space-y-5 animate-fade-in">
              {/* Payment Modality / Collection Timing Strategy */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/20 to-black/60 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Payment Collection Strategy &amp; Timing
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                    Cashfree PG Gateway
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setPaymentCollectionMethod('ONLINE_CASHFREE')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                      paymentCollectionMethod === 'ONLINE_CASHFREE'
                        ? 'bg-purple-500/15 border-purple-400 text-white ring-1 ring-purple-400 shadow-lg shadow-purple-500/10'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Accept Online Now</span>
                      {paymentCollectionMethod === 'ONLINE_CASHFREE' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <p className="text-[10px] text-neutral-300 leading-relaxed">
                      Instant online checkout with UPI, RuPay, Visa, and Netbanking. Tickets issued automatically.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentCollectionMethod('APPROVAL_FIRST')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                      paymentCollectionMethod === 'APPROVAL_FIRST'
                        ? 'bg-purple-500/15 border-purple-400 text-white ring-1 ring-purple-400 shadow-lg shadow-purple-500/10'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Approval First &bull; Selective</span>
                      {paymentCollectionMethod === 'APPROVAL_FIRST' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <p className="text-[10px] text-neutral-300 leading-relaxed">
                      Delegates submit registration form first. Secretariat reviews, accepts portfolios, and issues payment invoice.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentCollectionMethod('AT_VENUE')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                      paymentCollectionMethod === 'AT_VENUE'
                        ? 'bg-purple-500/15 border-purple-400 text-white ring-1 ring-purple-400 shadow-lg shadow-purple-500/10'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Desk / Venue Collection</span>
                      {paymentCollectionMethod === 'AT_VENUE' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <p className="text-[10px] text-neutral-300 leading-relaxed">
                      Collect registration fees physically at the venue check-in dais or via cash/college counter.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Mode Switcher */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider">
                    Pass Tiers &amp; Pricing Structure
                  </label>
                  <span className="text-[10px] font-mono text-neutral-400">Configurable Tiers</span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/10">
                  <button
                    type="button"
                    onClick={() => setPricingMode('FREE')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer flex items-center justify-center gap-1 ${
                      pricingMode === 'FREE'
                        ? 'bg-white text-black shadow-sm font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {pricingMode === 'FREE' && <Check className="w-3 h-3 text-black stroke-[3]" />}
                    <span>Free Entry (₹0)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPricingMode('NORMAL')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer flex items-center justify-center gap-1 ${
                      pricingMode === 'NORMAL'
                        ? 'bg-white text-black shadow-sm font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {pricingMode === 'NORMAL' && <Check className="w-3 h-3 text-black stroke-[3]" />}
                    <span>Standard Flat Fee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPricingMode('TIERED');
                      if (eventTiers.length === 0) {
                        handleAddEventTier({
                          name: 'RuPay Early Access Pass',
                          price: 499,
                          badge: 'RUPAY SALE',
                          exclusiveOfferEnabled: true,
                          cardType: 'RUPAY',
                          discountMode: 'FLAT',
                          offerTitle: 'RUPAY CARD OFFER • BUY TICKETS NOW',
                          discountFlat: 150,
                          discountPercent: 0,
                          badgeText: 'RUPAY SALE'
                        });
                        handleAddEventTier({
                          name: 'General Admission Pass',
                          price: 649,
                          badge: 'GENERAL SALE'
                        });
                      }
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer flex items-center justify-center gap-1 ${
                      pricingMode === 'TIERED'
                        ? 'bg-white text-black shadow-sm font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {pricingMode === 'TIERED' && <Check className="w-3 h-3 text-black stroke-[3]" />}
                    <span>Tiers &amp; Bank Offers ({eventTiers.length})</span>
                  </button>
                </div>

                {/* Normal Single Ticket Price */}
                {pricingMode === 'NORMAL' && (
                  <div className="space-y-1.5 pt-1 animate-fade-in">
                    <label className="block text-xs font-mono font-semibold text-neutral-300">
                      FLAT DELEGATE PASS FEE (INR ₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-neutral-400 font-mono text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={ticketPrice}
                        onChange={(e) => setTicketPrice(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                )}

                {/* Tiered Passes with RuPay / Visa Bank Offers */}
                {pricingMode === 'TIERED' && (
                  <div className="space-y-3 pt-1 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-purple-400" />
                        <span>Configured Pass Tiers &amp; Card Schemes ({eventTiers.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddEventTier()}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-mono font-semibold transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Pass Tier</span>
                      </button>
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-purple-300 font-semibold">1-Click Presets:</span>
                      {[
                        { 
                          name: 'RuPay Early Access Pass', 
                          price: 499, 
                          badge: 'RUPAY SALE',
                          exclusiveOfferEnabled: true,
                          cardType: 'RUPAY' as const,
                          discountMode: 'FLAT' as const,
                          offerTitle: 'RUPAY CARD OFFER • BUY TICKETS NOW',
                          discountFlat: 150,
                          discountPercent: 0,
                          badgeText: 'RUPAY SALE'
                        },
                        { 
                          name: 'Visa Special Presale', 
                          price: 699, 
                          badge: 'VISA EXCLUSIVE',
                          exclusiveOfferEnabled: true,
                          cardType: 'VISA' as const,
                          discountMode: 'FLAT' as const,
                          offerTitle: 'VISA CARD OFFER • PRIORITY ENTRY',
                          discountFlat: 100,
                          discountPercent: 0,
                          badgeText: 'VISA SALE'
                        },
                        { name: 'General Admission', price: 799, badge: 'GENERAL SALE' },
                        { name: 'VIP Ambassador All-Access', price: 1499, badge: '👑 VIP' },
                        { name: 'Student Delegate Pass', price: 349, badge: '🎓 STUDENT' },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleAddEventTier(preset)}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 text-[10px] font-mono text-neutral-300 hover:text-white transition cursor-pointer"
                        >
                          + {preset.name} (₹{preset.price})
                        </button>
                      ))}
                    </div>

                    {/* Tier Cards List */}
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                      {eventTiers.map((tier) => (
                        <div
                          key={tier.id}
                          className="p-4 rounded-2xl bg-black/75 border border-white/15 space-y-3 text-xs shadow-md"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">Tier Title</label>
                              <input
                                type="text"
                                value={tier.name}
                                onChange={(e) => handleUpdateEventTier(tier.id, 'name', e.target.value)}
                                placeholder="e.g. RuPay Early Bird / Executive Pass"
                                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                              />
                            </div>
                            <div className="w-28 relative">
                              <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">Price (₹)</label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1.5 text-neutral-400 font-mono text-xs">₹</span>
                                <input
                                  type="number"
                                  min={0}
                                  value={tier.price}
                                  onChange={(e) => handleUpdateEventTier(tier.id, 'price', Number(e.target.value))}
                                  className="w-full pl-6 pr-2 py-1.5 bg-neutral-900 border border-white/15 rounded-xl text-amber-300 font-bold text-xs font-mono"
                                />
                              </div>
                            </div>
                            {eventTiers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveEventTier(tier.id)}
                                className="p-2 mt-4 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                                title="Remove Tier"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                            <div>
                              <span className="text-[10px] text-neutral-400 block mb-0.5">Badge / Ribbon (Optional):</span>
                              <input
                                type="text"
                                value={tier.badge || ''}
                                onChange={(e) => handleUpdateEventTier(tier.id, 'badge', e.target.value)}
                                placeholder="e.g. RUPAY SALE / LIMITED"
                                className="w-full bg-neutral-900 border border-white/15 rounded-lg px-2.5 py-1 text-white"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-neutral-400 block mb-0.5">Seat Quota for this Tier:</span>
                              <input
                                type="number"
                                value={tier.capacity || ''}
                                onChange={(e) => handleUpdateEventTier(tier.id, 'capacity', Number(e.target.value))}
                                placeholder="e.g. 50"
                                className="w-full bg-neutral-900 border border-white/15 rounded-lg px-2.5 py-1 text-white"
                              />
                            </div>
                          </div>

                          {/* Exclusive Bank Card Offer Box */}
                          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/25 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={tier.exclusiveOfferEnabled}
                                  onChange={(e) => handleUpdateEventTier(tier.id, 'exclusiveOfferEnabled', e.target.checked)}
                                  className="accent-purple-400 cursor-pointer"
                                />
                                <span className="text-xs font-mono text-purple-300 font-bold flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                  <span>Exclusive Card Scheme Offer (&ldquo;RUPAY SALE&rdquo; / Discount)</span>
                                </span>
                              </label>
                              <span className="text-[10px] font-mono text-neutral-400">
                                {tier.exclusiveOfferEnabled ? 'Active' : 'Disabled'}
                              </span>
                            </div>

                            {tier.exclusiveOfferEnabled && (
                              <div className="space-y-2.5 pt-1.5 border-t border-purple-500/20 text-[10px] font-mono">
                                <div className="flex items-center justify-between text-neutral-300">
                                  <span className="font-semibold text-purple-200">Discount Mode:</span>
                                  <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-white/10">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateEventTier(tier.id, 'discountMode', 'FLAT')}
                                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                        tier.discountMode !== 'PERCENT'
                                          ? 'bg-purple-500 text-white shadow'
                                          : 'text-neutral-400 hover:text-white'
                                      }`}
                                    >
                                      Flat ₹ Off
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateEventTier(tier.id, 'discountMode', 'PERCENT')}
                                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                        tier.discountMode === 'PERCENT'
                                          ? 'bg-purple-500 text-white shadow'
                                          : 'text-neutral-400 hover:text-white'
                                      }`}
                                    >
                                      % Percentage Off
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div>
                                    <span className="text-neutral-400 block mb-0.5">Card Scheme:</span>
                                    <select
                                      value={tier.cardType}
                                      onChange={(e) => handleUpdateEventTier(tier.id, 'cardType', e.target.value)}
                                      className="w-full bg-neutral-900 border border-white/15 rounded-lg px-2 py-1 text-white cursor-pointer"
                                    >
                                      <option value="RUPAY">RuPay Card</option>
                                      <option value="VISA">Visa Card</option>
                                      <option value="MASTERCARD">Mastercard</option>
                                      <option value="STUDENT">Student Card</option>
                                      <option value="EARLY_ACCESS">Early Access</option>
                                    </select>
                                  </div>

                                  <div>
                                    <span className="text-neutral-400 block mb-0.5">Offer Title on Pass:</span>
                                    <input
                                      type="text"
                                      value={tier.offerTitle}
                                      onChange={(e) => handleUpdateEventTier(tier.id, 'offerTitle', e.target.value)}
                                      placeholder="RUPAY CARD OFFER"
                                      className="w-full bg-neutral-900 border border-white/15 rounded-lg px-2 py-1 text-white"
                                    />
                                  </div>

                                  <div>
                                    <span className="text-neutral-400 block mb-0.5">
                                      {tier.discountMode === 'PERCENT' ? 'Discount Percentage (%):' : 'Discount Amount (₹):'}
                                    </span>
                                    <input
                                      type="number"
                                      min={0}
                                      max={tier.discountMode === 'PERCENT' ? 100 : tier.price}
                                      value={tier.discountMode === 'PERCENT' ? (tier.discountPercent ?? 20) : tier.discountFlat}
                                      onChange={(e) =>
                                        handleUpdateEventTier(
                                          tier.id,
                                          tier.discountMode === 'PERCENT' ? 'discountPercent' : 'discountFlat',
                                          Number(e.target.value) || 0
                                        )
                                      }
                                      className="w-full bg-neutral-900 border border-white/15 rounded-lg px-2 py-1 text-amber-300 font-bold"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddEventTier()}
                      className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-purple-200 text-xs font-mono font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Another Pass Tier</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Stepper Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('LOGISTICS')}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Logistics</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('INTAKE')}
                  className="px-5 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Intake Form Studio</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB 3: DELEGATE INTAKE FORM STUDIO
              ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'INTAKE' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#121829] to-[#0a0d16] border border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        Registration &amp; Delegate Intake Form Strategy
                      </h3>
                      <p className="text-[11px] text-neutral-400">
                        Choose how and when delegates provide their delegation, committee preferences, and contact details.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold shrink-0 self-start sm:self-auto">
                    ZEN.FORMS STUDIO
                  </span>
                </div>

                {/* 4 Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setFormTiming('CREATE_NOW_SCRATCH')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 relative ${
                      formTiming === 'CREATE_NOW_SCRATCH'
                        ? 'bg-amber-500/10 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <FilePlus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Create Blank Canvas Form</span>
                      </span>
                      {formTiming === 'CREATE_NOW_SCRATCH' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      Opens an advanced drag-and-drop form canvas builder immediately upon event launch.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormTiming('CREATE_NOW_TEMPLATE')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 relative ${
                      formTiming === 'CREATE_NOW_TEMPLATE'
                        ? 'bg-amber-500/10 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>Use Diplomatic MUN Template</span>
                      </span>
                      {formTiming === 'CREATE_NOW_TEMPLATE' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      Pre-populates with standard 1-line agendas, committee choices, and portfolio preferences.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormTiming('LINK_EXISTING')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 relative ${
                      formTiming === 'LINK_EXISTING'
                        ? 'bg-amber-500/10 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Link Form from Workspace</span>
                      </span>
                      {formTiming === 'LINK_EXISTING' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      Attach an already drafted form or custom application from your workspace.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormTiming('CREATE_AFTER')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 relative ${
                      formTiming === 'CREATE_AFTER'
                        ? 'bg-amber-500/10 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Configure Form Later</span>
                      </span>
                      {formTiming === 'CREATE_AFTER' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      Launch the convening now and create or attach the intake form anytime later.
                    </p>
                  </div>
                </div>

                {/* Dropdown for Existing Form */}
                {formTiming === 'LINK_EXISTING' && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 animate-fade-in">
                    <label className="text-xs font-mono font-bold text-amber-300 block">
                      Select Form from Workspace:
                    </label>
                    <select
                      value={selectedExistingFormId}
                      onChange={(e) => setSelectedExistingFormId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      {existingForms.map((form) => (
                        <option key={form.id} value={form.id}>
                          {form.title} ({form.fields?.length || 0} fields)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* In-Studio Delegate Intake Field Checklist */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Standard Delegate Intake Field Checklist
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Toggle standard questions that will automatically be included in this convening&apos;s registration intake.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300">
                    {intakeFields.filter((f) => f.enabled).length} Enabled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {intakeFields.map((field) => (
                    <div
                      key={field.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                        field.enabled
                          ? 'bg-white/[0.04] border-white/20 text-white'
                          : 'bg-white/[0.01] border-white/5 text-neutral-500 opacity-60'
                      }`}
                    >
                      <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={field.enabled}
                          onChange={(e) =>
                            setIntakeFields((prev) =>
                              prev.map((f) => f.id === field.id ? { ...f, enabled: e.target.checked } : f)
                            )
                          }
                          className="accent-amber-400 cursor-pointer"
                        />
                        <span className="text-xs font-mono truncate">{field.label}</span>
                      </label>

                      {field.enabled && (
                        <button
                          type="button"
                          onClick={() =>
                            setIntakeFields((prev) =>
                              prev.map((f) => f.id === field.id ? { ...f, required: !f.required } : f)
                            )
                          }
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full border transition cursor-pointer ${
                            field.required
                              ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 font-bold'
                              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {field.required ? 'Required' : 'Optional'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Custom Question Builder */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-neutral-300">
                      Custom Application Questions ({customQuestions.length})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCustomQuestions((prev) => [
                          ...prev,
                          {
                            id: `cq_${Date.now()}`,
                            title: 'Do you require accommodation?',
                            type: 'text',
                            required: false
                          }
                        ])
                      }
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-200 text-[10px] font-mono font-semibold transition cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Custom Question</span>
                    </button>
                  </div>

                  {customQuestions.map((q) => (
                    <div key={q.id} className="p-3 rounded-xl bg-neutral-900 border border-white/10 flex items-center gap-2">
                      <input
                        type="text"
                        value={q.title}
                        onChange={(e) =>
                          setCustomQuestions((prev) =>
                            prev.map((item) => item.id === q.id ? { ...item, title: e.target.value } : item)
                          )
                        }
                        placeholder="Question title..."
                        className="flex-1 bg-black/40 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                      <select
                        value={q.type}
                        onChange={(e) =>
                          setCustomQuestions((prev) =>
                            prev.map((item) => item.id === q.id ? { ...item, type: e.target.value as any } : item)
                          )
                        }
                        className="bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-[11px] font-mono text-neutral-300 cursor-pointer"
                      >
                        <option value="text">Short Text</option>
                        <option value="textarea">Paragraph</option>
                        <option value="select">Dropdown</option>
                        <option value="file">File Upload</option>
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setCustomQuestions((prev) =>
                            prev.map((item) => item.id === q.id ? { ...item, required: !item.required } : item)
                          )
                        }
                        className={`text-[9px] font-mono px-2 py-1 rounded-lg border transition cursor-pointer ${
                          q.required ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' : 'bg-white/5 border-white/10 text-neutral-400'
                        }`}
                      >
                        {q.required ? 'Required' : 'Optional'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomQuestions((prev) => prev.filter((item) => item.id !== q.id))}
                        className="p-1 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stepper Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('TICKETS')}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Passes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('AGENDA')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Agenda &amp; Secretariat</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB 4: AGENDA, PROTOCOLS & SECRETARIAT
              ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'AGENDA' && (
            <div className="space-y-5 animate-fade-in">
              {/* Itinerary & Schedule Strategy: Paste Now or Add After */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0c1815] to-[#080d16] border border-emerald-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        Convening Itinerary &amp; Schedule Strategy
                      </h3>
                      <p className="text-[11px] text-neutral-400">
                        Choose whether to paste your itinerary right now or configure it after launching.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shrink-0 self-start sm:self-auto">
                    {itineraryTiming === 'NOW' ? 'PASTE / CONFIGURE NOW' : 'ADD AFTER LAUNCH'}
                  </span>
                </div>

                {/* 2 Choices: Right Now vs After */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setItineraryTiming('NOW')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 relative ${
                      itineraryTiming === 'NOW'
                        ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Paste Itinerary Right Now</span>
                      </span>
                      {itineraryTiming === 'NOW' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      Paste your raw schedule from Docs/WhatsApp or build structured timeline cards immediately.
                    </p>
                  </div>

                  <div
                    onClick={() => setItineraryTiming('AFTER')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 relative ${
                      itineraryTiming === 'AFTER'
                        ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Add Itinerary After Launch</span>
                      </span>
                      {itineraryTiming === 'AFTER' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      Launch your convening now; paste or fine-tune your final session itinerary later from your dashboard.
                    </p>
                  </div>
                </div>

                {/* When ITINERARY_NOW is selected: Paste Text & Interactive Cards */}
                {itineraryTiming === 'NOW' && (
                  <div className="pt-2 space-y-3 animate-fade-in border-t border-white/10">
                    {/* Sub-tab view switch */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => setItineraryViewMode('PASTE')}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                            itineraryViewMode === 'PASTE'
                              ? 'bg-emerald-500 text-black shadow'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <FileText className="w-3 h-3" />
                          <span>Paste Raw Itinerary</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setItineraryViewMode('CARDS')}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                            itineraryViewMode === 'CARDS'
                              ? 'bg-emerald-500 text-black shadow'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>Session Cards ({scheduleItems.length})</span>
                        </button>
                      </div>

                      {itineraryViewMode === 'PASTE' ? (
                        <button
                          type="button"
                          onClick={handleParsePastedItinerary}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Convert to Session Cards</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleAddScheduleSession}
                          className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Session</span>
                        </button>
                      )}
                    </div>

                    {/* Mode A: Paste Raw Itinerary Text */}
                    {itineraryViewMode === 'PASTE' ? (
                      <div className="space-y-2">
                        <textarea
                          rows={6}
                          value={rawItineraryText}
                          onChange={(e) => setRawItineraryText(e.target.value)}
                          placeholder={`Paste your convening itinerary here directly...\n\nExample:\nDay 1:\n09:00 - 10:30 Registration & Dais Accreditation\n10:30 - 12:00 Opening Plenary & Keynote Address\n13:00 - 15:30 Committee Session I: Setting the Agenda\n16:00 - 18:00 Moderated Caucus & Working Papers\n\nDay 2:\n10:00 - 13:00 Draft Resolution Debate & Voting\n14:00 - 16:30 Closing Ceremony & Best Delegate Awards`}
                          className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 font-mono leading-relaxed"
                        />
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                          <span>💡 Paste directly from Google Docs, WhatsApp, or PDF text.</span>
                          <button
                            type="button"
                            onClick={() => {
                              setRawItineraryText(
`Day 1:
09:00 - 10:30 Registration & Dais Accreditation
10:30 - 12:00 Opening Plenary & Keynote Address
13:00 - 15:30 Committee Session I: Procedural Motions & Setting Agenda
16:00 - 18:00 Moderated Caucus & Working Papers

Day 2:
10:00 - 13:00 Draft Resolution Debate & Voting
14:00 - 16:30 Closing Ceremony & Best Delegate Awards`
                              );
                            }}
                            className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                          >
                            Load Sample Itinerary
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Mode B: Structured Session Cards */
                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                        {scheduleItems.map((sess, idx) => (
                          <div
                            key={sess.id}
                            className="p-3 rounded-xl bg-neutral-900 border border-white/10 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                                Session #{idx + 1}
                              </span>
                              <input
                                type="text"
                                value={sess.day}
                                onChange={(e) => handleUpdateScheduleSession(sess.id, 'day', e.target.value)}
                                placeholder="Day 1"
                                className="w-24 bg-black/50 border border-white/15 rounded-lg px-2 py-1 text-[11px] font-mono text-white text-center"
                              />
                              <input
                                type="text"
                                value={sess.time}
                                onChange={(e) => handleUpdateScheduleSession(sess.id, 'time', e.target.value)}
                                placeholder="10:00 - 11:30"
                                className="w-32 bg-black/50 border border-white/15 rounded-lg px-2 py-1 text-[11px] font-mono text-cyan-300 text-center font-bold"
                              />
                              {scheduleItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveScheduleSession(sess.id)}
                                  className="p-1 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={sess.title}
                                onChange={(e) => handleUpdateScheduleSession(sess.id, 'title', e.target.value)}
                                placeholder="Session Title (e.g. Committee Session I)"
                                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-medium"
                              />
                              <input
                                type="text"
                                value={sess.location}
                                onChange={(e) => handleUpdateScheduleSession(sess.id, 'location', e.target.value)}
                                placeholder="Room / Chamber / Hall"
                                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 font-mono"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Secretariat Leadership & Organizing Committee */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Secretariat &amp; Organizing Committee Contacts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-neutral-400">HOST INSTITUTION / SOCIETY</label>
                    <input
                      type="text"
                      value={hostOrganization}
                      onChange={(e) => setHostOrganization(e.target.value)}
                      placeholder="e.g. Zenvitra Youth Diplomatic Society / Cambridge MUN"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-neutral-400">SECRETARY-GENERAL / CONVENOR</label>
                    <input
                      type="text"
                      value={secretaryGeneral}
                      onChange={(e) => setSecretaryGeneral(e.target.value)}
                      placeholder="e.g. Ambassador Yuveer Sharma"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-neutral-400">SECRETARIAT EMAIL</label>
                    <input
                      type="email"
                      value={secretariatEmail}
                      onChange={(e) => setSecretariatEmail(e.target.value)}
                      placeholder="secretariat@zenvitra.xyz"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-neutral-400">ORGANIZER HELPLINE / WHATSAPP</label>
                    <input
                      type="tel"
                      value={secretariatPhone}
                      onChange={(e) => setSecretariatPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Dress Code & Included Delegate Perks */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Shirt className="w-4 h-4 text-emerald-400" />
                      <label className="block text-xs font-mono font-semibold text-neutral-300">
                        OFFICIAL DRESS CODE
                      </label>
                    </div>
                    <select
                      value={dressCode}
                      onChange={(e) => setDressCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      <option value="Western Business Formal (Suits, Ties, Blazers)">Western Business Formal (Suits, Ties, Blazers)</option>
                      <option value="Traditional Diplomatic (National Attire / Kurta Pajama)">Traditional Diplomatic (National Attire / Kurta Pajama)</option>
                      <option value="Smart Business Casual">Smart Business Casual</option>
                      <option value="Informal / Academic Casual">Informal / Academic Casual</option>
                    </select>
                  </div>

                  {/* Included Perks Checkboxes */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <label className="block text-xs font-mono font-semibold text-neutral-300">
                        INCLUDED DELEGATE PERKS &amp; KIT
                      </label>
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {[
                        'Official Verified Certificate of Participation',
                        'Diplomatic Delegate Kit & Country Placard',
                        'Executive High Tea & Working Lunch',
                        'Committee Background Guides & Mentorship',
                        'Cash Awards & Best Delegate Gavels'
                      ].map((perk) => (
                        <label key={perk} className="flex items-center gap-2 text-xs font-mono text-neutral-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPerks.includes(perk)}
                            onChange={() => togglePerk(perk)}
                            className="accent-emerald-400 cursor-pointer"
                          />
                          <span className="truncate">{perk}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mandate & Overview Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-neutral-300">
                  MANDATE, COMMITTEE AGENDAS &amp; CODE OF CONDUCT
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context, committee agendas, rules of procedure (UN4MUN / HMUN / Lok Sabha), and delegate code of conduct..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 resize-none font-sans"
                />
              </div>

              {/* Stepper Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('INTAKE')}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Intake Form</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ARTWORK')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Artwork &amp; Launch</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB 5: ARTWORK, BRANDING & LIVE LAUNCH PREVIEW
              ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'ARTWORK' && (
            <div className="space-y-5 animate-fade-in">
              {/* Cover Artwork Banner */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-semibold text-neutral-300">
                    COVER ARTWORK BANNER (16:9)
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Device Image</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="grid grid-cols-4 gap-2">
                  {COVER_PRESETS.map((preset, i) => (
                    <div
                      key={i}
                      onClick={() => { setCoverImage(preset); setCustomCover(''); }}
                      className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                        coverImage === preset && !customCover ? 'border-cyan-400 scale-95 shadow-[0_0_15px_rgba(0,242,254,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                {/* Custom / Active Artwork Preview & Re-Adjust Trigger */}
                <div className="space-y-2">
                  <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-20 h-12 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-black">
                        <img
                          src={customCover || coverImage}
                          alt="Current Cover"
                          className="w-full h-full"
                          style={{ objectFit: artworkFit, objectPosition: artworkPosition }}
                        />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-bold text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{customCover ? 'Custom Artwork Active' : 'Preset Artwork Active'}</span>
                        </p>
                        <p className="text-[10px] font-mono text-neutral-400 truncate">
                          Alignment: {artworkPosition.toUpperCase()} &bull; Fit: {artworkFit.toUpperCase()} &bull; Scale: {artworkZoom}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPendingArtwork(customCover || coverImage);
                          setIsArtworkModalOpen(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Adjust Artwork</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{customCover ? 'Change' : 'Upload Device Image'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags & Keywords */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-semibold text-neutral-300">
                    TAGS &amp; DISCOVERABILITY KEYWORDS
                  </label>
                  <span className="text-[10px] font-mono text-neutral-400">Comma separated</span>
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. summit, mun, diplomacy, un, geopolitics"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {['+ Diplomatic', '+ MUN', '+ Youth Parliament', '+ Policy', '+ Global Affairs', '+ Leadership'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const cleanTag = tag.replace('+', '').trim().toLowerCase();
                        if (!tagInput.includes(cleanTag)) {
                          setTagInput(tagInput ? `${tagInput}, ${cleanTag}` : cleanTag);
                        }
                      }}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-neutral-300 hover:text-white transition cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── LIVE LAUNCH MONOLITH PREVIEW CARD ── */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0e1626] to-[#080d16] border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Live Public Card Preview</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">Delegates will see this card</span>
                </div>

                <div className="rounded-2xl border border-white/15 overflow-hidden bg-black/60 shadow-xl">
                  <div className="relative aspect-[21/9] w-full overflow-hidden bg-black">
                    <img
                      src={customCover || coverImage}
                      alt="Preview"
                      className="w-full h-full"
                      style={{ objectFit: artworkFit, objectPosition: artworkPosition }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/30 border border-cyan-400/50 text-[10px] font-mono font-bold text-cyan-200 uppercase">
                          {category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/60 border border-white/20 text-[10px] font-mono text-white">
                          {type.toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-widest">
                          {hostOrganization || 'ZENVITRA CONVENING'}
                        </p>
                        <h4 className="text-base font-display font-black text-white truncate">
                          {title.trim() || 'Your Summit Title Here'}
                        </h4>
                        <p className="text-xs text-neutral-300 font-mono truncate">
                          {date || 'Date Pending'} &bull; {startTime} - {endTime} &bull; {isVirtual ? 'Virtual Digital Chamber' : (location || city)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-950 flex items-center justify-between border-t border-white/10 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">Entry:</span>
                      <span className="text-amber-300 font-bold">
                        {pricingMode === 'FREE' ? 'FREE PASS' : pricingMode === 'NORMAL' ? `₹${ticketPrice}` : `From ₹${eventTiers[0]?.price ?? 499}`}
                      </span>
                      {pricingMode === 'TIERED' && eventTiers[0]?.exclusiveOfferEnabled && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                          {eventTiers[0].badgeText || 'CARD OFFER'}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-cyan-400 font-bold">Registration Ready</span>
                  </div>
                </div>
              </div>

              {/* Stepper Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('AGENDA')}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Agenda</span>
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              PERSISTENT BOTTOM ACTION BAR ACROSS ALL TABS
              ════════════════════════════════════════════════════════════════ */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="text-[11px] font-mono text-neutral-400 hidden sm:flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${title && date ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{title && date ? 'Convening ready to deploy' : 'Fill Title & Date in Logistics to Launch'}</span>
            </div>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="px-4 py-2.5 rounded-2xl border border-white/10 font-mono text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 hover:from-cyan-300 hover:to-amber-200 text-black font-display font-black text-xs uppercase tracking-wider transition shadow-[0_0_30px_rgba(6,182,212,0.35)] cursor-pointer flex items-center gap-2 active:scale-98"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Launch Convening</span>
              </button>
            </div>
          </div>
        </form>

        {/* Google Maps API World Location Picker Modal */}
        <WorldLocationPickerModal
          isOpen={isLocationPickerOpen}
          onClose={() => setIsLocationPickerOpen(false)}
          title="Select Physical Convening Venue (Google Maps API)"
          initialLocation={location}
          onSelectLocation={(loc: WorldLocation) => {
            const locName = loc.name + (loc.address ? `, ${loc.address}` : '');
            setLocation(locName);
            setPlacesQuery(loc.name);
            if (loc.city) setCity(loc.city);
            if (loc.lat && loc.lng) {
              setSelectedCoordinates({ lat: loc.lat, lng: loc.lng });
            }
            setIsLocationPickerOpen(false);
          }}
        />
      </div>
    </div>
  );
}
