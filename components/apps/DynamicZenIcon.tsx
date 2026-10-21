'use client';

import React from 'react';
import {
  MessageSquare,
  Video,
  PhoneCall,
  Bell,
  Radio,
  Film,
  PenTool,
  User,
  MessageCircle,
  Globe,
  ShieldCheck,
  Trophy,
  Building2,
  FileSpreadsheet,
  MessageSquareText,
  Sliders,
  CreditCard,
  Scale,
  BookOpen,
  Sheet,
  ShieldAlert,
  Crown,
  Lock,
  Search,
  Settings,
  Shield,
  Layers,
  Sparkles,
  HelpCircle,
  Users,
  Award,
  Gavel,
  Clock,
  CheckCircle2,
  Database,
  FileText
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

const ICON_MAP: Record<string, React.ElementType> = {
  MessageSquare,
  Video,
  PhoneCall,
  Bell,
  Radio,
  Film,
  PenTool,
  User,
  MessageCircle,
  Globe,
  ShieldCheck,
  Trophy,
  Building2,
  FileSpreadsheet,
  MessageSquareText,
  Sliders,
  CreditCard,
  Scale,
  BookOpen,
  Sheet,
  ShieldAlert,
  Crown,
  Lock,
  Search,
  Settings,
  Shield,
  Layers,
  Sparkles,
  Users,
  Award,
  Gavel,
  Clock,
  CheckCircle2,
  Database,
  FileText
};

export function DynamicZenIcon({ name, className = 'w-4 h-4', style }: DynamicIconProps) {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent className={className} style={style} />;
}
