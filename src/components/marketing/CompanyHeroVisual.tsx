import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

type CompanyHeroCardData = {
  title: string;
  text: string;
  Icon: LucideIcon;
  accent: string;
};

type CompanyHeroPillData = {
  label: string;
  Icon: LucideIcon;
  positionClassName: string;
  optional?: boolean;
};

const heroCards: CompanyHeroCardData[] = [
  {
    title: "AI-Supported Review",
    text: "Helps connect findings, context and priorities so teams can see what matters first.",
    Icon: BrainCircuit,
    accent: "from-cyan-400 via-blue-500 to-emerald-500",
  },
  {
    title: "Human Approved",
    text: "Sensitive validation stays under human judgement before action moves forward.",
    Icon: UserRoundCheck,
    accent: "from-blue-500 via-cyan-400 to-blue-600",
  },
  {
    title: "Evidence Led",
    text: "Proof and context help businesses understand why a fix matters.",
    Icon: ShieldCheck,
    accent: "from-emerald-500 via-blue-500 to-cyan-400",
  },
  {
    title: "Built by Netforte",
    text: "Real security experience sits behind the EVADA platform.",
    Icon: UsersRound,
    accent: "from-blue-500 via-emerald-500 to-cyan-400",
  },
];

const desktopCardPositions = [
  "left-[2%] top-[14%]",
  "left-[2%] top-[58%]",
  "right-[2%] top-[16%]",
  "right-[2%] top-[58%]",
];

const pills: CompanyHeroPillData[] = [
  {
    label: "AI-supported",
    Icon: Sparkles,
    positionClassName: "left-[1%] top-[2%]",
  },
  {
    label: "Evidence led",
    Icon: ShieldCheck,
    positionClassName: "right-[1%] top-[3%]",
  },
  {
    label: "Human approved",
    Icon: UserRoundCheck,
    positionClassName: "left-[0%] bottom-[2%]",
    optional: true,
  },
  {
    label: "Netforte backed",
    Icon: UsersRound,
    positionClassName: "right-[0%] bottom-[2%]",
    optional: true,
  },
];

const particles: Array<[string, string, number, string, string, string]> = [
  ["15%", "18%", 7, "rgba(34,211,238,0.92)", "0ms", "8.6s"],
  ["32%", "10%", 5, "rgba(14,165,233,0.78)", "360ms", "9.4s"],
  ["68%", "15%", 6, "rgba(46,206,130,0.78)", "720ms", "8.1s"],
  ["84%", "34%", 9, "rgba(34,211,238,0.7)", "1080ms", "9.1s"],
  ["21%", "51%", 5, "rgba(255,255,255,0.96)", "1320ms", "8.8s"],
  ["77%", "57%", 6, "rgba(14,165,233,0.72)", "1640ms", "8.4s"],
  ["39%", "81%", 7, "rgba(46,206,130,0.68)", "2020ms", "9.8s"],
  ["61%", "84%", 5, "rgba(34,211,238,0.76)", "2360ms", "8.9s"],
  ["50%", "24%", 4, "rgba(255,255,255,0.94)", "2600ms", "7.9s"],
  ["50%", "70%", 5, "rgba(14,165,233,0.64)", "2920ms", "9.5s"],
];

function CompanyMissionNexusIcon({
  className = "",
  idPrefix = "company-mission-nexus",
}: {
  className?: string;
  idPrefix?: string;
}) {
  const coreFillId = `${idPrefix}-core-fill`;
  const coreStrokeId = `${idPrefix}-core-stroke`;
  const lineId = `${idPrefix}-line`;
  const nodeFillId = `${idPrefix}-node-fill`;
  const glowId = `${idPrefix}-glow`;

  return (
    <svg
      aria-hidden="true"
      className={`company-nexus-icon ${className}`}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={coreFillId} x1="35" y1="30" x2="184" y2="188" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.46" stopColor="#0891B2" />
          <stop offset="1" stopColor="#2ECE82" />
        </linearGradient>

        <linearGradient id={coreStrokeId} x1="38" y1="32" x2="182" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.98)" />
          <stop offset="0.5" stopColor="rgba(191,239,255,0.95)" />
          <stop offset="1" stopColor="rgba(237,233,254,0.96)" />
        </linearGradient>

        <linearGradient id={lineId} x1="60" y1="62" x2="162" y2="162" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#BFDBFE" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>

        <linearGradient id={nodeFillId} x1="44" y1="46" x2="176" y2="178" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.28)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.12)" />
        </linearGradient>

        <filter id={glowId} x="-55%" y="-55%" width="210%" height="210%">
          <feGaussianBlur stdDeviation="4.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        className="company-nexus-core-body"
        d="M110 17L166 44.5L196 104L176 169L110 202L44 169L24 104L54 44.5L110 17Z"
        fill={`url(#${coreFillId})`}
        stroke={`url(#${coreStrokeId})`}
        strokeWidth="4.4"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
      />

      <path
        className="company-nexus-core-inner"
        d="M110 36L151 56.2L174 104.5L158.5 153.5L110 178L61.5 153.5L46 104.5L69 56.2L110 36Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <circle
        className="company-nexus-centre-orb"
        cx="110"
        cy="108"
        r="31"
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="3.6"
      />

      <path
        className="company-nexus-trace company-nexus-brain-left"
        d="M98 82C87.5 82 79.5 90 79.5 100.5C79.5 106.2 82.1 111.2 86.2 114.5C82.8 118 80.8 122.8 80.8 128.2C80.8 139 89.5 147.5 100.2 147.5H110V80.5C106.8 83.2 102.6 82 98 82Z"
        stroke={`url(#${lineId})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        className="company-nexus-trace company-nexus-brain-right"
        d="M122 82C132.5 82 140.5 90 140.5 100.5C140.5 106.2 137.9 111.2 133.8 114.5C137.2 118 139.2 122.8 139.2 128.2C139.2 139 130.5 147.5 119.8 147.5H110V80.5C113.2 83.2 117.4 82 122 82Z"
        stroke={`url(#${lineId})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        className="company-nexus-trace company-nexus-human-links"
        d="M84 99H61M136 99H159M110 139V166M91 145L76 162M129 145L144 162"
        stroke="rgba(191,239,255,0.96)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      <circle className="company-nexus-human-node company-nexus-human-node-a" cx="61" cy="99" r="9.5" fill={`url(#${nodeFillId})`} stroke="white" strokeWidth="2.6" />
      <circle className="company-nexus-human-node company-nexus-human-node-b" cx="159" cy="99" r="9.5" fill={`url(#${nodeFillId})`} stroke="white" strokeWidth="2.6" />
      <circle className="company-nexus-human-node company-nexus-human-node-c" cx="110" cy="166" r="10" fill={`url(#${nodeFillId})`} stroke="white" strokeWidth="2.6" />

      <path
        className="company-nexus-human-node-detail"
        d="M55 105C56.8 101.8 58.7 100.5 61 100.5C63.3 100.5 65.2 101.8 67 105M57.8 95.3C57.8 93.5 59.2 92 61 92C62.8 92 64.2 93.5 64.2 95.3M153 105C154.8 101.8 156.7 100.5 159 100.5C161.3 100.5 163.2 101.8 165 105M155.8 95.3C155.8 93.5 157.2 92 159 92C160.8 92 162.2 93.5 162.2 95.3M104 172C105.8 168.8 107.7 167.5 110 167.5C112.3 167.5 114.2 168.8 116 172M106.8 162.3C106.8 160.5 108.2 159 110 159C111.8 159 113.2 160.5 113.2 162.3"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        className="company-nexus-check"
        d="M96.5 111.5L106.5 121.5L124.5 101.5"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
      />

      <path
        className="company-nexus-spark"
        d="M110 51V62M110 181V191M49 110H60M160 110H171M69 67L76 74M151 67L144 74"
        stroke="rgba(255,255,255,0.78)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CompanyConnectorSvg({ idPrefix }: { idPrefix: string }) {
  const gradientId = `${idPrefix}-connector`;
  const softGradientId = `${idPrefix}-soft-connector`;
  const nodeGlowId = `${idPrefix}-node-glow`;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      viewBox="0 0 820 610"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="92" y1="90" x2="728" y2="520" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.5" stopColor="#0891B2" />
          <stop offset="1" stopColor="#2ECE82" />
        </linearGradient>

        <linearGradient id={softGradientId} x1="118" y1="128" x2="702" y2="502" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="0.48" stopColor="#FFFFFF" stopOpacity="0.82" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.18" />
        </linearGradient>

        <filter id={nodeGlowId} x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="4.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="410" cy="315" rx="268" ry="198" fill="rgba(255,255,255,0.14)" />
      <ellipse
        className="company-nexus-orbit-path"
        cx="410"
        cy="315"
        rx="278"
        ry="204"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.8"
        strokeDasharray="8 13"
      />
      <ellipse
        className="company-nexus-orbit-path company-nexus-orbit-path-slow"
        cx="410"
        cy="315"
        rx="196"
        ry="142"
        stroke="#06B6D4"
        strokeWidth="1.3"
        strokeDasharray="4 11"
      />
      <ellipse cx="410" cy="315" rx="132" ry="96" stroke="rgba(255,255,255,0.56)" strokeWidth="1.1" />

      <path className="company-nexus-connector" d="M248 178C314 204 356 246 392 300" stroke={`url(#${gradientId})`} />
      <path className="company-nexus-connector" d="M572 192C512 224 470 260 428 304" stroke={`url(#${gradientId})`} style={{ "--delay": "-0.8s" } as CSSProperties} />
      <path className="company-nexus-connector" d="M248 430C316 404 360 374 394 340" stroke={`url(#${gradientId})`} style={{ "--delay": "-1.6s" } as CSSProperties} />
      <path className="company-nexus-connector" d="M572 430C510 404 468 374 426 340" stroke={`url(#${gradientId})`} style={{ "--delay": "-2.4s" } as CSSProperties} />

      <path
        className="company-nexus-connector company-nexus-connector-soft"
        d="M160 315C250 164 570 164 660 315"
        stroke={`url(#${gradientId})`}
        style={{ "--delay": "-3.2s" } as CSSProperties}
      />
      <path
        className="company-nexus-connector company-nexus-connector-soft"
        d="M152 400C256 530 564 530 668 400"
        stroke={`url(#${softGradientId})`}
        style={{ "--delay": "-4.4s" } as CSSProperties}
      />

      {([
        [248, 178, "#22D3EE"],
        [572, 192, "#2ECE82"],
        [248, 430, "#22D3EE"],
        [572, 430, "#2ECE82"],
        [392, 300, "#0891B2"],
        [428, 304, "#2ECE82"],
        [394, 340, "#22D3EE"],
        [426, 340, "#0891B2"],
        [410, 166, "#FFFFFF"],
        [410, 490, "#FFFFFF"],
      ] as Array<[number, number, string]>).map(([cx, cy, fill], index) => (
        <g
          key={`${cx}-${cy}`}
          className="company-nexus-signal-node"
          style={{ "--delay": `${index * 0.14}s` } as CSSProperties}
        >
          <circle cx={cx} cy={cy} r="13" fill={fill} opacity="0.14" />
          <circle cx={cx} cy={cy} r="5.2" fill={fill} filter={`url(#${nodeGlowId})`} />
        </g>
      ))}
    </svg>
  );
}

function CompanyHeroCard({
  card,
  index,
  compact = false,
}: {
  card: CompanyHeroCardData;
  index: number;
  compact?: boolean;
}) {
  const Icon = card.Icon;

  return (
    <div
      className="company-nexus-card-float"
      style={
        {
          "--delay": `${index * 0.18}s`,
          "--duration": `${7.2 + index * 0.28}s`,
        } as CSSProperties
      }
    >
      <article
        className={`company-nexus-card evada-light-card group relative overflow-hidden ${
          compact
            ? "min-h-[116px] p-3"
            : "min-h-[104px] w-[192px] p-3.5"
        }`}
      >
        <div className="relative z-10">
          <div className="flex items-start gap-3">
            <span
              className={`company-nexus-icon-bubble evada-light-icon grid shrink-0 place-items-center rounded-[8px] transition group-hover:text-[#2ECE82] ${
                compact ? "h-9 w-9" : "h-10 w-10"
              }`}
            >
              <Icon className={compact ? "h-[15px] w-[15px]" : "h-[18px] w-[18px]"} strokeWidth={2.05} />
            </span>

            <div className="min-w-0">
              <h3 className={`evada-light-title ${compact ? "text-[13px]" : "text-[14px]"} font-bold leading-tight tracking-[-0.02em]`}>
                {card.title}
              </h3>
              <span className={`mt-1 block h-[3px] w-8 rounded-full bg-gradient-to-r ${card.accent}`} />
            </div>
          </div>

          <p className={`evada-light-muted ${compact ? "mt-1 text-[10.7px]" : "mt-1 text-[11.1px]"} font-medium leading-[1.45]`}>
            {card.text}
          </p>
        </div>
      </article>
    </div>
  );
}

function CompanyHeroPill({ pill, index }: { pill: CompanyHeroPillData; index: number }) {
  const Icon = pill.Icon;

  return (
    <div className={`absolute z-40 ${pill.positionClassName} ${pill.optional ? "hidden xl:block" : ""}`}>
      <div
        className="company-nexus-pill-float"
        style={
          {
            "--delay": `${index * 0.22}s`,
            "--duration": `${6.2 + index * 0.26}s`,
          } as CSSProperties
        }
      >
        <div className="company-nexus-pill evada-light-card inline-flex items-center gap-2 rounded-[8px] px-3 py-2 text-[11px] font-bold text-slate-800">
          <span className="evada-light-icon grid h-7 w-7 shrink-0 place-items-center rounded-[8px]">
            <Icon className="h-[15px] w-[15px]" strokeWidth={2.1} />
          </span>
          <span className="whitespace-nowrap">{pill.label}</span>
        </div>
      </div>
    </div>
  );
}

function CompanyNexusCore({
  compact = false,
  idPrefix,
}: {
  compact?: boolean;
  idPrefix: string;
}) {
  return (
    <div className={`company-nexus-core-float relative ${compact ? "h-[255px] w-[300px]" : "h-[300px] w-[330px]"}`}>
      <div className="company-nexus-core-aurora" />

      <div className="company-nexus-core-ring company-nexus-core-ring-a" />
      <div className="company-nexus-core-ring company-nexus-core-ring-b" />
      <div className="company-nexus-core-ring company-nexus-core-ring-c" />

      <div className="company-nexus-core-beam company-nexus-core-beam-a" />
      <div className="company-nexus-core-beam company-nexus-core-beam-b" />
      <div className="company-nexus-core-beam company-nexus-core-beam-c" />

      <div className="company-nexus-base company-nexus-base-shadow" />
      <div className="company-nexus-base company-nexus-base-back" />
      <div className="company-nexus-base company-nexus-base-mid" />
      <div className="company-nexus-base company-nexus-base-front" />

      <div className={`company-nexus-core-shell ${compact ? "company-nexus-core-shell-compact" : ""}`}>
        <span className="company-nexus-scan-ring" />
        <span className="company-nexus-scan-ring company-nexus-scan-ring-b" />
        <span className="company-nexus-orbit-dot company-nexus-orbit-dot-a" />
        <span className="company-nexus-orbit-dot company-nexus-orbit-dot-b" />
        <span className="company-nexus-orbit-dot company-nexus-orbit-dot-c" />

        <CompanyMissionNexusIcon
          idPrefix={`${idPrefix}-mission`}
          className={compact ? "h-[136px] w-[136px]" : "h-[154px] w-[154px]"}
        />
      </div>

      <div className={`absolute left-1/2 z-40 -translate-x-1/2 text-center ${compact ? "bottom-[4px] w-[190px]" : "bottom-[8px] w-[220px]"}`}>
        <p className={`${compact ? "text-[16px]" : "text-[18px]"} font-bold leading-none tracking-[-0.02em] text-[#071633]`}>
          Mission Nexus
        </p>
        <p className={`${compact ? "mt-1 text-[11px]" : "mt-1.5 text-[12px]"} font-semibold text-slate-600`}>
          Human + AI validation trust
        </p>
        <span className="mx-auto mt-2.5 block h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,#06B6D4,#0891B2,#2ECE82)]" />
      </div>
    </div>
  );
}

function MobileCompanyVisual() {
  return (
    <div className="lg:hidden">
      <div className="evada-light-panel relative overflow-hidden rounded-[8px] p-4">
        <div className="company-nexus-ambient absolute inset-0 rounded-[8px]" />
        <div className="company-nexus-mesh absolute right-[-18%] top-[-8%] h-[210px] w-[250px] opacity-30" />

          <div className="relative mx-auto h-[255px] max-w-[320px]">
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <CompanyNexusCore compact idPrefix="company-mobile-nexus" />
          </div>
        </div>

        <div className="relative z-20 mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {heroCards.map((card, index) => (
            <CompanyHeroCard key={card.title} card={card} index={index} compact />
          ))}
        </div>

        <div className="relative z-20 mt-4 flex flex-wrap justify-center gap-3">
          <span className="evada-light-card inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-[12px] font-bold text-slate-700">
            <Sparkles className="h-4 w-4 text-[#0891B2]" strokeWidth={2.1} />
            AI-supported
          </span>
          <span className="evada-light-card inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-[12px] font-bold text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-[#0891B2]" strokeWidth={2.1} />
            Human approved
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CompanyHeroVisual() {
  return (
    <div className="company-hero-visual company-nexus-visual relative mx-auto w-full max-w-[800px] overflow-visible lg:-mt-2 xl:-mt-3" aria-hidden="true">
      <div className="hidden lg:block">
        <div className="company-nexus-stage relative mx-auto h-[548px] w-full max-w-[800px] overflow-visible">
          <div className="company-nexus-ambient absolute inset-[-7%] rounded-full" />
          <div className="company-nexus-mesh absolute right-[-5%] top-[4%] h-[82%] w-[48%]" />
          <CompanyConnectorSvg idPrefix="company-nexus-desktop" />

          {particles.map(([left, top, size, color, delay, duration]) => (
            <span
              key={`${left}-${top}`}
              className="company-nexus-particle absolute z-20 rounded-full"
              style={
                {
                  left,
                  top,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  "--delay": delay,
                  "--duration": duration,
                } as CSSProperties
              }
            />
          ))}

          <div className="absolute left-1/2 top-[52%] z-30 -translate-x-1/2 -translate-y-1/2">
            <CompanyNexusCore idPrefix="company-desktop-nexus" />
          </div>

          {heroCards.map((card, index) => (
            <div key={card.title} className={`absolute z-40 ${desktopCardPositions[index]}`}>
              <CompanyHeroCard card={card} index={index} />
            </div>
          ))}

          {pills.map((pill, index) => (
            <CompanyHeroPill key={pill.label} pill={pill} index={index} />
          ))}
        </div>
      </div>

      <MobileCompanyVisual />
    </div>
  );
}
