import type { LucideIcon, LucideProps } from "lucide-react";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  BookOpen,
  BookText,
  Box,
  BrainCircuit,
  BriefcaseBusiness,
  Bug,
  Building2,
  Calendar,
  CalendarCheck,
  ClipboardCheck,
  ClipboardList,
  CloudCog,
  Code2,
  Compass,
  Cookie,
  Database,
  Eye,
  Factory,
  FileCheck2,
  FileClock,
  FileLock,
  FileText,
  FileWarning,
  Filter,
  Globe,
  HeartHandshake,
  HeartPulse,
  KeyRound,
  Landmark,
  Layers,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  ListFilter,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  Monitor,
  MonitorDot,
  Network,
  PackageCheck,
  Phone,
  PlayCircle,
  PlugZap,
  Radar,
  RefreshCw,
  Rocket,
  Route,
  ScanSearch,
  ScrollText,
  SearchCheck,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  ShieldUser,
  ShoppingCart,
  SlidersHorizontal,
  Target,
  Ticket,
  UploadCloud,
  User,
  UserCheck,
  Video,
  Wrench,
  Workflow,
} from "lucide-react";

export type MarketingIconName =
  | "ai-pentester"
  | "ai-supported"
  | "continuous-validation"
  | "security-workflow"
  | "enterprise-governance"
  | "stale-reports"
  | "attack-paths"
  | "evidence-action"
  | "discover"
  | "prioritise"
  | "remediate"
  | "real-time"
  | "business-context"
  | "secure-compliant"
  | "actionable-insights"
  | "scanner-noise"
  | "false-positives"
  | "risk-exposure"
  | "ingest"
  | "manual-uploads"
  | "analyse"
  | "validate"
  | "evidence"
  | "approval"
  | "sync"
  | "launch"
  | "live-monitor"
  | "vulnerability-report"
  | "application-configuration"
  | "classic-scans"
  | "network-scans"
  | "webapp-scanner"
  | "knowledge-hub"
  | "clients-agents"
  | "admin-rbac"
  | "reports-analytics"
  | "audit-logs"
  | "data-protection"
  | "tenant-isolation"
  | "session-csrf"
  | "safe-sandbox"
  | "compliance"
  | "policy-restrictions"
  | "human-accountability"
  | "sanitisation"
  | "security-signals"
  | "jira-itsm"
  | "siem"
  | "team-chat"
  | "dashboards"
  | "documentation"
  | "guides"
  | "api-reference"
  | "webinars"
  | "whitepaper"
  | "webinar-recording"
  | "release-notes"
  | "blog-insights"
  | "company-mission"
  | "vision"
  | "values"
  | "company-future"
  | "human-expertise"
  | "security-culture"
  | "trusted-platform"
  | "platform-modules"
  | "admin-access-layers"
  | "integration-categories"
  | "service-management"
  | "validation-visibility"
  | "parser"
  | "weakness-identifier"
  | "knowledge-lookup"
  | "script-generator"
  | "sandbox-executor"
  | "report-generator"
  | "script-validator"
  | "contact-email"
  | "contact-phone"
  | "contact-location"
  | "contact-name"
  | "contact-company"
  | "contact-message"
  | "schedule-call"
  | "show-workflow"
  | "next-steps"
  | "pricing-launch"
  | "enterprise-programmes"
  | "partners"
  | "secure-platform"
  | "identity-access"
  | "monitoring-audit"
  | "secure-development"
  | "infrastructure-security"
  | "data-security"
  | "application-security"
  | "ai-validation-safety"
  | "vulnerability-disclosure"
  | "customer-data-ownership"
  | "technology"
  | "financial-services"
  | "healthcare"
  | "retail"
  | "manufacturing"
  | "government";

export const marketingIconMap: Record<MarketingIconName, LucideIcon> = {
  "ai-pentester": BrainCircuit,
  "ai-supported": BrainCircuit,
  "continuous-validation": ShieldCheck,
  "security-workflow": Workflow,
  "enterprise-governance": ClipboardCheck,
  "stale-reports": FileClock,
  "attack-paths": Route,
  "evidence-action": FileCheck2,
  discover: Compass,
  prioritise: Target,
  remediate: Wrench,
  "real-time": Activity,
  "business-context": BarChart3,
  "secure-compliant": LockKeyhole,
  "actionable-insights": BarChart3,
  "scanner-noise": ListFilter,
  "false-positives": ShieldAlert,
  "risk-exposure": ShieldAlert,
  ingest: Database,
  "manual-uploads": UploadCloud,
  analyse: SearchCheck,
  validate: ShieldCheck,
  evidence: FileCheck2,
  approval: UserCheck,
  sync: RefreshCw,
  launch: Rocket,
  "live-monitor": Activity,
  "vulnerability-report": FileWarning,
  "application-configuration": SlidersHorizontal,
  "classic-scans": ScanSearch,
  "network-scans": Network,
  "webapp-scanner": Globe,
  "knowledge-hub": BookOpen,
  "clients-agents": ServerCog,
  "admin-rbac": ShieldUser,
  "reports-analytics": BarChart3,
  "audit-logs": ScrollText,
  "data-protection": LockKeyhole,
  "tenant-isolation": Layers,
  "session-csrf": Cookie,
  "safe-sandbox": PackageCheck,
  compliance: BadgeCheck,
  "policy-restrictions": FileLock,
  "human-accountability": UserCheck,
  sanitisation: Filter,
  "security-signals": Radar,
  "jira-itsm": Ticket,
  siem: MonitorDot,
  "team-chat": MessageSquare,
  dashboards: LayoutDashboard,
  documentation: FileText,
  guides: ClipboardList,
  "api-reference": Code2,
  webinars: Video,
  whitepaper: BookText,
  "webinar-recording": PlayCircle,
  "release-notes": FileClock,
  "blog-insights": Lightbulb,
  "company-mission": Target,
  vision: Eye,
  values: HeartHandshake,
  "company-future": Rocket,
  "human-expertise": UserCheck,
  "security-culture": ShieldCheck,
  "trusted-platform": BadgeCheck,
  "platform-modules": Layers,
  "admin-access-layers": ShieldUser,
  "integration-categories": PlugZap,
  "service-management": Ticket,
  "validation-visibility": Activity,
  parser: FileText,
  "weakness-identifier": Bug,
  "knowledge-lookup": BookOpen,
  "script-generator": Code2,
  "sandbox-executor": Box,
  "report-generator": FileCheck2,
  "script-validator": ShieldCheck,
  "contact-email": Mail,
  "contact-phone": Phone,
  "contact-location": MapPin,
  "contact-name": User,
  "contact-company": Building2,
  "contact-message": MessageSquare,
  "schedule-call": Calendar,
  "show-workflow": Monitor,
  "next-steps": ListChecks,
  "pricing-launch": CalendarCheck,
  "enterprise-programmes": Building2,
  partners: BriefcaseBusiness,
  "secure-platform": ShieldCheck,
  "identity-access": KeyRound,
  "monitoring-audit": ScrollText,
  "secure-development": Code2,
  "infrastructure-security": CloudCog,
  "data-security": Database,
  "application-security": Code2,
  "ai-validation-safety": BrainCircuit,
  "vulnerability-disclosure": ShieldAlert,
  "customer-data-ownership": FileLock,
  technology: Code2,
  "financial-services": Landmark,
  healthcare: HeartPulse,
  retail: ShoppingCart,
  manufacturing: Factory,
  government: Building2,
};

type MarketingIconProps = Omit<LucideProps, "ref"> & {
  name: MarketingIconName;
};

export function MarketingIcon({ name, className, strokeWidth = 2, ...props }: MarketingIconProps) {
  const Icon = marketingIconMap[name];

  return <Icon aria-hidden="true" className={className} strokeWidth={strokeWidth} {...props} />;
}
