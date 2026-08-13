"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  Bot,
  Braces,
  BrainCircuit,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Code2,
  Copy,
  CreditCard,
  Database,
  Download,
  Eye,
  FileText,
  Filter,
  Gauge,
  Globe2,
  Info,
  LayoutDashboard,
  Layers3,
  LockKeyhole,
  LogOut,
  MapPin,
  MonitorCog,
  MoreVertical,
  Network,
  Play,
  Plus,
  Router,
  ScanLine,
  ScanSearch,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Target,
  Terminal,
  TrendingUp,
  Users,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { useLoadingRouter } from "@/components/loading/PageLoadingProvider";
import { AccessDenied } from "@/components/errors/AccessDenied";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getAuthenticationActivity,
  logout,
  type AuthenticationActivityResponse,
  type PermissionAction,
} from "@/lib/auth-api";
import { clearAuthSession, getAccessToken, getRefreshToken } from "@/lib/auth-session";
import TeamWorkspace from "@/components/team/TeamWorkspace";
import AddTeamMember from "@/components/team/AddTeamMember";
import AssetWorkspace from "@/components/assets/AssetWorkspace";
import ScannerWorkspace from "@/components/scans/ScannerWorkspace";
import FindingsWorkspace from "@/components/findings/FindingsWorkspace";
import ReportsWorkspace from "@/components/reports/ReportsWorkspace";
import OverviewWorkspace from "@/components/overview/OverviewWorkspace";
import NotificationsWorkspace from "@/components/notifications/NotificationsWorkspace";
import ActivityLogWorkspace from "@/components/activity/ActivityLogWorkspace";
import HeaderCommandCenter from "@/components/header/HeaderCommandCenter";
import GuideButton from "@/components/guides/GuideButton";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { guideForSection } from "@/data/workspace-guides";

type DashboardSection = "overview" | "asset-management" | "scanner-engine" | "findings" | "reports" | "ai-pentester" | "noc-agent" | "activity-log" | "notifications" | "billing-cost" | "team";

type NocAgentRow = {
  id: string;
  name: string;
  site: string;
  network: string;
  os: string;
  version: string;
  status: "Online" | "Warning" | "Offline";
  heartbeat: string;
  devices: number;
  Icon: typeof LayoutDashboard;
  tone: string;
};

type NocDeviceRow = {
  id: string;
  name: string;
  ip: string;
  type: string;
  vendor: string;
  status: "Monitored" | "Discovered" | "Offline";
  risk: "Low" | "Medium" | "High" | "Critical";
  agent: string;
  lastScan: string;
  monitored: boolean;
  Icon: typeof LayoutDashboard;
  tone: string;
};

type NavChildItem = {
  label: string;
  Icon: typeof LayoutDashboard;
  href: string;
};

type NavItem = {
  id: DashboardSection;
  label: string;
  Icon: typeof LayoutDashboard;
  href?: string;
  children?: NavChildItem[];
};

const aiPentesterNavItems: NavChildItem[] = [
  { label: "Ad Hoc Dashboard", Icon: LayoutDashboard, href: "/ai-pentester/dashboard" },
  { label: "Launch Scan", Icon: Zap, href: "/ai-pentester/launch-scan" },
  { label: "Pipeline", Icon: Layers3, href: "/ai-pentester/pipeline" },
  { label: "CVE Vulnerabilities", Icon: ShieldAlert, href: "/ai-pentester/vulnerabilities" },
  { label: "Knowledge Hub", Icon: Database, href: "/ai-pentester/knowledge-hub" },
  { label: "AI Pentest Reports", Icon: FileText, href: "/ai-pentester/reports" },
];

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard, href: "/dashboard" },
  { id: "asset-management", label: "Asset Management", Icon: Target, href: "/assets" },
  { id: "scanner-engine", label: "Scanner Engine", Icon: ScanLine, href: "/scans" },
  { id: "findings", label: "Findings", Icon: ShieldAlert, href: "/findings" },
  { id: "reports", label: "VAPT Reports", Icon: FileText, href: "/reports" },
  { id: "ai-pentester", label: "AI Pentester", Icon: BrainCircuit, href: "/ai-pentester", children: aiPentesterNavItems },
  { id: "noc-agent", label: "Network Agent", Icon: Bot, href: "/network-agent" },
  { id: "activity-log", label: "Activity Log", Icon: Activity, href: "/activity-log" },
  { id: "billing-cost", label: "Billing & Cost", Icon: BadgeDollarSign, href: "/billing" },
  { id: "team", label: "Team", Icon: Users, href: "/team" },
];

const sectionModules: Record<DashboardSection, string> = {
  overview: "dashboard",
  "asset-management": "assets",
  "scanner-engine": "scans",
  findings: "findings",
  reports: "reports",
  "ai-pentester": "ai_pentester",
  "noc-agent": "network_agent",
  "activity-log": "activity_log",
  notifications: "notifications",
  "billing-cost": "billing_usage",
  team: "team_rbac",
};

function moduleForPath(pathname: string) {
  if (pathname.startsWith("/team")) return "team_rbac";
  if (pathname.startsWith("/billing")) return "billing_usage";
  if (pathname.startsWith("/assets")) return "assets";
  if (pathname.startsWith("/scans")) return "scans";
  if (pathname.startsWith("/findings")) return "findings";
  if (pathname.startsWith("/reports")) return "reports";
  if (pathname.startsWith("/network-agent")) return "network_agent";
  if (pathname.startsWith("/activity-log")) return "activity_log";
  if (pathname.startsWith("/notifications")) return "notifications";
  if (pathname.startsWith("/ai-pentester/knowledge-hub")) return "knowledge_base";
  if (pathname.startsWith("/ai-pentester")) return "ai_pentester";
  return "dashboard";
}

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const nocMetrics = [
  { label: "Agents online", value: "1 / 3", helper: "one warning", Icon: Wifi, tone: "emerald" },
  { label: "Devices discovered", value: "42", helper: "last sync", Icon: Network, tone: "cyan" },
  { label: "Monitored devices", value: "18 / 25", helper: "7 left", Icon: MonitorCog, tone: "blue" },
  { label: "Open alerts", value: "3", helper: "needs review", Icon: AlertTriangle, tone: "rose" },
  { label: "Quota used", value: "72%", helper: "Pro plan", Icon: Gauge, tone: "orange" },
];

const nocAgents: NocAgentRow[] = [
  {
    id: "agent-001",
    name: "EVADA-WIN-AGENT-01",
    site: "Head Office",
    network: "192.168.1.0/24",
    os: "Windows Server",
    version: "v1.0.0",
    status: "Online",
    heartbeat: "32 sec ago",
    devices: 18,
    Icon: MonitorCog,
    tone: "emerald",
  },
  {
    id: "agent-002",
    name: "EVADA-LINUX-DMZ-01",
    site: "DMZ Segment",
    network: "10.0.2.0/24",
    os: "Ubuntu",
    version: "v1.0.0",
    status: "Warning",
    heartbeat: "9 min ago",
    devices: 11,
    Icon: Server,
    tone: "amber",
  },
  {
    id: "agent-003",
    name: "EVADA-BRANCH-AGENT-01",
    site: "Branch Office",
    network: "172.16.4.0/24",
    os: "Windows",
    version: "v0.9.8",
    status: "Offline",
    heartbeat: "2 hr ago",
    devices: 13,
    Icon: WifiOff,
    tone: "rose",
  },
];

const nocDevices: NocDeviceRow[] = [
  {
    id: "device-001",
    name: "Core Firewall",
    ip: "192.168.1.1",
    type: "Firewall",
    vendor: "Fortinet",
    status: "Monitored",
    risk: "High",
    agent: "EVADA-WIN-AGENT-01",
    lastScan: "Jul 20, 2026",
    monitored: true,
    Icon: Shield,
    tone: "rose",
  },
  {
    id: "device-002",
    name: "Domain Controller",
    ip: "192.168.1.10",
    type: "Windows Server",
    vendor: "Microsoft",
    status: "Monitored",
    risk: "Medium",
    agent: "EVADA-WIN-AGENT-01",
    lastScan: "Jul 20, 2026",
    monitored: true,
    Icon: Server,
    tone: "blue",
  },
  {
    id: "device-003",
    name: "Edge Router",
    ip: "192.168.1.254",
    type: "Router",
    vendor: "Cisco",
    status: "Monitored",
    risk: "Critical",
    agent: "EVADA-WIN-AGENT-01",
    lastScan: "Jul 19, 2026",
    monitored: true,
    Icon: Router,
    tone: "rose",
  },
  {
    id: "device-004",
    name: "Backup NAS",
    ip: "192.168.1.42",
    type: "Storage",
    vendor: "Synology",
    status: "Discovered",
    risk: "Low",
    agent: "EVADA-WIN-AGENT-01",
    lastScan: "Not monitored",
    monitored: false,
    Icon: Database,
    tone: "cyan",
  },
  {
    id: "device-005",
    name: "DMZ Web Node",
    ip: "10.0.2.24",
    type: "Linux Server",
    vendor: "Ubuntu",
    status: "Monitored",
    risk: "High",
    agent: "EVADA-LINUX-DMZ-01",
    lastScan: "Jul 19, 2026",
    monitored: true,
    Icon: Server,
    tone: "orange",
  },
  {
    id: "device-006",
    name: "Branch Switch",
    ip: "172.16.4.2",
    type: "Switch",
    vendor: "HPE Aruba",
    status: "Offline",
    risk: "Medium",
    agent: "EVADA-BRANCH-AGENT-01",
    lastScan: "Jul 18, 2026",
    monitored: true,
    Icon: Network,
    tone: "amber",
  },
];

const nocSetupSteps = [
  { label: "Secure setup", helper: "Outbound HTTPS only, no inbound firewall rule.", Icon: ShieldCheck },
  { label: "Site details", helper: "Name the site, agent, network range, and environment.", Icon: MapPin },
  { label: "Choose OS", helper: "Download Windows .exe now; Linux packages can follow.", Icon: MonitorCog },
  { label: "Enrollment token", helper: "One-time token expires in 30 minutes.", Icon: LockKeyhole },
  { label: "Download agent", helper: "Install with token and verify the first heartbeat.", Icon: Download },
];

const nocOsOptions = [
  { label: "Windows .exe", helper: "Recommended for first client demo", Icon: MonitorCog },
  { label: "Linux .deb", helper: "Ubuntu and Debian collector", Icon: Server },
  { label: "Linux .rpm", helper: "RHEL, Rocky, AlmaLinux", Icon: Server },
];

const reportMetrics = [
  { label: "Total reports", value: "18", helper: "this cycle", Icon: FileText, tone: "blue" },
  { label: "Draft reports", value: "4", helper: "editing", Icon: CalendarClock, tone: "amber" },
  { label: "Ready to share", value: "7", helper: "approved", Icon: ShieldCheck, tone: "emerald" },
  { label: "Downloads", value: "31", helper: "client files", Icon: Download, tone: "cyan" },
  { label: "Pending approval", value: "3", helper: "review", Icon: AlertTriangle, tone: "rose" },
];

const reportBuilderSteps = [
  { label: "Scope", value: "Web/API + Network + AI evidence", helper: "Assets, scans, and findings", Icon: Layers3, tone: "cyan" },
  { label: "Date range", value: "Last 30 days", helper: "Jul 01 - Jul 30", Icon: CalendarClock, tone: "blue" },
  { label: "Report type", value: "Technical VAPT", helper: "Executive + technical sections", Icon: FileText, tone: "emerald" },
  { label: "Format", value: "PDF, DOCX, HTML", helper: "Client-ready exports", Icon: Download, tone: "orange" },
];

const reportRows = [
  {
    name: "July Web/API VAPT Report",
    type: "Technical VAPT",
    scope: "6 Web/API assets",
    findings: { critical: 8, high: 16, medium: 24 },
    status: "Ready",
    owner: "Dipak Kumar",
    updated: "Jul 20, 2026",
    Icon: Globe2,
    tone: "cyan",
  },
  {
    name: "Network Device Exposure Summary",
    type: "Network report",
    scope: "18 Network devices",
    findings: { critical: 3, high: 9, medium: 15 },
    status: "Draft",
    owner: "Infrastructure",
    updated: "Jul 19, 2026",
    Icon: Bot,
    tone: "emerald",
  },
  {
    name: "AI Pentest Evidence Pack",
    type: "AI Pentest",
    scope: "Pipeline evidence",
    findings: { critical: 5, high: 11, medium: 19 },
    status: "Needs review",
    owner: "AI Pentester",
    updated: "Jul 18, 2026",
    Icon: BrainCircuit,
    tone: "violet",
  },
  {
    name: "Executive Risk Summary",
    type: "Executive",
    scope: "Workspace overview",
    findings: { critical: 8, high: 20, medium: 31 },
    status: "Shared",
    owner: "Security",
    updated: "Jul 17, 2026",
    Icon: Gauge,
    tone: "blue",
  },
];

const reportTemplates = [
  { name: "Executive Summary", description: "Board-friendly risk posture and priorities.", sections: "8 sections", Icon: Gauge, tone: "blue" },
  { name: "Technical VAPT Report", description: "Detailed findings, evidence, impact, and remediation.", sections: "14 sections", Icon: FileText, tone: "emerald" },
  { name: "Compliance Evidence", description: "Audit-ready exports for controls and closure proof.", sections: "10 sections", Icon: ShieldCheck, tone: "cyan" },
  { name: "AI Pentest Report", description: "AI pipeline output with exploitation evidence.", sections: "12 sections", Icon: BrainCircuit, tone: "violet" },
  { name: "Remediation Plan", description: "Fix ownership, priority, and client handoff plan.", sections: "9 sections", Icon: CheckCircle2, tone: "orange" },
];

const reportReadiness = [
  { label: "Branding", value: "Ready", helper: "EVADA cover and footer", tone: "emerald" },
  { label: "Evidence", value: "42 items", helper: "Screenshots and scan output", tone: "blue" },
  { label: "Critical findings", value: "8", helper: "Requires approval", tone: "rose" },
  { label: "Remediation notes", value: "Pending", helper: "3 findings need owner text", tone: "amber" },
];

const aiAdHocMetrics = [
  { label: "Ad hoc jobs", value: "18", helper: "4 active", Icon: BrainCircuit, tone: "violet" },
  { label: "CVEs parsed", value: "633", helper: "from JSON", Icon: ShieldAlert, tone: "rose" },
  { label: "KB script hits", value: "450", helper: "71% coverage", Icon: Database, tone: "emerald" },
  { label: "AI scripts", value: "183", helper: "generated", Icon: Code2, tone: "cyan" },
  { label: "Confirmed vulnerable", value: "19", helper: "sandbox proof", Icon: CheckCircle2, tone: "orange" },
];

const aiPipelineStages = [
  { label: "JSON ingest", value: "12 jobs", helper: "scan files normalized", percent: 100, Icon: Braces, tone: "blue" },
  { label: "CVE normalize", value: "633 CVEs", helper: "dedupe + CVSS mapped", percent: 96, Icon: ShieldAlert, tone: "rose" },
  { label: "KB match", value: "450 hits", helper: "known scripts found", percent: 71, Icon: Database, tone: "emerald" },
  { label: "AI script", value: "183 built", helper: "missing scripts drafted", percent: 54, Icon: BrainCircuit, tone: "violet" },
  { label: "Sandbox test", value: "61 runs", helper: "safe validation", percent: 38, Icon: Terminal, tone: "cyan" },
  { label: "Evidence", value: "42 items", helper: "proof attached", percent: 31, Icon: FileText, tone: "orange" },
  { label: "Report", value: "9 ready", helper: "client packets", percent: 28, Icon: Download, tone: "emerald" },
];

const aiValidationFunnel = [
  { label: "CVEs parsed", value: 633, color: "bg-[#16A86E]", percent: 100 },
  { label: "KB scripts matched", value: 450, color: "bg-[#16A86E]", percent: 71 },
  { label: "AI scripts generated", value: 183, color: "bg-[#16A86E]", percent: 29 },
  { label: "Sandbox validated", value: 61, color: "bg-[#16A86E]", percent: 10 },
  { label: "Confirmed vulnerable", value: 19, color: "bg-[#16A86E]", percent: 3 },
  { label: "Manual review", value: 8, color: "bg-[#16A86E]", percent: 1 },
];

const aiSeverityDistribution = [
  { label: "Critical", value: 24, color: "bg-[#16A86E]", percent: 4 },
  { label: "High", value: 78, color: "bg-[#16A86E]", percent: 12 },
  { label: "Medium", value: 227, color: "bg-[#16A86E]", percent: 36 },
  { label: "Low", value: 105, color: "bg-[#16A86E]", percent: 17 },
  { label: "Info", value: 199, color: "bg-[#16A86E]", percent: 31 },
];

const aiActiveRun = {
  name: "Acunetix JSON - polosofttech.com",
  source: "File upload",
  target: "https://www.polosofttech.com",
  status: "Sandbox validation running",
  progress: 72,
  currentStep: "AI script revision attempt 2 / 3",
  report: "Draft preparing",
};

const aiValidationQueue = [
  {
    cve: "CVE-2024-1234",
    title: "SQL Injection in login module",
    severity: "Critical",
    target: "https://testphp.vulnweb.com",
    source: "KB Script",
    attempt: "1 / 3",
    status: "Validated",
    verdict: "Vulnerable",
    tone: "rose",
  },
  {
    cve: "CVE-2022-22963",
    title: "XML external entity injection",
    severity: "Critical",
    target: "https://api.evada.ai",
    source: "AI Generated",
    attempt: "3 / 3",
    status: "Failed",
    verdict: "Manual Review",
    tone: "amber",
  },
  {
    cve: "CVE-2021-44228",
    title: "Log4Shell exposure check",
    severity: "High",
    target: "app.evada.ai",
    source: "KB Script",
    attempt: "1 / 3",
    status: "Validated",
    verdict: "Not Vulnerable",
    tone: "emerald",
  },
  {
    cve: "CVE-2024-5678",
    title: "Command injection in upload API",
    severity: "Critical",
    target: "https://api.client.com",
    source: "AI Generated",
    attempt: "2 / 3",
    status: "Running",
    verdict: "Testing",
    tone: "cyan",
  },
  {
    cve: "CVE-2023-12345",
    title: "SSRF via URL parameter",
    severity: "High",
    target: "https://partners.evada.ai",
    source: "AI Generated",
    attempt: "1 / 3",
    status: "Queued",
    verdict: "Pending",
    tone: "blue",
  },
];

const aiRecentRuns = [
  { job: "AI-ADHOC-2026-0719", target: "polosofttech.com", cves: 87, vulnerable: 6, status: "Report Ready", started: "Jul 19, 2026", tone: "emerald" },
  { job: "AI-ADHOC-2026-0718", target: "api.evada.ai", cves: 64, vulnerable: 4, status: "Validating", started: "Jul 18, 2026", tone: "cyan" },
  { job: "AI-ADHOC-2026-0717", target: "client portal", cves: 112, vulnerable: 9, status: "Manual Review", started: "Jul 17, 2026", tone: "amber" },
  { job: "AI-ADHOC-2026-0716", target: "staging web", cves: 39, vulnerable: 0, status: "Closed", started: "Jul 16, 2026", tone: "slate" },
];

const aiEngineHealth = [
  { label: "Sandbox", value: "Available", helper: "isolated runner online", tone: "emerald" },
  { label: "LLM fallback", value: "Configured", helper: "script generation ready", tone: "blue" },
  { label: "KB coverage", value: "71%", helper: "450 of 633 CVEs matched", tone: "emerald" },
  { label: "Report readiness", value: "84%", helper: "evidence pack almost ready", tone: "cyan" },
];

const aiActivityTimeline = [
  { label: "JSON uploaded", detail: "Acunetix scanner output accepted", time: "09:42", Icon: Braces, tone: "blue" },
  { label: "633 CVEs parsed", detail: "Noise removed and CVSS normalized", time: "09:48", Icon: ShieldAlert, tone: "rose" },
  { label: "450 scripts matched", detail: "Knowledge Hub returned reusable checks", time: "09:56", Icon: Database, tone: "emerald" },
  { label: "183 scripts generated", detail: "AI created missing validation scripts", time: "10:08", Icon: BrainCircuit, tone: "violet" },
  { label: "Sandbox validating", detail: "61 scripts executed in isolated runner", time: "10:16", Icon: Terminal, tone: "cyan" },
  { label: "Report draft preparing", detail: "Evidence and remediation notes assembled", time: "10:24", Icon: FileText, tone: "orange" },
];

const aiLaunchSources = [
  { id: "json", label: "JSON File Upload", helper: "Acunetix, Nessus, ZAP, Burp, custom JSON", Icon: FileText, tone: "blue", enabled: true },
  { id: "api", label: "API Endpoint", helper: "Pull findings from scanner API later", Icon: Braces, tone: "cyan", enabled: false },
  { id: "webhook", label: "Webhook", helper: "Receive scanner output after backend setup", Icon: Zap, tone: "violet", enabled: false },
  { id: "storage", label: "Blob / S3", helper: "Cloud storage import can connect later", Icon: Database, tone: "orange", enabled: false },
];

const aiLaunchFormats = ["Acunetix", "Nessus", "OWASP ZAP", "Burp Suite", "Qualys", "Custom JSON"];

const aiLaunchFlow = [
  { label: "Upload JSON", Icon: Braces, tone: "blue" },
  { label: "Normalize CVEs", Icon: ShieldAlert, tone: "rose" },
  { label: "KB match", Icon: Database, tone: "emerald" },
  { label: "AI scripts", Icon: BrainCircuit, tone: "violet" },
  { label: "Sandbox", Icon: Terminal, tone: "cyan" },
  { label: "Report evidence", Icon: FileText, tone: "orange" },
];

const aiPipelineMetrics = [
  { label: "Pipeline status", value: "Running", helper: "active job", Icon: Activity, tone: "cyan" },
  { label: "Current stage", value: "Sandbox", helper: "validating", Icon: Terminal, tone: "violet" },
  { label: "CVEs processed", value: "633", helper: "normalized", Icon: ShieldAlert, tone: "rose" },
  { label: "Scripts generated", value: "183", helper: "AI-created", Icon: Code2, tone: "blue" },
  { label: "Needs review", value: "8", helper: "manual", Icon: AlertTriangle, tone: "amber" },
];

const aiPipelineSteps = [
  { id: "01", stage: "Ingestion", description: "Load scanner JSON and queue source file.", status: "Completed", duration: "00:18", records: "1 file", Icon: Braces, tone: "blue" },
  { id: "02", stage: "Parser", description: "Remove scanner noise and normalize raw entries.", status: "Completed", duration: "01:04", records: "730 raw", Icon: FileText, tone: "cyan" },
  { id: "03", stage: "CVE normalizer", description: "Map CVEs, CVSS, affected assets, and dedupe.", status: "Completed", duration: "01:31", records: "633 CVEs", Icon: ShieldAlert, tone: "rose" },
  { id: "04", stage: "Knowledge Hub lookup", description: "Search approved scripts before AI generation.", status: "Completed", duration: "02:08", records: "450 hits", Icon: Database, tone: "emerald" },
  { id: "05", stage: "AI script generator", description: "Generate missing validation scripts with guardrails.", status: "Running", duration: "05:42", records: "183 scripts", Icon: BrainCircuit, tone: "violet" },
  { id: "06", stage: "Sandbox executor", description: "Run scripts safely against approved target scope.", status: "Running", duration: "04:16", records: "61 runs", Icon: Terminal, tone: "cyan" },
  { id: "07", stage: "Evidence collector", description: "Attach logs, outputs, and validation proof.", status: "Queued", duration: "--", records: "42 items", Icon: FileText, tone: "orange" },
  { id: "08", stage: "Report builder", description: "Prepare AI pentest report sections and findings.", status: "Queued", duration: "--", records: "9 drafts", Icon: Download, tone: "emerald" },
  { id: "09", stage: "Final validator", description: "Check evidence, verdicts, and manual review blockers.", status: "Waiting", duration: "--", records: "pending", Icon: ShieldCheck, tone: "slate" },
];

const aiPipelineLogs = [
  "[10:16:21] INFO  ingest     scan_stage_update job=AI-ADHOC-2026-0721",
  "[10:16:24] INFO  ingest     reading raw input: Acunetix_scanner_sample_raw_scan.json",
  "[10:16:39] INFO  parser     parsed 633 vulnerabilities after normalization",
  "[10:17:02] INFO  kb         lookup complete: 450 scripts found, 183 to generate",
  "[10:17:18] INFO  generate   CVE-2024-5678 generation attempt 1 started",
  "[10:17:44] WARN  generate   CVE-2024-5678 script rejected by sanitizer: missing explicit exit codes",
  "[10:18:02] INFO  generate   CVE-2024-5678 revised prompt for attempt 2",
  "[10:18:28] INFO  sandbox    validation started for CVE-2024-5678",
  "[10:18:43] INFO  sandbox    CVE-2024-1234 completed: vulnerable=true evidence=attached",
  "[10:19:01] WARN  sandbox    CVE-2022-22963 reached attempt 3 and moved to manual review",
  "[10:19:16] INFO  evidence   42 proof items ready for report builder",
  "[10:19:38] INFO  report     draft preparation queued",
];

const aiPipelineWarnings = [
  { cve: "CVE-2022-22963", reason: "Script rejected after 3 attempts", action: "Moved to manual review", tone: "amber", Icon: AlertTriangle },
  { cve: "CVE-2024-5678", reason: "Generated script missed explicit success/failure exit codes", action: "Revised prompt for attempt 2", tone: "rose", Icon: ShieldAlert },
  { cve: "CVE-2023-12345", reason: "Sandbox target returned inconsistent response", action: "Queued retry with slower timeout", tone: "cyan", Icon: Terminal },
];

const aiEvidenceQueue = [
  { cve: "CVE-2024-1234", evidence: "Ready", artifact: "Log attached", report: "Yes", verdict: "Vulnerable", tone: "rose" },
  { cve: "CVE-2024-5678", evidence: "Running", artifact: "Pending", report: "No", verdict: "Testing", tone: "cyan" },
  { cve: "CVE-2022-22963", evidence: "Manual review", artifact: "Rejected", report: "No", verdict: "Review", tone: "amber" },
  { cve: "CVE-2021-44228", evidence: "Ready", artifact: "Output attached", report: "Yes", verdict: "Not Vulnerable", tone: "emerald" },
];

const aiPipelineHealth = [
  { label: "Knowledge Hub", value: "450 hits", helper: "approved scripts matched", tone: "emerald" },
  { label: "AI generated", value: "183 scripts", helper: "missing checks created", tone: "violet" },
  { label: "Sandbox passed", value: "61 runs", helper: "safe executions", tone: "cyan" },
  { label: "Sanitizer rejected", value: "8", helper: "guardrail blocks", tone: "amber" },
  { label: "Manual review", value: "8", helper: "human decision needed", tone: "rose" },
  { label: "Report readiness", value: "84%", helper: "evidence pack progress", tone: "blue" },
];

const aiVulnerabilityMetrics = [
  { label: "Total CVEs", value: "633", helper: "normalized", Icon: ShieldAlert, tone: "rose" },
  { label: "Critical / High", value: "102", helper: "priority", Icon: AlertTriangle, tone: "orange" },
  { label: "Validated", value: "19", helper: "vulnerable", Icon: CheckCircle2, tone: "emerald" },
  { label: "Needs review", value: "8", helper: "manual", Icon: Eye, tone: "amber" },
  { label: "KB matches", value: "450", helper: "scripts", Icon: Database, tone: "cyan" },
  { label: "Report ready", value: "42", helper: "evidence", Icon: FileText, tone: "blue" },
];

const aiVulnerabilityFlow = [
  { label: "Detected", value: 633, percent: 100, Icon: Braces, tone: "slate" },
  { label: "Normalized", value: 606, percent: 96, Icon: ShieldCheck, tone: "blue" },
  { label: "KB matched", value: 450, percent: 71, Icon: Database, tone: "emerald" },
  { label: "Script ready", value: 244, percent: 54, Icon: Code2, tone: "violet" },
  { label: "Sandbox proof", value: 61, percent: 38, Icon: Terminal, tone: "cyan" },
  { label: "Report ready", value: 42, percent: 31, Icon: FileText, tone: "orange" },
];

const aiAffectedTargets = [
  { target: "https://testphp.vulnweb.com", total: 38, critical: 7, high: 13, tone: "rose" },
  { target: "https://api.evada.ai", total: 26, critical: 4, high: 9, tone: "orange" },
  { target: "app.evada.ai", total: 19, critical: 1, high: 6, tone: "cyan" },
  { target: "partners.evada.ai", total: 14, critical: 0, high: 5, tone: "emerald" },
];

const aiVulnerabilityRows = [
  {
    cve: "CVE-2024-1234",
    cwe: "CWE-89",
    title: "SQL injection in user login module",
    severity: "Critical",
    cvss: "9.8",
    target: "https://testphp.vulnweb.com",
    source: "Acunetix JSON",
    aiStatus: "KB matched",
    validation: "Validated",
    verdict: "Vulnerable",
    evidence: "Ready",
    report: "Added",
    updated: "Jul 21, 2026 10:19",
    owner: "AI Pentester",
    attempts: "1 / 3",
    pipelineStage: "Evidence collector",
    knowledgeHub: "Approved SQLi probe matched",
    description: "Input validation allows crafted SQL payloads to alter the login query and confirm database behavior.",
    remediation: "Use parameterized queries, validate input, and add regression tests for authentication endpoints.",
  },
  {
    cve: "CVE-2022-22963",
    cwe: "CWE-611",
    title: "XML external entity injection in parser",
    severity: "Critical",
    cvss: "9.8",
    target: "https://api.evada.ai",
    source: "Nessus JSON",
    aiStatus: "AI generated",
    validation: "Failed",
    verdict: "Manual Review",
    evidence: "Blocked",
    report: "Draft",
    updated: "Jul 21, 2026 10:17",
    owner: "Manual review",
    attempts: "3 / 3",
    pipelineStage: "Final validator",
    knowledgeHub: "No approved script found",
    description: "Generated validation scripts were rejected by sanitizer after repeated unsafe or incomplete output.",
    remediation: "Review target parser behavior manually, then approve a sanitized script before report inclusion.",
  },
  {
    cve: "CVE-2024-5678",
    cwe: "CWE-78",
    title: "Command injection in file upload API",
    severity: "Critical",
    cvss: "9.6",
    target: "https://api.client.com",
    source: "Burp Suite JSON",
    aiStatus: "AI generated",
    validation: "Running",
    verdict: "Testing",
    evidence: "Running",
    report: "Pending",
    updated: "Jul 21, 2026 10:18",
    owner: "AI Pentester",
    attempts: "2 / 3",
    pipelineStage: "Sandbox executor",
    knowledgeHub: "Prompt revised with safer exit codes",
    description: "Upload processing may pass user-controlled values into shell execution without proper escaping.",
    remediation: "Remove shell execution from upload processing or enforce strict allowlists and escaped arguments.",
  },
  {
    cve: "CVE-2023-12345",
    cwe: "CWE-918",
    title: "Server-side request forgery via URL parameter",
    severity: "High",
    cvss: "7.5",
    target: "https://partners.evada.ai",
    source: "OWASP ZAP JSON",
    aiStatus: "AI queued",
    validation: "Queued",
    verdict: "Pending",
    evidence: "Pending",
    report: "Pending",
    updated: "Jul 21, 2026 10:12",
    owner: "AI Pentester",
    attempts: "1 / 3",
    pipelineStage: "AI script generator",
    knowledgeHub: "No reusable SSRF script available",
    description: "A URL fetch parameter may allow server-side access to internal or restricted network resources.",
    remediation: "Restrict outbound destinations, block private IP ranges, and validate URL schemes before fetch.",
  },
  {
    cve: "CVE-2021-44228",
    cwe: "CWE-502",
    title: "Log4Shell exposure check",
    severity: "High",
    cvss: "8.1",
    target: "app.evada.ai",
    source: "Qualys JSON",
    aiStatus: "KB matched",
    validation: "Validated",
    verdict: "Not Vulnerable",
    evidence: "Ready",
    report: "Excluded",
    updated: "Jul 21, 2026 09:58",
    owner: "AI Pentester",
    attempts: "1 / 3",
    pipelineStage: "Final validator",
    knowledgeHub: "Approved Log4Shell safe probe matched",
    description: "A historical Log4j signature was found, but sandbox validation did not confirm exploitability.",
    remediation: "Keep patched Log4j versions enforced and retain evidence as a non-vulnerable validation note.",
  },
  {
    cve: "CVE-2024-9012",
    cwe: "CWE-79",
    title: "Stored XSS in comment workflow",
    severity: "Medium",
    cvss: "6.4",
    target: "https://testphp.vulnweb.com",
    source: "Acunetix JSON",
    aiStatus: "KB matched",
    validation: "Validated",
    verdict: "Vulnerable",
    evidence: "Ready",
    report: "Added",
    updated: "Jul 20, 2026 17:36",
    owner: "AI Pentester",
    attempts: "1 / 3",
    pipelineStage: "Report builder",
    knowledgeHub: "Approved XSS payload matched",
    description: "Stored content is rendered without output encoding, allowing script execution for later viewers.",
    remediation: "Encode user-controlled content on output and apply a strict content security policy.",
  },
];

const aiVulnerabilityReviewQueue = [
  { label: "Manual review", value: "8", helper: "scripts rejected or unclear proof", tone: "amber", Icon: Eye },
  { label: "Unsafe output blocked", value: "5", helper: "sanitizer stopped execution", tone: "rose", Icon: ShieldAlert },
  { label: "Evidence missing", value: "3", helper: "report proof not attached", tone: "orange", Icon: FileText },
];

const aiKnowledgeMetrics = [
  { label: "CVEs tracked", value: "7,307", helper: "library", Icon: Database, tone: "blue" },
  { label: "Approved templates", value: "412", helper: "safe reuse", Icon: ShieldCheck, tone: "emerald" },
  { label: "Pending review", value: "86", helper: "needs human", Icon: Eye, tone: "amber" },
  { label: "Template gaps", value: "183", helper: "AI can draft", Icon: BrainCircuit, tone: "violet" },
  { label: "Reuse rate", value: "94%", helper: "pipeline", Icon: Layers3, tone: "cyan" },
  { label: "Last sync", value: "Today", helper: "NVD + imports", Icon: CalendarClock, tone: "orange" },
];

const aiKnowledgeRows = [
  {
    cve: "CVE-2024-1234",
    cwe: "CWE-89",
    title: "SQL injection in user login module",
    product: "Custom Web App",
    severity: "Critical",
    cvss: "9.8",
    templateStatus: "Approved",
    source: "Scanner Import",
    confidence: 96,
    reuse: "Used 18 times",
    updated: "Jul 21, 2026",
    validationType: "SQLi response probe",
    pipelineUse: "Reusable in Pipeline",
    affected: "Login form, query builder, API auth endpoint",
    description: "Known SQL injection pattern for login flows where input reaches a database query without parameter binding.",
    remediation: "Use parameterized queries, reject unsafe input, and add regression tests for authentication endpoints.",
    references: ["OWASP SQL Injection", "CWE-89", "Internal validation note"],
  },
  {
    cve: "CVE-2022-22963",
    cwe: "CWE-611",
    title: "XML external entity injection in parser",
    product: "XML Parser",
    severity: "Critical",
    cvss: "9.8",
    templateStatus: "Missing template",
    source: "AI Generated",
    confidence: 61,
    reuse: "0 reusable runs",
    updated: "Jul 21, 2026",
    validationType: "Manual validation required",
    pipelineUse: "Send to review first",
    affected: "XML upload and import workflows",
    description: "Potential XXE pattern needs a safer validation template before sandbox execution can be approved.",
    remediation: "Disable external entity processing, restrict parser features, and validate XML import paths.",
    references: ["CWE-611", "Parser hardening note", "Pipeline rejection log"],
  },
  {
    cve: "CVE-2024-5678",
    cwe: "CWE-78",
    title: "Command injection in file upload API",
    product: "Upload API",
    severity: "Critical",
    cvss: "9.6",
    templateStatus: "Pending review",
    source: "AI Generated",
    confidence: 74,
    reuse: "2 sandbox attempts",
    updated: "Jul 21, 2026",
    validationType: "Command execution guardrail",
    pipelineUse: "Needs approval",
    affected: "Upload processor and background worker",
    description: "AI drafted a validation template, but it needs review because shell arguments must remain bounded to the approved target.",
    remediation: "Avoid shell execution for uploads, use strict allowlists, and escape arguments if shell usage cannot be removed.",
    references: ["CWE-78", "Sandbox attempt 2", "Safe exit-code rule"],
  },
  {
    cve: "CVE-2023-12345",
    cwe: "CWE-918",
    title: "Server-side request forgery via URL parameter",
    product: "Partner Portal",
    severity: "High",
    cvss: "7.5",
    templateStatus: "Missing template",
    source: "Scanner Import",
    confidence: 68,
    reuse: "Queued for AI",
    updated: "Jul 20, 2026",
    validationType: "Outbound request proof",
    pipelineUse: "AI draft needed",
    affected: "Webhook fetcher and URL preview service",
    description: "URL fetch behavior may allow access to restricted network ranges when destination validation is incomplete.",
    remediation: "Block private IP ranges, validate URL schemes, and route fetches through an allowlisted proxy.",
    references: ["CWE-918", "SSRF test note", "Partner portal scan"],
  },
  {
    cve: "CVE-2021-44228",
    cwe: "CWE-502",
    title: "Log4Shell exposure check",
    product: "Apache Log4j",
    severity: "High",
    cvss: "8.1",
    templateStatus: "Approved",
    source: "NVD Sync",
    confidence: 98,
    reuse: "Used 42 times",
    updated: "Jul 19, 2026",
    validationType: "Safe callback-free probe",
    pipelineUse: "Reusable in Pipeline",
    affected: "Java services using vulnerable Log4j versions",
    description: "Approved Log4Shell validation knowledge for version detection and non-invasive exposure proof.",
    remediation: "Upgrade Log4j, remove vulnerable classes where needed, and confirm runtime dependencies.",
    references: ["NVD CVE-2021-44228", "Apache advisory", "Internal safe probe"],
  },
  {
    cve: "CVE-2024-9012",
    cwe: "CWE-79",
    title: "Stored XSS in comment workflow",
    product: "Web Application",
    severity: "Medium",
    cvss: "6.4",
    templateStatus: "Approved",
    source: "Manual",
    confidence: 93,
    reuse: "Used 11 times",
    updated: "Jul 18, 2026",
    validationType: "Stored payload render check",
    pipelineUse: "Reusable in Pipeline",
    affected: "Comment fields and admin review pages",
    description: "Stored XSS validation template checks whether submitted content is encoded before later rendering.",
    remediation: "Encode on output, sanitize rich text, and apply content security policy controls.",
    references: ["CWE-79", "OWASP XSS", "Manual reviewer note"],
  },
  {
    cve: "CVE-2020-7676",
    cwe: "CWE-1104",
    title: "Vulnerable JavaScript dependency",
    product: "AngularJS",
    severity: "Low",
    cvss: "5.4",
    templateStatus: "Deprecated",
    source: "NVD Sync",
    confidence: 82,
    reuse: "Legacy only",
    updated: "Jul 12, 2026",
    validationType: "Dependency version check",
    pipelineUse: "Do not auto-run",
    affected: "Legacy frontend bundles",
    description: "Knowledge entry is retained for dependency reporting, but the validation template should not be used for new jobs.",
    remediation: "Upgrade unsupported JavaScript dependencies and remove legacy AngularJS bundles.",
    references: ["NVD CVE-2020-7676", "Dependency scan", "Deprecated template note"],
  },
  {
    cve: "CVE-2021-3711",
    cwe: "CWE-310",
    title: "OpenSSL padding oracle attack",
    product: "OpenSSL",
    severity: "Medium",
    cvss: "5.9",
    templateStatus: "Approved",
    source: "NVD Sync",
    confidence: 91,
    reuse: "Used 9 times",
    updated: "Jul 08, 2026",
    validationType: "TLS version and library check",
    pipelineUse: "Reusable in Pipeline",
    affected: "TLS services and package inventory",
    description: "Validated knowledge for OpenSSL version checks and safe service posture review.",
    remediation: "Patch OpenSSL packages, rotate impacted certificates if needed, and rescan TLS services.",
    references: ["NVD CVE-2021-3711", "OpenSSL advisory", "TLS scanner note"],
  },
];

const aiKnowledgeReviewQueue = [
  { label: "Approve AI templates", value: "14", helper: "ready for reviewer", tone: "violet", Icon: BrainCircuit },
  { label: "Missing safe template", value: "183", helper: "fallback generation needed", tone: "amber", Icon: Code2 },
  { label: "Deprecated entries", value: "21", helper: "keep for reporting only", tone: "slate", Icon: Database },
];

const aiKnowledgeSourceHealth = [
  { label: "NVD Sync", value: "Healthy", helper: "last sync today", tone: "emerald", Icon: Database },
  { label: "Scanner imports", value: "633", helper: "normalized this run", tone: "blue", Icon: Braces },
  { label: "Manual reviews", value: "58", helper: "approved by analyst", tone: "cyan", Icon: ShieldCheck },
  { label: "AI drafts", value: "183", helper: "awaiting guardrail review", tone: "violet", Icon: BrainCircuit },
];

const aiPentestReportMetrics = [
  { label: "Reports ready", value: "9", helper: "client-ready", Icon: FileText, tone: "emerald" },
  { label: "Generating", value: "3", helper: "in progress", Icon: Activity, tone: "cyan" },
  { label: "Needs review", value: "4", helper: "manual", Icon: Eye, tone: "amber" },
  { label: "Evidence items", value: "42", helper: "attached", Icon: Database, tone: "blue" },
  { label: "Validated CVEs", value: "19", helper: "confirmed", Icon: ShieldCheck, tone: "rose" },
  { label: "Exports", value: "31", helper: "this month", Icon: Download, tone: "violet" },
];

const aiPentestReportRows = [
  {
    id: "AIR-2026-0719",
    title: "AI Pentest Report - polosofttech.com",
    job: "AI-ADHOC-2026-0719",
    target: "https://www.polosofttech.com",
    status: "Ready",
    scope: "Web/API",
    cves: 87,
    evidence: 18,
    validated: 6,
    author: "AI Pentester",
    updated: "Jul 21, 2026",
    readiness: 96,
    formats: ["PDF", "DOCX", "HTML", "Evidence ZIP"],
    severity: { critical: 4, high: 11, medium: 21, low: 51 },
    blockers: ["1 remediation owner pending"],
    sections: ["Executive summary", "Scope and methodology", "AI validation summary", "Confirmed vulnerabilities", "Evidence appendix", "Remediation plan"],
    checklist: [
      { label: "CVEs normalized", status: "Done" },
      { label: "Evidence attached", status: "Done" },
      { label: "Sandbox verdicts included", status: "Done" },
      { label: "Remediation notes complete", status: "Warning" },
      { label: "Manual review cleared", status: "Done" },
      { label: "Branding applied", status: "Done" },
    ],
    timeline: [
      { label: "Source job completed", status: "Completed" },
      { label: "CVEs selected", status: "Completed" },
      { label: "Evidence assembled", status: "Completed" },
      { label: "Remediation drafted", status: "Completed" },
      { label: "Review completed", status: "Completed" },
      { label: "Export generated", status: "Completed" },
    ],
    coverage: [
      { label: "Critical evidence", value: "4 / 4", percent: 100, tone: "rose" },
      { label: "High evidence", value: "10 / 11", percent: 91, tone: "orange" },
      { label: "Medium evidence", value: "19 / 21", percent: 90, tone: "amber" },
    ],
  },
  {
    id: "AIR-2026-0718",
    title: "AI Pentest Report - api.evada.ai",
    job: "AI-ADHOC-2026-0718",
    target: "https://api.evada.ai",
    status: "Generating",
    scope: "API",
    cves: 64,
    evidence: 12,
    validated: 4,
    author: "AI Pentester",
    updated: "Jul 21, 2026",
    readiness: 72,
    formats: ["PDF", "HTML"],
    severity: { critical: 2, high: 8, medium: 17, low: 37 },
    blockers: ["Report builder still assembling evidence", "2 high findings need remediation notes"],
    sections: ["Executive summary", "API validation summary", "Confirmed vulnerabilities", "Evidence appendix"],
    checklist: [
      { label: "CVEs normalized", status: "Done" },
      { label: "Evidence attached", status: "Running" },
      { label: "Sandbox verdicts included", status: "Done" },
      { label: "Remediation notes complete", status: "Warning" },
      { label: "Manual review cleared", status: "Done" },
      { label: "Branding applied", status: "Running" },
    ],
    timeline: [
      { label: "Source job completed", status: "Completed" },
      { label: "CVEs selected", status: "Completed" },
      { label: "Evidence assembled", status: "Running" },
      { label: "Remediation drafted", status: "Running" },
      { label: "Review completed", status: "Queued" },
      { label: "Export generated", status: "Queued" },
    ],
    coverage: [
      { label: "Critical evidence", value: "2 / 2", percent: 100, tone: "rose" },
      { label: "High evidence", value: "6 / 8", percent: 75, tone: "orange" },
      { label: "Medium evidence", value: "4 / 17", percent: 24, tone: "amber" },
    ],
  },
  {
    id: "AIR-2026-0717",
    title: "AI Pentest Report - client portal",
    job: "AI-ADHOC-2026-0717",
    target: "https://partners.evada.ai",
    status: "Needs review",
    scope: "Web/API",
    cves: 112,
    evidence: 22,
    validated: 9,
    author: "Security Review",
    updated: "Jul 20, 2026",
    readiness: 64,
    formats: ["PDF draft", "Evidence ZIP"],
    severity: { critical: 5, high: 16, medium: 31, low: 60 },
    blockers: ["4 findings missing remediation owner", "2 AI-generated templates need approval", "1 sandbox result inconclusive"],
    sections: ["Executive summary", "Scope and methodology", "AI validation summary", "Confirmed vulnerabilities", "Manual review appendix"],
    checklist: [
      { label: "CVEs normalized", status: "Done" },
      { label: "Evidence attached", status: "Warning" },
      { label: "Sandbox verdicts included", status: "Warning" },
      { label: "Remediation notes complete", status: "Blocked" },
      { label: "Manual review cleared", status: "Blocked" },
      { label: "Branding applied", status: "Done" },
    ],
    timeline: [
      { label: "Source job completed", status: "Completed" },
      { label: "CVEs selected", status: "Completed" },
      { label: "Evidence assembled", status: "Completed" },
      { label: "Remediation drafted", status: "Blocked" },
      { label: "Review completed", status: "Blocked" },
      { label: "Export generated", status: "Queued" },
    ],
    coverage: [
      { label: "Critical evidence", value: "5 / 5", percent: 100, tone: "rose" },
      { label: "High evidence", value: "11 / 16", percent: 69, tone: "orange" },
      { label: "Medium evidence", value: "6 / 31", percent: 19, tone: "amber" },
    ],
  },
  {
    id: "AIR-2026-0716",
    title: "AI Pentest Report - staging web",
    job: "AI-ADHOC-2026-0716",
    target: "https://staging.evada.ai",
    status: "Shared",
    scope: "Web App",
    cves: 39,
    evidence: 8,
    validated: 0,
    author: "Dipak Kumar",
    updated: "Jul 18, 2026",
    readiness: 100,
    formats: ["PDF", "DOCX", "HTML"],
    severity: { critical: 0, high: 2, medium: 8, low: 29 },
    blockers: [],
    sections: ["Executive summary", "Non-vulnerable checks", "Evidence appendix", "Remediation plan"],
    checklist: [
      { label: "CVEs normalized", status: "Done" },
      { label: "Evidence attached", status: "Done" },
      { label: "Sandbox verdicts included", status: "Done" },
      { label: "Remediation notes complete", status: "Done" },
      { label: "Manual review cleared", status: "Done" },
      { label: "Branding applied", status: "Done" },
    ],
    timeline: [
      { label: "Source job completed", status: "Completed" },
      { label: "CVEs selected", status: "Completed" },
      { label: "Evidence assembled", status: "Completed" },
      { label: "Remediation drafted", status: "Completed" },
      { label: "Review completed", status: "Completed" },
      { label: "Export generated", status: "Completed" },
    ],
    coverage: [
      { label: "Critical evidence", value: "0 / 0", percent: 100, tone: "emerald" },
      { label: "High evidence", value: "2 / 2", percent: 100, tone: "orange" },
      { label: "Medium evidence", value: "6 / 8", percent: 75, tone: "amber" },
    ],
  },
  {
    id: "AIR-2026-0715",
    title: "AI Pentest Report - branch network portal",
    job: "AI-ADHOC-2026-0715",
    target: "https://branch-client.example",
    status: "Blocked",
    scope: "Hybrid",
    cves: 51,
    evidence: 5,
    validated: 1,
    author: "AI Pentester",
    updated: "Jul 17, 2026",
    readiness: 38,
    formats: ["Draft only"],
    severity: { critical: 1, high: 7, medium: 15, low: 28 },
    blockers: ["Sandbox target unreachable", "Manual scope approval required", "Evidence pack incomplete"],
    sections: ["Scope and methodology", "Blocked validation notes", "Evidence appendix"],
    checklist: [
      { label: "CVEs normalized", status: "Done" },
      { label: "Evidence attached", status: "Blocked" },
      { label: "Sandbox verdicts included", status: "Blocked" },
      { label: "Remediation notes complete", status: "Warning" },
      { label: "Manual review cleared", status: "Blocked" },
      { label: "Branding applied", status: "Queued" },
    ],
    timeline: [
      { label: "Source job completed", status: "Completed" },
      { label: "CVEs selected", status: "Completed" },
      { label: "Evidence assembled", status: "Blocked" },
      { label: "Remediation drafted", status: "Queued" },
      { label: "Review completed", status: "Blocked" },
      { label: "Export generated", status: "Queued" },
    ],
    coverage: [
      { label: "Critical evidence", value: "1 / 1", percent: 100, tone: "rose" },
      { label: "High evidence", value: "2 / 7", percent: 29, tone: "orange" },
      { label: "Medium evidence", value: "2 / 15", percent: 13, tone: "amber" },
    ],
  },
];

const aiPentestReportSections = [
  { label: "Executive summary", helper: "Risk narrative and priority actions", Icon: Gauge, tone: "blue" },
  { label: "Scope and methodology", helper: "Targets, sources, and AI validation flow", Icon: Layers3, tone: "cyan" },
  { label: "AI validation summary", helper: "Sandbox verdicts and confidence notes", Icon: BrainCircuit, tone: "violet" },
  { label: "Confirmed vulnerabilities", helper: "Validated CVEs with impact", Icon: ShieldAlert, tone: "rose" },
  { label: "Evidence appendix", helper: "Logs, outputs, and screenshots", Icon: Database, tone: "emerald" },
  { label: "Remediation plan", helper: "Fix guidance and ownership", Icon: CheckCircle2, tone: "orange" },
];

const billingUsage = [
  { label: "Web/API assets", used: 6, total: 10, remaining: 4, cost: "$0.00", unit: "assets", Icon: Globe2, tone: "cyan" },
  { label: "Network devices", used: 18, total: 25, remaining: 7, cost: "$0.00", unit: "devices", Icon: Bot, tone: "emerald" },
  { label: "Scan runs", used: 72, total: 100, remaining: 28, cost: "$0.00", unit: "runs", Icon: ScanLine, tone: "blue" },
  { label: "VAPT reports", used: 6, total: 5, remaining: 0, cost: "$19.00", unit: "reports", Icon: FileText, tone: "orange" },
  { label: "AI Pentester credits", used: 620, total: 500, remaining: 0, cost: "$12.00", unit: "credits", Icon: BrainCircuit, tone: "violet" },
  { label: "Team seats", used: 3, total: 5, remaining: 2, cost: "$0.00", unit: "seats", Icon: Activity, tone: "slate" },
];

const billingSummary = [
  { label: "Current bill", value: "$110.00", helper: "Base Pro plan plus add-ons", Icon: BadgeDollarSign, tone: "emerald" },
  { label: "Estimated month-end", value: "$129.50", helper: "Based on current usage velocity", Icon: TrendingUp, tone: "orange" },
  { label: "Included value used", value: "78%", helper: "Across scans, assets, and reports", Icon: Gauge, tone: "blue" },
];

const costBreakdownRows = [
  { item: "Pro plan", included: "Base plan", used: "1 workspace", extra: "-", rate: "$79/mo", cost: "$79.00" },
  { item: "Web/API assets", included: "10", used: "6", extra: "0", rate: "$8 / extra", cost: "$0.00" },
  { item: "Network devices", included: "25", used: "18", extra: "0", rate: "$3 / extra", cost: "$0.00" },
  { item: "Scan runs", included: "100", used: "72", extra: "0", rate: "$0.40 / run", cost: "$0.00" },
  { item: "VAPT reports", included: "5", used: "6", extra: "1", rate: "$19 / report", cost: "$19.00" },
  { item: "AI Pentester credits", included: "500", used: "620", extra: "120", rate: "$0.10 / credit", cost: "$12.00" },
];

const costBreakdownTotals = [
  { label: "Base total", value: "$79.00", helper: "Pro workspace plan", tone: "slate" },
  { label: "Overage total", value: "$31.00", helper: "Reports + AI credits", tone: "rose" },
  { label: "Current bill", value: "$110.00", helper: "Before month-end usage", tone: "emerald" },
];

const billingInvoices = [
  { id: "INV-2026-0718", date: "Jul 18, 2026", amount: "$110.00", status: "Open" },
  { id: "INV-2026-0618", date: "Jun 18, 2026", amount: "$79.00", status: "Paid" },
  { id: "INV-2026-0518", date: "May 18, 2026", amount: "$79.00", status: "Paid" },
];

const recommendedUpgrade = [
  { label: "Business plan", value: "$199/mo", helper: "100 Web/API assets and 250 Network devices" },
  { label: "Savings signal", value: "$31.50", helper: "Estimated add-on cost avoided this month" },
  { label: "Best reason", value: "AI + reports", helper: "Higher included credits and branded reports" },
];

const activityMetrics = [
  { label: "Total events", value: "184", helper: "30 days", Icon: Activity, tone: "blue" },
  { label: "Successful logins", value: "42", helper: "verified", Icon: ShieldCheck, tone: "emerald" },
  { label: "Security alerts", value: "3", helper: "review", Icon: AlertTriangle, tone: "rose" },
  { label: "Exports", value: "12", helper: "files", Icon: Download, tone: "cyan" },
];

type ActivityMonth = {
  label: string;
  days: number;
  startOffset: number;
  activeDays: number[];
  warningDays: number[];
  riskDays: number[];
  loginCounts: Record<number, number>;
  lastLogin: string;
  streak: string;
  failedAttempts: string;
};

type ActivityEvent = {
  id: string;
  monthIndex: number;
  day: number;
  time: string;
  event: string;
  module: string;
  status: string;
  user: string;
  email: string;
  ip: string;
  location: string;
  device: string;
  description: string;
  sessionId: string;
  authMethod: string;
  riskScore: string;
  Icon: typeof LayoutDashboard;
  tone: string;
};

const mayActiveDays = [1, 4, 5, 6, 8, 11, 12, 13, 15, 18, 19, 20, 22, 25, 26, 27, 29];
const juneActiveDays = [1, 2, 3, 4, 5, 8, 9, 10, 12, 15, 16, 17, 19, 22, 23, 24, 26, 29, 30];
const julyActiveDays = [1, 2, 3, 5, 7, 8, 10, 12, 13, 14, 15, 17, 19, 20, 22, 24, 26, 27, 29];

function buildLoginCounts(activeDays: number[], overrides: Record<number, number> = {}) {
  return activeDays.reduce<Record<number, number>>((counts, day) => {
    counts[day] = overrides[day] || 1;
    return counts;
  }, {});
}

const activityMonths: ActivityMonth[] = [
  {
    label: "May 2026",
    days: 31,
    startOffset: 5,
    activeDays: mayActiveDays,
    warningDays: [10, 24],
    riskDays: [16],
    loginCounts: buildLoginCounts(mayActiveDays, { 8: 2, 22: 2, 29: 3 }),
    lastLogin: "May 31, 18:24",
    streak: "2 days",
    failedAttempts: "1",
  },
  {
    label: "June 2026",
    days: 30,
    startOffset: 1,
    activeDays: juneActiveDays,
    warningDays: [14, 21],
    riskDays: [7],
    loginCounts: buildLoginCounts(juneActiveDays, { 12: 2, 24: 3, 30: 2 }),
    lastLogin: "Jun 30, 19:08",
    streak: "3 days",
    failedAttempts: "1",
  },
  {
    label: "July 2026",
    days: 31,
    startOffset: 3,
    activeDays: julyActiveDays,
    warningDays: [9, 16, 21],
    riskDays: [6, 18],
    loginCounts: buildLoginCounts(julyActiveDays, { 20: 2, 24: 4, 27: 3 }),
    lastLogin: "Today, 09:42",
    streak: "4 days",
    failedAttempts: "2",
  },
];

const activityEvents: ActivityEvent[] = [
  {
    id: "evt-0801",
    monthIndex: 0,
    day: 29,
    time: "May 29, 2026 18:24",
    event: "Login successful",
    module: "Authentication",
    status: "Success",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Chrome on Windows",
    description: "Verified account session from the primary workstation.",
    sessionId: "ses-may-29-1824",
    authMethod: "Email + password",
    riskScore: "Low",
    Icon: ShieldCheck,
    tone: "emerald",
  },
  {
    id: "evt-0802",
    monthIndex: 0,
    day: 29,
    time: "May 29, 2026 14:02",
    event: "Invoice downloaded",
    module: "Billing & Cost",
    status: "Info",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Chrome on Windows",
    description: "Monthly invoice preview was downloaded from Billing & Cost.",
    sessionId: "ses-may-29-1402",
    authMethod: "Verified session",
    riskScore: "Low",
    Icon: Download,
    tone: "cyan",
  },
  {
    id: "evt-0901",
    monthIndex: 1,
    day: 30,
    time: "Jun 30, 2026 19:08",
    event: "Login successful",
    module: "Authentication",
    status: "Success",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Chrome on Windows",
    description: "Verified dashboard login from a trusted browser.",
    sessionId: "ses-jun-30-1908",
    authMethod: "Email + password",
    riskScore: "Low",
    Icon: ShieldCheck,
    tone: "emerald",
  },
  {
    id: "evt-0902",
    monthIndex: 1,
    day: 30,
    time: "Jun 30, 2026 19:14",
    event: "Network scan started",
    module: "Scanner Engine",
    status: "Success",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Chrome on Windows",
    description: "Demo network scan started for the workspace range.",
    sessionId: "ses-jun-30-1914",
    authMethod: "Verified session",
    riskScore: "Low",
    Icon: Network,
    tone: "blue",
  },
  {
    id: "evt-1001",
    monthIndex: 2,
    day: 20,
    time: "Jul 20, 2026 09:42",
    event: "Login successful",
    module: "Authentication",
    status: "Success",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Chrome on Windows",
    description: "Verified account session started from a recognized browser.",
    sessionId: "ses-jul-20-0942",
    authMethod: "Email + password",
    riskScore: "Low",
    Icon: ShieldCheck,
    tone: "emerald",
  },
  {
    id: "evt-1002",
    monthIndex: 2,
    day: 20,
    time: "Jul 20, 2026 09:50",
    event: "Web App scan started",
    module: "Scanner Engine",
    status: "Success",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Chrome on Windows",
    description: "Demo web application scan queued for https://www.polosofttech.com/.",
    sessionId: "ses-jul-20-0950",
    authMethod: "Verified session",
    riskScore: "Low",
    Icon: ScanLine,
    tone: "blue",
  },
  {
    id: "evt-1003",
    monthIndex: 2,
    day: 19,
    time: "Jul 19, 2026 18:16",
    event: "Failed login blocked",
    module: "Authentication",
    status: "Alert",
    user: "Unknown",
    email: "dk358693@gmail.com",
    ip: "45.91.22.104",
    location: "Unknown",
    device: "Firefox on Linux",
    description: "Password attempt failed and no dashboard session was created.",
    sessionId: "blocked-jul-19-1816",
    authMethod: "Email + password",
    riskScore: "High",
    Icon: AlertTriangle,
    tone: "rose",
  },
  {
    id: "evt-1004",
    monthIndex: 2,
    day: 18,
    time: "Jul 18, 2026 17:03",
    event: "VAPT report generated",
    module: "VAPT Reports",
    status: "Success",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Chrome on Windows",
    description: "Report package generated with demo scan evidence and summary counts.",
    sessionId: "ses-jul-18-1703",
    authMethod: "Verified session",
    riskScore: "Low",
    Icon: FileText,
    tone: "cyan",
  },
  {
    id: "evt-1005",
    monthIndex: 2,
    day: 18,
    time: "Jul 18, 2026 12:40",
    event: "Plan review opened",
    module: "Billing & Cost",
    status: "Info",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Chrome on Windows",
    description: "Business plan recommendation opened from Billing & Cost.",
    sessionId: "ses-jul-18-1240",
    authMethod: "Verified session",
    riskScore: "Low",
    Icon: BadgeDollarSign,
    tone: "orange",
  },
  {
    id: "evt-1006",
    monthIndex: 2,
    day: 17,
    time: "Jul 17, 2026 20:10",
    event: "AI pipeline viewed",
    module: "AI Pentester",
    status: "Info",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Chrome on Windows",
    description: "AI Pentester pipeline page opened for workflow review.",
    sessionId: "ses-jul-17-2010",
    authMethod: "Verified session",
    riskScore: "Low",
    Icon: BrainCircuit,
    tone: "violet",
  },
  {
    id: "evt-1024-1",
    monthIndex: 2,
    day: 24,
    time: "Jul 24, 2026 08:15",
    event: "Login successful",
    module: "Authentication",
    status: "Success",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Chrome on Windows",
    description: "Morning verified login from the regular office network.",
    sessionId: "ses-jul-24-0815",
    authMethod: "Email + password",
    riskScore: "Low",
    Icon: ShieldCheck,
    tone: "emerald",
  },
  {
    id: "evt-1024-2",
    monthIndex: 2,
    day: 24,
    time: "Jul 24, 2026 11:32",
    event: "Login successful",
    module: "Authentication",
    status: "Success",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Edge on Windows",
    description: "Verified login from a second trusted browser on the same workspace.",
    sessionId: "ses-jul-24-1132",
    authMethod: "Email + password",
    riskScore: "Low",
    Icon: ShieldCheck,
    tone: "emerald",
  },
  {
    id: "evt-1024-3",
    monthIndex: 2,
    day: 24,
    time: "Jul 24, 2026 15:44",
    event: "Login successful",
    module: "Authentication",
    status: "Success",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Chrome on Windows",
    description: "Verified login before reviewing scan results.",
    sessionId: "ses-jul-24-1544",
    authMethod: "Email + password",
    riskScore: "Low",
    Icon: ShieldCheck,
    tone: "emerald",
  },
  {
    id: "evt-1024-4",
    monthIndex: 2,
    day: 24,
    time: "Jul 24, 2026 19:02",
    event: "Login successful",
    module: "Authentication",
    status: "Success",
    user: "Dipak Kumar",
    email: "dk358693@gmail.com",
    ip: "103.74.118.22",
    location: "Bihar, India",
    device: "Chrome on Windows",
    description: "Evening verified login from the recognized browser profile.",
    sessionId: "ses-jul-24-1902",
    authMethod: "Email + password",
    riskScore: "Low",
    Icon: ShieldCheck,
    tone: "emerald",
  },
];

function metricToneClasses(tone: string) {
  const tones = {
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
    rose: "bg-rose-50 text-rose-600 ring-rose-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    cyan: "bg-cyan-50 text-[#0891B2] ring-cyan-100",
    emerald: "bg-emerald-50 text-[#16A86E] ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return tones[tone as keyof typeof tones] || tones.slate;
}

function severityPillClasses(severity: string) {
  const tones = {
    Critical: "bg-rose-50 text-rose-700 ring-rose-100",
    High: "bg-red-50 text-red-700 ring-red-100",
    Medium: "bg-amber-50 text-amber-700 ring-amber-100",
    Low: "bg-yellow-50 text-yellow-700 ring-yellow-100",
  };

  return tones[severity as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function reportStatusClasses(status: string) {
  const tones = {
    Ready: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Shared: "bg-blue-50 text-blue-700 ring-blue-100",
    Draft: "bg-amber-50 text-amber-700 ring-amber-100",
    "Needs review": "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return tones[status as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function aiValidationStatusClasses(status: string) {
  const tones = {
    Validated: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Running: "bg-cyan-50 text-[#0891B2] ring-cyan-100",
    Queued: "bg-blue-50 text-blue-700 ring-blue-100",
    Failed: "bg-amber-50 text-amber-700 ring-amber-100",
  };

  return tones[status as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function aiPipelineStatusClasses(status: string) {
  const tones = {
    Completed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Running: "bg-cyan-50 text-[#0891B2] ring-cyan-100",
    Queued: "bg-blue-50 text-blue-700 ring-blue-100",
    Waiting: "bg-slate-50 text-slate-600 ring-slate-100",
    Warning: "bg-amber-50 text-amber-700 ring-amber-100",
    Failed: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return tones[status as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function aiVerdictClasses(verdict: string) {
  const tones = {
    Vulnerable: "bg-rose-50 text-rose-700 ring-rose-100",
    "Not Vulnerable": "bg-emerald-50 text-emerald-700 ring-emerald-100",
    "Manual Review": "bg-amber-50 text-amber-700 ring-amber-100",
    Testing: "bg-cyan-50 text-[#0891B2] ring-cyan-100",
    Pending: "bg-blue-50 text-blue-700 ring-blue-100",
  };

  return tones[verdict as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function aiCveStatusClasses(status: string) {
  const tones = {
    "KB matched": "bg-emerald-50 text-emerald-700 ring-emerald-100",
    "AI generated": "bg-violet-50 text-violet-700 ring-violet-100",
    "AI queued": "bg-blue-50 text-blue-700 ring-blue-100",
  };

  return tones[status as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function aiEvidenceClasses(status: string) {
  const tones = {
    Ready: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Running: "bg-cyan-50 text-[#0891B2] ring-cyan-100",
    Pending: "bg-blue-50 text-blue-700 ring-blue-100",
    Blocked: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return tones[status as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function aiReportClasses(status: string) {
  const tones = {
    Added: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Draft: "bg-amber-50 text-amber-700 ring-amber-100",
    Pending: "bg-blue-50 text-blue-700 ring-blue-100",
    Excluded: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return tones[status as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function aiPentestReportStatusClasses(status: string) {
  const tones = {
    Ready: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Generating: "bg-cyan-50 text-[#0891B2] ring-cyan-100",
    "Needs review": "bg-amber-50 text-amber-700 ring-amber-100",
    Blocked: "bg-rose-50 text-rose-700 ring-rose-100",
    Shared: "bg-blue-50 text-blue-700 ring-blue-100",
  };

  return tones[status as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function aiReportReadinessClasses(status: string) {
  const tones = {
    Done: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Completed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Running: "bg-cyan-50 text-[#0891B2] ring-cyan-100",
    Warning: "bg-amber-50 text-amber-700 ring-amber-100",
    Queued: "bg-blue-50 text-blue-700 ring-blue-100",
    Blocked: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return tones[status as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function aiKnowledgeTemplateClasses(status: string) {
  const tones = {
    Approved: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    "Pending review": "bg-amber-50 text-amber-700 ring-amber-100",
    "Missing template": "bg-rose-50 text-rose-700 ring-rose-100",
    Deprecated: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return tones[status as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function aiKnowledgeSourceClasses(source: string) {
  const tones = {
    "NVD Sync": "bg-blue-50 text-blue-700 ring-blue-100",
    "Scanner Import": "bg-cyan-50 text-[#0891B2] ring-cyan-100",
    "AI Generated": "bg-violet-50 text-violet-700 ring-violet-100",
    Manual: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  };

  return tones[source as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function nocConnectionClasses(status: string) {
  const tones = {
    Online: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Warning: "bg-amber-50 text-amber-700 ring-amber-100",
    Offline: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return tones[status as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function nocDeviceStatusClasses(status: string) {
  const tones = {
    Monitored: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Discovered: "bg-cyan-50 text-[#0891B2] ring-cyan-100",
    Offline: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return tones[status as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function activityStatusClasses(status: string) {
  const tones = {
    Success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Alert: "bg-rose-50 text-rose-700 ring-rose-100",
    Review: "bg-amber-50 text-amber-700 ring-amber-100",
    Info: "bg-cyan-50 text-[#0891B2] ring-cyan-100",
  };

  return tones[status as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function activityRiskClasses(risk: string) {
  const tones = {
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Medium: "bg-amber-50 text-amber-700 ring-amber-100",
    High: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return tones[risk as keyof typeof tones] || "bg-slate-50 text-slate-700 ring-slate-100";
}

function activityDayClasses(status: string) {
  const tones = {
    active: "bg-[#2ECE82] text-[#071010] ring-[#2ECE82]",
    warning: "bg-amber-50 text-amber-700 ring-amber-100",
    risk: "bg-rose-50 text-rose-700 ring-rose-100",
    idle: "bg-slate-50 text-slate-400 ring-slate-100",
  };

  return tones[status as keyof typeof tones] || tones.idle;
}

function defaultActivityDay(monthIndex: number) {
  const month = activityMonths[monthIndex] || activityMonths[activityMonths.length - 1];
  if (month.label === "July 2026") return 20;

  return month.activeDays[month.activeDays.length - 1] || 1;
}

const defaultActivityMonthIndex = activityMonths.length - 1;
const defaultActivityDayValue = defaultActivityDay(defaultActivityMonthIndex);
const defaultActivityEventId = activityEvents.find((event) => event.monthIndex === defaultActivityMonthIndex && event.day === defaultActivityDayValue)?.id || "";

type DashboardSuccessProps = {
  initialSection?: DashboardSection;
};

export default function DashboardSuccess({ initialSection = "overview" }: DashboardSuccessProps = {}) {
  const router = useLoadingRouter();
  const pathname = usePathname();
  const { activeWorkspace, user, loading: workspaceLoading, error: sessionError } = useWorkspace();
  const [activeSection, setActiveSection] = useState<DashboardSection>(initialSection);
  const [collapsed, setCollapsed] = useState(false);
  const [aiPentesterOpen, setAiPentesterOpen] = useState(initialSection === "ai-pentester");
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [authenticationActivity, setAuthenticationActivity] = useState<AuthenticationActivityResponse | null>(null);
  const [authenticationActivityLoading, setAuthenticationActivityLoading] = useState(false);
  const [scanToast, setScanToast] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState(defaultActivityEventId);
  const [activityMonthIndex, setActivityMonthIndex] = useState(defaultActivityMonthIndex);
  const [selectedActivityDay, setSelectedActivityDay] = useState(defaultActivityDayValue);
  const [activitySearch, setActivitySearch] = useState("");
  const [activityModuleFilter, setActivityModuleFilter] = useState("All modules");
  const [activityStatusFilter, setActivityStatusFilter] = useState("All status");
  const [nocAgentWizardOpen, setNocAgentWizardOpen] = useState(false);
  const [nocAgentStep, setNocAgentStep] = useState(0);
  const [nocAgentOs, setNocAgentOs] = useState(nocOsOptions[0].label);
  const [aiLaunchJobName, setAiLaunchJobName] = useState("AI-ADHOC-2026-0721");
  const [aiLaunchTarget, setAiLaunchTarget] = useState("https://www.polosofttech.com");
  const [aiLaunchEnvironment, setAiLaunchEnvironment] = useState("Production");
  const [aiLaunchOwner, setAiLaunchOwner] = useState("Dipak Kumar");
  const [aiLaunchSourceId, setAiLaunchSourceId] = useState(aiLaunchSources[0].id);
  const [aiLaunchFileName, setAiLaunchFileName] = useState("");
  const [aiLaunchLlm, setAiLaunchLlm] = useState("OpenAI GPT-4");
  const [aiLaunchSandboxTarget, setAiLaunchSandboxTarget] = useState("https://www.polosofttech.com");
  const [aiLaunchUseKnowledgeHub, setAiLaunchUseKnowledgeHub] = useState(true);
  const [aiLaunchGenerateMissing, setAiLaunchGenerateMissing] = useState(true);
  const [aiLaunchSandboxEnabled, setAiLaunchSandboxEnabled] = useState(true);
  const [aiLaunchAttachEvidence, setAiLaunchAttachEvidence] = useState(true);
  const [aiPipelineStreamPaused, setAiPipelineStreamPaused] = useState(false);
  const [aiVulnerabilitySearch, setAiVulnerabilitySearch] = useState("");
  const [aiVulnerabilitySeverity, setAiVulnerabilitySeverity] = useState("All severity");
  const [aiVulnerabilityValidation, setAiVulnerabilityValidation] = useState("All validation");
  const [selectedAiVulnerabilityId, setSelectedAiVulnerabilityId] = useState(aiVulnerabilityRows[0].cve);
  const [aiKnowledgeSearch, setAiKnowledgeSearch] = useState("");
  const [aiKnowledgeSeverity, setAiKnowledgeSeverity] = useState("All severity");
  const [aiKnowledgeTemplateStatus, setAiKnowledgeTemplateStatus] = useState("All templates");
  const [aiKnowledgeSource, setAiKnowledgeSource] = useState("All sources");
  const [selectedAiKnowledgeId, setSelectedAiKnowledgeId] = useState(aiKnowledgeRows[0].cve);
  const [aiReportSearch, setAiReportSearch] = useState("");
  const [aiReportStatus, setAiReportStatus] = useState("All status");
  const [aiReportScope, setAiReportScope] = useState("All scopes");
  const [selectedAiReportId, setSelectedAiReportId] = useState(aiPentestReportRows[0].id);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const allowedModules = useMemo(() => new Set(activeWorkspace?.permissions.modules || []), [activeWorkspace]);
  const requiredModule = moduleForPath(pathname);
  const moduleAccessDenied = Boolean(activeWorkspace && !allowedModules.has(requiredModule));
  const actionAccessDenied = Boolean(
    activeWorkspace &&
      ((pathname === "/scans/new-scan" && !activeWorkspace.permissions.actions.scans?.includes("execute")) ||
        (pathname === "/ai-pentester/launch-scan" && !activeWorkspace.permissions.actions.ai_pentester?.includes("execute"))),
  );
  const canAction = (moduleCode: string, action: PermissionAction) =>
    activeWorkspace?.permissions.actions[moduleCode]?.includes(action) ?? false;
  const visibleNavItems = useMemo(() => navItems.flatMap((item) => {
    const moduleCode = sectionModules[item.id];
    if (item.id === "ai-pentester") {
      const hasAi = allowedModules.has("ai_pentester");
      const hasKnowledge = allowedModules.has("knowledge_base");
      if (!hasAi && !hasKnowledge) return [];
      if (!hasAi) return [{ ...item, label: "Knowledge Base", Icon: Database, href: "/ai-pentester/knowledge-hub", children: undefined }];
      const children = item.children?.filter((child) => {
        if (child.href === "/ai-pentester/knowledge-hub") return hasKnowledge;
        if (child.href === "/ai-pentester/launch-scan") {
          return activeWorkspace?.permissions.actions.ai_pentester?.includes("execute") ?? false;
        }
        return true;
      });
      return [{ ...item, children }];
    }
    return allowedModules.has(moduleCode) ? [item] : [];
  }), [activeWorkspace, allowedModules]);
  const activeItem = useMemo(() => visibleNavItems.find((item) => item.id === activeSection) || visibleNavItems[0] || navItems[0], [activeSection, visibleNavItems]);
  const activeAiSubItem = useMemo(() => aiPentesterNavItems.find((item) => item.href === pathname), [pathname]);
  const activePageLabel = activeAiSubItem?.label || activeItem.label;
  const activeGuideId = guideForSection(activeSection);
  const ActivePageIcon = activeAiSubItem?.Icon || activeItem.Icon;
  const selectedActivityMonth = activityMonths[activityMonthIndex] || activityMonths[activityMonths.length - 1];
  const selectedMonthEvents = useMemo(() => activityEvents.filter((event) => event.monthIndex === activityMonthIndex), [activityMonthIndex]);
  const activityModuleOptions = useMemo(() => ["All modules", ...Array.from(new Set(selectedMonthEvents.map((event) => event.module)))], [selectedMonthEvents]);
  const activityStatusOptions = useMemo(() => ["All status", ...Array.from(new Set(selectedMonthEvents.map((event) => event.status)))], [selectedMonthEvents]);
  const filteredActivityEvents = useMemo(() => {
    const searchTerm = activitySearch.trim().toLowerCase();

    return selectedMonthEvents.filter((event) => {
      const matchesModule = activityModuleFilter === "All modules" || event.module === activityModuleFilter;
      const matchesStatus = activityStatusFilter === "All status" || event.status === activityStatusFilter;
      const matchesSearch =
        !searchTerm ||
        `${event.time} ${event.event} ${event.module} ${event.status} ${event.email} ${event.ip} ${event.location} ${event.device}`.toLowerCase().includes(searchTerm);

      return matchesModule && matchesStatus && matchesSearch;
    });
  }, [activityModuleFilter, activitySearch, activityStatusFilter, selectedMonthEvents]);
  const selectedDayEvents = useMemo(
    () => selectedMonthEvents.filter((event) => event.day === selectedActivityDay),
    [selectedActivityDay, selectedMonthEvents],
  );
  const selectedDayLoginCount = selectedActivityMonth.loginCounts[selectedActivityDay] || 0;
  const selectedActivity = useMemo(() => {
    return selectedDayEvents.find((event) => event.id === selectedActivityId) || selectedDayEvents[0] || null;
  }, [selectedActivityId, selectedDayEvents]);
  const SelectedActivityIcon = selectedActivity?.Icon || Info;
  const selectedActivityCalendarDays = useMemo(() => {
    return Array.from({ length: selectedActivityMonth.days }, (_, index) => {
      const day = index + 1;
      const status = selectedActivityMonth.riskDays.includes(day)
        ? "risk"
        : selectedActivityMonth.warningDays.includes(day)
          ? "warning"
          : selectedActivityMonth.activeDays.includes(day)
            ? "active"
            : "idle";

      return { day, status, loginCount: selectedActivityMonth.loginCounts[day] || 0 };
    });
  }, [selectedActivityMonth]);
  const activityMonthSlots = useMemo(() => {
    return [...Array.from({ length: selectedActivityMonth.startOffset }, () => null), ...selectedActivityCalendarDays];
  }, [selectedActivityCalendarDays, selectedActivityMonth.startOffset]);
  const selectedDayLabel = `${selectedActivityMonth.label} ${selectedActivityDay}`;
  const selectActivityDay = (day: number) => {
    setSelectedActivityDay(day);
    const nextEvent = activityEvents.find((event) => event.monthIndex === activityMonthIndex && event.day === day);
    setSelectedActivityId(nextEvent?.id || "");
  };
  const changeActivityMonth = (nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(activityMonths.length - 1, nextIndex));
    const nextDay = defaultActivityDay(boundedIndex);
    const nextEvent = activityEvents.find((event) => event.monthIndex === boundedIndex && event.day === nextDay);

    setActivityMonthIndex(boundedIndex);
    setSelectedActivityDay(nextDay);
    setSelectedActivityId(nextEvent?.id || "");
    setActivitySearch("");
    setActivityModuleFilter("All modules");
    setActivityStatusFilter("All status");
  };
  const nocCurrentStep = nocSetupSteps[nocAgentStep] || nocSetupSteps[0];
  const NocCurrentStepIcon = nocCurrentStep.Icon;
  const selectedAiLaunchSource = aiLaunchSources.find((source) => source.id === aiLaunchSourceId) || aiLaunchSources[0];
  const SelectedAiLaunchSourceIcon = selectedAiLaunchSource.Icon;
  const aiLaunchChecklist = useMemo(
    () => [
      { label: "Job name provided", done: Boolean(aiLaunchJobName.trim()) },
      { label: "Target provided", done: Boolean(aiLaunchTarget.trim()) },
      { label: "Scanner JSON selected", done: Boolean(aiLaunchFileName) },
      { label: "Knowledge Hub enabled", done: aiLaunchUseKnowledgeHub },
      { label: "Sandbox target set", done: aiLaunchSandboxEnabled && Boolean(aiLaunchSandboxTarget.trim()) },
      { label: "AI generation enabled", done: aiLaunchGenerateMissing },
      { label: "Evidence attachment enabled", done: aiLaunchAttachEvidence },
    ],
    [aiLaunchAttachEvidence, aiLaunchFileName, aiLaunchGenerateMissing, aiLaunchJobName, aiLaunchSandboxEnabled, aiLaunchSandboxTarget, aiLaunchTarget, aiLaunchUseKnowledgeHub],
  );
  const aiLaunchReady = aiLaunchChecklist.every((item) => item.done);
  const aiVulnerabilitySeverityOptions = useMemo(() => ["All severity", ...Array.from(new Set(aiVulnerabilityRows.map((row) => row.severity)))], []);
  const aiVulnerabilityValidationOptions = useMemo(() => ["All validation", ...Array.from(new Set(aiVulnerabilityRows.map((row) => row.validation)))], []);
  const filteredAiVulnerabilities = useMemo(() => {
    const searchTerm = aiVulnerabilitySearch.trim().toLowerCase();

    return aiVulnerabilityRows.filter((row) => {
      const matchesSeverity = aiVulnerabilitySeverity === "All severity" || row.severity === aiVulnerabilitySeverity;
      const matchesValidation = aiVulnerabilityValidation === "All validation" || row.validation === aiVulnerabilityValidation;
      const matchesSearch =
        !searchTerm ||
        `${row.cve} ${row.cwe} ${row.title} ${row.severity} ${row.target} ${row.source} ${row.aiStatus} ${row.validation} ${row.verdict} ${row.evidence} ${row.report} ${row.knowledgeHub} ${row.remediation}`
          .toLowerCase()
          .includes(searchTerm);

      return matchesSeverity && matchesValidation && matchesSearch;
    });
  }, [aiVulnerabilitySearch, aiVulnerabilitySeverity, aiVulnerabilityValidation]);
  const selectedAiVulnerability = useMemo(() => {
    return aiVulnerabilityRows.find((row) => row.cve === selectedAiVulnerabilityId) || filteredAiVulnerabilities[0] || aiVulnerabilityRows[0]!;
  }, [filteredAiVulnerabilities, selectedAiVulnerabilityId]);
  const aiKnowledgeSeverityOptions = useMemo(() => ["All severity", ...Array.from(new Set(aiKnowledgeRows.map((row) => row.severity)))], []);
  const aiKnowledgeTemplateOptions = useMemo(() => ["All templates", ...Array.from(new Set(aiKnowledgeRows.map((row) => row.templateStatus)))], []);
  const aiKnowledgeSourceOptions = useMemo(() => ["All sources", ...Array.from(new Set(aiKnowledgeRows.map((row) => row.source)))], []);
  const filteredAiKnowledgeRows = useMemo(() => {
    const searchTerm = aiKnowledgeSearch.trim().toLowerCase();

    return aiKnowledgeRows.filter((row) => {
      const matchesSeverity = aiKnowledgeSeverity === "All severity" || row.severity === aiKnowledgeSeverity;
      const matchesTemplate = aiKnowledgeTemplateStatus === "All templates" || row.templateStatus === aiKnowledgeTemplateStatus;
      const matchesSource = aiKnowledgeSource === "All sources" || row.source === aiKnowledgeSource;
      const matchesSearch =
        !searchTerm ||
        `${row.cve} ${row.cwe} ${row.title} ${row.product} ${row.severity} ${row.templateStatus} ${row.source} ${row.validationType} ${row.pipelineUse} ${row.description} ${row.remediation} ${row.references.join(" ")}`
          .toLowerCase()
          .includes(searchTerm);

      return matchesSeverity && matchesTemplate && matchesSource && matchesSearch;
    });
  }, [aiKnowledgeSearch, aiKnowledgeSeverity, aiKnowledgeSource, aiKnowledgeTemplateStatus]);
  const selectedAiKnowledge = useMemo(() => {
    return aiKnowledgeRows.find((row) => row.cve === selectedAiKnowledgeId) || filteredAiKnowledgeRows[0] || aiKnowledgeRows[0]!;
  }, [filteredAiKnowledgeRows, selectedAiKnowledgeId]);
  const aiReportStatusOptions = useMemo(() => ["All status", ...Array.from(new Set(aiPentestReportRows.map((row) => row.status)))], []);
  const aiReportScopeOptions = useMemo(() => ["All scopes", ...Array.from(new Set(aiPentestReportRows.map((row) => row.scope)))], []);
  const filteredAiReports = useMemo(() => {
    const searchTerm = aiReportSearch.trim().toLowerCase();

    return aiPentestReportRows.filter((row) => {
      const matchesStatus = aiReportStatus === "All status" || row.status === aiReportStatus;
      const matchesScope = aiReportScope === "All scopes" || row.scope === aiReportScope;
      const matchesSearch =
        !searchTerm ||
        `${row.id} ${row.title} ${row.job} ${row.target} ${row.status} ${row.scope} ${row.author} ${row.updated} ${row.blockers.join(" ")} ${row.sections.join(" ")}`
          .toLowerCase()
          .includes(searchTerm);

      return matchesStatus && matchesScope && matchesSearch;
    });
  }, [aiReportScope, aiReportSearch, aiReportStatus]);
  const selectedAiReport = useMemo(() => {
    return aiPentestReportRows.find((row) => row.id === selectedAiReportId) || filteredAiReports[0] || aiPentestReportRows[0]!;
  }, [filteredAiReports, selectedAiReportId]);
  const displayName = user?.full_name || "EVADA User";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const aiRouteItem = aiPentesterNavItems.find((item) => item.href === pathname);
    if (aiRouteItem || pathname.startsWith("/ai-pentester")) {
      setActiveSection("ai-pentester");
      setAiPentesterOpen(true);
      return;
    }

    const routeItem = navItems.find((item) => item.href === pathname);
    if (routeItem) {
      setActiveSection(routeItem.id);
      return;
    }

    if (pathname.startsWith("/scans")) {
      setActiveSection("scanner-engine");
      return;
    }
  }, [pathname]);

  useEffect(() => {
    if (workspaceLoading) return;
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    if (window.sessionStorage.getItem("evada.loginSuccess") === "1") {
      setShowLoginToast(true);
      window.sessionStorage.removeItem("evada.loginSuccess");
    }
  }, [router, workspaceLoading]);

  useEffect(() => {
    if (!showLoginToast) return;

    const timer = window.setTimeout(() => setShowLoginToast(false), 5600);
    return () => window.clearTimeout(timer);
  }, [showLoginToast]);

  useEffect(() => {
    if (!scanToast) return;

    const timer = window.setTimeout(() => setScanToast(""), 4200);
    return () => window.clearTimeout(timer);
  }, [scanToast]);

  useEffect(() => {
    const pendingToast = window.sessionStorage.getItem("evada.scanToast");
    if (!pendingToast) return;

    setScanToast(pendingToast);
    window.sessionStorage.removeItem("evada.scanToast");
  }, []);

  useEffect(() => {
    if (!accountMenuOpen) return;

    const closeMenu = (event: MouseEvent) => {
      if (event.target instanceof Node && accountMenuRef.current?.contains(event.target)) return;
      setAccountMenuOpen(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountMenuOpen(false);
    };

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountMenuOpen]);

  useEffect(() => {
    if (!accountMenuOpen) return;

    const accessToken = getAccessToken();
    if (!accessToken) return;

    let cancelled = false;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    setAuthenticationActivityLoading(true);

    getAuthenticationActivity(accessToken, timezone)
      .then((activity) => {
        if (!cancelled) setAuthenticationActivity(activity);
      })
      .catch(() => {
        if (!cancelled) setAuthenticationActivity(null);
      })
      .finally(() => {
        if (!cancelled) setAuthenticationActivityLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accountMenuOpen]);

  const signOut = async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    try {
      if (accessToken && refreshToken) {
        await logout(refreshToken);
      }
    } catch {
      // Local cleanup still happens even if the refresh token is already invalid.
    } finally {
      clearAuthSession();
      router.replace("/login");
    }
  };

  const moveToSection = (item: NavItem) => {
    setActiveSection(item.id);
    if (item.id === "ai-pentester") {
      if (collapsed) setCollapsed(false);
      setAiPentesterOpen((current) => !current);
      if (!pathname.startsWith("/ai-pentester")) router.push(aiPentesterNavItems[0].href);
      return;
    }

    setAiPentesterOpen(false);
    if (item.href && pathname !== item.href) router.push(item.href);
  };

  const moveToAiPentesterItem = (item: NavChildItem) => {
    setActiveSection("ai-pentester");
    setAiPentesterOpen(true);
    if (pathname !== item.href) router.push(item.href);
  };

  const openNocAgentWizard = () => {
    setNocAgentStep(0);
    setNocAgentOs(nocOsOptions[0].label);
    setNocAgentWizardOpen(true);
  };

  const closeNocAgentWizard = () => {
    setNocAgentWizardOpen(false);
    setNocAgentStep(0);
  };

  const moveNocAgentStep = (direction: "next" | "back") => {
    if (direction === "back") {
      setNocAgentStep((step) => Math.max(0, step - 1));
      return;
    }

    if (nocAgentStep >= nocSetupSteps.length - 1) {
      closeNocAgentWizard();
      setScanToast("Agent setup saved as frontend preview. Backend token registration can connect next.");
      return;
    }

    setNocAgentStep((step) => Math.min(nocSetupSteps.length - 1, step + 1));
  };

  const chooseAiLaunchSource = (source: (typeof aiLaunchSources)[number]) => {
    if (!source.enabled) {
      setScanToast(`${source.label} will connect after backend scanner integrations.`);
      return;
    }

    setAiLaunchSourceId(source.id);
  };

  const launchAiAdHocScan = () => {
    if (!aiLaunchReady) {
      setScanToast("Add job name, target, scanner JSON, sandbox target, and enabled AI policy before launch.");
      return;
    }

    const message = "AI pentest job queued. Opening Pipeline preview.";
    setScanToast(message);
    window.sessionStorage.setItem("evada.scanToast", message);
    window.setTimeout(() => router.push("/ai-pentester/pipeline"), 750);
  };

  if (moduleAccessDenied || actionAccessDenied) {
    return <AccessDenied role={activeWorkspace?.role} />;
  }

  return (
    <main className="evada-product-ui fixed inset-0 min-h-dvh overflow-hidden bg-white text-slate-950">
      {showLoginToast ? (
        <div className="fixed inset-x-3 top-3 z-[80] overflow-hidden rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-4 text-left text-white shadow-[0_24px_70px_rgba(7,16,16,0.34)] sm:left-auto sm:right-4 sm:top-4 sm:w-[min(calc(100vw-2rem),390px)]">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(4,217,255,0.18),transparent_38%),radial-gradient(circle_at_86%_22%,rgba(46,206,130,0.16),transparent_34%)]" />
          <div className="relative flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Login successful</p>
              <p className="mt-1 text-[14px] font-bold leading-relaxed text-white/86">Welcome back, {displayName}.</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex h-full overflow-hidden">
        <aside
          className={`relative hidden h-full shrink-0 overflow-visible bg-[#071010] text-white shadow-[20px_0_60px_rgba(7,16,16,0.16)] transition-[width] duration-300 lg:flex lg:flex-col ${
            collapsed ? "w-[88px]" : "w-[280px]"
          }`}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(46,206,130,0.16),transparent_28%),radial-gradient(circle_at_12%_80%,rgba(14,165,233,0.10),transparent_28%)]" />
          <div className={`relative z-10 flex h-full min-h-0 flex-col ${collapsed ? "px-4 py-5" : "p-5"}`}>
            <div className={`relative flex shrink-0 ${collapsed ? "h-12 items-center justify-center" : "items-center justify-between gap-3"}`}>
              <Link
                href="/"
                prefetch={false}
                aria-label="Go to EVADA home"
                className={`flex items-center rounded-[8px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071010] ${collapsed ? "justify-center" : "gap-3"}`}
              >
                <Image
                  src={collapsed ? "/logos/title.png" : "/logos/logo.png"}
                  alt="EVADA"
                  width={collapsed ? 604 : 2890}
                  height={collapsed ? 596 : 631}
                  priority
                  className={collapsed ? "h-10 w-10 object-contain" : "h-auto w-[128px] object-contain"}
                />
              </Link>
              <button
                type="button"
                onClick={() => setCollapsed((current) => !current)}
                className={`grid shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/[0.1] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${
                  collapsed ? "absolute -right-[34px] top-1/2 z-20 h-9 w-9 -translate-y-1/2 bg-[#10241E] shadow-[0_12px_28px_rgba(7,16,16,0.24)]" : "h-9 w-9"
                }`}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            </div>

            <div className={`${collapsed ? "mt-7" : "mt-8"} shrink-0`}>
              <div className={`flex h-11 items-center rounded-[8px] border border-white/10 bg-white/[0.06] text-white ${collapsed ? "justify-center px-2" : "gap-3 px-3"}`} title={activeWorkspace?.name || "Workspace"}>
                <Database className="h-4 w-4 shrink-0 text-[#2ECE82]" />
                {!collapsed ? <div className="min-w-0"><p className="truncate text-[12px] font-black">{activeWorkspace?.name || "Workspace"}</p><p className="text-[9px] font-bold capitalize text-white/42">{activeWorkspace?.role || "loading"}</p></div> : null}
              </div>
            </div>

            <nav
              className="mt-3 grid min-h-0 flex-1 content-start gap-2 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Dashboard navigation"
            >
              {visibleNavItems.map((item) => {
                const Icon = item.Icon;
                const active = activeSection === item.id;
                const dropdownIconClass = active
                  ? aiPentesterOpen
                    ? "rotate-90 text-[#16A86E]"
                    : "text-[#071010]/55 group-hover:text-[#16A86E]"
                  : aiPentesterOpen
                    ? "rotate-90 text-[#2ECE82]"
                    : "text-white/44 group-hover:text-[#2ECE82]";

                return (
                  <div key={item.id} className="grid gap-1">
                    <button
                      type="button"
                      onClick={() => moveToSection(item)}
                      title={collapsed ? item.label : undefined}
                      aria-expanded={item.children ? aiPentesterOpen : undefined}
                      className={`group flex h-11 items-center gap-3 rounded-[8px] px-3 text-left text-[13px] font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${
                        active
                          ? "bg-white text-[#071010] shadow-[0_16px_36px_rgba(0,0,0,0.22)]"
                          : "text-white/64 hover:bg-white/[0.07] hover:text-white"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-[#16A86E]" : "text-[#75E7FF]/78 group-hover:text-[#2ECE82]"}`} />
                      {!collapsed ? (
                        <>
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.children ? (
                            <ChevronRight className={`h-4 w-4 shrink-0 transition ${dropdownIconClass}`} />
                          ) : null}
                        </>
                      ) : null}
                    </button>

                    {item.children && aiPentesterOpen && !collapsed ? (
                      <div className="ml-5 grid gap-1 border-l border-white/10 pl-3">
                        {item.children.map((child) => {
                          const ChildIcon = child.Icon;
                          const childActive = pathname === child.href;

                          return (
                            <button
                              key={child.href}
                              type="button"
                              onClick={() => moveToAiPentesterItem(child)}
                              className={`group flex h-9 items-center gap-2 rounded-[8px] px-3 text-left text-[12px] font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${
                                childActive ? "bg-[#2ECE82]/14 text-white" : "text-white/54 hover:bg-white/[0.06] hover:text-white"
                              }`}
                            >
                              <ChildIcon className={`h-4 w-4 shrink-0 ${childActive ? "text-[#2ECE82]" : "text-[#75E7FF]/68 group-hover:text-[#2ECE82]"}`} />
                              <span className="min-w-0 flex-1 truncate">{child.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="mt-4 shrink-0 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={signOut}
                title={collapsed ? "Logout" : undefined}
                className={`flex h-11 items-center gap-3 rounded-[8px] border border-red-400/20 bg-red-500/12 px-3 text-[13px] font-black text-red-100 transition hover:bg-red-500/18 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 ${
                  collapsed ? "w-full justify-center" : "w-full justify-start"
                }`}
              >
                <LogOut className="h-4.5 w-4.5 shrink-0" />
                {!collapsed ? <span>Logout</span> : null}
              </button>
            </div>
          </div>
        </aside>

        <section className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-white">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/92 px-4 py-2.5 backdrop-blur-xl sm:px-6 lg:px-7">
            <div className="flex flex-col gap-2 md:flex-row md:flex-nowrap md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#071010] text-[#2ECE82] shadow-[0_12px_26px_rgba(7,16,16,0.14)]">
                  <ActivePageIcon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase text-[#0891B2]">EVADA Dashboard</p>
                  <h1 className="truncate text-[22px] font-black leading-tight text-slate-950 sm:text-[24px]">{activePageLabel}</h1>
                </div>
              </div>

              <div className="flex min-w-0 w-full flex-nowrap items-center justify-end gap-2 md:w-auto">
                <HeaderCommandCenter
                  canCreateAsset={canAction("assets", "create")}
                  canStartScan={canAction("scans", "execute")}
                  showCreateAsset={collapsed}
                  showNotifications={allowedModules.has("notifications")}
                />
                {activeWorkspace?.access_expires_at && activeWorkspace.days_remaining !== null ? (
                  <span
                    className={`inline-flex h-9 min-w-14 items-center justify-center gap-1.5 rounded-[8px] border px-2.5 text-[10px] font-black ${
                      activeWorkspace.days_remaining <= 7
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                    title={`Access expires ${new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" }).format(new Date(activeWorkspace.access_expires_at))}. ${activeWorkspace.days_remaining} day${activeWorkspace.days_remaining === 1 ? "" : "s"} remaining.`}
                    aria-label={`${activeWorkspace.days_remaining} days of workspace access remaining`}
                  >
                    <CalendarClock className="h-4 w-4" />
                    {activeWorkspace.days_remaining}d
                  </span>
                ) : null}
                {activeGuideId ? <GuideButton guideId={activeGuideId} compact className="h-9 w-9 rounded-full" /> : null}
                <div ref={accountMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen((current) => !current)}
                    className="flex h-9 min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-white py-0.5 pl-0.5 pr-2.5 text-left shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:border-emerald-200 hover:shadow-[0_12px_30px_rgba(46,206,130,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    aria-expanded={accountMenuOpen}
                    aria-haspopup="menu"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#E8FFF3] text-[11px] font-black text-[#16A86E] ring-1 ring-emerald-100">
                      {initials || "EV"}
                    </span>
                    <span className="hidden min-w-0 sm:block">
                      <span className="block max-w-[145px] truncate text-[12px] font-black text-slate-900">{displayName}</span>
                      <span className="block max-w-[145px] truncate text-[9px] font-bold text-slate-500">{workspaceLoading ? "Checking..." : "Verified account"}</span>
                    </span>
                    <span className="hidden rounded-full bg-[#071010] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#2ECE82] ring-1 ring-[#2ECE82]/20 2xl:inline-flex">{activeWorkspace?.plan_code || "Plan"}</span>
                  </button>
                  {accountMenuOpen ? (
                    <div className="fixed inset-x-3 top-[5.25rem] z-50 overflow-hidden rounded-[8px] border border-slate-200 bg-white p-4 text-left shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+0.7rem)] sm:w-[340px]">
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E8FFF3] text-[13px] font-black text-[#16A86E] ring-1 ring-emerald-100">
                          {initials || "EV"}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-black text-slate-950">{displayName}</p>
                          <p className="mt-0.5 truncate text-[12px] font-bold text-slate-500">{user?.email || "Verified account"}</p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-[8px] bg-[#071010] p-3 text-white ring-1 ring-[#2ECE82]/20">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#04D9FF]">Current plan</p>
                            <p className="mt-1 text-[18px] font-black capitalize leading-none">{activeWorkspace?.plan_code || "Not assigned"}</p>
                          </div>
                          <span className="rounded-full bg-[#2ECE82]/12 px-2.5 py-1 text-[10px] font-black capitalize text-[#BFFFE1] ring-1 ring-[#2ECE82]/20">{activeWorkspace?.status || "Unknown"}</span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-black">
                          <div className="rounded-[8px] bg-white/[0.06] p-2">
                            <p className="text-white/45">Workspace role</p>
                            <p className="mt-0.5 capitalize text-white">{activeWorkspace?.role || "-"}</p>
                          </div>
                          <div className="rounded-[8px] bg-white/[0.06] p-2">
                            <p className="text-white/45">Tenant</p>
                            <p className="mt-0.5 capitalize text-[#BFFFE1]">{activeWorkspace?.tenant_status || "Unknown"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 rounded-[8px] bg-slate-50 p-3 text-[11px] ring-1 ring-slate-100">
                        <div><p className="font-bold text-slate-400">Membership</p><p className="mt-1 font-black capitalize text-slate-900">{activeWorkspace?.membership_status || "Unknown"}</p></div>
                        <div><p className="font-bold text-slate-400">Report retention</p><p className="mt-1 font-black text-slate-900">{activeWorkspace?.report_retention_days ?? 0} days</p></div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-[10px]">
                        <span className="font-bold text-slate-400">Last login</span>
                        <span className="text-right font-black text-slate-800">
                          {user?.last_login
                            ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(user.last_login))
                            : "Not recorded"}
                        </span>
                      </div>
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black text-slate-900">Recent login activity</p>
                          {!authenticationActivityLoading && authenticationActivity ? (
                            <span
                              className={`rounded-full px-2 py-1 text-[9px] font-black ${
                                authenticationActivity.days.some((day) => day.is_today && day.active)
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                  : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                              }`}
                            >
                              {authenticationActivity.days.some((day) => day.is_today && day.active) ? "Today active" : "No login today"}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-3 grid grid-cols-7 gap-2" aria-label="Recent account login activity">
                          {authenticationActivityLoading && !authenticationActivity
                            ? Array.from({ length: 7 }, (_, index) => (
                                <span key={index} className="h-8 w-8 animate-pulse rounded-full bg-slate-100" />
                              ))
                            : authenticationActivity?.days.slice(-7).map((day) => {
                                const activityLabel = `${day.weekday}, ${new Intl.DateTimeFormat("en", {
                                  month: "short",
                                  day: "numeric",
                                }).format(new Date(`${day.date}T12:00:00`))}: ${day.login_count} ${
                                  day.login_count === 1 ? "login" : "logins"
                                }, ${day.logout_count} ${day.logout_count === 1 ? "logout" : "logouts"}`;

                                return (
                                  <span key={day.date} className="group relative flex justify-center">
                                    <span
                                      className={`grid h-8 w-8 place-items-center rounded-full text-[10px] font-black transition ${
                                        day.active
                                          ? "bg-[#2ECE82] text-[#052E21] ring-1 ring-emerald-300"
                                          : day.is_future
                                            ? "bg-slate-50 text-slate-400 ring-1 ring-slate-200"
                                            : "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                                      } ${day.is_today ? "ring-2 ring-slate-950 ring-offset-2" : ""}`}
                                      title={activityLabel}
                                      aria-label={activityLabel}
                                    >
                                      {day.label}
                                    </span>
                                    <span className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-20 hidden w-max max-w-[210px] -translate-x-1/2 rounded-[6px] bg-slate-950 px-2.5 py-2 text-center text-[9px] font-bold leading-4 text-white shadow-xl group-hover:block">
                                      {activityLabel}
                                    </span>
                                  </span>
                                );
                              })}
                        </div>
                        {!authenticationActivityLoading && !authenticationActivity ? (
                          <p className="mt-3 text-[10px] font-bold text-rose-600">Recent activity is temporarily unavailable.</p>
                        ) : (
                          <p className="mt-3 text-[9px] font-bold text-slate-400">Hover a day for login and logout totals.</p>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:hidden">
            <div className="mb-3 flex items-center gap-3">
              <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Workspace</span>
              <span className="inline-flex h-9 min-w-0 items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-3"><Database className="h-4 w-4 shrink-0 text-[#16A86E]" /><span className="truncate text-[11px] font-black text-slate-800">{activeWorkspace?.name || "Workspace"}</span></span>
            </div>
            <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1">
              {visibleNavItems.map((item) => {
                const Icon = item.Icon;
                const active = activeSection === item.id;

                return (
                  <div key={item.id} className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveToSection(item)}
                      className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[12px] font-black ${
                        active ? "border-[#071010] bg-[#071010] text-white" : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {item.children ? <ChevronRight className={`h-3.5 w-3.5 transition ${aiPentesterOpen ? "rotate-90" : ""}`} /> : null}
                    </button>
                    {item.children && aiPentesterOpen ? (
                      <>
                        {item.children.map((child) => {
                          const ChildIcon = child.Icon;
                          const childActive = pathname === child.href;

                          return (
                            <button
                              key={child.href}
                              type="button"
                              onClick={() => moveToAiPentesterItem(child)}
                              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[12px] font-black ${
                                childActive ? "border-[#2ECE82] bg-[#E8FFF3] text-[#071010]" : "border-slate-200 bg-white text-slate-600"
                              }`}
                            >
                              <ChildIcon className="h-4 w-4" />
                              {child.label}
                            </button>
                          );
                        })}
                      </>
                    ) : null}
                  </div>
                );
              })}
              <button type="button" onClick={signOut} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 text-[12px] font-black text-red-700">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          <section className="evada-workspace-scroll min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto overscroll-contain bg-white px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {sessionError ? (
              <div className="mb-5 rounded-[8px] border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-bold text-red-800">{sessionError}</div>
            ) : null}

            {activeSection === "overview" ? (
              <OverviewWorkspace />
            ) : activeSection === "asset-management" ? (
              <AssetWorkspace />
            ) : activeSection === "scanner-engine" ? (
              <ScannerWorkspace />
            ) : activeSection === "ai-pentester" && pathname === "/ai-pentester/dashboard" ? (
              <div className="grid gap-4">
                {scanToast ? (
                  <div className="fixed inset-x-3 top-3 z-[90] rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-4 text-white shadow-[0_24px_70px_rgba(7,16,16,0.28)] sm:left-auto sm:right-4 sm:top-4 sm:w-[min(calc(100vw-2rem),390px)]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                        <BrainCircuit className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">AI Pentester preview</p>
                        <p className="mt-1 text-[13px] font-bold leading-relaxed text-white/80">{scanToast}</p>
                      </div>
                      <button type="button" onClick={() => setScanToast("")} className="text-white/50 transition hover:text-white" aria-label="Close notification">
                        <ChevronRight className="h-4 w-4 rotate-45" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {aiAdHocMetrics.map((item) => (
                    <article key={item.label} className="min-h-[92px] rounded-[8px] border border-slate-200 bg-white px-4 py-3 shadow-[0_6px_16px_rgba(15,23,42,0.03)]">
                      <div className="flex h-full items-center gap-3">
                        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ${metricToneClasses(item.tone)}`}>
                          <item.Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[12px] font-black leading-tight text-slate-500">{item.label}</p>
                            <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-slate-400 ring-1 ring-slate-100">{item.helper}</span>
                          </div>
                          <p className="mt-2 text-[26px] font-black leading-none text-slate-950">{item.value}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
                  <div className="grid gap-4">

                    <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-5">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0891B2]">AI Pentester</p>
                          <h2 className="mt-2 text-[28px] font-black leading-tight text-slate-950">Ad Hoc Dashboard</h2>
                          <p className="mt-2 max-w-[760px] text-[13px] font-semibold leading-relaxed text-slate-600">
                            Graphical overview for uploaded scanner JSON, CVE normalization, Knowledge Hub matching, AI script generation, sandbox validation, evidence, and report readiness.
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {["JSON to CVE queue", "KB script matching", "AI validation loop"].map((item) => (
                              <span key={item} className="inline-flex h-8 items-center gap-2 rounded-full bg-slate-50 px-3 text-[11px] font-black text-slate-600 ring-1 ring-slate-100">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#16A86E]" />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-2 rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Latest run</p>
                              <p className="mt-1 text-[20px] font-black leading-tight">72% complete</p>
                              <p className="mt-1 text-[11px] font-bold text-white/58">{aiActiveRun.status}</p>
                            </div>
                            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                              <BrainCircuit className="h-5 w-5" />
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-[#2ECE82]" style={{ width: `${aiActiveRun.progress}%` }} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-[8px] bg-white/[0.06] p-2.5">
                              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">Current step</p>
                              <p className="mt-1 text-[11px] font-black leading-snug text-white">{aiActiveRun.currentStep}</p>
                            </div>
                            <div className="rounded-[8px] bg-white/[0.06] p-2.5">
                              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">Report</p>
                              <p className="mt-1 text-[11px] font-black leading-snug text-[#BFFFE1]">{aiActiveRun.report}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 lg:px-5">
                        {canAction("ai_pentester", "execute") ? <button
                          type="button"
                          onClick={() => router.push("/ai-pentester/launch-scan")}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white shadow-[0_14px_30px_rgba(7,16,16,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0E241E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                        >
                          <Zap className="h-4 w-4 text-[#2ECE82]" />
                          Launch ad hoc scan
                        </button> : null}
                        <button
                          type="button"
                          onClick={() => router.push("/ai-pentester/pipeline")}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                        >
                          <Layers3 className="h-4 w-4 text-[#0891B2]" />
                          View pipeline
                        </button>
                        {canAction("ai_pentester", "create") ? <button
                          type="button"
                          onClick={() => router.push("/ai-pentester/reports")}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                        >
                          <FileText className="h-4 w-4 text-[#0891B2]" />
                          Generate report
                        </button> : null}
                      </div>
                    </article>

                    <section className="grid gap-3 2xl:grid-cols-2">
                      <article className="rounded-[8px] border border-slate-200 bg-white p-3.5 shadow-[0_8px_18px_rgba(15,23,42,0.028)]">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[17px] font-black text-slate-950">Validation funnel</h3>
                            <p className="mt-1 text-[12px] font-semibold text-slate-500">From uploaded JSON to confirmed proof.</p>
                          </div>
                          <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#16A86E] ring-1 ring-slate-100">19 confirmed</span>
                        </div>
                        <div className="mt-3 grid gap-2">
                          {aiValidationFunnel.map((item) => (
                            <div key={item.label} className="grid gap-1.5">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-[11px] font-black text-slate-700">{item.label}</span>
                                <span className="text-[11px] font-black text-slate-950">{item.value}</span>
                              </div>
                              <div className="h-6 overflow-hidden rounded-[8px] bg-slate-50 ring-1 ring-slate-100">
                                <div className={`flex h-full min-w-10 items-center justify-end rounded-[8px] px-2.5 text-[10px] font-black text-white ${item.color}`} style={{ width: `${Math.max(item.percent, 8)}%` }}>
                                  {item.percent}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>

                      <article className="rounded-[8px] border border-slate-200 bg-white p-3.5 shadow-[0_8px_18px_rgba(15,23,42,0.028)]">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[17px] font-black text-slate-950">Severity distribution</h3>
                            <p className="mt-1 text-[12px] font-semibold text-slate-500">Normalized CVEs from ad hoc scan uploads.</p>
                          </div>
                          <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#16A86E] ring-1 ring-slate-100">633 total</span>
                        </div>
                        <div className="mt-3 grid gap-3">
                          <div className="mx-auto grid h-32 w-32 place-items-center rounded-full shadow-inner" style={{ background: "conic-gradient(#0B5B49 0 4%, #0F7A5E 4% 16%, #16A86E 16% 52%, #34D399 52% 69%, #BFFFE1 69% 100%)" }}>
                            <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center shadow-[inset_0_0_0_1px_rgba(226,232,240,1)]">
                              <div>
                                <p className="text-[22px] font-black leading-none text-slate-950">633</p>
                                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">CVEs</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            {aiSeverityDistribution.map((item) => (
                              <div key={item.label} className="grid gap-1">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-[11px] font-black text-slate-700">{item.label}</span>
                                  <span className="text-[11px] font-black text-slate-950">{item.value} <span className="text-slate-400">({item.percent}%)</span></span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                  <div className={`h-full min-w-2 rounded-full ${item.color}`} style={{ width: `${Math.max(item.percent, 3)}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </article>
                    </section>

                    <article className="rounded-[8px] border border-slate-200 bg-white p-3.5 shadow-[0_8px_18px_rgba(15,23,42,0.028)]">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[17px] font-black text-slate-950">AI pentest flow</h3>
                          <p className="mt-1 text-[12px] font-semibold text-slate-500">Every uploaded scanner output moves through the same decision pipeline.</p>
                        </div>
                        <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#16A86E] ring-1 ring-slate-100">Graphical overview</span>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
                        {aiPipelineStages.map((stage) => (
                          <div key={stage.label} className="rounded-[8px] border border-slate-200 bg-slate-50/70 p-2.5 transition hover:border-[#2ECE82]/45 hover:bg-white">
                            <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#E8FFF3] text-[#16A86E] ring-1 ring-[#2ECE82]/20">
                              <stage.Icon className="h-3.5 w-3.5" />
                            </span>
                            <p className="mt-2 text-[9px] font-black uppercase tracking-[0.1em] text-slate-500">{stage.label}</p>
                            <p className="mt-0.5 text-[13px] font-black text-slate-950">{stage.value}</p>
                            <p className="mt-0.5 text-[10.5px] font-semibold leading-relaxed text-slate-500">{stage.helper}</p>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white ring-1 ring-slate-100">
                              <div className="h-full rounded-full bg-[#2ECE82]" style={{ width: `${stage.percent}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  </div>

                  <aside className="grid gap-4">
                    <article className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white shadow-[0_12px_30px_rgba(7,16,16,0.14)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Active run</p>
                          <h3 className="mt-1 text-[20px] font-black leading-tight">{aiActiveRun.name}</h3>
                          <p className="mt-1 text-[11px] font-bold text-white/58">{aiActiveRun.source}</p>
                        </div>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                          <Target className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="mt-3 rounded-[8px] bg-white/[0.06] p-3">
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">Target</p>
                        <p className="mt-1 truncate text-[12px] font-black text-white">{aiActiveRun.target}</p>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-[8px] bg-white/[0.06] p-3">
                          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">Progress</p>
                          <p className="mt-1 text-[20px] font-black text-[#BFFFE1]">{aiActiveRun.progress}%</p>
                        </div>
                        <div className="rounded-[8px] bg-white/[0.06] p-3">
                          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">Verdicts</p>
                          <p className="mt-1 text-[20px] font-black text-white">61</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push("/ai-pentester/pipeline")}
                        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2ECE82] text-[12px] font-black text-[#071010] transition hover:-translate-y-0.5 hover:bg-[#3FDC8F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        Open pipeline
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="border-b border-slate-100 p-3.5">
                        <h3 className="text-[18px] font-black text-slate-950">Engine health</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">Readiness for safe validation and reports.</p>
                      </div>
                      <div className="grid gap-2 p-3.5">
                        {aiEngineHealth.map((item) => (
                          <div key={item.label} className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">{item.label}</span>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${metricToneClasses(item.tone)}`}>{item.value}</span>
                            </div>
                            <p className="mt-1 text-[11px] font-bold text-slate-500">{item.helper}</p>
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="border-b border-slate-100 p-3.5">
                        <h3 className="text-[18px] font-black text-slate-950">AI activity timeline</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">Short summary, not full logs.</p>
                      </div>
                      <div className="grid gap-1 p-3.5">
                        {aiActivityTimeline.map((item, index) => (
                          <div key={item.label} className="relative flex gap-3 pb-3 last:pb-0">
                            {index < aiActivityTimeline.length - 1 ? <span className="absolute left-[17px] top-8 h-[calc(100%-1.2rem)] w-px bg-slate-200" /> : null}
                            <span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(item.tone)}`}>
                              <item.Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1 rounded-[8px] bg-slate-50 p-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-[12px] font-black text-slate-950">{item.label}</p>
                                <span className="text-[10px] font-black text-slate-400">{item.time}</span>
                              </div>
                              <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{item.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  </aside>
                </section>

                    <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">CVE validation queue</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Script source, attempt count, sandbox status, and final verdict.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {["All", "Critical", "KB matched", "AI generated", "Manual review"].map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setScanToast(`${item} queue filter is frontend-only for now.`)}
                              className={`h-8 rounded-full px-3 text-[10px] font-black ring-1 transition hover:-translate-y-0.5 ${
                                item === "All" ? "bg-[#071010] text-white ring-[#071010]" : "bg-white text-slate-600 ring-slate-200 hover:ring-[#2ECE82]/40"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="overflow-x-auto p-3">
                        <table className="w-full min-w-[1040px] table-fixed border-collapse text-left">
                          <colgroup>
                            <col className="w-[15%]" />
                            <col className="w-[23%]" />
                            <col className="w-[10%]" />
                            <col className="w-[18%]" />
                            <col className="w-[12%]" />
                            <col className="w-[8%]" />
                            <col className="w-[8%]" />
                            <col className="w-[6%]" />
                          </colgroup>
                          <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
                              <th className="rounded-l-[8px] px-3 py-2.5">CVE</th>
                              <th className="px-3 py-2.5">Title</th>
                              <th className="px-3 py-2.5">Severity</th>
                              <th className="px-3 py-2.5">Target</th>
                              <th className="px-3 py-2.5">Script source</th>
                              <th className="px-3 py-2.5">Attempt</th>
                              <th className="px-3 py-2.5">Status</th>
                              <th className="rounded-r-[8px] px-3 py-2.5 text-right">Verdict</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {aiValidationQueue.map((row) => (
                              <tr key={row.cve} className="transition hover:bg-slate-50/70">
                                <td className="px-3 py-3">
                                  <button
                                    type="button"
                                    onClick={() => setScanToast(`${row.cve} workbench preview opens after backend CVE data is connected.`)}
                                    className="text-[12px] font-black text-[#2563EB] transition hover:text-[#071010]"
                                  >
                                    {row.cve}
                                  </button>
                                </td>
                                <td className="px-3 py-3">
                                  <p className="truncate text-[12px] font-black text-slate-950">{row.title}</p>
                                </td>
                                <td className="px-3 py-3">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${severityPillClasses(row.severity)}`}>{row.severity}</span>
                                </td>
                                <td className="px-3 py-3">
                                  <span className="block truncate text-[11px] font-bold text-slate-600">{row.target}</span>
                                </td>
                                <td className="px-3 py-3">
                                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${metricToneClasses(row.tone)}`}>
                                    {row.source === "KB Script" ? <Database className="h-3 w-3" /> : <BrainCircuit className="h-3 w-3" />}
                                    {row.source}
                                  </span>
                                </td>
                                <td className="px-3 py-3">
                                  <span className="text-[11px] font-black text-slate-700">{row.attempt}</span>
                                </td>
                                <td className="px-3 py-3">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiValidationStatusClasses(row.status)}`}>{row.status}</span>
                                </td>
                                <td className="px-3 py-3 text-right">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiVerdictClasses(row.verdict)}`}>{row.verdict}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </article>

                    <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Recent ad hoc runs</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Uploaded scanner outputs and their AI validation result.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => router.push("/ai-pentester/launch-scan")}
                          className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-700 transition hover:border-[#2ECE82]/40 hover:text-[#071010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                        >
                          New run
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid gap-2 p-3">
                        {aiRecentRuns.map((run) => (
                          <div key={run.job} className="grid gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-3 transition hover:border-[#2ECE82]/35 hover:bg-white md:grid-cols-[minmax(0,1fr)_130px_110px_130px_92px] md:items-center">
                            <div className="min-w-0">
                              <p className="truncate text-[12px] font-black text-slate-950">{run.job}</p>
                              <p className="mt-0.5 truncate text-[11px] font-bold text-slate-500">{run.target}</p>
                              <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">{run.started}</p>
                            </div>
                            <div className="text-[11px] font-black text-slate-700">
                              <span className="text-slate-950">{run.cves}</span> CVEs
                            </div>
                            <div className="text-[11px] font-black text-slate-700">
                              <span className="text-rose-600">{run.vulnerable}</span> vulnerable
                            </div>
                            <span className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${metricToneClasses(run.tone)}`}>{run.status}</span>
                            <div className="flex items-center gap-1 md:justify-end">
                              <button
                                type="button"
                                onClick={() => setScanToast(`${run.job} preview is frontend-only for now.`)}
                                className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#2ECE82]/40 hover:text-[#071010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                                aria-label={`Preview ${run.job}`}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => router.push("/ai-pentester/pipeline")}
                                className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-[#0891B2] transition hover:border-[#2ECE82]/40 hover:text-[#071010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                                aria-label={`Open pipeline for ${run.job}`}
                              >
                                <Layers3 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
              </div>
            ) : activeSection === "ai-pentester" && pathname === "/ai-pentester/pipeline" ? (
              <div className="flex min-h-[calc(100dvh-11rem)] flex-col gap-4">
                {scanToast ? (
                  <div className="fixed right-4 top-4 z-[90] w-[min(calc(100vw-2rem),390px)] rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-4 text-white shadow-[0_24px_70px_rgba(7,16,16,0.28)]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                        <Layers3 className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Pipeline preview</p>
                        <p className="mt-1 text-[13px] font-bold leading-relaxed text-white/80">{scanToast}</p>
                      </div>
                      <button type="button" onClick={() => setScanToast("")} className="text-white/50 transition hover:text-white" aria-label="Close notification">
                        <ChevronRight className="h-4 w-4 rotate-45" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
                  {aiPipelineMetrics.map((item) => (
                    <article key={item.label} className="rounded-[8px] border border-slate-200 bg-white px-3 py-2.5 shadow-[0_6px_16px_rgba(15,23,42,0.03)]">
                      <div className="flex items-center gap-2.5">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ${metricToneClasses(item.tone)}`}>
                          <item.Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[11px] font-black text-slate-500">{item.label}</p>
                            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-slate-400 ring-1 ring-slate-100">{item.helper}</span>
                          </div>
                          <p className="mt-0.5 text-[21px] font-black leading-none text-slate-950">{item.value}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>

                <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                  <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_310px] lg:p-5">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0891B2]">AI Pentester</p>
                      <h2 className="mt-2 text-[28px] font-black leading-tight text-slate-950">Pipeline Dashboard</h2>
                      <p className="mt-2 max-w-[780px] text-[13px] font-semibold leading-relaxed text-slate-600">
                        Detailed execution view for the active ad hoc AI pentest job. Track stage progress, sanitizer warnings, sandbox validation, evidence collection, and report readiness.
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {["Polls every 2s", "Sanitizer protected", "Evidence tracked"].map((item) => (
                          <span key={item} className="inline-flex h-8 items-center gap-2 rounded-full bg-slate-50 px-3 text-[11px] font-black text-slate-600 ring-1 ring-slate-100">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#16A86E]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2 rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Current stage</p>
                          <p className="mt-1 text-[22px] font-black leading-none">Sandbox validation</p>
                          <p className="mt-1 text-[11px] font-bold text-white/58">CVE-2024-5678 attempt 2 / 3</p>
                        </div>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                          <Terminal className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[72%] rounded-full bg-[#2ECE82]" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-[8px] bg-white/[0.06] p-2.5">
                          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">Job</p>
                          <p className="mt-1 truncate text-[11px] font-black text-white">AI-ADHOC-2026-0721</p>
                        </div>
                        <div className="rounded-[8px] bg-white/[0.06] p-2.5">
                          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">Target</p>
                          <p className="mt-1 truncate text-[11px] font-black text-[#BFFFE1]">polosofttech.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 lg:px-5">
                    <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/dashboard")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white shadow-[0_14px_30px_rgba(7,16,16,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0E241E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#2ECE82]" />
                      Open Ad Hoc Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/vulnerabilities")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <ShieldAlert className="h-4 w-4 text-[#0891B2]" />
                      Open CVE Workbench
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/reports")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <FileText className="h-4 w-4 text-[#0891B2]" />
                      Generate Report
                    </button>
                  </div>
                </article>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
                  <div className="grid gap-4">
                    <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Active pipeline tracker</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Stage status, runtime, and record counts for the current job.</p>
                        </div>
                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#0891B2] ring-1 ring-cyan-100">Running</span>
                      </div>
                      <div className="grid gap-2 p-3">
                        {aiPipelineSteps.map((step) => (
                          <div key={step.id} className="grid gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-3 transition hover:border-[#2ECE82]/35 hover:bg-white lg:grid-cols-[54px_minmax(0,1fr)_120px_90px_110px] lg:items-center">
                            <div className="flex items-center gap-2 lg:block">
                              <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-white text-[12px] font-black text-slate-500 ring-1 ring-slate-200">{step.id}</span>
                            </div>
                            <div className="flex min-w-0 items-start gap-3">
                              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(step.tone)}`}>
                                <step.Icon className="h-4.5 w-4.5" />
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-black text-slate-950">{step.stage}</p>
                                <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{step.description}</p>
                              </div>
                            </div>
                            <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${aiPipelineStatusClasses(step.status)}`}>{step.status}</span>
                            <span className="text-[12px] font-black text-slate-700">{step.duration}</span>
                            <span className="text-[12px] font-black text-slate-500">{step.records}</span>
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Live log feed</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Technical execution stream for generation, sanitizer, and sandbox events.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAiPipelineStreamPaused((value) => !value)}
                            className={`inline-flex h-9 items-center gap-2 rounded-[8px] px-3 text-[11px] font-black ring-1 transition hover:-translate-y-0.5 ${
                              aiPipelineStreamPaused ? "bg-amber-50 text-amber-700 ring-amber-100" : "bg-[#E8FFF3] text-[#16A86E] ring-emerald-100"
                            }`}
                          >
                            {aiPipelineStreamPaused ? "Resume stream" : "Pause stream"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              window.navigator.clipboard?.writeText(aiPipelineLogs.join("\n"));
                              setScanToast("Pipeline logs copied in frontend preview.");
                            }}
                            className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copy logs
                          </button>
                          {canAction("ai_pentester", "download") ? <button
                            type="button"
                            onClick={() => setScanToast("Log download will connect after backend job storage.")}
                            className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button> : null}
                        </div>
                      </div>
                      <div className="bg-[#071010] p-4">
                        <div className="rounded-[8px] border border-white/10 bg-black/25 p-4 font-mono text-[11px] leading-6 text-[#BFFFE1] shadow-inner">
                          {aiPipelineLogs.map((line) => (
                            <p key={line} className={line.includes("WARN") ? "text-amber-200" : line.includes("sandbox") ? "text-cyan-100" : "text-[#BFFFE1]"}>
                              {line}
                            </p>
                          ))}
                          {aiPipelineStreamPaused ? <p className="mt-2 text-amber-200">[stream paused] frontend preview is holding new events.</p> : null}
                        </div>
                      </div>
                    </article>

                    <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                      <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                        <div className="border-b border-slate-100 p-4">
                          <h3 className="text-[18px] font-black text-slate-950">Warnings and rejections</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Latest sanitizer and sandbox decisions that need attention.</p>
                        </div>
                        <div className="grid gap-2 p-3">
                          {aiPipelineWarnings.map((warning) => (
                            <div key={warning.cve} className="rounded-[8px] border border-slate-200 bg-slate-50 p-3 transition hover:border-[#2ECE82]/35 hover:bg-white">
                              <div className="flex items-start gap-3">
                                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(warning.tone)}`}>
                                  <warning.Icon className="h-4.5 w-4.5" />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-[12px] font-black text-slate-950">{warning.cve}</p>
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${metricToneClasses(warning.tone)}`}>{warning.action}</span>
                                  </div>
                                  <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{warning.reason}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>

                      <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                        <div className="border-b border-slate-100 p-4">
                          <h3 className="text-[18px] font-black text-slate-950">Evidence queue</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Proof artifacts moving toward the AI pentest report.</p>
                        </div>
                        <div className="overflow-x-auto p-3">
                          <table className="w-full min-w-[620px] table-fixed border-collapse text-left">
                            <colgroup>
                              <col className="w-[24%]" />
                              <col className="w-[22%]" />
                              <col className="w-[22%]" />
                              <col className="w-[14%]" />
                              <col className="w-[18%]" />
                            </colgroup>
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
                                <th className="rounded-l-[8px] px-3 py-2.5">CVE</th>
                                <th className="px-3 py-2.5">Evidence</th>
                                <th className="px-3 py-2.5">Artifact</th>
                                <th className="px-3 py-2.5">Report</th>
                                <th className="rounded-r-[8px] px-3 py-2.5 text-right">Verdict</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {aiEvidenceQueue.map((item) => (
                                <tr key={item.cve} className="transition hover:bg-slate-50/70">
                                  <td className="px-3 py-3 text-[12px] font-black text-[#2563EB]">{item.cve}</td>
                                  <td className="px-3 py-3">
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${metricToneClasses(item.tone)}`}>{item.evidence}</span>
                                  </td>
                                  <td className="px-3 py-3 text-[11px] font-black text-slate-600">{item.artifact}</td>
                                  <td className="px-3 py-3 text-[11px] font-black text-slate-700">{item.report}</td>
                                  <td className="px-3 py-3 text-right">
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiVerdictClasses(item.verdict)}`}>{item.verdict}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </article>
                    </section>
                  </div>

                  <aside className="grid gap-4 self-start">
                    <article className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white shadow-[0_12px_30px_rgba(7,16,16,0.14)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Current stage detail</p>
                          <h3 className="mt-1 text-[20px] font-black leading-tight">Sandbox validation</h3>
                          <p className="mt-1 text-[11px] font-bold text-white/58">Last event: validation started</p>
                        </div>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                          <Terminal className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {[
                          ["Job", "AI-ADHOC-2026-0721"],
                          ["Target", "https://www.polosofttech.com"],
                          ["Current CVE", "CVE-2024-5678"],
                          ["Attempt", "2 / 3"],
                          ["Progress", "72%"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-[8px] bg-white/[0.06] p-2.5">
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">{label}</p>
                            <p className="mt-1 truncate text-[12px] font-black text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="border-b border-slate-100 p-3.5">
                        <h3 className="text-[18px] font-black text-slate-950">Stage health</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">Operational counters for this run.</p>
                      </div>
                      <div className="grid gap-2 p-3.5">
                        {aiPipelineHealth.map((item) => (
                          <div key={item.label} className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">{item.label}</span>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${metricToneClasses(item.tone)}`}>{item.value}</span>
                            </div>
                            <p className="mt-1 text-[11px] font-bold text-slate-500">{item.helper}</p>
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-amber-100 bg-amber-50 p-3.5 shadow-[0_8px_22px_rgba(245,158,11,0.06)]">
                      <div className="flex items-start gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-white text-amber-600 ring-1 ring-amber-100">
                          <AlertTriangle className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <p className="text-[12px] font-black uppercase tracking-[0.12em] text-amber-700">Next action</p>
                          <h3 className="mt-1 text-[16px] font-black text-slate-950">Review 8 rejected scripts</h3>
                          <p className="mt-1 text-[12px] font-semibold leading-relaxed text-slate-600">Manual review is blocking final validation and report approval for this run.</p>
                          <button
                            type="button"
                            onClick={() => router.push("/ai-pentester/vulnerabilities")}
                            className="mt-3 inline-flex h-9 items-center gap-2 rounded-[8px] bg-white px-3 text-[11px] font-black text-slate-800 ring-1 ring-amber-100 transition hover:ring-[#2ECE82]/40"
                          >
                            Open CVE Workbench
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  </aside>
                </section>
              </div>
            ) : activeSection === "ai-pentester" && pathname === "/ai-pentester/vulnerabilities" ? (
              <div className="grid gap-4">
                {scanToast ? (
                  <div className="fixed right-4 top-4 z-[90] w-[min(calc(100vw-2rem),390px)] rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-4 text-white shadow-[0_24px_70px_rgba(7,16,16,0.28)]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                        <ShieldAlert className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">CVE workbench preview</p>
                        <p className="mt-1 text-[13px] font-bold leading-relaxed text-white/80">{scanToast}</p>
                      </div>
                      <button type="button" onClick={() => setScanToast("")} className="text-white/50 transition hover:text-white" aria-label="Close notification">
                        <ChevronRight className="h-4 w-4 rotate-45" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-6">
                  {aiVulnerabilityMetrics.map((item) => (
                    <article key={item.label} className="rounded-[8px] border border-slate-200 bg-white px-3 py-2.5 shadow-[0_6px_16px_rgba(15,23,42,0.03)]">
                      <div className="flex items-center gap-2.5">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ${metricToneClasses(item.tone)}`}>
                          <item.Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[11px] font-black text-slate-500">{item.label}</p>
                            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-slate-400 ring-1 ring-slate-100">{item.helper}</span>
                          </div>
                          <p className="mt-0.5 text-[21px] font-black leading-none text-slate-950">{item.value}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>

                <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                  <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_330px] lg:p-5">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0891B2]">AI Pentester</p>
                      <h2 className="mt-2 text-[28px] font-black leading-tight text-slate-950">AI CVE Workbench</h2>
                      <p className="mt-2 max-w-[820px] text-[13px] font-semibold leading-relaxed text-slate-600">
                        Review normalized CVEs from scanner JSON, track AI validation, inspect evidence, and decide what should move into the AI pentest report.
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {["Scanner JSON normalized", "Knowledge Hub linked", "Sandbox verdict tracked"].map((item) => (
                          <span key={item} className="inline-flex h-8 items-center gap-2 rounded-full bg-slate-50 px-3 text-[11px] font-black text-slate-600 ring-1 ring-slate-100">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#16A86E]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Workbench status</p>
                          <p className="mt-1 text-[22px] font-black leading-none">42 report ready</p>
                          <p className="mt-1 text-[11px] font-bold text-white/58">8 findings still need human review</p>
                        </div>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                          <ShieldAlert className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {[
                          ["Vuln", "19"],
                          ["Not vuln", "11"],
                          ["Review", "8"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-[8px] bg-white/[0.06] p-2.5">
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">{label}</p>
                            <p className="mt-1 text-[18px] font-black leading-none text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 lg:px-5">
                    {canAction("ai_pentester", "execute") ? <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/launch-scan")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white shadow-[0_14px_30px_rgba(7,16,16,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0E241E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <Play className="h-4 w-4 fill-[#2ECE82] text-[#2ECE82]" />
                      Launch Scan
                    </button> : null}
                    {canAction("ai_pentester", "download") ? <button
                      type="button"
                      onClick={() => setScanToast("CVE export will connect after backend report storage.")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <Download className="h-4 w-4 text-[#0891B2]" />
                      Export
                    </button> : null}
                    {canAction("ai_pentester", "create") ? <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/reports")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <FileText className="h-4 w-4 text-[#0891B2]" />
                      Create Report
                    </button> : null}
                    <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/pipeline")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <Layers3 className="h-4 w-4 text-[#0891B2]" />
                      Open Pipeline
                    </button>
                  </div>
                </article>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
                  <div className="grid gap-4">
                    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                      <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[18px] font-black text-slate-950">Validation funnel</h3>
                            <p className="mt-1 text-[13px] font-semibold text-slate-500">CVE movement from scanner import to report-ready proof.</p>
                          </div>
                          <span className="rounded-full bg-[#E8FFF3] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#16A86E] ring-1 ring-emerald-100">AI assisted</span>
                        </div>
                        <div className="mt-4 grid gap-2">
                          {aiVulnerabilityFlow.map((step) => (
                            <div key={step.label} className="grid gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[44px_minmax(0,1fr)_64px] sm:items-center">
                              <span className={`grid h-10 w-10 place-items-center rounded-[8px] ring-1 ${metricToneClasses(step.tone)}`}>
                                <step.Icon className="h-4.5 w-4.5" />
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-[12px] font-black text-slate-950">{step.label}</p>
                                  <p className="text-[11px] font-black text-slate-500">{step.value}</p>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                                  <div className="h-full rounded-full bg-[#2ECE82]" style={{ width: `${step.percent}%` }} />
                                </div>
                              </div>
                              <span className="text-right text-[12px] font-black text-slate-600">{step.percent}%</span>
                            </div>
                          ))}
                        </div>
                      </article>

                      <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Affected targets</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Top targets by normalized CVE count.</p>
                        </div>
                        <div className="mt-4 grid gap-2">
                          {aiAffectedTargets.map((item) => (
                            <div key={item.target} className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-[12px] font-black text-slate-950">{item.target}</p>
                                  <p className="mt-1 text-[11px] font-bold text-slate-500">{item.critical} critical, {item.high} high</p>
                                </div>
                                <span className={`rounded-full px-2 py-1 text-[10px] font-black ring-1 ${metricToneClasses(item.tone)}`}>{item.total}</span>
                              </div>
                              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                                <div className="h-full rounded-full bg-[#0891B2]" style={{ width: `${Math.min(100, item.total * 2)}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>
                    </section>

                    <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="border-b border-slate-100 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="text-[18px] font-black text-slate-950">CVE findings</h3>
                            <p className="mt-1 text-[13px] font-semibold text-slate-500">Filtered view of normalized CVEs, validation verdicts, and report status.</p>
                          </div>
                          <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500 ring-1 ring-slate-100">{filteredAiVulnerabilities.length} shown</span>
                        </div>
                        <div className="mt-4 grid gap-2 lg:grid-cols-[minmax(0,1fr)_160px_170px]">
                          <label className="relative block">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                              value={aiVulnerabilitySearch}
                              onChange={(event) => setAiVulnerabilitySearch(event.target.value)}
                              placeholder="Search CVE, title, target, source"
                              className="h-11 w-full rounded-[8px] border border-slate-200 bg-slate-50 pl-10 pr-3 text-[13px] font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2ECE82] focus:bg-white focus:ring-4 focus:ring-[#2ECE82]/12"
                            />
                          </label>
                          <select
                            value={aiVulnerabilitySeverity}
                            onChange={(event) => setAiVulnerabilitySeverity(event.target.value)}
                            className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-700 outline-none transition focus:border-[#2ECE82] focus:ring-4 focus:ring-[#2ECE82]/12"
                          >
                            {aiVulnerabilitySeverityOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                          <select
                            value={aiVulnerabilityValidation}
                            onChange={(event) => setAiVulnerabilityValidation(event.target.value)}
                            className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-700 outline-none transition focus:border-[#2ECE82] focus:ring-4 focus:ring-[#2ECE82]/12"
                          >
                            {aiVulnerabilityValidationOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {[
                            { label: "All", run: () => { setAiVulnerabilitySearch(""); setAiVulnerabilitySeverity("All severity"); setAiVulnerabilityValidation("All validation"); } },
                            { label: "Critical", run: () => { setAiVulnerabilitySearch(""); setAiVulnerabilitySeverity("Critical"); setAiVulnerabilityValidation("All validation"); } },
                            { label: "Validated", run: () => { setAiVulnerabilitySearch(""); setAiVulnerabilitySeverity("All severity"); setAiVulnerabilityValidation("Validated"); } },
                            { label: "Needs review", run: () => { setAiVulnerabilitySearch("Manual Review"); setAiVulnerabilitySeverity("All severity"); setAiVulnerabilityValidation("All validation"); } },
                            { label: "Report ready", run: () => { setAiVulnerabilitySearch("Added"); setAiVulnerabilitySeverity("All severity"); setAiVulnerabilityValidation("All validation"); } },
                          ].map((chip) => (
                            <button
                              key={chip.label}
                              type="button"
                              onClick={chip.run}
                              className="inline-flex h-8 items-center rounded-full bg-slate-50 px-3 text-[11px] font-black text-slate-600 ring-1 ring-slate-100 transition hover:bg-[#E8FFF3] hover:text-[#16A86E] hover:ring-emerald-100"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="overflow-x-auto p-3">
                        <table className="w-full min-w-[1180px] table-fixed border-collapse text-left">
                          <colgroup>
                            <col className="w-[12%]" />
                            <col className="w-[22%]" />
                            <col className="w-[9%]" />
                            <col className="w-[7%]" />
                            <col className="w-[17%]" />
                            <col className="w-[11%]" />
                            <col className="w-[10%]" />
                            <col className="w-[8%]" />
                            <col className="w-[8%]" />
                            <col className="w-[8%]" />
                          </colgroup>
                          <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
                              <th className="rounded-l-[8px] px-3 py-2.5">CVE</th>
                              <th className="px-3 py-2.5">Title</th>
                              <th className="px-3 py-2.5">Severity</th>
                              <th className="px-3 py-2.5">CVSS</th>
                              <th className="px-3 py-2.5">Target</th>
                              <th className="px-3 py-2.5">AI status</th>
                              <th className="px-3 py-2.5">Validation</th>
                              <th className="px-3 py-2.5">Evidence</th>
                              <th className="px-3 py-2.5">Report</th>
                              <th className="rounded-r-[8px] px-3 py-2.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredAiVulnerabilities.map((row) => (
                              <tr
                                key={row.cve}
                                onClick={() => setSelectedAiVulnerabilityId(row.cve)}
                                className={`cursor-pointer transition hover:bg-slate-50/80 ${selectedAiVulnerability.cve === row.cve ? "bg-[#E8FFF3]/60" : ""}`}
                              >
                                <td className="px-3 py-3 align-top">
                                  <p className="text-[12px] font-black text-[#2563EB]">{row.cve}</p>
                                  <p className="mt-1 text-[10px] font-black text-slate-400">{row.cwe}</p>
                                </td>
                                <td className="px-3 py-3 align-top">
                                  <p className="line-clamp-2 text-[12px] font-black leading-relaxed text-slate-950">{row.title}</p>
                                  <p className="mt-1 text-[10px] font-bold text-slate-400">{row.source}</p>
                                </td>
                                <td className="px-3 py-3 align-top">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${severityPillClasses(row.severity)}`}>{row.severity}</span>
                                </td>
                                <td className="px-3 py-3 align-top text-[12px] font-black text-slate-800">{row.cvss}</td>
                                <td className="truncate px-3 py-3 align-top text-[11px] font-bold text-slate-600">{row.target}</td>
                                <td className="px-3 py-3 align-top">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiCveStatusClasses(row.aiStatus)}`}>{row.aiStatus}</span>
                                </td>
                                <td className="px-3 py-3 align-top">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiValidationStatusClasses(row.validation)}`}>{row.validation}</span>
                                </td>
                                <td className="px-3 py-3 align-top">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiEvidenceClasses(row.evidence)}`}>{row.evidence}</span>
                                </td>
                                <td className="px-3 py-3 align-top">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiReportClasses(row.report)}`}>{row.report}</span>
                                </td>
                                <td className="px-3 py-3 text-right align-top">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedAiVulnerabilityId(row.cve);
                                    }}
                                    className="inline-flex h-8 items-center justify-center rounded-[8px] border border-slate-200 bg-white px-3 text-[10px] font-black text-slate-700 transition hover:border-[#2ECE82]/40"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </article>
                  </div>

                  <aside className="grid gap-4 xl:sticky xl:top-24">
                    <article className="overflow-hidden rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] text-white shadow-[0_12px_30px_rgba(7,16,16,0.14)]">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Event detail</p>
                            <h3 className="mt-1 truncate text-[21px] font-black leading-tight">{selectedAiVulnerability.cve}</h3>
                            <p className="mt-1 text-[12px] font-bold text-white/62">{selectedAiVulnerability.title}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${severityPillClasses(selectedAiVulnerability.severity)}`}>
                            {selectedAiVulnerability.severity}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {[
                            ["CVSS", selectedAiVulnerability.cvss],
                            ["Attempts", selectedAiVulnerability.attempts],
                            ["Validation", selectedAiVulnerability.validation],
                            ["Report", selectedAiVulnerability.report],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-[8px] bg-white/[0.06] p-2.5">
                              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">{label}</p>
                              <p className="mt-1 truncate text-[12px] font-black text-white">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/50">Affected target</p>
                        <p className="mt-1 truncate text-[12px] font-black text-[#BFFFE1]">{selectedAiVulnerability.target}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiVerdictClasses(selectedAiVulnerability.verdict)}`}>{selectedAiVulnerability.verdict}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiCveStatusClasses(selectedAiVulnerability.aiStatus)}`}>{selectedAiVulnerability.aiStatus}</span>
                        </div>
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="border-b border-slate-100 p-3.5">
                        <h3 className="text-[18px] font-black text-slate-950">CVE detail</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">Evidence, AI decision, and remediation notes.</p>
                      </div>
                      <div className="grid gap-3 p-3.5">
                        <div className="rounded-[8px] bg-slate-50 p-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Description</p>
                          <p className="mt-1 text-[12px] font-semibold leading-relaxed text-slate-600">{selectedAiVulnerability.description}</p>
                        </div>
                        <div className="rounded-[8px] bg-[#E8FFF3] p-3 ring-1 ring-emerald-100">
                          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#16A86E]">Remediation</p>
                          <p className="mt-1 text-[12px] font-semibold leading-relaxed text-slate-700">{selectedAiVulnerability.remediation}</p>
                        </div>
                        <div className="grid gap-2">
                          {[
                            { label: "Knowledge Hub", value: selectedAiVulnerability.knowledgeHub, Icon: Database },
                            { label: "Pipeline stage", value: selectedAiVulnerability.pipelineStage, Icon: Layers3 },
                            { label: "Owner", value: selectedAiVulnerability.owner, Icon: Activity },
                            { label: "Updated", value: selectedAiVulnerability.updated, Icon: CalendarClock },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-white text-[#0891B2] ring-1 ring-slate-200">
                                <item.Icon className="h-4 w-4" />
                              </span>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">{item.label}</p>
                                <p className="mt-0.5 truncate text-[12px] font-black text-slate-800">{item.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="grid gap-2">
                          <button
                            type="button"
                            onClick={() => router.push("/ai-pentester/pipeline")}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white transition hover:bg-[#0E241E]"
                          >
                            Open in Pipeline
                            <ArrowRight className="h-4 w-4 text-[#2ECE82]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => router.push("/ai-pentester/knowledge-hub")}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40"
                          >
                            Open Knowledge Hub
                            <Database className="h-4 w-4 text-[#0891B2]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setScanToast(`${selectedAiVulnerability.cve} marked for report in frontend preview.`)}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40"
                          >
                            Add to Report
                            <FileText className="h-4 w-4 text-[#0891B2]" />
                          </button>
                        </div>
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white p-3.5 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div>
                        <h3 className="text-[18px] font-black text-slate-950">Review queue</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">Items that should not auto-approve.</p>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {aiVulnerabilityReviewQueue.map((item) => (
                          <div key={item.label} className="flex items-center gap-3 rounded-[8px] bg-slate-50 p-3 ring-1 ring-slate-100">
                            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(item.tone)}`}>
                              <item.Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-[12px] font-black text-slate-950">{item.label}</p>
                                <span className="text-[14px] font-black text-slate-950">{item.value}</span>
                              </div>
                              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{item.helper}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  </aside>
                </section>
              </div>
            ) : activeSection === "ai-pentester" && pathname === "/ai-pentester/reports" ? (
              <div className="grid gap-4">
                {scanToast ? (
                  <div className="fixed right-4 top-4 z-[90] w-[min(calc(100vw-2rem),390px)] rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-4 text-white shadow-[0_24px_70px_rgba(7,16,16,0.28)]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">AI report preview</p>
                        <p className="mt-1 text-[13px] font-bold leading-relaxed text-white/80">{scanToast}</p>
                      </div>
                      <button type="button" onClick={() => setScanToast("")} className="text-white/50 transition hover:text-white" aria-label="Close notification">
                        <ChevronRight className="h-4 w-4 rotate-45" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-6">
                  {aiPentestReportMetrics.map((item) => (
                    <article key={item.label} className="rounded-[8px] border border-slate-200 bg-white px-3 py-2.5 shadow-[0_6px_16px_rgba(15,23,42,0.03)]">
                      <div className="flex items-center gap-2.5">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ${metricToneClasses(item.tone)}`}>
                          <item.Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[11px] font-black text-slate-500">{item.label}</p>
                            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-slate-400 ring-1 ring-slate-100">{item.helper}</span>
                          </div>
                          <p className="mt-0.5 text-[21px] font-black leading-none text-slate-950">{item.value}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>

                <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                  <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-5">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0891B2]">AI Pentester</p>
                      <h2 className="mt-2 text-[28px] font-black leading-tight text-slate-950">AI Pentest Reports</h2>
                      <p className="mt-2 max-w-[860px] text-[13px] font-semibold leading-relaxed text-slate-600">
                        Generate, review, and export client-ready reports from AI-validated CVEs, sandbox evidence, and remediation notes.
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {["Evidence-backed exports", "Manual blockers visible", "Client-ready report sections"].map((item) => (
                          <span key={item} className="inline-flex h-8 items-center gap-2 rounded-full bg-slate-50 px-3 text-[11px] font-black text-slate-600 ring-1 ring-slate-100">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#16A86E]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Selected report</p>
                          <p className="mt-1 text-[22px] font-black leading-none">{selectedAiReport.readiness}% ready</p>
                          <p className="mt-1 text-[11px] font-bold text-white/58">{selectedAiReport.id} - {selectedAiReport.status}</p>
                        </div>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                          <FileText className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-[#2ECE82]" style={{ width: `${selectedAiReport.readiness}%` }} />
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {[
                          ["CVEs", selectedAiReport.cves],
                          ["Evidence", selectedAiReport.evidence],
                          ["Validated", selectedAiReport.validated],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-[8px] bg-white/[0.06] p-2.5">
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">{label}</p>
                            <p className="mt-1 text-[18px] font-black leading-none text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 lg:px-5">
                    <button
                      type="button"
                      onClick={() => setScanToast("Create AI report is frontend-only for now. Backend report generation will connect this action later.")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white shadow-[0_14px_30px_rgba(7,16,16,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0E241E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <Plus className="h-4 w-4 text-[#2ECE82]" />
                      Create AI report
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/pipeline")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <Layers3 className="h-4 w-4 text-[#0891B2]" />
                      Open Pipeline
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/vulnerabilities")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <ShieldAlert className="h-4 w-4 text-[#0891B2]" />
                      CVE Workbench
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/knowledge-hub")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <Database className="h-4 w-4 text-[#0891B2]" />
                      Knowledge Hub
                    </button>
                  </div>
                </article>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_370px] xl:items-start">
                  <div className="grid gap-4">
                    <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="border-b border-slate-100 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="text-[18px] font-black text-slate-950">Report library</h3>
                            <p className="mt-1 text-[13px] font-semibold text-slate-500">Review AI-generated report readiness, export state, and blockers.</p>
                          </div>
                          <span className="rounded-full bg-[#E8FFF3] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#16A86E] ring-1 ring-emerald-100">
                            {filteredAiReports.length} visible
                          </span>
                        </div>
                        <div className="mt-4 grid gap-2 lg:grid-cols-[minmax(240px,1fr)_170px_160px]">
                          <label className="relative block">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                              value={aiReportSearch}
                              onChange={(event) => setAiReportSearch(event.target.value)}
                              className="h-11 w-full rounded-[8px] border border-slate-200 bg-slate-50 pl-9 pr-3 text-[13px] font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2ECE82] focus:bg-white focus:ring-2 focus:ring-[#2ECE82]/18"
                              placeholder="Search report, job, target, blocker..."
                            />
                          </label>
                          <select
                            value={aiReportStatus}
                            onChange={(event) => setAiReportStatus(event.target.value)}
                            className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-800 outline-none transition focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18"
                          >
                            {aiReportStatusOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                          <select
                            value={aiReportScope}
                            onChange={(event) => setAiReportScope(event.target.value)}
                            className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-800 outline-none transition focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18"
                          >
                            {aiReportScopeOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {[
                            { label: "All", run: () => { setAiReportSearch(""); setAiReportStatus("All status"); setAiReportScope("All scopes"); } },
                            { label: "Ready", run: () => { setAiReportSearch(""); setAiReportStatus("Ready"); setAiReportScope("All scopes"); } },
                            { label: "Needs review", run: () => { setAiReportSearch(""); setAiReportStatus("Needs review"); setAiReportScope("All scopes"); } },
                            { label: "Blocked", run: () => { setAiReportSearch(""); setAiReportStatus("Blocked"); setAiReportScope("All scopes"); } },
                            { label: "Web/API", run: () => { setAiReportSearch(""); setAiReportStatus("All status"); setAiReportScope("Web/API"); } },
                          ].map((chip) => (
                            <button
                              key={chip.label}
                              type="button"
                              onClick={chip.run}
                              className="inline-flex h-8 items-center rounded-full bg-slate-50 px-3 text-[11px] font-black text-slate-600 ring-1 ring-slate-100 transition hover:bg-[#E8FFF3] hover:text-[#16A86E] hover:ring-emerald-100"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[1120px] border-collapse text-left">
                          <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
                              <th className="px-4 py-3">Report</th>
                              <th className="px-3 py-3">Source job</th>
                              <th className="px-3 py-3">Target</th>
                              <th className="px-3 py-3">Status</th>
                              <th className="px-3 py-3">CVEs</th>
                              <th className="px-3 py-3">Evidence</th>
                              <th className="px-3 py-3">Ready</th>
                              <th className="px-3 py-3">Updated</th>
                              <th className="px-3 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredAiReports.map((row) => (
                              <tr
                                key={row.id}
                                onClick={() => setSelectedAiReportId(row.id)}
                                className={`cursor-pointer transition hover:bg-slate-50/80 ${selectedAiReport.id === row.id ? "bg-[#F3FFF8]" : "bg-white"}`}
                              >
                                <td className="px-4 py-3 align-top">
                                  <p className="text-[12px] font-black text-[#2563EB]">{row.id}</p>
                                  <p className="mt-1 max-w-[250px] truncate text-[11px] font-black text-slate-950">{row.title}</p>
                                  <p className="mt-1 text-[10px] font-black text-slate-400">{row.scope}</p>
                                </td>
                                <td className="px-3 py-3 align-top text-[11px] font-black text-slate-600">{row.job}</td>
                                <td className="max-w-[220px] truncate px-3 py-3 align-top text-[11px] font-bold text-slate-500">{row.target}</td>
                                <td className="px-3 py-3 align-top">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiPentestReportStatusClasses(row.status)}`}>{row.status}</span>
                                </td>
                                <td className="px-3 py-3 align-top text-[12px] font-black text-slate-800">{row.cves}</td>
                                <td className="px-3 py-3 align-top text-[12px] font-black text-slate-800">{row.evidence}</td>
                                <td className="px-3 py-3 align-top">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                                      <div className="h-full rounded-full bg-[#2ECE82]" style={{ width: `${row.readiness}%` }} />
                                    </div>
                                    <span className="text-[11px] font-black text-slate-700">{row.readiness}%</span>
                                  </div>
                                </td>
                                <td className="px-3 py-3 align-top text-[11px] font-black text-slate-500">{row.updated}</td>
                                <td className="px-3 py-3 text-right align-top">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedAiReportId(row.id);
                                    }}
                                    className="inline-flex h-8 items-center justify-center rounded-[8px] border border-slate-200 bg-white px-3 text-[10px] font-black text-slate-700 transition hover:border-[#2ECE82]/40"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {filteredAiReports.length === 0 ? (
                        <div className="grid place-items-center p-8 text-center">
                          <FileText className="h-9 w-9 text-slate-300" />
                          <p className="mt-3 text-[14px] font-black text-slate-950">No AI reports found</p>
                          <p className="mt-1 text-[12px] font-semibold text-slate-500">Try another report, job, target, status, or scope filter.</p>
                        </div>
                      ) : null}
                    </article>

                    <section className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                      <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[18px] font-black text-slate-950">Evidence coverage</h3>
                            <p className="mt-1 text-[13px] font-semibold text-slate-500">Evidence completeness for selected report.</p>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${aiPentestReportStatusClasses(selectedAiReport.status)}`}>{selectedAiReport.status}</span>
                        </div>
                        <div className="mt-4 grid gap-2">
                          {selectedAiReport.coverage.map((item) => (
                            <div key={item.label} className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-[12px] font-black text-slate-950">{item.label}</p>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${metricToneClasses(item.tone)}`}>{item.value}</span>
                              </div>
                              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                                <div className="h-full rounded-full bg-[#2ECE82]" style={{ width: `${item.percent}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 rounded-[8px] bg-[#071010] p-3 text-white">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#04D9FF]">Severity included</span>
                            <span className="text-[12px] font-black text-[#BFFFE1]">{selectedAiReport.cves} CVEs</span>
                          </div>
                          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                            {[
                              ["Critical", selectedAiReport.severity.critical, "text-rose-200"],
                              ["High", selectedAiReport.severity.high, "text-orange-200"],
                              ["Medium", selectedAiReport.severity.medium, "text-amber-200"],
                              ["Low", selectedAiReport.severity.low, "text-blue-200"],
                            ].map(([label, value, color]) => (
                              <div key={label} className="rounded-[8px] bg-white/[0.06] p-2">
                                <p className={`text-[15px] font-black ${color}`}>{value}</p>
                                <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-white/44">{label}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </article>

                      <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Generation timeline</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Lifecycle from AI job completion to export.</p>
                        </div>
                        <div className="mt-4 grid gap-2">
                          {selectedAiReport.timeline.map((step, index) => (
                            <div key={step.label} className="grid grid-cols-[34px_minmax(0,1fr)_90px] items-center gap-3 rounded-[8px] bg-slate-50 p-3 ring-1 ring-slate-100">
                              <span className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-black ring-1 ${aiReportReadinessClasses(step.status)}`}>
                                {index + 1}
                              </span>
                              <span className="text-[12px] font-black text-slate-950">{step.label}</span>
                              <span className={`rounded-full px-2 py-0.5 text-center text-[10px] font-black ring-1 ${aiReportReadinessClasses(step.status)}`}>{step.status}</span>
                            </div>
                          ))}
                        </div>
                      </article>
                    </section>

                    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Report sections</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Client-ready sections expected in AI Pentest reports.</p>
                        </div>
                        <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500 ring-1 ring-slate-100">
                          {selectedAiReport.sections.length} in selected report
                        </span>
                      </div>
                      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                        {aiPentestReportSections.map((section) => {
                          const included = selectedAiReport.sections.includes(section.label);
                          return (
                            <div key={section.label} className={`rounded-[8px] border p-3 transition ${included ? "border-[#2ECE82]/30 bg-[#F3FFF8]" : "border-slate-200 bg-slate-50 opacity-70"}`}>
                              <div className="flex items-start gap-3">
                                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(section.tone)}`}>
                                  <section.Icon className="h-4 w-4" />
                                </span>
                                <div className="min-w-0">
                                  <p className="text-[12px] font-black text-slate-950">{section.label}</p>
                                  <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{section.helper}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  </div>

                  <aside className="grid gap-4 xl:sticky xl:top-24">
                    <article className="overflow-hidden rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] text-white shadow-[0_12px_30px_rgba(7,16,16,0.14)]">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Report detail</p>
                            <h3 className="mt-1 truncate text-[21px] font-black leading-tight">{selectedAiReport.id}</h3>
                            <p className="mt-1 text-[12px] font-bold text-white/62">{selectedAiReport.title}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${aiPentestReportStatusClasses(selectedAiReport.status)}`}>
                            {selectedAiReport.status}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {[
                            ["Readiness", `${selectedAiReport.readiness}%`],
                            ["CVEs", selectedAiReport.cves],
                            ["Evidence", selectedAiReport.evidence],
                            ["Validated", selectedAiReport.validated],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-[8px] bg-white/[0.06] p-2.5">
                              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">{label}</p>
                              <p className="mt-1 truncate text-[12px] font-black text-white">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/50">Source job</p>
                        <p className="mt-1 truncate text-[12px] font-black text-[#BFFFE1]">{selectedAiReport.job}</p>
                        <p className="mt-2 truncate text-[11px] font-bold text-white/58">{selectedAiReport.target}</p>
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="border-b border-slate-100 p-3.5">
                        <h3 className="text-[18px] font-black text-slate-950">Readiness checklist</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">What must be true before client sharing.</p>
                      </div>
                      <div className="grid gap-2 p-3.5">
                        {selectedAiReport.checklist.map((item) => (
                          <div key={item.label} className="flex items-center justify-between gap-3 rounded-[8px] bg-slate-50 p-3 ring-1 ring-slate-100">
                            <span className="text-[12px] font-black text-slate-800">{item.label}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiReportReadinessClasses(item.status)}`}>{item.status}</span>
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white p-3.5 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div>
                        <h3 className="text-[18px] font-black text-slate-950">Export options</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">Frontend-only actions until backend export storage is connected.</p>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {["Preview", "PDF", "DOCX", "HTML", "Evidence ZIP", "Share link"]
                          .filter((format) => format === "Preview" || canAction("ai_pentester", "download"))
                          .map((format) => (
                          <button
                            key={format}
                            type="button"
                            onClick={() => setScanToast(`${format} for ${selectedAiReport.id} will connect after backend report generation.`)}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 hover:bg-[#F3FFF8]"
                          >
                            {format === "Preview" ? <Eye className="h-3.5 w-3.5 text-[#0891B2]" /> : format === "Share link" ? <Copy className="h-3.5 w-3.5 text-[#0891B2]" /> : <Download className="h-3.5 w-3.5 text-[#0891B2]" />}
                            {format}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 rounded-[8px] bg-slate-50 p-3 ring-1 ring-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Available now</p>
                        <p className="mt-1 text-[12px] font-black text-slate-800">{selectedAiReport.formats.join(", ")}</p>
                      </div>
                    </article>

                    <article className={`rounded-[8px] border p-3.5 shadow-[0_8px_22px_rgba(15,23,42,0.035)] ${selectedAiReport.blockers.length ? "border-amber-100 bg-amber-50" : "border-emerald-100 bg-[#F3FFF8]"}`}>
                      <div className="flex items-start gap-3">
                        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ring-1 ${selectedAiReport.blockers.length ? "bg-white text-amber-600 ring-amber-100" : "bg-white text-[#16A86E] ring-emerald-100"}`}>
                          {selectedAiReport.blockers.length ? <AlertTriangle className="h-4.5 w-4.5" /> : <ShieldCheck className="h-4.5 w-4.5" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-[15px] font-black text-slate-950">{selectedAiReport.blockers.length ? "Review blockers" : "Ready to share"}</h3>
                          <div className="mt-2 grid gap-2">
                            {(selectedAiReport.blockers.length ? selectedAiReport.blockers : ["No active blockers for this report."]).map((blocker) => (
                              <p key={blocker} className="rounded-[8px] bg-white/70 p-2 text-[11px] font-bold leading-relaxed text-slate-700 ring-1 ring-white">{blocker}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  </aside>
                </section>
              </div>
            ) : activeSection === "ai-pentester" && pathname === "/ai-pentester/knowledge-hub" ? (
              <div className="grid gap-4">
                {scanToast ? (
                  <div className="fixed right-4 top-4 z-[90] w-[min(calc(100vw-2rem),390px)] rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-4 text-white shadow-[0_24px_70px_rgba(7,16,16,0.28)]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                        <Database className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Knowledge Hub preview</p>
                        <p className="mt-1 text-[13px] font-bold leading-relaxed text-white/80">{scanToast}</p>
                      </div>
                      <button type="button" onClick={() => setScanToast("")} className="text-white/50 transition hover:text-white" aria-label="Close notification">
                        <ChevronRight className="h-4 w-4 rotate-45" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-6">
                  {aiKnowledgeMetrics.map((item) => (
                    <article key={item.label} className="rounded-[8px] border border-slate-200 bg-white px-3 py-2.5 shadow-[0_6px_16px_rgba(15,23,42,0.03)]">
                      <div className="flex items-center gap-2.5">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ${metricToneClasses(item.tone)}`}>
                          <item.Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[11px] font-black text-slate-500">{item.label}</p>
                            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-slate-400 ring-1 ring-slate-100">{item.helper}</span>
                          </div>
                          <p className="mt-0.5 text-[21px] font-black leading-none text-slate-950">{item.value}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>

                <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                  <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-5">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0891B2]">AI Pentester</p>
                      <h2 className="mt-2 text-[28px] font-black leading-tight text-slate-950">CVE Knowledge Hub</h2>
                      <p className="mt-2 max-w-[850px] text-[13px] font-semibold leading-relaxed text-slate-600">
                        Reusable CVE intelligence, approved validation templates, remediation guidance, references, and AI review status for the AI Pentester pipeline.
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {["Approved templates first", "AI drafts reviewed", "Pipeline reuse tracked"].map((item) => (
                          <span key={item} className="inline-flex h-8 items-center gap-2 rounded-full bg-slate-50 px-3 text-[11px] font-black text-slate-600 ring-1 ring-slate-100">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#16A86E]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Library status</p>
                          <p className="mt-1 text-[22px] font-black leading-none">94% reusable</p>
                          <p className="mt-1 text-[11px] font-bold text-white/58">412 approved validation templates</p>
                        </div>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                          <Database className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[94%] rounded-full bg-[#2ECE82]" />
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {[
                          ["Approved", "412"],
                          ["Pending", "86"],
                          ["Missing", "183"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-[8px] bg-white/[0.06] p-2.5">
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">{label}</p>
                            <p className="mt-1 text-[18px] font-black leading-none text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 lg:px-5">
                    <button
                      type="button"
                      onClick={() => setScanToast("Add knowledge is frontend-only for now. Backend will create CVE records, references, and review state later.")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white shadow-[0_14px_30px_rgba(7,16,16,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0E241E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <Plus className="h-4 w-4 text-[#2ECE82]" />
                      Add knowledge
                    </button>
                    <button
                      type="button"
                      onClick={() => setScanToast("CVE JSON import will connect after backend Knowledge Hub APIs are ready.")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <Braces className="h-4 w-4 text-[#0891B2]" />
                      Import CVE JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/pipeline")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <Layers3 className="h-4 w-4 text-[#0891B2]" />
                      Open Pipeline
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/vulnerabilities")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <ShieldAlert className="h-4 w-4 text-[#0891B2]" />
                      CVE Workbench
                    </button>
                  </div>
                </article>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_370px] xl:items-start">
                  <div className="grid gap-4">
                    <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="border-b border-slate-100 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="text-[18px] font-black text-slate-950">Knowledge records</h3>
                            <p className="mt-1 text-[13px] font-semibold text-slate-500">Search approved templates, AI drafts, remediation notes, and source references.</p>
                          </div>
                          <span className="rounded-full bg-[#E8FFF3] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#16A86E] ring-1 ring-emerald-100">
                            {filteredAiKnowledgeRows.length} visible
                          </span>
                        </div>
                        <div className="mt-4 grid gap-2 lg:grid-cols-[minmax(240px,1fr)_170px_180px_170px]">
                          <label className="relative block">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                              value={aiKnowledgeSearch}
                              onChange={(event) => setAiKnowledgeSearch(event.target.value)}
                              className="h-11 w-full rounded-[8px] border border-slate-200 bg-slate-50 pl-9 pr-3 text-[13px] font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2ECE82] focus:bg-white focus:ring-2 focus:ring-[#2ECE82]/18"
                              placeholder="Search CVE, CWE, product, remediation..."
                            />
                          </label>
                          <select
                            value={aiKnowledgeSeverity}
                            onChange={(event) => setAiKnowledgeSeverity(event.target.value)}
                            className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-800 outline-none transition focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18"
                          >
                            {aiKnowledgeSeverityOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                          <select
                            value={aiKnowledgeTemplateStatus}
                            onChange={(event) => setAiKnowledgeTemplateStatus(event.target.value)}
                            className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-800 outline-none transition focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18"
                          >
                            {aiKnowledgeTemplateOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                          <select
                            value={aiKnowledgeSource}
                            onChange={(event) => setAiKnowledgeSource(event.target.value)}
                            className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-800 outline-none transition focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18"
                          >
                            {aiKnowledgeSourceOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[1060px] border-collapse text-left">
                          <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
                              <th className="px-4 py-3">CVE</th>
                              <th className="px-3 py-3">Knowledge</th>
                              <th className="px-3 py-3">Severity</th>
                              <th className="px-3 py-3">Template</th>
                              <th className="px-3 py-3">Source</th>
                              <th className="px-3 py-3">Confidence</th>
                              <th className="px-3 py-3">Reuse</th>
                              <th className="px-3 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredAiKnowledgeRows.map((row) => (
                              <tr
                                key={row.cve}
                                onClick={() => setSelectedAiKnowledgeId(row.cve)}
                                className={`cursor-pointer transition hover:bg-slate-50/80 ${selectedAiKnowledge.cve === row.cve ? "bg-[#F3FFF8]" : "bg-white"}`}
                              >
                                <td className="px-4 py-3 align-top">
                                  <p className="text-[12px] font-black text-[#2563EB]">{row.cve}</p>
                                  <p className="mt-1 text-[10px] font-black text-slate-400">{row.cwe}</p>
                                </td>
                                <td className="px-3 py-3 align-top">
                                  <p className="max-w-[300px] truncate text-[12px] font-black text-slate-950">{row.title}</p>
                                  <p className="mt-1 text-[11px] font-bold text-slate-500">{row.product}</p>
                                </td>
                                <td className="px-3 py-3 align-top">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${severityPillClasses(row.severity)}`}>{row.severity}</span>
                                  <p className="mt-1 text-[10px] font-black text-slate-400">CVSS {row.cvss}</p>
                                </td>
                                <td className="px-3 py-3 align-top">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiKnowledgeTemplateClasses(row.templateStatus)}`}>{row.templateStatus}</span>
                                </td>
                                <td className="px-3 py-3 align-top">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiKnowledgeSourceClasses(row.source)}`}>{row.source}</span>
                                </td>
                                <td className="px-3 py-3 align-top">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                                      <div className="h-full rounded-full bg-[#2ECE82]" style={{ width: `${row.confidence}%` }} />
                                    </div>
                                    <span className="text-[11px] font-black text-slate-700">{row.confidence}%</span>
                                  </div>
                                </td>
                                <td className="px-3 py-3 align-top text-[11px] font-black text-slate-600">{row.reuse}</td>
                                <td className="px-3 py-3 text-right align-top">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedAiKnowledgeId(row.cve);
                                    }}
                                    className="inline-flex h-8 items-center justify-center rounded-[8px] border border-slate-200 bg-white px-3 text-[10px] font-black text-slate-700 transition hover:border-[#2ECE82]/40"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {filteredAiKnowledgeRows.length === 0 ? (
                        <div className="grid place-items-center p-8 text-center">
                          <Database className="h-9 w-9 text-slate-300" />
                          <p className="mt-3 text-[14px] font-black text-slate-950">No knowledge records found</p>
                          <p className="mt-1 text-[12px] font-semibold text-slate-500">Try a different CVE, severity, template, or source filter.</p>
                        </div>
                      ) : null}
                    </article>

                    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[18px] font-black text-slate-950">Source health</h3>
                            <p className="mt-1 text-[13px] font-semibold text-slate-500">Where Knowledge Hub entries are coming from.</p>
                          </div>
                          <Filter className="h-5 w-5 text-[#0891B2]" />
                        </div>
                        <div className="mt-4 grid gap-2">
                          {aiKnowledgeSourceHealth.map((item) => (
                            <div key={item.label} className="flex items-center gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(item.tone)}`}>
                                <item.Icon className="h-4.5 w-4.5" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="truncate text-[12px] font-black text-slate-950">{item.label}</p>
                                  <span className="text-[12px] font-black text-slate-700">{item.value}</span>
                                </div>
                                <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{item.helper}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>

                      <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Review queue</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Knowledge items that should not auto-run yet.</p>
                        </div>
                        <div className="mt-4 grid gap-2">
                          {aiKnowledgeReviewQueue.map((item) => (
                            <div key={item.label} className="flex items-center gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(item.tone)}`}>
                                <item.Icon className="h-4.5 w-4.5" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="truncate text-[12px] font-black text-slate-950">{item.label}</p>
                                  <span className="text-[16px] font-black text-slate-950">{item.value}</span>
                                </div>
                                <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{item.helper}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>
                    </section>
                  </div>

                  <aside className="grid gap-4 xl:sticky xl:top-24">
                    <article className="overflow-hidden rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] text-white shadow-[0_12px_30px_rgba(7,16,16,0.14)]">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Selected knowledge</p>
                            <h3 className="mt-1 truncate text-[21px] font-black leading-tight">{selectedAiKnowledge.cve}</h3>
                            <p className="mt-1 text-[12px] font-bold text-white/62">{selectedAiKnowledge.title}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${severityPillClasses(selectedAiKnowledge.severity)}`}>
                            {selectedAiKnowledge.severity}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {[
                            ["CVSS", selectedAiKnowledge.cvss],
                            ["CWE", selectedAiKnowledge.cwe],
                            ["Confidence", `${selectedAiKnowledge.confidence}%`],
                            ["Updated", selectedAiKnowledge.updated],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-[8px] bg-white/[0.06] p-2.5">
                              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">{label}</p>
                              <p className="mt-1 truncate text-[12px] font-black text-white">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/50">Template state</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiKnowledgeTemplateClasses(selectedAiKnowledge.templateStatus)}`}>{selectedAiKnowledge.templateStatus}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${aiKnowledgeSourceClasses(selectedAiKnowledge.source)}`}>{selectedAiKnowledge.source}</span>
                        </div>
                        <p className="mt-3 text-[12px] font-bold leading-relaxed text-white/70">{selectedAiKnowledge.pipelineUse}</p>
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="border-b border-slate-100 p-3.5">
                        <h3 className="text-[18px] font-black text-slate-950">Knowledge detail</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">Validation, remediation, and references.</p>
                      </div>
                      <div className="grid gap-3 p-3.5">
                        <div className="rounded-[8px] bg-slate-50 p-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Validation template</p>
                          <p className="mt-1 text-[12px] font-black text-slate-950">{selectedAiKnowledge.validationType}</p>
                          <p className="mt-1 text-[12px] font-semibold leading-relaxed text-slate-600">{selectedAiKnowledge.description}</p>
                        </div>
                        <div className="rounded-[8px] bg-[#E8FFF3] p-3 ring-1 ring-emerald-100">
                          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#16A86E]">Remediation</p>
                          <p className="mt-1 text-[12px] font-semibold leading-relaxed text-slate-700">{selectedAiKnowledge.remediation}</p>
                        </div>
                        <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Affected area</p>
                          <p className="mt-1 text-[12px] font-black text-slate-800">{selectedAiKnowledge.affected}</p>
                        </div>
                        <div className="grid gap-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">References</p>
                          {selectedAiKnowledge.references.map((reference) => (
                            <div key={reference} className="flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white p-2.5">
                              <Database className="h-3.5 w-3.5 shrink-0 text-[#0891B2]" />
                              <span className="text-[11px] font-black text-slate-700">{reference}</span>
                            </div>
                          ))}
                        </div>
                        <div className="grid gap-2">
                          <button
                            type="button"
                            onClick={() => setScanToast(`${selectedAiKnowledge.cve} template preview is frontend-only until backend template storage is connected.`)}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white transition hover:bg-[#0E241E]"
                          >
                            View template
                            <Eye className="h-4 w-4 text-[#2ECE82]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => router.push("/ai-pentester/pipeline")}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40"
                          >
                            Send to Pipeline
                            <ArrowRight className="h-4 w-4 text-[#0891B2]" />
                          </button>
                          {canAction("knowledge_base", "create") ? <button
                            type="button"
                            onClick={() => setScanToast(`${selectedAiKnowledge.cve} report note prepared in frontend preview.`)}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40"
                          >
                            Create report note
                            <FileText className="h-4 w-4 text-[#0891B2]" />
                          </button> : null}
                        </div>
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white p-3.5 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div>
                        <h3 className="text-[18px] font-black text-slate-950">Pipeline reuse</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">How this record helps active AI jobs.</p>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {[
                          ["Pipeline status", selectedAiKnowledge.pipelineUse],
                          ["Reuse history", selectedAiKnowledge.reuse],
                          ["Product", selectedAiKnowledge.product],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-[8px] bg-slate-50 p-3 ring-1 ring-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
                            <p className="mt-1 text-[12px] font-black text-slate-800">{value}</p>
                          </div>
                        ))}
                      </div>
                    </article>
                  </aside>
                </section>
              </div>
            ) : activeSection === "ai-pentester" && pathname === "/ai-pentester/launch-scan" ? (
              <div className="flex min-h-[calc(100dvh-11rem)] flex-col gap-4">
                {scanToast ? (
                  <div className="fixed right-4 top-4 z-[90] w-[min(calc(100vw-2rem),390px)] rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-4 text-white shadow-[0_24px_70px_rgba(7,16,16,0.28)]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                        <Zap className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Launch scan preview</p>
                        <p className="mt-1 text-[13px] font-bold leading-relaxed text-white/80">{scanToast}</p>
                      </div>
                      <button type="button" onClick={() => setScanToast("")} className="text-white/50 transition hover:text-white" aria-label="Close notification">
                        <ChevronRight className="h-4 w-4 rotate-45" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                  <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_310px] lg:p-5">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0891B2]">AI Pentester</p>
                      <h2 className="mt-2 text-[28px] font-black leading-tight text-slate-950">Launch Scan</h2>
                      <p className="mt-2 max-w-[780px] text-[13px] font-semibold leading-relaxed text-slate-600">
                        Create an AI-assisted ad hoc pentest job from scanner JSON. The job will normalize CVEs, check Knowledge Hub scripts, generate missing scripts, validate in sandbox, and prepare report evidence.
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {["Safe validation only", "3 AI revision attempts", "Evidence-ready report"].map((item) => (
                          <span key={item} className="inline-flex h-8 items-center gap-2 rounded-full bg-slate-50 px-3 text-[11px] font-black text-slate-600 ring-1 ring-slate-100">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#16A86E]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2 rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Launch status</p>
                          <p className="mt-1 text-[22px] font-black leading-none">{aiLaunchReady ? "Ready" : "Setup needed"}</p>
                          <p className="mt-1 text-[11px] font-bold text-white/58">{aiLaunchChecklist.filter((item) => item.done).length} of {aiLaunchChecklist.length} checks complete</p>
                        </div>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                          <SelectedAiLaunchSourceIcon className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-[#2ECE82]" style={{ width: `${Math.round((aiLaunchChecklist.filter((item) => item.done).length / aiLaunchChecklist.length) * 100)}%` }} />
                      </div>
                      <div className="rounded-[8px] bg-white/[0.06] p-2.5">
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">Selected source</p>
                        <p className="mt-1 text-[12px] font-black text-white">{selectedAiLaunchSource.label}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 lg:px-5">
                    <button
                      type="button"
                      onClick={launchAiAdHocScan}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white shadow-[0_14px_30px_rgba(7,16,16,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0E241E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <Play className="h-4 w-4 fill-[#2ECE82] text-[#2ECE82]" />
                      Launch AI scan
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/dashboard")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#0891B2]" />
                      View Ad Hoc Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/ai-pentester/pipeline")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      <Layers3 className="h-4 w-4 text-[#0891B2]" />
                      Open Pipeline
                    </button>
                  </div>
                </article>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
                  <div className="grid gap-4">
                    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Job details</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Name the ad hoc run and define the target context.</p>
                        </div>
                        <span className="rounded-full bg-[#E8FFF3] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#16A86E] ring-1 ring-emerald-100">Frontend setup</span>
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <label className="grid gap-2">
                          <span className="text-[12px] font-black text-slate-700">Job name</span>
                          <input
                            value={aiLaunchJobName}
                            onChange={(event) => setAiLaunchJobName(event.target.value)}
                            className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[13px] font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18"
                            placeholder="AI-ADHOC-2026-0721"
                          />
                        </label>
                        <label className="grid gap-2">
                          <span className="text-[12px] font-black text-slate-700">Target / application</span>
                          <input
                            value={aiLaunchTarget}
                            onChange={(event) => setAiLaunchTarget(event.target.value)}
                            className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[13px] font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18"
                            placeholder="https://example.com"
                          />
                        </label>
                        <label className="grid gap-2">
                          <span className="text-[12px] font-black text-slate-700">Environment</span>
                          <select
                            value={aiLaunchEnvironment}
                            onChange={(event) => setAiLaunchEnvironment(event.target.value)}
                            className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[13px] font-black text-slate-900 outline-none transition focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18"
                          >
                            {["Production", "Staging", "Internal", "Client demo"].map((item) => (
                              <option key={item}>{item}</option>
                            ))}
                          </select>
                        </label>
                        <label className="grid gap-2">
                          <span className="text-[12px] font-black text-slate-700">Owner</span>
                          <input
                            value={aiLaunchOwner}
                            onChange={(event) => setAiLaunchOwner(event.target.value)}
                            className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[13px] font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18"
                            placeholder="Dipak Kumar"
                          />
                        </label>
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Input source</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Use JSON upload now. API, webhook, and storage imports can connect later.</p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-blue-700 ring-1 ring-blue-100">JSON first</span>
                      </div>
                      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                        {aiLaunchSources.map((source) => (
                          <button
                            key={source.id}
                            type="button"
                            onClick={() => chooseAiLaunchSource(source)}
                            className={`rounded-[8px] border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${
                              aiLaunchSourceId === source.id
                                ? "border-[#2ECE82]/45 bg-[#F3FFF8] shadow-[0_12px_28px_rgba(46,206,130,0.10)]"
                                : source.enabled
                                  ? "border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:border-[#2ECE82]/40 hover:bg-white"
                                  : "border-slate-200 bg-slate-50/70 opacity-75 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className={`grid h-10 w-10 place-items-center rounded-[8px] ring-1 ${metricToneClasses(source.tone)}`}>
                                <source.Icon className="h-4.5 w-4.5" />
                              </span>
                              {!source.enabled ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-slate-500">Later</span> : null}
                            </div>
                            <p className="mt-3 text-[12px] font-black text-slate-950">{source.label}</p>
                            <p className="mt-1 min-h-8 text-[11px] font-semibold leading-relaxed text-slate-500">{source.helper}</p>
                          </button>
                        ))}
                      </div>

                      <label
                        htmlFor="ai-launch-json"
                        className="mt-4 grid min-h-44 cursor-pointer place-items-center rounded-[8px] border border-dashed border-[#0891B2]/35 bg-cyan-50/35 p-5 text-center transition hover:border-[#2ECE82]/60 hover:bg-[#F3FFF8]"
                      >
                        <input
                          id="ai-launch-json"
                          type="file"
                          accept=".json,application/json"
                          className="sr-only"
                          onChange={(event) => {
                            const fileName = event.target.files?.[0]?.name;
                            if (fileName) setAiLaunchFileName(fileName);
                          }}
                        />
                        <span className="grid h-13 w-13 place-items-center rounded-[8px] bg-white text-[#0891B2] shadow-[0_12px_28px_rgba(14,165,233,0.12)] ring-1 ring-cyan-100">
                          <Braces className="h-6 w-6" />
                        </span>
                        <div className="mt-3">
                          <p className="text-[15px] font-black text-slate-950">{aiLaunchFileName || "Drop scanner JSON here, or click to browse"}</p>
                          <p className="mt-1 text-[12px] font-semibold text-slate-500">Only JSON files are used in this frontend preview.</p>
                          <div className="mt-3 flex flex-wrap justify-center gap-2">
                            {aiLaunchFormats.map((format) => (
                              <span key={format} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-slate-500 ring-1 ring-slate-200">{format}</span>
                            ))}
                          </div>
                        </div>
                      </label>
                    </article>

                    <section className="grid gap-4 xl:grid-cols-2">
                      <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Engine configuration</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Choose the AI fallback and sandbox target for safe validation.</p>
                        </div>
                        <div className="mt-4 grid gap-3">
                          <label className="grid gap-2">
                            <span className="text-[12px] font-black text-slate-700">Fallback LLM</span>
                            <select
                              value={aiLaunchLlm}
                              onChange={(event) => setAiLaunchLlm(event.target.value)}
                              className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[13px] font-black text-slate-900 outline-none transition focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18"
                            >
                              {["OpenAI GPT-4", "OpenAI GPT-5 later", "Local fallback later"].map((item) => (
                                <option key={item}>{item}</option>
                              ))}
                            </select>
                          </label>
                          <label className="grid gap-2">
                            <span className="text-[12px] font-black text-slate-700">Sandbox target URL</span>
                            <input
                              value={aiLaunchSandboxTarget}
                              onChange={(event) => setAiLaunchSandboxTarget(event.target.value)}
                              className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-[13px] font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18"
                              placeholder="https://example.com"
                            />
                          </label>
                          <div className="rounded-[8px] border border-amber-100 bg-amber-50 p-3">
                            <div className="flex items-start gap-2.5">
                              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                              <p className="text-[11px] font-bold leading-relaxed text-slate-700">Validation should run only in an isolated sandbox or approved target scope. This page is frontend-only until backend policy checks are connected.</p>
                            </div>
                          </div>
                        </div>
                      </article>

                      <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Validation policy</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Control how scripts are selected, generated, and attached to reports.</p>
                        </div>
                        <div className="mt-4 grid gap-2.5">
                          {[
                            { label: "Use Knowledge Hub scripts first", helper: "Reuse approved checks before AI generation.", checked: aiLaunchUseKnowledgeHub, onClick: () => setAiLaunchUseKnowledgeHub((value) => !value), Icon: Database, tone: "emerald" },
                            { label: "Generate missing scripts with AI", helper: "Create missing checks with up to 3 revisions.", checked: aiLaunchGenerateMissing, onClick: () => setAiLaunchGenerateMissing((value) => !value), Icon: BrainCircuit, tone: "violet" },
                            { label: "Run sandbox validation", helper: "Do not mark vulnerable without safe execution proof.", checked: aiLaunchSandboxEnabled, onClick: () => setAiLaunchSandboxEnabled((value) => !value), Icon: Terminal, tone: "cyan" },
                            { label: "Attach evidence to report", helper: "Prepare proof and remediation notes for VAPT report.", checked: aiLaunchAttachEvidence, onClick: () => setAiLaunchAttachEvidence((value) => !value), Icon: FileText, tone: "orange" },
                          ].map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={item.onClick}
                              className={`flex items-center justify-between gap-3 rounded-[8px] border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${
                                item.checked ? "border-[#2ECE82]/35 bg-[#F3FFF8]" : "border-slate-200 bg-slate-50"
                              }`}
                            >
                              <div className="flex min-w-0 items-start gap-3">
                                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(item.tone)}`}>
                                  <item.Icon className="h-4 w-4" />
                                </span>
                                <div className="min-w-0">
                                  <p className="text-[12px] font-black text-slate-950">{item.label}</p>
                                  <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{item.helper}</p>
                                </div>
                              </div>
                              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${item.checked ? "bg-[#E8FFF3] text-[#16A86E] ring-emerald-100" : "bg-white text-slate-400 ring-slate-200"}`}>
                                {item.checked ? "On" : "Off"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </article>
                    </section>

                  </div>

                  <aside className="grid gap-4 self-start">
                    <article className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white shadow-[0_12px_30px_rgba(7,16,16,0.14)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Launch summary</p>
                          <h3 className="mt-1 text-[20px] font-black leading-tight">{aiLaunchJobName || "Untitled AI job"}</h3>
                          <p className="mt-1 text-[11px] font-bold text-white/58">{aiLaunchEnvironment} scope</p>
                        </div>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                          <Zap className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                        {[
                          ["Target", aiLaunchTarget || "Not set"],
                          ["Owner", aiLaunchOwner || "Not set"],
                          ["Source", selectedAiLaunchSource.label],
                          ["File", aiLaunchFileName || "No JSON selected"],
                          ["LLM", aiLaunchLlm],
                          ["Sandbox", aiLaunchSandboxTarget || "Not set"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-[8px] bg-white/[0.06] p-2.5">
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">{label}</p>
                            <p className="mt-1 truncate text-[12px] font-black text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={launchAiAdHocScan}
                        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2ECE82] text-[12px] font-black text-[#071010] transition hover:-translate-y-0.5 hover:bg-[#3FDC8F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        Launch AI scan
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_18px_rgba(15,23,42,0.028)]">
                      <div className="border-b border-slate-100 p-3.5">
                        <h3 className="text-[17px] font-black text-slate-950">Pre-launch checklist</h3>
                        <p className="mt-1 text-[12px] font-semibold text-slate-500">Complete these before queueing the AI job.</p>
                      </div>
                      <div className="grid gap-2 p-3">
                        {aiLaunchChecklist.map((item) => (
                          <div key={item.label} className="flex items-center gap-2.5 rounded-[8px] bg-slate-50/80 p-2">
                            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 ${item.done ? "bg-[#E8FFF3] text-[#16A86E] ring-emerald-100" : "bg-white text-slate-300 ring-slate-200"}`}>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </span>
                            <span className={`text-[11px] font-black ${item.done ? "text-slate-950" : "text-slate-400"}`}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </article>

                  </aside>
                </section>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-stretch">
                  <article className="rounded-[8px] border border-slate-200 bg-white p-3.5 shadow-[0_8px_18px_rgba(15,23,42,0.028)]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[17px] font-black text-slate-950">Launch flow</h3>
                        <p className="mt-1 text-[12px] font-semibold text-slate-500">What this job will do after backend pipeline integration.</p>
                      </div>
                      <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#16A86E] ring-1 ring-slate-100">Ad hoc job path</span>
                    </div>
                    <div className="mt-3 grid gap-2 md:grid-cols-3 xl:grid-cols-6">
                      {aiLaunchFlow.map((step, index) => (
                        <div key={step.label} className="relative rounded-[8px] border border-slate-200 bg-slate-50/70 p-2.5 transition hover:border-[#2ECE82]/45 hover:bg-white">
                          {index < aiLaunchFlow.length - 1 ? <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-[#16A86E]/35 xl:block" /> : null}
                          <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#E8FFF3] text-[#16A86E] ring-1 ring-[#2ECE82]/20">
                            <step.Icon className="h-3.5 w-3.5" />
                          </span>
                          <p className="mt-2 text-[11px] font-black leading-snug text-slate-950">{step.label}</p>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-[8px] border border-slate-200 bg-white p-3.5 shadow-[0_8px_18px_rgba(15,23,42,0.028)]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#E8FFF3] text-[#16A86E] ring-1 ring-emerald-100">
                        <Info className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-black text-slate-950">What happens after launch</h3>
                        <p className="mt-1 text-[12px] font-semibold leading-relaxed text-slate-500">
                          The demo redirects to Pipeline. Backend later will create the job, parse JSON, run validations, and publish results to Ad Hoc Dashboard.
                        </p>
                      </div>
                    </div>
                  </article>
                </section>

                <section className="mt-auto grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
                  <article className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-4 text-white shadow-[0_14px_34px_rgba(7,16,16,0.14)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Launch readiness</p>
                        <h3 className="mt-1 text-[22px] font-black leading-tight">{aiLaunchReady ? "Ready to queue" : "Waiting for JSON"}</h3>
                        <p className="mt-1 text-[12px] font-bold leading-relaxed text-white/62">
                          {aiLaunchChecklist.filter((item) => item.done).length} of {aiLaunchChecklist.length} checks complete for this ad hoc job.
                        </p>
                      </div>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={launchAiAdHocScan}
                      className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2ECE82] text-[12px] font-black text-[#071010] transition hover:-translate-y-0.5 hover:bg-[#3FDC8F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Launch AI scan
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </article>

                  <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.028)]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[17px] font-black text-slate-950">Backend handoff preview</h3>
                        <p className="mt-1 text-[12px] font-semibold text-slate-500">These steps will become live once the Django AI Pentester worker is connected.</p>
                      </div>
                      <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#16A86E] ring-1 ring-slate-100">Frontend only</span>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {[
                        { label: "Create job", helper: "Store job, target, owner, source, and selected policy.", Icon: FileText },
                        { label: "Queue pipeline", helper: "Send JSON to parser, Knowledge Hub, AI generator, and sandbox.", Icon: Layers3 },
                        { label: "Publish results", helper: "Return status to Pipeline, CVE Workbench, and Ad Hoc Dashboard.", Icon: LayoutDashboard },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[8px] border border-slate-200 bg-slate-50/70 p-3">
                          <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-[#E8FFF3] text-[#16A86E] ring-1 ring-[#2ECE82]/20">
                            <item.Icon className="h-4 w-4" />
                          </span>
                          <p className="mt-3 text-[12px] font-black text-slate-950">{item.label}</p>
                          <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{item.helper}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                </section>
              </div>
            ) : activeSection === "noc-agent" ? (
              <div className="grid gap-4">
                {scanToast ? (
                  <div className="fixed right-4 top-4 z-[90] w-[min(calc(100vw-2rem),390px)] rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-4 text-white shadow-[0_24px_70px_rgba(7,16,16,0.28)]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                        <Bot className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Network Agent preview</p>
                        <p className="mt-1 text-[13px] font-bold leading-relaxed text-white/80">{scanToast}</p>
                      </div>
                      <button type="button" onClick={() => setScanToast("")} className="text-white/50 transition hover:text-white" aria-label="Close notification">
                        <ChevronRight className="h-4 w-4 rotate-45" />
                      </button>
                    </div>
                  </div>
                ) : null}

                {nocAgentWizardOpen ? (
                  <div className="fixed inset-0 z-[95] grid place-items-center bg-[#071010]/58 p-4 backdrop-blur-sm">
                    <section className="max-h-[calc(100dvh-2rem)] w-[min(100%,920px)] overflow-hidden rounded-[8px] border border-[#2ECE82]/24 bg-white shadow-[0_28px_90px_rgba(7,16,16,0.34)]">
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-4">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0891B2]">Add Network Agent</p>
                          <h2 className="mt-1 text-[26px] font-black leading-tight text-slate-950">{nocCurrentStep.label}</h2>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">{nocCurrentStep.helper}</p>
                        </div>
                        <button
                          type="button"
                          onClick={closeNocAgentWizard}
                          className="grid h-10 w-10 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                          aria-label="Close add agent flow"
                        >
                          <ChevronRight className="h-4 w-4 rotate-45" />
                        </button>
                      </div>

                      <div className="grid max-h-[calc(100dvh-12rem)] gap-4 overflow-y-auto overscroll-contain p-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                        <aside className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                          <div className="grid gap-2">
                            {nocSetupSteps.map((step, index) => (
                              <button
                                key={step.label}
                                type="button"
                                onClick={() => setNocAgentStep(index)}
                                className={`flex items-start gap-3 rounded-[8px] p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${
                                  nocAgentStep === index ? "bg-[#071010] text-white shadow-[0_12px_28px_rgba(7,16,16,0.16)]" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-[#2ECE82]/35"
                                }`}
                              >
                                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-[8px] ${nocAgentStep === index ? "bg-white/[0.08] text-[#2ECE82]" : "bg-cyan-50 text-[#0891B2]"}`}>
                                  <step.Icon className="h-4 w-4" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-[12px] font-black">{step.label}</span>
                                  <span className={`mt-0.5 block text-[10px] font-bold leading-relaxed ${nocAgentStep === index ? "text-white/58" : "text-slate-500"}`}>{step.helper}</span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </aside>

                        <div className="rounded-[8px] border border-slate-200 bg-white p-4">
                          <div className="mb-4 flex items-center gap-3">
                            <span className={`grid h-12 w-12 place-items-center rounded-[8px] ring-1 ${metricToneClasses(nocAgentStep === 3 ? "orange" : nocAgentStep === 4 ? "emerald" : "cyan")}`}>
                              <NocCurrentStepIcon className="h-5 w-5" />
                            </span>
                            <div>
                              <p className="text-[13px] font-black text-slate-950">Step {nocAgentStep + 1} of {nocSetupSteps.length}</p>
                              <p className="mt-0.5 text-[12px] font-semibold text-slate-500">Collector model: one agent can monitor many devices inside the same network.</p>
                            </div>
                          </div>

                          {nocAgentStep === 0 ? (
                            <div className="grid gap-3">
                              {[
                                ["Outbound HTTPS only", "The agent connects to EVADA without opening inbound firewall rules."],
                                ["Short-lived enrollment", "One-time setup token expires after 30 minutes."],
                                ["Collector deployment", "Install one agent per site or network segment, not on every device."],
                              ].map(([label, helper]) => (
                                <div key={label} className="flex items-start gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A86E]" />
                                  <div>
                                    <p className="text-[13px] font-black text-slate-950">{label}</p>
                                    <p className="mt-0.5 text-[12px] font-semibold text-slate-500">{helper}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {nocAgentStep === 1 ? (
                            <div className="grid gap-3 md:grid-cols-2">
                              {[
                                ["Agent name", "Head Office Agent"],
                                ["Site name", "Patna Office"],
                                ["Network range", "192.168.1.0/24"],
                                ["Environment", "Internal"],
                              ].map(([label, value]) => (
                                <label key={label} className="grid gap-2">
                                  <span className="text-[12px] font-black text-slate-700">{label}</span>
                                  <input
                                    defaultValue={value}
                                    className="h-11 rounded-[8px] border border-slate-200 bg-slate-50 px-3 text-[13px] font-bold text-slate-900 outline-none transition focus:border-[#2ECE82] focus:bg-white focus:ring-2 focus:ring-[#2ECE82]/20"
                                  />
                                </label>
                              ))}
                            </div>
                          ) : null}

                          {nocAgentStep === 2 ? (
                            <div className="grid gap-3 md:grid-cols-3">
                              {nocOsOptions.map((option) => (
                                <button
                                  key={option.label}
                                  type="button"
                                  onClick={() => setNocAgentOs(option.label)}
                                  className={`rounded-[8px] border p-4 text-left transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${
                                    nocAgentOs === option.label ? "border-[#2ECE82] bg-[#F3FFF8] shadow-[0_14px_30px_rgba(46,206,130,0.14)]" : "border-slate-200 bg-white hover:border-[#2ECE82]/40"
                                  }`}
                                >
                                  <span className={`grid h-11 w-11 place-items-center rounded-[8px] ring-1 ${option.label.includes("Windows") ? metricToneClasses("blue") : metricToneClasses("slate")}`}>
                                    <option.Icon className="h-5 w-5" />
                                  </span>
                                  <p className="mt-3 text-[13px] font-black text-slate-950">{option.label}</p>
                                  <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{option.helper}</p>
                                </button>
                              ))}
                            </div>
                          ) : null}

                          {nocAgentStep === 3 ? (
                            <div className="grid gap-3">
                              <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">Enrollment token</p>
                                <p className="mt-2 break-all rounded-[8px] bg-white p-3 font-mono text-[13px] font-black text-slate-950 ring-1 ring-amber-100">evada_enroll_7H9K-4F2X-DEMO-30MIN</p>
                                <p className="mt-2 text-[12px] font-semibold text-amber-800">One-time use. Expires in 30 minutes. Demo token for frontend preview.</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  window.navigator.clipboard?.writeText("evada_enroll_7H9K-4F2X-DEMO-30MIN");
                                  setScanToast("Enrollment token copied for frontend preview.");
                                }}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                              >
                                <Copy className="h-4 w-4 text-[#0891B2]" />
                                Copy token
                              </button>
                            </div>
                          ) : null}

                          {nocAgentStep === 4 ? (
                            <div className="grid gap-3">
                              <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0891B2]">Selected package</p>
                                    <p className="mt-1 text-[18px] font-black text-slate-950">{nocAgentOs}</p>
                                  </div>
                                  <span className="rounded-full bg-[#E8FFF3] px-3 py-1 text-[10px] font-black text-[#16A86E] ring-1 ring-emerald-100">Ready</span>
                                </div>
                                <div className="mt-3 rounded-[8px] bg-[#071010] p-3 text-white">
                                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#04D9FF]">Install command</p>
                                  <p className="mt-2 break-all font-mono text-[12px] font-bold text-white/84">EVADA-Agent-Setup.exe /token evada_enroll_7H9K-4F2X-DEMO-30MIN /site &quot;Patna Office&quot;</p>
                                </div>
                              </div>
                              <div className="grid gap-2 sm:grid-cols-2">
                                <button
                                  type="button"
                                  onClick={() => setScanToast("Windows agent .exe download is frontend-only for now.")}
                                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#2ECE82] text-[12px] font-black text-[#071010] shadow-[0_16px_34px_rgba(46,206,130,0.22)] transition hover:-translate-y-0.5 hover:bg-[#3FDC8F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#071010]"
                                >
                                  <Download className="h-4 w-4" />
                                  Download agent
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    window.navigator.clipboard?.writeText('EVADA-Agent-Setup.exe /token evada_enroll_7H9K-4F2X-DEMO-30MIN /site "Patna Office"');
                                    setScanToast("Install command copied for frontend preview.");
                                  }}
                                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                                >
                                  <Terminal className="h-4 w-4 text-[#0891B2]" />
                                  Copy command
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 p-4">
                        <button
                          type="button"
                          onClick={() => moveNocAgentStep("back")}
                          disabled={nocAgentStep === 0}
                          className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-700 transition hover:border-[#2ECE82]/40 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => moveNocAgentStep("next")}
                          className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white transition hover:bg-[#0E241E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                        >
                          {nocAgentStep >= nocSetupSteps.length - 1 ? "Verify connection" : "Continue"}
                          <ArrowRight className="h-4 w-4 text-[#2ECE82]" />
                        </button>
                      </div>
                    </section>
                  </div>
                ) : null}

                <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
                  {nocMetrics.map((item) => (
                    <article key={item.label} className="rounded-[8px] border border-slate-200 bg-white px-3 py-2.5 shadow-[0_6px_16px_rgba(15,23,42,0.03)]">
                      <div className="flex items-center gap-2.5">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ${metricToneClasses(item.tone)}`}>
                          <item.Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[11px] font-black text-slate-500">{item.label}</p>
                            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-slate-400 ring-1 ring-slate-100">{item.helper}</span>
                          </div>
                          <p className="mt-0.5 text-[22px] font-black leading-none text-slate-950">{item.value}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
                  <div className="grid gap-4">
                    <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-5">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0891B2]">Network collector</p>
                          <h2 className="mt-2 text-[28px] font-black leading-tight text-slate-950">Connect a Network Agent</h2>
                          <p className="mt-2 max-w-[720px] text-[13px] font-semibold leading-relaxed text-slate-600">
                            Install one EVADA Agent inside a client network to discover devices, monitor exposure, and report heartbeat status securely.
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {["One agent per site", "Outbound HTTPS", "30 min enrollment token"].map((item) => (
                              <span key={item} className="inline-flex h-8 items-center gap-2 rounded-full bg-slate-50 px-3 text-[11px] font-black text-slate-600 ring-1 ring-slate-100">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#16A86E]" />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-2 rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Collector model</p>
                              <p className="mt-1 text-[22px] font-black leading-none">1 agent</p>
                            </div>
                            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                              <Bot className="h-5 w-5" />
                            </span>
                          </div>
                          <p className="text-[12px] font-bold leading-relaxed text-white/68">Can discover many routers, servers, switches, firewalls, and storage devices in the selected network range.</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 lg:px-5">
                        {canAction("network_agent", "create") ? <button
                          type="button"
                          onClick={openNocAgentWizard}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white shadow-[0_14px_30px_rgba(7,16,16,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0E241E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                        >
                          <Plus className="h-4 w-4 text-[#2ECE82]" />
                          Add agent
                        </button> : null}
                        <button
                          type="button"
                          onClick={() => setScanToast("Network Agent setup guide is frontend-only for now.")}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                        >
                          <FileText className="h-4 w-4 text-[#0891B2]" />
                          View setup guide
                        </button>
                      </div>
                    </article>

                    <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Agent fleet</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Collectors by site, heartbeat, and connected device count.</p>
                        </div>
                        <span className="rounded-full bg-[#E8FFF3] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#16A86E] ring-1 ring-emerald-100">1 online</span>
                      </div>
                      <div className="overflow-x-auto p-3">
                        <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
                          <colgroup>
                            <col className="w-[25%]" />
                            <col className="w-[19%]" />
                            <col className="w-[15%]" />
                            <col className="w-[13%]" />
                            <col className="w-[13%]" />
                            <col className="w-[9%]" />
                            <col className="w-[6%]" />
                          </colgroup>
                          <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
                              <th className="rounded-l-[8px] px-3 py-2.5">Agent</th>
                              <th className="px-3 py-2.5">Site / network</th>
                              <th className="px-3 py-2.5">OS</th>
                              <th className="px-3 py-2.5">Status</th>
                              <th className="px-3 py-2.5">Heartbeat</th>
                              <th className="px-3 py-2.5">Devices</th>
                              <th className="rounded-r-[8px] px-3 py-2.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {nocAgents.map((agent) => {
                              const AgentIcon = agent.Icon;
                              const ConnectionIcon = agent.status === "Offline" ? WifiOff : Wifi;

                              return (
                                <tr key={agent.id} className="transition hover:bg-slate-50/70">
                                  <td className="px-3 py-3">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(agent.tone)}`}>
                                        <AgentIcon className="h-4 w-4" />
                                      </span>
                                      <div className="min-w-0">
                                        <p className="truncate text-[12px] font-black text-slate-950">{agent.name}</p>
                                        <p className="mt-0.5 truncate text-[10px] font-bold text-slate-500">{agent.version}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3">
                                    <p className="truncate text-[11px] font-black text-slate-800">{agent.site}</p>
                                    <p className="mt-0.5 truncate text-[10px] font-bold text-slate-500">{agent.network}</p>
                                  </td>
                                  <td className="px-3 py-3 text-[11px] font-black text-slate-700">{agent.os}</td>
                                  <td className="px-3 py-3">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${nocConnectionClasses(agent.status)}`}>
                                      <ConnectionIcon className="h-3 w-3" />
                                      {agent.status}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3 text-[11px] font-black text-slate-700">{agent.heartbeat}</td>
                                  <td className="px-3 py-3 text-[11px] font-black text-slate-700">{agent.devices}</td>
                                  <td className="px-3 py-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => setScanToast(`${agent.name} details are frontend-only for now.`)}
                                      className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#2ECE82]/40 hover:text-[#071010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                                      aria-label={`Open actions for ${agent.name}`}
                                    >
                                      <MoreVertical className="h-3.5 w-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </article>

                    <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Discovered devices</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Discovered devices are free to view; monitored devices count toward Network Device quota.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setScanToast("Device discovery refresh is frontend-only for now.")}
                          className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                        >
                          <ScanSearch className="h-3.5 w-3.5 text-[#0891B2]" />
                          Resync
                        </button>
                      </div>
                      <div className="overflow-x-auto p-3">
                        <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
                          <colgroup>
                            <col className="w-[22%]" />
                            <col className="w-[13%]" />
                            <col className="w-[13%]" />
                            <col className="w-[13%]" />
                            <col className="w-[11%]" />
                            <col className="w-[10%]" />
                            <col className="w-[12%]" />
                            <col className="w-[6%]" />
                          </colgroup>
                          <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
                              <th className="rounded-l-[8px] px-3 py-2.5">Device</th>
                              <th className="px-3 py-2.5">IP</th>
                              <th className="px-3 py-2.5">Type</th>
                              <th className="px-3 py-2.5">Vendor</th>
                              <th className="px-3 py-2.5">Status</th>
                              <th className="px-3 py-2.5">Risk</th>
                              <th className="px-3 py-2.5">Last scan</th>
                              <th className="rounded-r-[8px] px-3 py-2.5 text-right">Monitor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {nocDevices.map((device) => {
                              const DeviceIcon = device.Icon;

                              return (
                                <tr key={device.id} className="transition hover:bg-slate-50/70">
                                  <td className="px-3 py-3">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(device.tone)}`}>
                                        <DeviceIcon className="h-4 w-4" />
                                      </span>
                                      <div className="min-w-0">
                                        <p className="truncate text-[12px] font-black text-slate-950">{device.name}</p>
                                        <p className="mt-0.5 truncate text-[10px] font-bold text-slate-500">{device.agent}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3 text-[11px] font-black text-slate-700">{device.ip}</td>
                                  <td className="px-3 py-3 text-[11px] font-black text-slate-700">{device.type}</td>
                                  <td className="px-3 py-3 text-[11px] font-black text-slate-700">{device.vendor}</td>
                                  <td className="px-3 py-3">
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${nocDeviceStatusClasses(device.status)}`}>{device.status}</span>
                                  </td>
                                  <td className="px-3 py-3">
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${severityPillClasses(device.risk)}`}>{device.risk}</span>
                                  </td>
                                  <td className="px-3 py-3 text-[11px] font-black text-slate-700">{device.lastScan}</td>
                                  <td className="px-3 py-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => setScanToast(`${device.name} monitor toggle is frontend-only for now.`)}
                                      className={`relative h-6 w-11 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${device.monitored ? "bg-[#2ECE82]" : "bg-slate-200"}`}
                                      aria-label={`Toggle monitoring for ${device.name}`}
                                    >
                                      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${device.monitored ? "left-6" : "left-1"}`} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </article>
                  </div>

                  <aside className="grid gap-4 xl:sticky xl:top-24">
                    <article className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white shadow-[0_12px_30px_rgba(7,16,16,0.14)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Network health</p>
                          <h3 className="mt-1 text-[22px] font-black leading-none">72% coverage</h3>
                          <p className="mt-1 text-[11px] font-bold text-white/58">18 monitored of 25 included devices</p>
                        </div>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                          <Gauge className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[72%] rounded-full bg-[#2ECE82]" />
                      </div>
                      <div className="mt-3 grid gap-2">
                        {[
                          ["Agent health", "1 online / 1 warning / 1 offline"],
                          ["Last sync", "32 seconds ago"],
                          ["Open alerts", "3 require review"],
                          ["Quota left", "7 Network devices"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-[8px] bg-white/[0.06] p-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/46">{label}</p>
                            <p className="mt-1 text-[12px] font-black text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white p-3.5 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0891B2]">Deployment guidance</p>
                      <h3 className="mt-2 text-[18px] font-black text-slate-950">Install per network site</h3>
                      <p className="mt-2 text-[12px] font-semibold leading-relaxed text-slate-500">
                        Use one collector for each office, VLAN, DMZ, or cloud network segment that needs internal discovery.
                      </p>
                      <div className="mt-3 grid gap-2">
                        {[
                          ["Good", "1 agent per site or segment"],
                          ["Avoid", "Installing on every discovered device"],
                          ["Later", "Endpoint agent for deep host telemetry"],
                        ].map(([label, helper]) => (
                          <div key={label} className="flex items-start gap-2 rounded-[8px] border border-slate-200 bg-slate-50 p-2.5">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A86E]" />
                            <div>
                              <p className="text-[12px] font-black text-slate-950">{label}</p>
                              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{helper}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  </aside>
                </section>
              </div>
            ) : activeSection === "activity-log" ? (
              <>
                <ActivityLogWorkspace />
                {false && (
              <div className="grid gap-3">
                <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                  {activityMetrics.map((metric) => (
                    <article key={metric.label} className="rounded-[8px] border border-slate-200 bg-white px-3 py-2.5 shadow-[0_6px_16px_rgba(15,23,42,0.03)]">
                      <div className="flex items-center gap-2.5">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ${metricToneClasses(metric.tone)}`}>
                          <metric.Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[11px] font-black text-slate-500">{metric.label}</p>
                            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-slate-400 ring-1 ring-slate-100">{metric.helper}</span>
                          </div>
                          <p className="mt-0.5 text-[22px] font-black leading-none text-slate-950">{metric.value}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>

                <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                  <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-3">
                      <div>
                        <h3 className="text-[17px] font-black text-slate-950">Monthly login activity</h3>
                        <p className="mt-0.5 text-[12px] font-semibold text-slate-500">{selectedDayLabel} activity, login count, and blocked attempts.</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#E8FFF3] px-2.5 py-1 text-[10px] font-black text-[#16A86E] ring-1 ring-emerald-100">{selectedActivityMonth.activeDays.length} active days</span>
                        <div className="inline-flex h-9 items-center overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50">
                          <button
                            type="button"
                            onClick={() => changeActivityMonth(activityMonthIndex - 1)}
                            disabled={activityMonthIndex === 0}
                            className="grid h-full w-9 place-items-center text-slate-500 transition hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-35"
                            aria-label="Previous month"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="min-w-[92px] px-2 text-center text-[11px] font-black text-slate-700">{selectedActivityMonth.label}</span>
                          <button
                            type="button"
                            onClick={() => changeActivityMonth(activityMonthIndex + 1)}
                            disabled={activityMonthIndex === activityMonths.length - 1}
                            className="grid h-full w-9 place-items-center text-slate-500 transition hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-35"
                            aria-label="Next month"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 p-3 lg:grid-cols-[minmax(0,620px)_minmax(220px,1fr)]">
                      <div>
                        <div className="grid max-w-[620px] grid-cols-7 gap-1.5 text-center text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                          {weekDays.map((day, index) => (
                            <span key={`${day}-${index}`}>{day}</span>
                          ))}
                        </div>
                        <div className="mt-1.5 grid max-w-[620px] grid-cols-7 gap-1.5">
                          {activityMonthSlots.map((day, index) => (
                            day ? (
                              <button
                                key={day.day}
                                type="button"
                                onClick={() => selectActivityDay(day.day)}
                                className={`relative grid h-11 place-items-center rounded-[8px] text-[12px] font-black ring-1 transition hover:-translate-y-0.5 ${activityDayClasses(day.status)} ${selectedActivityDay === day.day ? "ring-2 ring-[#071010]" : ""}`}
                                title={`${selectedActivityMonth.label} ${day.day}: ${day.loginCount} ${day.loginCount === 1 ? "login" : "logins"}`}
                              >
                                {activityMonthIndex === defaultActivityMonthIndex && day.day === defaultActivityDayValue ? (
                                  <span className="absolute left-1 top-1 rounded-full bg-[#071010] px-1.5 py-0.5 text-[8px] font-black uppercase leading-none text-white shadow-sm">Today</span>
                                ) : null}
                                <span className="leading-none">{day.day}</span>
                                {day.loginCount > 0 ? (
                                  <span className="absolute bottom-1 right-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-white/90 px-1 text-[9px] font-black leading-none text-[#071010] shadow-sm">{day.loginCount}</span>
                                ) : null}
                              </button>
                            ) : (
                              <div key={`blank-${index}`} aria-hidden="true" />
                            )
                          ))}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black text-slate-500">
                          {[
                            ["Active", "bg-[#2ECE82]"],
                            ["Attention", "bg-amber-300"],
                            ["Blocked", "bg-rose-300"],
                            ["No login", "bg-slate-200"],
                          ].map(([label, color]) => (
                            <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 ring-1 ring-slate-100">
                              <span className={`h-2 w-2 rounded-full ${color}`} />
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        {[
                          ["Selected day", `${selectedDayLoginCount} ${selectedDayLoginCount === 1 ? "login" : "logins"}`, `${selectedDayEvents.length} detailed events`],
                          ["Last login", selectedActivity?.time || selectedActivityMonth.lastLogin, selectedActivity?.device || "No session on this date"],
                          ["Current streak", selectedActivityMonth.streak, "verified login activity"],
                          ["Failed attempts", selectedActivityMonth.failedAttempts, "blocked before session"],
                        ].map(([label, value, helper]) => (
                          <div key={label} className="rounded-[8px] border border-slate-200 bg-slate-50 p-2.5">
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
                            <p className="mt-1 text-[17px] font-black leading-none text-slate-950">{value}</p>
                            <p className="mt-1 text-[11px] font-bold text-slate-500">{helper}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>

                  <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                    <div className="border-b border-slate-100 p-3">
                      <h3 className="text-[17px] font-black text-slate-950">Security timeline</h3>
                      <p className="mt-0.5 text-[12px] font-semibold text-slate-500">{selectedDayLabel} important events.</p>
                    </div>
                    <div className="grid gap-2.5 p-3">
                      {selectedDayEvents.length > 0 ? selectedDayEvents.slice(0, 4).map((item) => {
                        const TimelineIcon = item.Icon;

                        return (
                          <button
                            key={`${item.event}-${item.time}`}
                            type="button"
                            onClick={() => setSelectedActivityId(item.id)}
                            className={`flex gap-2.5 rounded-[8px] p-1.5 text-left transition hover:bg-slate-50 ${selectedActivity?.id === item.id ? "bg-[#F3FFF8]" : ""}`}
                          >
                            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ${metricToneClasses(item.tone)}`}>
                              <TimelineIcon className="h-3.5 w-3.5" />
                            </span>
                            <div className="min-w-0 flex-1 border-b border-slate-100 pb-2.5 last:border-b-0 last:pb-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate text-[12px] font-black text-slate-950">{item.event}</p>
                                <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ring-1 ${activityStatusClasses(item.status)}`}>{item.status}</span>
                              </div>
                              <p className="mt-0.5 text-[11px] font-bold text-slate-500">{item.time}</p>
                              <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-600">{item.location}</p>
                            </div>
                          </button>
                        );
                      }) : (
                        <div className="rounded-[8px] border border-dashed border-slate-200 bg-slate-50 p-3">
                          <p className="text-[12px] font-black text-slate-950">No events on this date</p>
                          <p className="mt-1 text-[11px] font-semibold text-slate-500">Pick another active day or change month.</p>
                        </div>
                      )}
                    </div>
                  </article>
                </section>

                <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                  <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-3">
                      <div>
                        <h3 className="text-[17px] font-black text-slate-950">Audit events</h3>
                        <p className="mt-0.5 text-[12px] font-semibold text-slate-500">
                          {filteredActivityEvents.length} of {selectedMonthEvents.length} events in {selectedActivityMonth.label}. View a row to focus its day.
                        </p>
                      </div>
                      {canAction("activity_log", "download") ? <button type="button" className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]">
                        Export log
                        <Download className="h-3.5 w-3.5" />
                      </button> : null}
                    </div>

                    <div className="grid gap-2 border-b border-slate-100 bg-slate-50 p-3 lg:grid-cols-[minmax(220px,1fr)_140px_140px]">
                      <label className="flex h-9 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-slate-500 transition focus-within:border-[#2ECE82]/50 focus-within:ring-2 focus-within:ring-[#2ECE82]/20">
                        <Search className="h-4 w-4" />
                        <input
                          value={activitySearch}
                          onChange={(event) => setActivitySearch(event.target.value)}
                          placeholder="Search activity"
                          className="min-w-0 flex-1 bg-transparent text-[12px] font-bold text-slate-800 outline-none placeholder:text-slate-400"
                        />
                      </label>
                      <select
                        value={activityModuleFilter}
                        onChange={(event) => setActivityModuleFilter(event.target.value)}
                        className="h-9 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700 outline-none transition hover:border-[#2ECE82]/40 focus:border-[#2ECE82]/50 focus:ring-2 focus:ring-[#2ECE82]/20"
                        aria-label="Filter activity module"
                      >
                        {activityModuleOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <select
                        value={activityStatusFilter}
                        onChange={(event) => setActivityStatusFilter(event.target.value)}
                        className="h-9 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700 outline-none transition hover:border-[#2ECE82]/40 focus:border-[#2ECE82]/50 focus:ring-2 focus:ring-[#2ECE82]/20"
                        aria-label="Filter activity status"
                      >
                        {activityStatusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div className="overflow-x-auto p-3">
                      <table className="w-full min-w-[780px] table-fixed border-collapse text-left">
                        <colgroup>
                          <col className="w-[19%]" />
                          <col className="w-[31%]" />
                          <col className="w-[17%]" />
                          <col className="w-[13%]" />
                          <col className="w-[13%]" />
                          <col className="w-[7%]" />
                        </colgroup>
                        <thead>
                          <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
                            <th className="rounded-l-[8px] px-3 py-2.5">Time</th>
                            <th className="px-3 py-2.5">Event</th>
                            <th className="px-3 py-2.5">Module</th>
                            <th className="px-3 py-2.5">Status</th>
                            <th className="px-3 py-2.5">Source</th>
                            <th className="rounded-r-[8px] px-3 py-2.5 text-right">View</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredActivityEvents.length > 0 ? filteredActivityEvents.map((event) => {
                            const EventIcon = event.Icon;
                            const selected = selectedActivity?.id === event.id;

                            return (
                              <tr key={event.id} className={selected ? "bg-[#F3FFF8]" : "transition hover:bg-slate-50/70"}>
                                <td className="px-3 py-2.5">
                                  <span className="block truncate text-[11px] font-black text-slate-800">{event.time}</span>
                                  <span className="mt-0.5 block text-[10px] font-bold text-slate-500">{event.id}</span>
                                </td>
                                <td className="px-3 py-2.5">
                                  <div className="flex min-w-0 items-center gap-2">
                                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(event.tone)}`}>
                                      <EventIcon className="h-3.5 w-3.5" />
                                    </span>
                                    <div className="min-w-0">
                                      <p className="truncate text-[12px] font-black text-slate-950">{event.event}</p>
                                      <p className="mt-0.5 truncate text-[10px] font-bold text-slate-500">{event.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-2.5">
                                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600 ring-1 ring-slate-200">{event.module}</span>
                                </td>
                                <td className="px-3 py-2.5">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${activityStatusClasses(event.status)}`}>{event.status}</span>
                                </td>
                                <td className="px-3 py-2.5">
                                  <p className="truncate text-[11px] font-black text-slate-800">{event.ip}</p>
                                  <p className="mt-0.5 truncate text-[10px] font-bold text-slate-500">{event.location}</p>
                                </td>
                                <td className="px-3 py-2.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedActivityDay(event.day);
                                      setSelectedActivityId(event.id);
                                    }}
                                    className="inline-grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#2ECE82]/40 hover:text-[#071010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                                    aria-label={`View ${event.id}`}
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          }) : (
                            <tr>
                              <td colSpan={6} className="px-3 py-10 text-center">
                                <div className="mx-auto max-w-[320px]">
                                  <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500">
                                    <Info className="h-4 w-4" />
                                  </span>
                                  <p className="mt-3 text-[13px] font-black text-slate-950">No audit rows match this filter</p>
                                  <p className="mt-1 text-[12px] font-semibold text-slate-500">Clear search or change module/status to see the month ledger.</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </article>

                  <aside className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                    {selectedActivity ? (
                      <>
                        <div className="border-b border-slate-100 p-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0891B2]">Event detail</p>
                          <div className="mt-2.5 flex items-start gap-2.5">
                            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(selectedActivity.tone)}`}>
                              <SelectedActivityIcon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <h3 className="truncate text-[17px] font-black text-slate-950">{selectedActivity.event}</h3>
                              <p className="mt-0.5 text-[11px] font-bold text-slate-500">{selectedActivity.time}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2.5 p-3">
                          <div className="rounded-[8px] border border-[#2ECE82]/18 bg-[#F3FFF8] p-2.5">
                            <div className="flex items-start gap-2">
                              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[#16A86E] ring-1 ring-emerald-100">
                                <MapPin className="h-3.5 w-3.5" />
                              </span>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Location</p>
                                <p className="mt-0.5 truncate text-[12px] font-black text-slate-950">{selectedActivity.location}</p>
                                <p className="mt-0.5 truncate text-[11px] font-bold text-slate-500">{selectedActivity.ip}</p>
                              </div>
                            </div>
                          </div>
                          {[
                            ["Status", selectedActivity.status],
                            ["Module", selectedActivity.module],
                            ["User", selectedActivity.user],
                            ["Email", selectedActivity.email],
                            ["Auth method", selectedActivity.authMethod],
                            ["Risk", selectedActivity.riskScore],
                            ["Device", selectedActivity.device],
                            ["Session", selectedActivity.sessionId],
                          ].map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
                              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">{label}</span>
                              <span className={label === "Risk" ? `min-w-0 rounded-full px-2 py-0.5 text-right text-[10px] font-black ring-1 ${activityRiskClasses(value)}` : "min-w-0 truncate text-right text-[11px] font-black text-slate-800"}>{value}</span>
                            </div>
                          ))}
                          <div className="rounded-[8px] bg-slate-50 p-2.5">
                            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Description</p>
                            <p className="mt-1.5 text-[11px] font-semibold leading-relaxed text-slate-600">{selectedActivity.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setScanToast(`${selectedActivity.id} copied in frontend preview.`)}
                            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[8px] bg-[#071010] text-[11px] font-black text-white transition hover:bg-[#0E241E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                          >
                            Copy event ID
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="grid min-h-[280px] place-items-center p-5 text-center">
                        <div>
                          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500">
                            <Info className="h-5 w-5" />
                          </span>
                          <p className="mt-3 text-[13px] font-black text-slate-950">Select an event</p>
                          <p className="mt-1 text-[12px] font-semibold leading-relaxed text-slate-500">No detailed activity is stored for {selectedDayLabel} in this frontend preview.</p>
                        </div>
                      </div>
                    )}
                  </aside>
                </section>
              </div>
                )}
              </>
            ) : activeSection === "reports" ? (
              <>
                <ReportsWorkspace />
                {false && (
              <div className="grid gap-4">
                {scanToast ? (
                  <div className="fixed right-4 top-4 z-[90] w-[min(calc(100vw-2rem),390px)] rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-4 text-white shadow-[0_24px_70px_rgba(7,16,16,0.28)]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Reports preview</p>
                        <p className="mt-1 text-[13px] font-bold leading-relaxed text-white/80">{scanToast}</p>
                      </div>
                      <button type="button" onClick={() => setScanToast("")} className="text-white/50 transition hover:text-white" aria-label="Close notification">
                        <ChevronRight className="h-4 w-4 rotate-45" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
                  {reportMetrics.map((item) => (
                    <article key={item.label} className="rounded-[8px] border border-slate-200 bg-white px-3 py-2.5 shadow-[0_6px_16px_rgba(15,23,42,0.03)]">
                      <div className="flex items-center gap-2.5">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ${metricToneClasses(item.tone)}`}>
                          <item.Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[11px] font-black text-slate-500">{item.label}</p>
                            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-slate-400 ring-1 ring-slate-100">{item.helper}</span>
                          </div>
                          <p className="mt-0.5 text-[22px] font-black leading-none text-slate-950">{item.value}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
                  <div className="grid gap-4">
                    <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-5">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0891B2]">Report center</p>
                          <h2 className="mt-2 text-[28px] font-black leading-tight text-slate-950">Generate VAPT report</h2>
                          <p className="mt-2 max-w-[700px] text-[13px] font-semibold leading-relaxed text-slate-600">
                            Create client-ready reports from scans, assets, findings, and AI Pentester evidence.
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {["Evidence attached", "Client branding", "Approval workflow"].map((item) => (
                              <span key={item} className="inline-flex h-8 items-center gap-2 rounded-full bg-slate-50 px-3 text-[11px] font-black text-slate-600 ring-1 ring-slate-100">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#16A86E]" />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-2 rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Next export</p>
                              <p className="mt-1 text-[22px] font-black leading-none">Technical VAPT</p>
                            </div>
                            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                              <FileText className="h-5 w-5" />
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-[8px] bg-white/[0.06] p-2.5">
                              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">Findings</p>
                              <p className="mt-1 text-[18px] font-black">48</p>
                            </div>
                            <div className="rounded-[8px] bg-white/[0.06] p-2.5">
                              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/46">Evidence</p>
                              <p className="mt-1 text-[18px] font-black">42</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 lg:px-5">
                        {canAction("reports", "create") ? <button
                          type="button"
                          onClick={() => setScanToast("Report builder is frontend-only for now. Backend report generation can connect next.")}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white shadow-[0_14px_30px_rgba(7,16,16,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0E241E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                        >
                          <Plus className="h-4 w-4 text-[#2ECE82]" />
                          Create report
                        </button> : null}
                        <button
                          type="button"
                          onClick={() => setScanToast("Report templates are ready for frontend preview.")}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                        >
                          <Layers3 className="h-4 w-4 text-[#0891B2]" />
                          View templates
                        </button>
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Report builder preview</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Scope, range, report type, and export format for the next client packet.</p>
                        </div>
                        <span className="rounded-full bg-[#E8FFF3] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#16A86E] ring-1 ring-emerald-100">Frontend preview</span>
                      </div>
                      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                        {reportBuilderSteps.map((step) => (
                          <button
                            key={step.label}
                            type="button"
                            onClick={() => setScanToast(`${step.label} selection is frontend-only for now.`)}
                            className="rounded-[8px] border border-slate-200 bg-slate-50 p-3 text-left transition hover:-translate-y-0.5 hover:border-[#2ECE82]/40 hover:bg-white hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                          >
                            <span className={`grid h-9 w-9 place-items-center rounded-[8px] ring-1 ${metricToneClasses(step.tone)}`}>
                              <step.Icon className="h-4 w-4" />
                            </span>
                            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{step.label}</p>
                            <p className="mt-1 text-[13px] font-black text-slate-950">{step.value}</p>
                            <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{step.helper}</p>
                          </button>
                        ))}
                      </div>
                    </article>

                    <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-950">Recent reports</h3>
                          <p className="mt-1 text-[13px] font-semibold text-slate-500">Client packets, internal drafts, and generated evidence exports.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" className="grid h-9 w-9 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600 transition hover:border-[#2ECE82]/40 hover:text-slate-950" aria-label="Filter reports">
                            <Filter className="h-4 w-4" />
                          </button>
                          <button type="button" className="grid h-9 w-9 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600 transition hover:border-[#2ECE82]/40 hover:text-slate-950" aria-label="Report menu">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto p-3">
                        <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
                          <colgroup>
                            <col className="w-[26%]" />
                            <col className="w-[15%]" />
                            <col className="w-[19%]" />
                            <col className="w-[15%]" />
                            <col className="w-[10%]" />
                            <col className="w-[9%]" />
                            <col className="w-[6%]" />
                          </colgroup>
                          <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
                              <th className="rounded-l-[8px] px-3 py-2.5">Report</th>
                              <th className="px-3 py-2.5">Type</th>
                              <th className="px-3 py-2.5">Scope</th>
                              <th className="px-3 py-2.5">Findings</th>
                              <th className="px-3 py-2.5">Status</th>
                              <th className="px-3 py-2.5">Updated</th>
                              <th className="rounded-r-[8px] px-3 py-2.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {reportRows.map((report) => {
                              const ReportIcon = report.Icon;
                              const ReportStatusIcon = report.status === "Ready" || report.status === "Shared" ? CheckCircle2 : report.status === "Draft" ? CalendarClock : AlertTriangle;

                              return (
                                <tr key={report.name} className="transition hover:bg-slate-50/70">
                                  <td className="px-3 py-3">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(report.tone)}`}>
                                        <ReportIcon className="h-4 w-4" />
                                      </span>
                                      <div className="min-w-0">
                                        <p className="truncate text-[12px] font-black text-slate-950">{report.name}</p>
                                        <p className="mt-0.5 truncate text-[10px] font-bold text-slate-500">Owner: {report.owner}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3">
                                    <span className="text-[11px] font-black text-slate-800">{report.type}</span>
                                  </td>
                                  <td className="px-3 py-3">
                                    <span className="block truncate text-[11px] font-black text-slate-700">{report.scope}</span>
                                  </td>
                                  <td className="px-3 py-3">
                                    <div className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-2 py-1.5 shadow-[0_8px_18px_rgba(15,23,42,0.035)]">
                                      <span className="grid h-6 min-w-7 place-items-center rounded-full bg-rose-50 px-2 text-[10px] font-black text-rose-700">{report.findings.critical}</span>
                                      <span className="grid h-6 min-w-7 place-items-center rounded-full bg-orange-50 px-2 text-[10px] font-black text-orange-700">{report.findings.high}</span>
                                      <span className="grid h-6 min-w-7 place-items-center rounded-full bg-amber-50 px-2 text-[10px] font-black text-amber-700">{report.findings.medium}</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${reportStatusClasses(report.status)}`}>
                                      <ReportStatusIcon className="h-3 w-3" />
                                      {report.status}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3">
                                    <span className="text-[11px] font-black text-slate-700">{report.updated}</span>
                                  </td>
                                  <td className="px-3 py-3 text-right">
                                    <div className="inline-flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => setScanToast(`${report.name} preview is frontend-only for now.`)}
                                        className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#2ECE82]/40 hover:text-[#071010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                                        aria-label={`Preview ${report.name}`}
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                      </button>
                                      {canAction("reports", "download") ? <button
                                        type="button"
                                        onClick={() => setScanToast(`${report.name} download will connect after report backend.`)}
                                        className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-[#0891B2] transition hover:border-[#2ECE82]/40 hover:text-[#071010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                                        aria-label={`Download ${report.name}`}
                                      >
                                        <Download className="h-3.5 w-3.5" />
                                      </button> : null}
                                      {canAction("reports", "manage") ? <button
                                        type="button"
                                        onClick={() => setScanToast(`${report.name} action menu is frontend-only for now.`)}
                                        className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#2ECE82]/40 hover:text-[#071010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                                        aria-label={`More actions for ${report.name}`}
                                      >
                                        <MoreVertical className="h-3.5 w-3.5" />
                                      </button> : null}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </article>
                  </div>

                  <aside className="grid gap-4 xl:sticky xl:top-24">
                    <article className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white shadow-[0_12px_30px_rgba(7,16,16,0.14)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Report readiness</p>
                          <h3 className="mt-1 text-[22px] font-black leading-none">Internal review</h3>
                          <p className="mt-1 text-[11px] font-bold text-white/58">Quality checks before sharing</p>
                        </div>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                          <ShieldCheck className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {reportReadiness.map((item) => (
                          <div key={item.label} className="rounded-[8px] bg-white/[0.06] p-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/46">{item.label}</span>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${metricToneClasses(item.tone)}`}>{item.value}</span>
                            </div>
                            <p className="mt-1 text-[11px] font-bold text-white/66">{item.helper}</p>
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="border-b border-slate-100 p-3.5">
                        <h3 className="text-[18px] font-black text-slate-950">Report templates</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">Reusable packets for client delivery.</p>
                      </div>
                      <div className="grid gap-2 p-3.5">
                        {reportTemplates.map((template) => (
                          <button
                            key={template.name}
                            type="button"
                            onClick={() => setScanToast(`${template.name} template selected for demo report.`)}
                            className="group rounded-[8px] border border-slate-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-[#2ECE82]/40 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                          >
                            <div className="flex items-start gap-3">
                              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(template.tone)}`}>
                                <template.Icon className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-[12px] font-black text-slate-950">{template.name}</p>
                                  <span className="shrink-0 rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-slate-400 ring-1 ring-slate-100">{template.sections}</span>
                                </div>
                                <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{template.description}</p>
                                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-[#0891B2] group-hover:text-[#071010]">
                                  Use template
                                  <ArrowRight className="h-3 w-3" />
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </article>
                  </aside>
                </section>
              </div>
                )}
              </>
            ) : activeSection === "findings" ? (
              <FindingsWorkspace />
            ) : activeSection === "notifications" ? (
              <NotificationsWorkspace />
            ) : activeSection === "team" ? (
              pathname === "/team/members/add" ? <AddTeamMember /> : <TeamWorkspace />
            ) : activeSection === "billing-cost" ? (
              <div className="grid gap-3">
                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(360px,1.25fr)] xl:items-start">
                  {billingSummary.map((item) => (
                    <article key={item.label} className="rounded-[8px] border border-slate-200 bg-white p-3.5 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="flex items-start gap-2.5">
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ${metricToneClasses(item.tone)}`}>
                          <item.Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[12px] font-bold leading-tight text-slate-500">{item.label}</p>
                          <p className="mt-1 text-[23px] font-black leading-none text-slate-950">{item.value}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] font-semibold leading-relaxed text-slate-500">{item.helper}</p>
                    </article>
                  ))}

                  <div className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-3.5 text-white shadow-[0_10px_26px_rgba(7,16,16,0.14)] sm:col-span-2 xl:col-span-1">
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-center">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#04D9FF]">Current plan</p>
                        <h3 className="mt-1 text-[22px] font-black leading-none">Pro</h3>
                        <p className="mt-1 text-[11px] font-bold text-white/58">Monthly billing cycle</p>
                      </div>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-[8px] bg-white/[0.06] p-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/44">Plan base</p>
                            <p className="mt-0.5 text-[16px] font-black">$79.00</p>
                          </div>
                          <div className="rounded-[8px] bg-white/[0.06] p-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/44">Add-ons</p>
                            <p className="mt-0.5 text-[16px] font-black">$31.00</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#2ECE82]/12 px-3 py-1.5 text-[10px] font-black text-[#BFFFE1] ring-1 ring-[#2ECE82]/18">
                          <span>Est. month total</span>
                          <span>$129.50</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-3.5">
                    <div>
                      <h3 className="text-[18px] font-black text-slate-950">Usage overview</h3>
                      <p className="mt-1 text-[13px] font-semibold text-slate-500">Included quota, current usage, remaining capacity, and overage cost.</p>
                    </div>
                    <div className="flex w-full justify-start sm:w-auto sm:justify-end">
                      <div className="inline-flex items-center gap-2 rounded-[8px] bg-rose-50 px-3 py-2 text-rose-700 ring-1 ring-rose-100">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <div>
                          <p className="text-[11px] font-black leading-none">2 over quota</p>
                          <p className="mt-1 text-[10px] font-bold text-rose-500">Reports + AI credits</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2.5 bg-[linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_100%)] p-3.5 sm:grid-cols-2 xl:grid-cols-3">
                    {billingUsage.map((item) => {
                    const rawPercent = Math.round((item.used / item.total) * 100);
                    const percent = Math.min(100, rawPercent);
                    const overLimit = item.used > item.total;
                    const overBy = Math.max(0, item.used - item.total);

                    return (
                      <article
                        key={item.label}
                        className={`relative overflow-hidden rounded-[8px] border bg-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 ${
                          overLimit ? "border-rose-200 ring-1 ring-rose-100" : "border-slate-200 hover:border-[#2ECE82]/35"
                        }`}
                      >
                        <div aria-hidden="true" className={`absolute -right-12 -top-12 h-24 w-24 rounded-full blur-2xl ${
                          overLimit ? "bg-rose-100" : "bg-emerald-100"
                        }`} />

                        <div className="relative flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ring-1 ${metricToneClasses(item.tone)}`}>
                              <item.Icon className="h-4.5 w-4.5" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-black text-slate-800">{item.label}</p>
                              <p className="mt-0.5 text-[10px] font-bold text-slate-500">{item.unit} this cycle</p>
                            </div>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] ring-1 ${
                            overLimit ? "bg-rose-50 text-rose-700 ring-rose-100" : "bg-white text-slate-500 ring-slate-200"
                          }`}>
                            {overLimit ? `${overBy} over` : `${item.remaining} left`}
                          </span>
                        </div>

                        <div className="relative mt-3 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[23px] font-black leading-none text-slate-950">{item.used} / {item.total}</p>
                            <p className="mt-0.5 text-[10px] font-bold text-slate-500">included quota</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-[19px] font-black leading-none ${overLimit ? "text-rose-600" : "text-[#16A86E]"}`}>{rawPercent}%</p>
                            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-slate-400">used</p>
                          </div>
                        </div>

                        <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${overLimit ? "bg-rose-500" : "bg-[#2ECE82]"}`} style={{ width: `${percent}%` }} />
                        </div>

                        <div className="relative mt-3 flex items-center justify-between gap-3 rounded-[8px] bg-slate-50 px-3 py-2">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.08em] text-slate-400">{overLimit ? "Over" : "Left"}</p>
                            <p className={`mt-0.5 text-[12px] font-black ${overLimit ? "text-rose-600" : "text-slate-950"}`}>{overLimit ? overBy : item.remaining}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black uppercase tracking-[0.08em] text-slate-400">Cost</p>
                            <p className={`mt-0.5 text-[12px] font-black ${item.cost === "$0.00" ? "text-[#16A86E]" : "text-rose-600"}`}>{item.cost}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                  </div>
                </section>

                <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
                  <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-3.5">
                      <div>
                        <h3 className="text-[18px] font-black text-slate-950">Cost breakdown</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">Line items for included usage and paid overage.</p>
                      </div>
                      <button type="button" className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-700 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]">
                        Last 30 days
                        <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                      </button>
                    </div>

                    <div className="p-3.5">
                      <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
                        <colgroup>
                          <col className="w-[28%]" />
                          <col className="w-[16%]" />
                          <col className="w-[14%]" />
                          <col className="w-[12%]" />
                          <col className="w-[17%]" />
                          <col className="w-[13%]" />
                        </colgroup>
                        <thead>
                          <tr className="bg-slate-50 text-[11px] font-black text-slate-700">
                            <th className="rounded-l-[8px] px-3 py-3">Item</th>
                            <th className="px-3 py-3">Included</th>
                            <th className="px-3 py-3">Used</th>
                            <th className="px-3 py-3">Extra</th>
                            <th className="px-3 py-3">Rate</th>
                            <th className="rounded-r-[8px] px-3 py-3 text-right">Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {costBreakdownRows.map((row) => (
                            <tr key={row.item} className="text-[12px] font-bold text-slate-700 transition hover:bg-slate-50/70">
                              <td className="truncate px-3 py-3.5 font-black text-slate-950">{row.item}</td>
                              <td className="truncate px-3 py-3.5">{row.included}</td>
                              <td className="truncate px-3 py-3.5">{row.used}</td>
                              <td className={row.extra === "0" || row.extra === "-" ? "truncate px-3 py-3.5 text-slate-500" : "truncate px-3 py-3.5 font-black text-rose-600"}>{row.extra}</td>
                              <td className="truncate px-3 py-3.5">{row.rate}</td>
                              <td className="truncate px-3 py-3.5 text-right font-black text-slate-950">{row.cost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>

                      <div className="mt-3 grid gap-2.5 border-t border-slate-100 pt-3 sm:grid-cols-3">
                        {costBreakdownTotals.map((item) => (
                          <div
                            key={item.label}
                            className={`rounded-[8px] p-3 ring-1 ${
                              item.tone === "emerald"
                                ? "bg-[#F3FFF8] ring-emerald-100"
                                : item.tone === "rose"
                                  ? "bg-rose-50 ring-rose-100"
                                  : "bg-slate-50 ring-slate-100"
                            }`}
                          >
                            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
                            <p className={`mt-1 text-[22px] font-black leading-none ${
                              item.tone === "emerald" ? "text-[#16A86E]" : item.tone === "rose" ? "text-rose-600" : "text-slate-950"
                            }`}>{item.value}</p>
                            <p className="mt-1 text-[11px] font-bold text-slate-500">{item.helper}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>

                  <div className="grid gap-3">
                    <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                      <div className="border-b border-slate-100 p-3.5">
                        <h3 className="text-[18px] font-black text-slate-950">Budget controls</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">Guardrails for overage and client spend.</p>
                      </div>
                      <div className="grid gap-2.5 p-3.5">
                        <div className="rounded-[8px] bg-[#071010] p-3.5 text-white shadow-[0_14px_30px_rgba(7,16,16,0.12)]">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#04D9FF]">Monthly budget</p>
                              <p className="mt-1 text-[24px] font-black leading-none">$150</p>
                            </div>
                            <span className="rounded-full bg-[#2ECE82]/12 px-2.5 py-1 text-[10px] font-black text-[#BFFFE1] ring-1 ring-[#2ECE82]/20">73% used</span>
                          </div>
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[73%] rounded-full bg-[#2ECE82]" />
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-black">
                            <div className="rounded-[8px] bg-white/[0.06] p-2">
                              <p className="text-white/45">Current bill</p>
                              <p className="mt-0.5 text-[15px] text-white">$110</p>
                            </div>
                            <div className="rounded-[8px] bg-white/[0.06] p-2">
                              <p className="text-white/45">Remaining</p>
                              <p className="mt-0.5 text-[15px] text-[#BFFFE1]">$40</p>
                            </div>
                          </div>
                        </div>
                        {[
                          ["Alert at 80%", "On"],
                          ["Auto-pause paid scan overage", "On"],
                          ["Notify billing owner", "On"],
                        ].map(([label, status]) => (
                          <div key={label} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2.5 transition hover:bg-white">
                            <span className="text-[12px] font-black text-slate-700">{label}</span>
                            <span className="rounded-full bg-[#E8FFF3] px-2.5 py-1 text-[10px] font-black text-[#16A86E] ring-1 ring-emerald-100">{status}</span>
                          </div>
                        ))}
                        <div className="rounded-[8px] border border-amber-100 bg-amber-50 p-3">
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                            <div>
                              <p className="text-[12px] font-black text-slate-950">Next alert at $120</p>
                              <p className="mt-1 text-[11px] font-bold leading-relaxed text-slate-600">Only $10 more usage before the billing owner gets notified.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </section>

                <section className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)_340px]">
                  <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-3.5">
                      <div>
                        <h3 className="text-[18px] font-black text-slate-950">Invoices</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">Next invoice updates Aug 01, 2026.</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-cyan-50 px-3 text-[11px] font-black text-[#0891B2] ring-1 ring-cyan-100">
                          <CalendarClock className="h-3.5 w-3.5" />
                          Aug 01
                        </span>
                        <button
                          type="button"
                          onClick={() => setScanToast("Invoice history is frontend-only for now. Backend billing can connect this action later.")}
                          className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-700 transition hover:border-[#2ECE82]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                        >
                          View all
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-2.5 p-3.5">
                      {billingInvoices.map((invoice) => (
                        <div key={invoice.id} className="grid gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-3.5 transition hover:border-[#2ECE82]/35 hover:bg-white sm:grid-cols-[minmax(0,1fr)_96px_74px_86px] sm:items-center">
                          <div>
                            <p className="text-[13px] font-black text-slate-950">{invoice.id}</p>
                            <p className="mt-1 text-[12px] font-bold text-slate-500">{invoice.date}</p>
                          </div>
                          <span className="text-[13px] font-black text-slate-950">{invoice.amount}</span>
                          <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${
                            invoice.status === "Paid" ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-amber-50 text-amber-700 ring-amber-100"
                          }`}>{invoice.status}</span>
                          <div className="flex items-center gap-1.5 sm:justify-end">
                            <button
                              type="button"
                              onClick={() => setScanToast(`${invoice.id} preview is frontend-only for now.`)}
                              title="Preview invoice"
                              aria-label={`Preview ${invoice.id}`}
                              className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#2ECE82]/40 hover:text-[#071010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setScanToast(`${invoice.id} download will be connected with backend billing.`)}
                              title="Download invoice"
                              aria-label={`Download ${invoice.id}`}
                              className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-[#0891B2] transition hover:border-[#2ECE82]/40 hover:text-[#071010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-[8px] border border-[#2ECE82]/28 bg-[#F3FFF8] p-3.5 shadow-[0_8px_22px_rgba(46,206,130,0.07)]">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#0891B2]">Recommended update</p>
                    <h3 className="mt-2 text-[20px] font-black text-slate-950">Move to Business</h3>
                    <p className="mt-2 text-[13px] font-semibold leading-relaxed text-slate-600">
                      Better for this usage pattern because AI credits and VAPT report overage are already increasing.
                    </p>
                    <div className="mt-4 grid gap-2">
                      {recommendedUpgrade.map((item) => (
                        <div key={item.label} className="rounded-[8px] bg-white p-3 ring-1 ring-emerald-100">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500">{item.label}</span>
                            <span className="text-[13px] font-black text-slate-950">{item.value}</span>
                          </div>
                          <p className="mt-1 text-[11px] font-bold text-slate-500">{item.helper}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push("/pricing?review=business#business-plan")}
                      className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2ECE82] text-[13px] font-black text-[#071010] shadow-[0_16px_34px_rgba(46,206,130,0.22)] transition hover:-translate-y-0.5 hover:bg-[#3FDC8F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#071010]"
                    >
                      Review plan update
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </article>

                  <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-3.5">
                      <div>
                        <h3 className="text-[18px] font-black text-slate-950">Payment method</h3>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">Primary card and billing owner.</p>
                      </div>
                      <span className="rounded-full bg-[#E8FFF3] px-2.5 py-1 text-[10px] font-black text-[#16A86E] ring-1 ring-emerald-100">Auto-pay</span>
                    </div>
                    <div className="m-3.5 overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50">
                      <div className="border-b border-slate-200 bg-white p-3.5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-[#071010] text-[#2ECE82] shadow-[0_12px_24px_rgba(7,16,16,0.16)]">
                              <CreditCard className="h-5 w-5" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-black text-slate-950">Visa ending 4242</p>
                              <p className="mt-1 text-[12px] font-bold text-slate-500">Expires 08/2029</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">Primary</span>
                        </div>
                      </div>
                      <div className="grid gap-2 p-3.5 text-[12px] font-bold text-slate-600">
                        <div className="flex items-center justify-between gap-3">
                          <span>Billing email</span>
                          <span className="truncate text-slate-950">dk358693@gmail.com</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>Tax profile</span>
                          <span className="text-slate-950">Not configured</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>Currency</span>
                          <span className="text-slate-950">USD</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScanToast("Payment method editing is frontend-only for now. Backend payment setup can connect later.")}
                      className="mx-3.5 mb-3.5 inline-flex h-10 w-[calc(100%-1.75rem)] items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40 hover:text-[#071010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                    >
                      Update payment method
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </article>
                </section>
              </div>
            ) : (
              <div className="grid min-h-[calc(100dvh-11rem)] place-items-center rounded-[8px] border border-slate-200 bg-white p-8 text-center shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                <div className="max-w-[420px]">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#071010] text-[#2ECE82]">
                    <ActivePageIcon className="h-7 w-7" />
                  </span>
                  <p className="mt-5 text-[11px] font-black uppercase tracking-[0.18em] text-[#0891B2]">{activeItem.label}</p>
                  <h2 className="mt-2 text-[28px] font-black text-slate-950">{activePageLabel} is in progress</h2>
                  <p className="mt-3 text-[14px] font-semibold leading-relaxed text-slate-600">
                    Work on it. This section is connected to the sidebar route now, and the full {activePageLabel.toLowerCase()} workflow can be built in the next step.
                  </p>
                </div>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

