"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Clock3,
  Copy,
  Database,
  Edit3,
  FileCode2,
  Filter,
  Globe2,
  History,
  LoaderCircle,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useLoadingRouter } from "@/components/loading/PageLoadingProvider";
import GuideButton from "@/components/guides/GuideButton";
import WorkspaceGuidePage from "@/components/guides/WorkspaceGuidePage";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { WorkspaceSkeleton } from "@/components/workspace/WorkspaceSkeleton";
import {
  ApiError,
  archiveAsset,
  createAsset,
  getAsset,
  listAssets,
  regenerateAssetChallenge,
  updateAsset,
  verifyAsset,
  type Asset,
  type AssetChallenge,
  type AssetEnvironment,
  type AssetListResponse,
  type AssetPayload,
  type AssetStatus,
  type AssetType,
  type AssetVerificationEvent,
  type AssetVerificationMethod,
  type Finding,
} from "@/lib/auth-api";
import { getAccessToken } from "@/lib/auth-session";


const EMPTY_SUMMARY: AssetListResponse["summary"] = {
  total: 0,
  active: 0,
  pending_verification: 0,
  at_risk: 0,
  archived: 0,
};

const ASSET_TYPE_OPTIONS: Array<{ value: AssetType; label: string; helper: string; Icon: typeof Globe2 }> = [
  { value: "web_application", label: "Web application", helper: "Website or customer portal", Icon: Globe2 },
  { value: "api_endpoint", label: "API endpoint", helper: "HTTP or HTTPS API surface", Icon: Braces },
  { value: "hostname", label: "Hostname", helper: "Public domain or service host", Icon: Server },
];

const ASSET_TYPE_GUIDES = {
  web_application: "asset-web-application",
  api_endpoint: "asset-api-endpoint",
  hostname: "asset-hostname",
} as const;

const ENVIRONMENT_OPTIONS: Array<{ value: AssetEnvironment; label: string }> = [
  { value: "production", label: "Production" },
  { value: "staging", label: "Staging" },
  { value: "development", label: "Development" },
  { value: "testing", label: "Testing" },
];

const SCANNER_LABELS: Record<string, string> = {
  "web-app": "Web App Scanner",
  api: "API Scanner",
  os: "OS / Port Scanner",
  tls: "TLS/SSL Scanner",
  "hybrid-sos": "Hybrid SOS Scanner",
};

const DEFAULT_FORM: AssetPayload = {
  name: "",
  asset_type: "web_application",
  target: "",
  environment: "production",
  verification_method: "dns_txt",
  owner_label: "",
  tags: [],
};

function titleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value: string | null, includeTime = false) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

function dnsProviderName(hostname: string) {
  const labels = hostname.split(".").filter(Boolean);
  if (labels.length <= 2) return "_evada-verification";
  return `_evada-verification.${labels.slice(0, -2).join(".")}`;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

function statusClasses(status: Asset["status"] | Asset["verification_status"]) {
  if (status === "active" || status === "verified") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "failed" || status === "expired") return "bg-rose-50 text-rose-700 ring-rose-100";
  if (status === "archived") return "bg-slate-100 text-slate-600 ring-slate-200";
  return "bg-amber-50 text-amber-700 ring-amber-100";
}

function riskClasses(risk: Asset["risk"]) {
  if (risk === "critical") return "bg-rose-100 text-rose-800 ring-rose-200";
  if (risk === "high") return "bg-orange-50 text-orange-700 ring-orange-100";
  if (risk === "medium") return "bg-amber-50 text-amber-700 ring-amber-100";
  if (risk === "low") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function AssetTypeIcon({ asset, className = "h-4 w-4" }: { asset: Pick<Asset, "asset_type">; className?: string }) {
  const Icon = asset.asset_type === "api_endpoint" ? Braces : asset.asset_type === "hostname" ? Server : Globe2;
  return <Icon className={className} />;
}

function Badge({ children, className }: { children: ReactNode; className: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase ring-1 ${className}`}>{children}</span>;
}

function InlineNotice({ tone = "error", children }: { tone?: "error" | "success" | "info"; children: ReactNode }) {
  const classes = tone === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : tone === "info"
      ? "border-cyan-200 bg-cyan-50 text-cyan-800"
      : "border-rose-200 bg-rose-50 text-rose-800";
  const Icon = tone === "success" ? CheckCircle2 : tone === "info" ? ShieldCheck : AlertTriangle;
  return (
    <div className={`flex items-start gap-3 rounded-[8px] border px-3.5 py-3 text-[12px] font-bold leading-relaxed ${classes}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

function AssetSkeleton() {
  return <WorkspaceSkeleton metrics={5} rows={6} />;
}

function ChallengePanel({
  asset,
  challenge,
  busy,
  error,
  resultMessage,
  onGenerate,
  onVerify,
}: {
  asset: Asset;
  challenge: AssetChallenge | null;
  busy: "" | "challenge" | "verify";
  error: string;
  resultMessage: string;
  onGenerate: (method?: AssetVerificationMethod) => Promise<void>;
  onVerify: () => Promise<void>;
}) {
  const [copied, setCopied] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<AssetVerificationMethod>(asset.verification_method);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const expiresAt = asset.verification_expires_at ? new Date(asset.verification_expires_at).getTime() : 0;
  const challengeExpired = expiresAt > 0 && expiresAt <= now;
  const hasActiveChallenge = expiresAt > now;
  const lastAttemptAt = asset.last_verification_attempt_at ? new Date(asset.last_verification_attempt_at).getTime() : 0;
  const verifyCooldown = Math.max(0, Math.ceil((lastAttemptAt + 30_000 - now) / 1000));
  const fullDnsHost = challenge?.host || `_evada-verification.${asset.hostname}`;
  const providerDnsName = dnsProviderName(asset.hostname);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  };

  const copyDnsConfiguration = async () => {
    if (!challenge || challenge.method !== "dns_txt") return;
    await copyValue(
      "configuration",
      `Type: TXT\nName / Host: ${providerDnsName}\nFull hostname: ${fullDnsHost}\nValue: ${challenge.value}\nTTL: 300`,
    );
  };

  const requestChallenge = async () => {
    if (hasActiveChallenge) {
      setConfirmRegenerate(true);
      return;
    }
    await onGenerate(selectedMethod);
  };

  const regenerate = async () => {
    setConfirmRegenerate(false);
    await onGenerate(selectedMethod);
  };

  if (asset.status === "active") {
    return (
      <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-emerald-600 ring-1 ring-emerald-200">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[13px] font-black text-emerald-950">Ownership verified</p>
            <p className="mt-1 text-[12px] font-semibold text-emerald-800">Verified {formatDate(asset.verified_at, true)}. This Asset can be selected by compatible scanners.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-black text-slate-950">Prove control of {asset.hostname}</p>
          <p className="mt-1 text-[12px] font-semibold text-slate-500">The verification value is revealed only when a challenge is generated.</p>
        </div>
        <div className="inline-flex rounded-[8px] border border-slate-200 bg-slate-50 p-1">
          {(["dns_txt", "http_file"] as AssetVerificationMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => {
                setSelectedMethod(method);
                setConfirmRegenerate(false);
              }}
              disabled={busy !== ""}
              className={`h-8 rounded-[6px] px-3 text-[10px] font-black uppercase transition ${selectedMethod === method ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              {method === "dns_txt" ? "DNS TXT" : "HTTP file"}
            </button>
          ))}
        </div>
      </div>

      {challenge ? (
        <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50">
          {challenge.method === "dns_txt" ? (
            <>
              <ChallengeRow label="Type" value="TXT" copied={copied === "type"} onCopy={() => void copyValue("type", "TXT")} />
              <ChallengeRow label="Name / Host" value={providerDnsName} copied={copied === "name"} onCopy={() => void copyValue("name", providerDnsName)} />
              <ChallengeRow label="Full host" value={fullDnsHost} copied={copied === "host"} onCopy={() => void copyValue("host", fullDnsHost)} />
              <ChallengeRow label="Value" value={challenge.value} copied={copied === "value"} onCopy={() => void copyValue("value", challenge.value)} />
              <ChallengeRow label="TTL" value="300 (or the lowest available)" copied={copied === "ttl"} onCopy={() => void copyValue("ttl", "300")} />
            </>
          ) : (
            <>
              {challenge.url ? <ChallengeRow label="URL" value={challenge.url} copied={copied === "url"} onCopy={() => void copyValue("url", challenge.url || "")} /> : null}
              <ChallengeRow label="Value" value={challenge.value} copied={copied === "value"} onCopy={() => void copyValue("value", challenge.value)} />
            </>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-3 py-2.5 text-[11px] font-bold text-slate-500">
            <span>Expires {formatDate(challenge.expires_at, true)}</span>
            {challenge.method === "dns_txt" ? (
              <button type="button" onClick={() => void copyDnsConfiguration()} className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-950">
                {copied === "configuration" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                Copy DNS configuration
              </button>
            ) : <span>Plain text</span>}
          </div>
          {challenge.method === "dns_txt" ? (
            <div className="border-t border-cyan-100 bg-cyan-50 px-3 py-3 text-[11px] font-semibold leading-relaxed text-cyan-900">
              Add one TXT record. Do not use @ or add quotation marks. If your provider accepts full hostnames, use Full host; if it appends your domain automatically, use Name / Host.
            </div>
          ) : null}
        </div>
      ) : (
        <div className="grid min-h-32 place-items-center rounded-[8px] border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
          <div>
            <FileCode2 className="mx-auto h-6 w-6 text-slate-400" />
            <p className="mt-2 text-[12px] font-black text-slate-800">{hasActiveChallenge ? "Active challenge exists" : challengeExpired ? "Challenge expired" : "No active challenge"}</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">
              {hasActiveChallenge
                ? `The value is hidden after refresh. You can verify the existing DNS record until ${formatDate(asset.verification_expires_at, true)}.`
                : challengeExpired
                  ? "Generate a new value, update the verification record, then check ownership again."
                  : "Generate a one-time value to configure ownership verification."}
            </p>
            {hasActiveChallenge ? <code className="mt-3 block break-all text-[10px] font-bold text-slate-700">{asset.verification_method === "dns_txt" ? fullDnsHost : `${asset.scheme || "https"}://${asset.hostname}/.well-known/evada-verification.txt`}</code> : null}
          </div>
        </div>
      )}

      {selectedMethod !== asset.verification_method ? <InlineNotice tone="info">Switching to {selectedMethod === "dns_txt" ? "DNS TXT" : "HTTP file"} requires an explicit new challenge. The current value remains valid until you confirm regeneration.</InlineNotice> : null}

      {confirmRegenerate ? (
        <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-3">
          <p className="text-[12px] font-black text-amber-950">Invalidate the current challenge?</p>
          <p className="mt-1 text-[11px] font-semibold leading-relaxed text-amber-800">You must replace the existing verification value after regeneration.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => void regenerate()} disabled={busy !== ""} className="h-9 rounded-[8px] bg-amber-700 px-3 text-[11px] font-black text-white disabled:opacity-60">Confirm regeneration</button>
            <button type="button" onClick={() => setConfirmRegenerate(false)} disabled={busy !== ""} className="h-9 rounded-[8px] border border-amber-200 bg-white px-3 text-[11px] font-black text-amber-900">Keep current challenge</button>
          </div>
        </div>
      ) : null}

      {error ? <InlineNotice>{error}</InlineNotice> : null}
      {resultMessage ? <InlineNotice tone="success">{resultMessage}</InlineNotice> : null}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void requestChallenge()} disabled={busy !== "" || confirmRegenerate} className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/50 disabled:opacity-60">
            {busy === "challenge" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 text-[#16A86E]" />}
            {hasActiveChallenge ? "Regenerate challenge" : "Generate challenge"}
        </button>
        <button type="button" onClick={() => void onVerify()} disabled={busy !== "" || !hasActiveChallenge || verifyCooldown > 0} className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white transition hover:bg-[#0E241E] disabled:cursor-not-allowed disabled:opacity-50">
          {busy === "verify" ? <LoaderCircle className="h-4 w-4 animate-spin text-[#2ECE82]" /> : <ShieldCheck className="h-4 w-4 text-[#2ECE82]" />}
          {busy === "verify" ? "Checking ownership" : verifyCooldown > 0 ? `Retry in ${verifyCooldown}s` : asset.verification_method === "dns_txt" ? "Check DNS and verify" : "Check file and verify"}
        </button>
      </div>
    </div>
  );
}

function ChallengeRow({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="grid gap-2 border-b border-slate-200 px-3 py-3 last:border-b-0 sm:grid-cols-[72px_minmax(0,1fr)_36px] sm:items-center">
      <span className="text-[10px] font-black uppercase text-slate-500">{label}</span>
      <code className="min-w-0 break-all text-[11px] font-bold text-slate-800">{value}</code>
      <button type="button" onClick={onCopy} title={`Copy ${label}`} aria-label={`Copy ${label}`} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#2ECE82]/50 hover:text-slate-900">
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

function AssetFormFields({ form, tagsText, onChange, onTagsChange }: { form: AssetPayload; tagsText: string; onChange: (changes: Partial<AssetPayload>) => void; onTagsChange: (value: string) => void }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Asset name" helper="A clear name used throughout EVADA.">
          <input required value={form.name} onChange={(event) => onChange({ name: event.target.value })} placeholder="Customer Portal" className="asset-input" />
        </FormField>
        <FormField label="Environment" helper="Used for filtering and scan policy.">
          <select value={form.environment} onChange={(event) => onChange({ environment: event.target.value as AssetEnvironment })} className="asset-input">
            {ENVIRONMENT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </FormField>
      </div>

      <div>
        <p className="text-[11px] font-black uppercase text-slate-600">Asset type</p>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {ASSET_TYPE_OPTIONS.map((option) => (
            <article key={option.value} className={`relative min-h-20 overflow-hidden rounded-[8px] border transition ${form.asset_type === option.value ? "border-[#2ECE82] bg-[#E8FFF3] ring-1 ring-[#2ECE82]/30" : "border-slate-200 bg-white hover:border-[#2ECE82]/50"}`}>
              <button type="button" onClick={() => onChange({ asset_type: option.value, target: "" })} className="flex min-h-20 w-full items-start gap-3 p-3 pr-14 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2ECE82]">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ${form.asset_type === option.value ? "bg-[#071010] text-[#2ECE82]" : "bg-slate-100 text-slate-500"}`}><option.Icon className="h-4 w-4" /></span>
                <span><span className="block text-[12px] font-black text-slate-950">{option.label}</span><span className="mt-1 block text-[11px] font-semibold text-slate-500">{option.helper}</span></span>
              </button>
              <GuideButton guideId={ASSET_TYPE_GUIDES[option.value]} label={`${option.label} help`} compact className="absolute right-2.5 top-2.5" />
            </article>
          ))}
        </div>
      </div>

      <FormField label={form.asset_type === "hostname" ? "Public hostname" : "Authorized target URL"} helper={form.asset_type === "hostname" ? "Example: portal.example.com" : "Include http:// or https://. Credentials and URL fragments are rejected."}>
        <div className="relative">
          <Globe2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0891B2]" />
          <input required value={form.target} onChange={(event) => onChange({ target: event.target.value })} placeholder={form.asset_type === "hostname" ? "portal.example.com" : "https://portal.example.com"} className="asset-input pl-10" />
        </div>
      </FormField>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Owner label" helper="Internal team or system owner. No credentials.">
          <input value={form.owner_label} onChange={(event) => onChange({ owner_label: event.target.value })} placeholder="Application Security" className="asset-input" />
        </FormField>
        <FormField label="Tags" helper="Comma-separated, up to 20 tags.">
          <div className="relative">
            <Tag className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={tagsText} onChange={(event) => onTagsChange(event.target.value)} placeholder="production, customer-facing" className="asset-input pl-10" />
          </div>
        </FormField>
      </div>

      <div>
        <p className="text-[11px] font-black uppercase text-slate-600">Ownership method</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {([
            ["dns_txt", "DNS TXT", "Add one TXT record to the exact Asset hostname."],
            ["http_file", "HTTP file", "Publish one small verification file under .well-known."],
          ] as Array<[AssetVerificationMethod, string, string]>).map(([value, label, helper]) => (
            <article key={value} className={`relative overflow-hidden rounded-[8px] border transition ${form.verification_method === value ? "border-[#2ECE82] bg-[#E8FFF3]" : "border-slate-200 bg-white hover:border-[#2ECE82]/50"}`}>
              <label className="flex min-h-20 cursor-pointer items-start gap-3 p-3 pr-14">
                <input type="radio" name="verification_method" value={value} checked={form.verification_method === value} onChange={() => onChange({ verification_method: value })} className="mt-1 h-4 w-4 accent-[#16A86E]" />
                <span><span className="block text-[12px] font-black text-slate-950">{label}</span><span className="mt-1 block text-[11px] font-semibold text-slate-500">{helper}</span></span>
              </label>
              <GuideButton guideId={value === "dns_txt" ? "verification-dns" : "verification-http"} label={`${label} help`} compact className="absolute right-2.5 top-2.5" />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, helper, children }: { label: string; helper: string; children: ReactNode }) {
  return <label className="grid gap-1.5"><span className="text-[11px] font-black uppercase text-slate-600">{label}</span>{children}<span className="text-[10px] font-semibold text-slate-400">{helper}</span></label>;
}

function AssetInventory() {
  const router = useLoadingRouter();
  const { activeOrganizationId, activeWorkspace } = useWorkspace();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [pagination, setPagination] = useState({ page: 1, page_size: 10, total: 0, total_pages: 1 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<AssetType | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setAssets([]);
    setSummary(EMPTY_SUMMARY);
    setLoading(true);
  }, [activeOrganizationId]);

  const load = useCallback(async () => {
    const token = getAccessToken();
    if (!token || !activeOrganizationId) return;
    setLoading(true);
    setError("");
    try {
      const response = await listAssets(token, activeOrganizationId, {
        page: pagination.page,
        page_size: pagination.page_size,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        asset_type: typeFilter || undefined,
      });
      setAssets(response.results);
      setSummary(response.summary);
      setPagination(response.pagination);
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not load this workspace's Assets."));
    } finally {
      setLoading(false);
    }
  }, [activeOrganizationId, pagination.page, pagination.page_size, search, statusFilter, typeFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), search ? 280 : 0);
    return () => window.clearTimeout(timer);
  }, [load, search]);

  useEffect(() => setPagination((current) => ({ ...current, page: 1 })), [activeOrganizationId, search, statusFilter, typeFilter]);

  const canCreate = activeWorkspace?.permissions.actions.assets?.includes("create") ?? false;
  const canEdit = activeWorkspace?.permissions.actions.assets?.includes("edit") ?? false;
  const metrics = [
    { label: "Total Assets", value: summary.total, helper: "current inventory", Icon: Database, tone: "bg-cyan-50 text-cyan-700 ring-cyan-100" },
    { label: "Active", value: summary.active, helper: "scanner ready", Icon: ShieldCheck, tone: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
    { label: "Pending", value: summary.pending_verification, helper: "ownership proof", Icon: CircleDashed, tone: "bg-amber-50 text-amber-700 ring-amber-100" },
    { label: "At Risk", value: summary.at_risk, helper: "high or critical", Icon: ShieldAlert, tone: "bg-rose-50 text-rose-700 ring-rose-100" },
    { label: "Archived", value: summary.archived, helper: "outside scope", Icon: History, tone: "bg-slate-100 text-slate-600 ring-slate-200" },
  ];

  if (loading && assets.length === 0) return <AssetSkeleton />;

  return (
    <div className="grid gap-3">
      <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-[8px] border border-slate-200 bg-white px-3.5 py-3 shadow-[0_6px_16px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-3">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ring-1 ${metric.tone}`}><metric.Icon className="h-4 w-4" /></span>
              <div className="min-w-0"><p className="text-[10px] font-black uppercase text-slate-500">{metric.label}</p><p className="mt-0.5 text-[22px] font-black leading-none text-slate-950">{metric.value}</p><p className="mt-1 text-[9px] font-bold text-slate-400">{metric.helper}</p></div>
            </div>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-3.5">
          <div><h2 className="text-[17px] font-black text-slate-950">Asset inventory</h2><p className="mt-0.5 text-[12px] font-semibold text-slate-500">Verified scope owned by {activeWorkspace?.name || "this workspace"}.</p></div>
          <div className="flex items-center gap-2"><GuideButton guideId="assets" compact />{canCreate ? <button type="button" onClick={() => router.push("/assets/new")} className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white transition hover:bg-[#0E241E]"><Plus className="h-4 w-4 text-[#2ECE82]" />Add Asset</button> : null}</div>
        </div>

        <div className="grid gap-2 border-b border-slate-100 bg-slate-50 p-3 sm:grid-cols-[minmax(220px,1fr)_190px_190px_auto]">
          <label className="flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-slate-500 focus-within:border-[#2ECE82]/60 focus-within:ring-2 focus-within:ring-[#2ECE82]/15"><Search className="h-4 w-4" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, target, owner or tag" className="min-w-0 flex-1 bg-transparent text-[12px] font-bold text-slate-800 outline-none placeholder:text-slate-400" /></label>
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as AssetType | "")} className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700 outline-none focus:border-[#2ECE82]"><option value="">All Asset types</option>{ASSET_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as AssetStatus | "")} className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700 outline-none focus:border-[#2ECE82]"><option value="">Current scope</option><option value="active">Active</option><option value="pending_verification">Pending verification</option><option value="archived">Archived</option></select>
          <button type="button" onClick={() => void load()} title="Refresh Assets" aria-label="Refresh Assets" className="grid h-10 w-10 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#2ECE82]/50 hover:text-slate-950"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button>
        </div>

        {error ? <div className="p-3"><InlineNotice>{error}</InlineNotice></div> : null}

        {assets.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] border-collapse">
                <thead><tr className="border-b border-slate-100 bg-white text-left text-[9px] font-black uppercase text-slate-400"><th className="px-3.5 py-3">Asset</th><th className="px-3 py-3">Target</th><th className="px-3 py-3">Environment</th><th className="px-3 py-3">Verification</th><th className="px-3 py-3">Risk</th><th className="px-3 py-3">Updated</th><th className="px-3 py-3 text-right">Actions</th></tr></thead>
                <tbody>{assets.map((asset) => (
                  <tr key={asset.id} className="border-b border-slate-100 text-[12px] font-bold text-slate-700 transition last:border-b-0 hover:bg-slate-50/70">
                    <td className="px-3.5 py-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-[#E8FFF3] text-[#16A86E] ring-1 ring-emerald-100"><AssetTypeIcon asset={asset} /></span><div className="min-w-0"><Link href={`/assets/${asset.id}`} className="block max-w-48 truncate font-black text-slate-950 hover:text-[#16A86E]">{asset.name}</Link><span className="mt-0.5 block text-[10px] font-semibold text-slate-400">{titleCase(asset.asset_type)}</span></div></div></td>
                    <td className="max-w-64 px-3 py-3"><span className="block truncate font-mono text-[11px] text-slate-700">{asset.canonical_target}</span><span className="mt-1 block truncate text-[10px] font-semibold text-slate-400">{asset.owner_label || asset.owner_email}</span></td>
                    <td className="px-3 py-3"><span className="text-[11px] font-black text-slate-700">{titleCase(asset.environment)}</span></td>
                    <td className="px-3 py-3"><Badge className={statusClasses(asset.status)}>{asset.status === "active" ? "Verified" : titleCase(asset.verification_status)}</Badge></td>
                    <td className="px-3 py-3"><Badge className={riskClasses(asset.risk)}>{titleCase(asset.risk)}</Badge></td>
                    <td className="px-3 py-3 text-[11px] text-slate-500">{formatDate(asset.updated_at)}</td>
                    <td className="px-3 py-3"><div className="flex justify-end gap-1"><button type="button" onClick={() => router.push(`/assets/${asset.id}`)} title="Open Asset" aria-label={`Open ${asset.name}`} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#2ECE82]/50 hover:text-slate-950"><ArrowRight className="h-3.5 w-3.5" /></button>{canEdit && asset.status !== "archived" ? <button type="button" onClick={() => router.push(`/assets/${asset.id}/edit`)} title="Edit Asset" aria-label={`Edit ${asset.name}`} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#2ECE82]/50 hover:text-slate-950"><Edit3 className="h-3.5 w-3.5" /></button> : null}</div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="grid gap-2 p-3 md:hidden">{assets.map((asset) => <button key={asset.id} type="button" onClick={() => router.push(`/assets/${asset.id}`)} className="grid gap-3 rounded-[8px] border border-slate-200 bg-white p-3 text-left"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-[#E8FFF3] text-[#16A86E]"><AssetTypeIcon asset={asset} /></span><div className="min-w-0"><p className="truncate text-[13px] font-black text-slate-950">{asset.name}</p><p className="mt-1 truncate font-mono text-[10px] font-semibold text-slate-500">{asset.canonical_target}</p></div></div><ChevronRight className="h-4 w-4 text-slate-400" /></div><div className="flex flex-wrap gap-2"><Badge className={statusClasses(asset.status)}>{asset.status === "active" ? "Verified" : titleCase(asset.verification_status)}</Badge><Badge className={riskClasses(asset.risk)}>{titleCase(asset.risk)}</Badge></div></button>)}</div>
          </>
        ) : !loading ? (
          <div className="grid min-h-80 place-items-center p-6 text-center"><div className="max-w-sm"><span className="mx-auto grid h-14 w-14 place-items-center rounded-[8px] bg-[#071010] text-[#2ECE82]"><Filter className="h-6 w-6" /></span><h3 className="mt-4 text-[18px] font-black text-slate-950">{summary.total === 0 ? "Add your first authorized Asset" : "No Assets match this view"}</h3><p className="mt-2 text-[12px] font-semibold leading-relaxed text-slate-500">{summary.total === 0 ? "Create a target, prove ownership, and make it available to EVADA scanners." : "Adjust the filters or search term to return to the inventory."}</p>{canCreate && summary.total === 0 ? <button type="button" onClick={() => router.push("/assets/new")} className="mt-4 inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#2ECE82] px-4 text-[12px] font-black text-[#071010]"><Plus className="h-4 w-4" />Add Asset</button> : null}</div></div>
        ) : null}

        {pagination.total_pages > 1 ? <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-3.5 py-3"><p className="text-[10px] font-bold text-slate-500">Page {pagination.page} of {pagination.total_pages} | {pagination.total} Assets</p><div className="flex gap-1"><button type="button" disabled={pagination.page <= 1} onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button><button type="button" disabled={pagination.page >= pagination.total_pages} onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button></div></div> : null}
      </section>
    </div>
  );
}

function NewAsset() {
  const router = useLoadingRouter();
  const { activeOrganizationId } = useWorkspace();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [tagsText, setTagsText] = useState("");
  const [asset, setAsset] = useState<Asset | null>(null);
  const [challenge, setChallenge] = useState<AssetChallenge | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [busy, setBusy] = useState<"" | "save" | "challenge" | "verify">("");
  const [error, setError] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const token = getAccessToken();
    if (!token || !activeOrganizationId) return;
    setBusy("save"); setError("");
    try {
      const response = await createAsset(token, activeOrganizationId, { ...form, tags: tagsText.split(",").map((tag) => tag.trim()).filter(Boolean) });
      setAsset(response.result); setChallenge(response.challenge); setStep(2);
    } catch (requestError) { setError(errorMessage(requestError, "Could not create this Asset.")); }
    finally { setBusy(""); }
  };

  const generate = async (method?: AssetVerificationMethod) => {
    const token = getAccessToken(); if (!token || !activeOrganizationId || !asset) return;
    setBusy("challenge"); setError(""); setResultMessage("");
    try { const response = await regenerateAssetChallenge(token, activeOrganizationId, asset.id, method); setAsset(response.result); setChallenge(response.challenge); }
    catch (requestError) { setError(errorMessage(requestError, "Could not generate a new challenge.")); }
    finally { setBusy(""); }
  };

  const verify = async () => {
    const token = getAccessToken(); if (!token || !activeOrganizationId || !asset) return;
    setBusy("verify"); setError(""); setResultMessage("");
    try { const response = await verifyAsset(token, activeOrganizationId, asset.id); setAsset(response.result); if (response.verified) { setResultMessage(response.detail); setStep(3); } else setError(response.detail); }
    catch (requestError) { setError(errorMessage(requestError, "Ownership verification could not be completed.")); }
    finally { setBusy(""); }
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><Link href="/assets" className="inline-flex items-center gap-2 text-[11px] font-black text-[#0891B2]"><ArrowLeft className="h-3.5 w-3.5" />Asset inventory</Link><h2 className="mt-2 text-[24px] font-black text-slate-950">Add an authorized Asset</h2><p className="mt-1 text-[12px] font-semibold text-slate-500">Define the target, prove ownership, then make it scanner-ready.</p></div><div className="flex items-center gap-2">{[1, 2, 3].map((item) => <span key={item} className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-black ring-1 ${step >= item ? "bg-[#071010] text-[#2ECE82] ring-[#071010]" : "bg-white text-slate-400 ring-slate-200"}`}>{step > item ? <Check className="h-3.5 w-3.5" /> : item}</span>)}</div></div>

      <section className="rounded-[8px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-100 px-4 py-3"><p className="text-[10px] font-black uppercase text-[#0891B2]">Step {step} of 3</p><h3 className="mt-1 text-[17px] font-black text-slate-950">{step === 1 ? "Asset details" : step === 2 ? "Ownership verification" : "Asset ready"}</h3></div>
        <div className="p-4 lg:p-5">
          {step === 1 ? <form onSubmit={(event) => void submit(event)} className="grid gap-4"><AssetFormFields form={form} tagsText={tagsText} onChange={(changes) => setForm((current) => ({ ...current, ...changes }))} onTagsChange={setTagsText} />{error ? <InlineNotice>{error}</InlineNotice> : null}<div className="flex justify-end"><button type="submit" disabled={busy !== ""} className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#071010] px-5 text-[12px] font-black text-white disabled:opacity-60">{busy === "save" ? <LoaderCircle className="h-4 w-4 animate-spin text-[#2ECE82]" /> : <ArrowRight className="h-4 w-4 text-[#2ECE82]" />}{busy === "save" ? "Creating Asset" : "Create Asset and Continue"}</button></div></form> : null}
          {step === 2 && asset ? <div className="grid gap-4"><InlineNotice tone="info">Asset created as Pending Verification. Scanning remains blocked until ownership succeeds.</InlineNotice><ChallengePanel asset={asset} challenge={challenge} busy={busy === "save" ? "" : busy} error={error} resultMessage={resultMessage} onGenerate={generate} onVerify={verify} /><div className="flex justify-end"><button type="button" onClick={() => router.push(`/assets/${asset.id}`)} className="text-[11px] font-black text-slate-500 hover:text-slate-950">Finish verification later</button></div></div> : null}
          {step === 3 && asset ? <div className="grid min-h-72 place-items-center text-center"><div className="max-w-md"><span className="mx-auto grid h-16 w-16 place-items-center rounded-[8px] bg-[#E8FFF3] text-[#16A86E] ring-1 ring-emerald-100"><ShieldCheck className="h-8 w-8" /></span><h3 className="mt-4 text-[22px] font-black text-slate-950">{asset.name} is active</h3><p className="mt-2 text-[12px] font-semibold leading-relaxed text-slate-500">Ownership of {asset.hostname} is verified. Risk remains Unknown until a real scan completes.</p><button type="button" onClick={() => router.push(`/assets/${asset.id}`)} className="mt-5 inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#2ECE82] px-4 text-[12px] font-black text-[#071010]">Open Asset<ArrowRight className="h-4 w-4" /></button></div></div> : null}
        </div>
      </section>
    </div>
  );
}

function AssetDetail({ assetId, editMode }: { assetId: string; editMode: boolean }) {
  const router = useLoadingRouter();
  const { activeOrganizationId, activeWorkspace } = useWorkspace();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [events, setEvents] = useState<AssetVerificationEvent[]>([]);
  const [findingsSummary, setFindingsSummary] = useState<{ active: number; resolved: number; critical_or_high: number } | null>(null);
  const [recentFindings, setRecentFindings] = useState<Array<Pick<Finding, "id" | "title" | "severity" | "status" | "scanner" | "last_seen_at">>>([]);
  const [challenge, setChallenge] = useState<AssetChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"" | "save" | "challenge" | "verify" | "archive">("");
  const [error, setError] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [form, setForm] = useState<AssetPayload | null>(null);
  const [tagsText, setTagsText] = useState("");

  const load = useCallback(async () => {
    const token = getAccessToken(); if (!token || !activeOrganizationId) return;
    setLoading(true); setError("");
    try { const response = await getAsset(token, activeOrganizationId, assetId); setAsset(response.result); setEvents(response.verification_events); setFindingsSummary(response.findings_summary); setRecentFindings(response.recent_findings); setForm({ name: response.result.name, asset_type: response.result.asset_type, target: response.result.target, environment: response.result.environment, verification_method: response.result.verification_method, owner_label: response.result.owner_label, tags: response.result.tags }); setTagsText(response.result.tags.join(", ")); }
    catch (requestError) { setError(errorMessage(requestError, "Could not load this Asset.")); }
    finally { setLoading(false); }
  }, [activeOrganizationId, assetId]);

  useEffect(() => { void load(); }, [load]);

  const generate = async (method?: AssetVerificationMethod) => { const token = getAccessToken(); if (!token || !activeOrganizationId || !asset) return; setBusy("challenge"); setError(""); setResultMessage(""); try { const response = await regenerateAssetChallenge(token, activeOrganizationId, asset.id, method); setAsset(response.result); setChallenge(response.challenge); } catch (requestError) { setError(errorMessage(requestError, "Could not generate a new challenge.")); } finally { setBusy(""); } };
  const verify = async () => { const token = getAccessToken(); if (!token || !activeOrganizationId || !asset) return; setBusy("verify"); setError(""); setResultMessage(""); try { const response = await verifyAsset(token, activeOrganizationId, asset.id); setAsset(response.result); if (response.verified) { setResultMessage(response.detail); await load(); } else { setError(response.detail); } } catch (requestError) { setError(errorMessage(requestError, "Ownership verification could not be completed.")); } finally { setBusy(""); } };

  const save = async (event: FormEvent) => { event.preventDefault(); const token = getAccessToken(); if (!token || !activeOrganizationId || !asset || !form) return; setBusy("save"); setError(""); try { const response = await updateAsset(token, activeOrganizationId, asset.id, { ...form, tags: tagsText.split(",").map((tag) => tag.trim()).filter(Boolean) }); setAsset(response.result); setChallenge(response.challenge); if (response.challenge) { setResultMessage("Asset scope changed. Complete the new ownership challenge before scanning."); } else router.push(`/assets/${asset.id}`); } catch (requestError) { setError(errorMessage(requestError, "Could not update this Asset.")); } finally { setBusy(""); } };

  const archive = async () => { const token = getAccessToken(); if (!token || !activeOrganizationId || !asset) return; setBusy("archive"); setError(""); try { await archiveAsset(token, activeOrganizationId, asset.id); router.push("/assets"); } catch (requestError) { setError(errorMessage(requestError, "Could not archive this Asset.")); setBusy(""); } };

  if (loading) return <WorkspaceSkeleton metrics={5} detail />;
  if (!asset) return <InlineNotice>{error || "Asset not found."}</InlineNotice>;

  const canEdit = activeWorkspace?.permissions.actions.assets?.includes("edit") ?? false;
  const canDelete = activeWorkspace?.permissions.actions.assets?.includes("delete") ?? false;
  const canManage = activeWorkspace?.permissions.actions.assets?.includes("manage") ?? false;
  const canViewFindings = activeWorkspace?.permissions.actions.findings?.includes("view") ?? false;

  if (editMode && form) {
    return <div className="mx-auto grid w-full max-w-6xl gap-3"><div><Link href={`/assets/${asset.id}`} className="inline-flex items-center gap-2 text-[11px] font-black text-[#0891B2]"><ArrowLeft className="h-3.5 w-3.5" />Back to Asset</Link><h2 className="mt-2 text-[24px] font-black text-slate-950">Edit {asset.name}</h2><p className="mt-1 text-[12px] font-semibold text-slate-500">Changing the target or verification method invalidates the current proof.</p></div><section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)] lg:p-5"><form onSubmit={(event) => void save(event)} className="grid gap-4"><AssetFormFields form={form} tagsText={tagsText} onChange={(changes) => setForm((current) => current ? { ...current, ...changes } : current)} onTagsChange={setTagsText} />{error ? <InlineNotice>{error}</InlineNotice> : null}{resultMessage ? <InlineNotice tone="info">{resultMessage}</InlineNotice> : null}{challenge ? <ChallengePanel asset={asset} challenge={challenge} busy={busy === "save" || busy === "archive" ? "" : busy} error={error} resultMessage="" onGenerate={generate} onVerify={verify} /> : null}<div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={() => router.push(`/assets/${asset.id}`)} className="h-10 rounded-[8px] border border-slate-200 px-4 text-[12px] font-black text-slate-700">Cancel</button><button type="submit" disabled={busy !== ""} className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white disabled:opacity-60">{busy === "save" ? <LoaderCircle className="h-4 w-4 animate-spin text-[#2ECE82]" /> : <Check className="h-4 w-4 text-[#2ECE82]" />}Save changes</button></div></form></section></div>;
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><Link href="/assets" className="inline-flex items-center gap-2 text-[11px] font-black text-[#0891B2]"><ArrowLeft className="h-3.5 w-3.5" />Asset inventory</Link><div className="mt-2 flex flex-wrap items-center gap-2"><h2 className="text-[24px] font-black text-slate-950">{asset.name}</h2><Badge className={statusClasses(asset.status)}>{asset.status === "active" ? "Active" : titleCase(asset.status)}</Badge><Badge className={riskClasses(asset.risk)}>{titleCase(asset.risk)} risk</Badge></div><p className="mt-1 break-all font-mono text-[11px] font-bold text-slate-500">{asset.canonical_target}</p></div><div className="flex flex-wrap gap-2">{canEdit && asset.status !== "archived" ? <button type="button" onClick={() => router.push(`/assets/${asset.id}/edit`)} className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-700"><Edit3 className="h-4 w-4 text-[#16A86E]" />Edit</button> : null}<button type="button" disabled={asset.status !== "active"} onClick={() => router.push(`/scans/new-scan?asset=${asset.id}`)} className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white disabled:cursor-not-allowed disabled:opacity-45">Start scan<ArrowRight className="h-4 w-4 text-[#2ECE82]" /></button></div></div>
      {error ? <InlineNotice>{error}</InlineNotice> : null}{resultMessage ? <InlineNotice tone="success">{resultMessage}</InlineNotice> : null}
      <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-3">
          <article className="rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]"><div className="border-b border-slate-100 px-4 py-3"><h3 className="text-[16px] font-black text-slate-950">Scope and ownership</h3><p className="mt-1 text-[11px] font-semibold text-slate-500">Backend-controlled Asset identity and scanner eligibility.</p></div><div className="grid gap-px bg-slate-100 sm:grid-cols-2"><DetailCell label="Asset type" value={titleCase(asset.asset_type)} Icon={asset.asset_type === "api_endpoint" ? Braces : asset.asset_type === "hostname" ? Server : Globe2} /><DetailCell label="Environment" value={titleCase(asset.environment)} Icon={Database} /><DetailCell label="Hostname" value={asset.hostname} Icon={Globe2} /><DetailCell label="Owner" value={asset.owner_label || asset.owner_email} Icon={ShieldCheck} /><DetailCell label="Verification" value={`${asset.verification_method === "dns_txt" ? "DNS TXT" : "HTTP file"} | ${titleCase(asset.verification_status)}`} Icon={FileCode2} /><DetailCell label="Last scan" value={formatDate(asset.last_scan_at)} Icon={Clock3} /></div></article>
          {canViewFindings && findingsSummary ? <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3"><div><h3 className="text-[16px] font-black text-slate-950">Risk and Findings</h3><p className="mt-1 text-[11px] font-semibold text-slate-500">Calculated from normalized scanner results.</p></div><Link href={`/findings?asset_id=${asset.id}`} className="inline-flex items-center gap-2 text-[10px] font-black text-[#0891B2]">View all<ArrowRight className="h-3.5 w-3.5" /></Link></div><div className="grid gap-px bg-slate-100 sm:grid-cols-3"><div className="bg-white p-4"><p className="text-[9px] font-black uppercase text-slate-400">Risk score</p><p className="mt-2 text-[25px] font-black text-slate-950">{asset.risk_score}<span className="text-[10px] text-slate-400"> / 100</span></p></div><div className="bg-white p-4"><p className="text-[9px] font-black uppercase text-slate-400">Active</p><p className="mt-2 text-[25px] font-black text-rose-600">{findingsSummary.active}</p></div><div className="bg-white p-4"><p className="text-[9px] font-black uppercase text-slate-400">Critical / High</p><p className="mt-2 text-[25px] font-black text-orange-600">{findingsSummary.critical_or_high}</p></div></div>{recentFindings.length ? <div className="divide-y divide-slate-100">{recentFindings.map((finding) => <Link key={finding.id} href={`/findings/${finding.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${finding.severity === "critical" ? "bg-rose-600" : finding.severity === "high" ? "bg-orange-500" : finding.severity === "medium" ? "bg-amber-400" : "bg-emerald-500"}`} /><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-black text-slate-800">{finding.title}</p><p className="mt-0.5 text-[9px] font-bold text-slate-400">{titleCase(finding.severity)} · {titleCase(finding.status)}</p></div><ChevronRight className="h-4 w-4 text-slate-400" /></Link>)}</div> : <p className="p-4 text-[11px] font-semibold text-slate-500">No normalized Findings for this Asset.</p>}</article> : null}
          {canManage && asset.status !== "archived" ? <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]"><ChallengePanel asset={asset} challenge={challenge} busy={busy === "save" || busy === "archive" ? "" : busy} error="" resultMessage="" onGenerate={generate} onVerify={verify} /></article> : null}
          <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]"><div className="flex items-center justify-between gap-3"><div><h3 className="text-[16px] font-black text-slate-950">Verification activity</h3><p className="mt-1 text-[11px] font-semibold text-slate-500">Immutable ownership and scope events.</p></div><History className="h-5 w-5 text-[#0891B2]" /></div><div className="mt-4 grid gap-0">{events.length > 0 ? events.map((event, index) => <div key={event.id} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3"><div className="relative flex justify-center"><span className={`mt-0.5 grid h-6 w-6 place-items-center rounded-full ring-1 ${event.status === "verified" ? "bg-emerald-50 text-emerald-600 ring-emerald-100" : event.status === "failed" || event.status === "expired" ? "bg-rose-50 text-rose-600 ring-rose-100" : "bg-cyan-50 text-cyan-600 ring-cyan-100"}`}>{event.status === "verified" ? <Check className="h-3 w-3" /> : <MoreHorizontal className="h-3 w-3" />}</span>{index < events.length - 1 ? <span className="absolute bottom-0 top-7 w-px bg-slate-200" /> : null}</div><div className="pb-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-[12px] font-black text-slate-900">{titleCase(event.status)}</p><span className="text-[9px] font-bold text-slate-400">{formatDate(event.created_at, true)}</span></div><p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{event.message}</p><p className="mt-1 text-[9px] font-bold text-slate-400">{event.attempted_by_email || "EVADA system"}</p></div></div>) : <p className="py-6 text-center text-[11px] font-semibold text-slate-500">No verification activity recorded.</p>}</div></article>
        </div>
        <aside className="grid content-start gap-3 xl:sticky xl:top-24"><article className="rounded-[8px] border border-[#2ECE82]/25 bg-[#071010] p-4 text-white shadow-[0_12px_30px_rgba(7,16,16,0.16)]"><p className="text-[10px] font-black uppercase text-[#04D9FF]">Scanner compatibility</p><h3 className="mt-2 text-[19px] font-black">{asset.status === "active" ? "Ready for assessment" : "Verification required"}</h3><p className="mt-2 text-[11px] font-semibold leading-relaxed text-white/60">{asset.status === "active" ? "Only scanners compatible with this Asset type will accept it." : "Complete ownership verification before this target enters a scan queue."}</p><div className="mt-4 grid gap-2">{asset.compatible_scanners.map((scanner) => <div key={scanner} className="flex items-center gap-2 rounded-[8px] bg-white/[0.06] px-3 py-2.5 ring-1 ring-white/10"><CheckCircle2 className={`h-4 w-4 ${asset.status === "active" ? "text-[#2ECE82]" : "text-white/30"}`} /><span className="text-[11px] font-black text-white/82">{SCANNER_LABELS[scanner] || scanner}</span></div>)}</div></article><article className="rounded-[8px] border border-slate-200 bg-white p-4"><p className="text-[10px] font-black uppercase text-slate-500">Tags</p><div className="mt-3 flex flex-wrap gap-2">{asset.tags.length > 0 ? asset.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600 ring-1 ring-slate-200">{tag}</span>) : <span className="text-[11px] font-semibold text-slate-400">No tags</span>}</div></article>{canDelete && asset.status !== "archived" ? <article className="rounded-[8px] border border-rose-200 bg-rose-50 p-4"><h3 className="text-[13px] font-black text-rose-950">Remove from scope</h3><p className="mt-1 text-[11px] font-semibold leading-relaxed text-rose-700">Archiving blocks scanner selection but preserves scan and verification history.</p>{confirmArchive ? <div className="mt-3 flex gap-2"><button type="button" onClick={() => void archive()} disabled={busy !== ""} className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-rose-700 px-3 text-[11px] font-black text-white">{busy === "archive" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}Confirm archive</button><button type="button" onClick={() => setConfirmArchive(false)} className="h-9 rounded-[8px] border border-rose-200 bg-white px-3 text-[11px] font-black text-rose-700">Cancel</button></div> : <button type="button" onClick={() => setConfirmArchive(true)} className="mt-3 inline-flex h-9 items-center gap-2 rounded-[8px] border border-rose-200 bg-white px-3 text-[11px] font-black text-rose-700"><Trash2 className="h-3.5 w-3.5" />Archive Asset</button>}</article> : null}</aside>
      </section>
    </div>
  );
}

function DetailCell({ label, value, Icon }: { label: string; value: string; Icon: typeof Globe2 }) {
  return <div className="flex min-h-24 items-start gap-3 bg-white p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-slate-50 text-[#0891B2] ring-1 ring-slate-100"><Icon className="h-4 w-4" /></span><div className="min-w-0"><p className="text-[9px] font-black uppercase text-slate-400">{label}</p><p className="mt-1 break-all text-[12px] font-black text-slate-800">{value}</p></div></div>;
}

export default function AssetWorkspace() {
  const pathname = usePathname();
  const route = useMemo(() => {
    if (pathname === "/assets/new") return { mode: "new" as const, assetId: "" };
    const match = pathname.match(/^\/assets\/([0-9a-f-]+)(\/edit)?$/i);
    if (match) return { mode: match[2] ? "edit" as const : "detail" as const, assetId: match[1] };
    return { mode: "list" as const, assetId: "" };
  }, [pathname]);

  if (pathname === "/assets/guide") return <WorkspaceGuidePage guideId="assets" />;
  if (route.mode === "new") return <NewAsset />;
  if (route.mode === "detail" || route.mode === "edit") return <AssetDetail assetId={route.assetId} editMode={route.mode === "edit"} />;
  return <AssetInventory />;
}
