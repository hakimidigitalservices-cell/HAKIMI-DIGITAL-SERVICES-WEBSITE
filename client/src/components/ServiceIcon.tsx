import {
  Building2,
  UtensilsCrossed,
  Receipt,
  Store,
  Briefcase,
  BadgeCheck,
  Globe,
  PenTool,
  CreditCard,
  FileText,
  ShieldCheck,
  Eye,
  Headphones,
  MonitorSmartphone,
  FileCheck2,
  Landmark,
  ClipboardCheck,
  FileSignature,
  Stamp,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  UtensilsCrossed,
  Receipt,
  Store,
  Briefcase,
  BadgeCheck,
  Globe,
  PenTool,
  CreditCard,
  FileText,
  ShieldCheck,
  Eye,
  Headphones,
  MonitorSmartphone,
  FileCheck2,
  Landmark,
  ClipboardCheck,
  FileSignature,
  Stamp,
};

export default function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? FileText;
  return <Icon className={className} />;
}
