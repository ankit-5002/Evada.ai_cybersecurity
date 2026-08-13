import type { CSSProperties } from "react";

type OrbLayer = {
  className: string;
  style: CSSProperties;
};

type ParticleLayer = {
  left: string;
  top: string;
  size: string;
  color: string;
  delay: string;
  duration: string;
  opacity?: number;
};

type ChipLayer = {
  className: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  delay: string;
  duration?: string;
};

type NetworkNode = {
  x: number;
  y: number;
  r: number;
  fill: string;
};

const premiumOrbs: OrbLayer[] = [
  {
    className: "evada-home-bg-orb evada-home-bg-orb-a evada-float-soft",
    style: {
      left: "-11rem",
      top: "-9rem",
      width: "42rem",
      height: "42rem",
      background:
        "radial-gradient(circle, rgba(125, 211, 252, 0.52), rgba(219, 234, 254, 0.28) 38%, transparent 72%)",
      "--duration": "18s",
      "--delay": "-2s",
    } as CSSProperties,
  },
  {
    className: "evada-home-bg-orb evada-home-bg-orb-b evada-float-reverse",
    style: {
      right: "-12rem",
      top: "-6rem",
      width: "39rem",
      height: "39rem",
      background:
        "radial-gradient(circle, rgba(103, 232, 249, 0.42), rgba(46, 206, 130, 0.18) 42%, transparent 72%)",
      "--duration": "20s",
      "--delay": "-7s",
    } as CSSProperties,
  },
  {
    className: "evada-home-bg-orb evada-home-bg-orb-c evada-float-soft",
    style: {
      right: "8%",
      bottom: "-15rem",
      width: "44rem",
      height: "44rem",
      background:
        "radial-gradient(circle, rgba(34, 211, 238, 0.34), rgba(14, 165, 233, 0.18) 42%, transparent 74%)",
      "--duration": "22s",
      "--delay": "-11s",
    } as CSSProperties,
  },
  {
    className: "evada-home-bg-orb evada-home-bg-orb-d evada-float-reverse",
    style: {
      left: "12%",
      bottom: "-13rem",
      width: "34rem",
      height: "34rem",
      background:
        "radial-gradient(circle, rgba(186, 247, 208, 0.32), rgba(4, 169, 199, 0.16) 44%, transparent 74%)",
      "--duration": "21s",
      "--delay": "-15s",
    } as CSSProperties,
  },
];

const premiumParticles: ParticleLayer[] = [
  { left: "8%", top: "16%", size: "5px", color: "rgba(14,165,233,0.56)", delay: "-1s", duration: "9.4s" },
  { left: "17%", top: "68%", size: "7px", color: "rgba(34,211,238,0.62)", delay: "-4s", duration: "10.8s" },
  { left: "26%", top: "28%", size: "4px", color: "rgba(255,255,255,0.94)", delay: "-7s", duration: "8.8s" },
  { left: "38%", top: "11%", size: "6px", color: "rgba(46,206,130,0.45)", delay: "-2s", duration: "11.2s" },
  { left: "47%", top: "74%", size: "5px", color: "rgba(14,165,233,0.52)", delay: "-6s", duration: "9.8s" },
  { left: "56%", top: "21%", size: "4px", color: "rgba(34,211,238,0.58)", delay: "-9s", duration: "10.5s" },
  { left: "66%", top: "82%", size: "7px", color: "rgba(255,255,255,0.9)", delay: "-3s", duration: "9.2s" },
  { left: "76%", top: "34%", size: "5px", color: "rgba(46,206,130,0.5)", delay: "-8s", duration: "12s" },
  { left: "86%", top: "62%", size: "6px", color: "rgba(34,211,238,0.55)", delay: "-5s", duration: "10.2s" },
  { left: "93%", top: "18%", size: "4px", color: "rgba(14,165,233,0.46)", delay: "-10s", duration: "11.5s" },
  { left: "12%", top: "88%", size: "4px", color: "rgba(46,206,130,0.42)", delay: "-12s", duration: "9.7s" },
  { left: "72%", top: "9%", size: "5px", color: "rgba(255,255,255,0.92)", delay: "-13s", duration: "10.9s" },
];

const chipLayers: ChipLayer[] = [
  { className: "evada-home-bg-chip-a", left: "11%", top: "42%", delay: "-2s" },
  { className: "evada-home-bg-chip-b", left: "31%", top: "82%", delay: "-6s" },
  { className: "evada-home-bg-chip-c", right: "13%", top: "24%", delay: "-10s" },
  { className: "evada-home-bg-chip-d", right: "24%", bottom: "14%", delay: "-14s" },
];

function NetworkField({
  className = "",
  idPrefix = "home-network",
}: {
  className?: string;
  idPrefix?: string;
}) {
  const gradientId = `${idPrefix}-gradient`;
  const softGradientId = `${idPrefix}-soft-gradient`;
  const nodeGlowId = `${idPrefix}-node-glow`;

  const nodes: NetworkNode[] = [
    { x: 36, y: 68, fill: "#FFFFFF", r: 3.2 },
    { x: 96, y: 38, fill: "#22D3EE", r: 2.7 },
    { x: 166, y: 72, fill: "#06B6D4", r: 3 },
    { x: 238, y: 42, fill: "#67E8F9", r: 2.8 },
    { x: 316, y: 82, fill: "#FFFFFF", r: 3.2 },
    { x: 398, y: 52, fill: "#06B6D4", r: 2.8 },
    { x: 478, y: 88, fill: "#67E8F9", r: 3 },
    { x: 568, y: 60, fill: "#FFFFFF", r: 3.2 },

    { x: 72, y: 168, fill: "#06B6D4", r: 2.8 },
    { x: 146, y: 206, fill: "#FFFFFF", r: 3.1 },
    { x: 238, y: 166, fill: "#67E8F9", r: 2.8 },
    { x: 326, y: 212, fill: "#06B6D4", r: 3 },
    { x: 416, y: 174, fill: "#FFFFFF", r: 3.2 },
    { x: 504, y: 210, fill: "#22D3EE", r: 2.8 },
    { x: 594, y: 162, fill: "#67E8F9", r: 2.9 },

    { x: 42, y: 300, fill: "#FFFFFF", r: 3.1 },
    { x: 128, y: 336, fill: "#67E8F9", r: 2.8 },
    { x: 220, y: 292, fill: "#06B6D4", r: 2.8 },
    { x: 316, y: 338, fill: "#FFFFFF", r: 3.2 },
    { x: 414, y: 302, fill: "#06B6D4", r: 2.8 },
    { x: 514, y: 342, fill: "#67E8F9", r: 2.8 },
    { x: 606, y: 292, fill: "#FFFFFF", r: 3.1 },
  ];

  const links = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [0, 8],
    [8, 9],
    [9, 10],
    [10, 11],
    [11, 12],
    [12, 13],
    [13, 14],
    [8, 15],
    [15, 16],
    [16, 17],
    [17, 18],
    [18, 19],
    [19, 20],
    [20, 21],
    [2, 10],
    [4, 12],
    [6, 14],
    [9, 17],
    [12, 19],
  ] as const;

  return (
    <svg
      className={`evada-home-bg-network evada-network-field absolute h-[420px] w-[640px] ${className}`}
      viewBox="0 0 640 420"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="20" y1="34" x2="620" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.5" stopColor="#0891B2" />
          <stop offset="1" stopColor="#16A86E" />
        </linearGradient>

        <linearGradient id={softGradientId} x1="60" y1="300" x2="580" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.18" />
        </linearGradient>

        <filter id={nodeGlowId} x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="4.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g strokeLinecap="round">
        {links.map(([from, to], index) => {
          const start = nodes[from];
          const end = nodes[to];

          return (
            <path
              key={`${from}-${to}`}
              className="evada-home-bg-network-line evada-dash-flow"
              d={`M${start.x} ${start.y}L${end.x} ${end.y}`}
              stroke={index % 5 === 0 ? `url(#${softGradientId})` : `url(#${gradientId})`}
              strokeWidth={index % 4 === 0 ? "1.45" : "1.18"}
              strokeDasharray={index % 3 === 0 ? "7 13" : "5 12"}
              opacity={index % 4 === 0 ? "0.56" : "0.38"}
              style={
                {
                  "--duration": `${18 + (index % 5) * 2}s`,
                  "--delay": `${index * -0.32}s`,
                } as CSSProperties
              }
            />
          );
        })}
      </g>

      {nodes.map((node, index) => (
        <g
          key={`${node.x}-${node.y}`}
          className="evada-home-bg-network-node-wrap evada-network-node"
          style={
            {
              "--delay": `${index * 0.14}s`,
              "--duration": `${3.8 + (index % 4) * 0.35}s`,
            } as CSSProperties
          }
        >
          <circle cx={node.x} cy={node.y} r={node.r + 8} fill={node.fill} opacity="0.12" />
          <circle
            className="evada-home-bg-network-node"
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={node.fill}
            filter={`url(#${nodeGlowId})`}
          />
        </g>
      ))}
    </svg>
  );
}

function WaveField() {
  return (
    <svg
      className="evada-home-bg-wave evada-wave-drift absolute inset-x-[-10%] bottom-[-5%] h-[44rem] w-[120%]"
      viewBox="0 0 1440 640"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="home-wave-cyan" x1="0" y1="180" x2="1440" y2="380" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" stopOpacity="0" />
          <stop offset="0.46" stopColor="#22D3EE" stopOpacity="0.42" />
          <stop offset="1" stopColor="#16A86E" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="home-wave-blue" x1="0" y1="300" x2="1440" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16A86E" stopOpacity="0" />
          <stop offset="0.52" stopColor="#0891B2" stopOpacity="0.32" />
          <stop offset="1" stopColor="#04A9C7" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        className="evada-home-bg-wave-line evada-dash-flow"
        d="M-30 374C140 286 270 268 424 326C610 396 760 420 942 326C1112 238 1268 258 1470 338"
        stroke="url(#home-wave-cyan)"
        strokeWidth="2"
        strokeDasharray="10 18"
        style={{ "--duration": "24s", "--delay": "-3s" } as CSSProperties}
      />

      <path
        className="evada-home-bg-wave-line evada-dash-flow"
        d="M-40 440C154 344 340 358 520 432C718 514 852 454 1008 356C1162 260 1308 278 1480 386"
        stroke="url(#home-wave-blue)"
        strokeWidth="1.6"
        strokeDasharray="8 16"
        style={{ "--duration": "30s", "--delay": "-12s" } as CSSProperties}
      />

      <path
        className="evada-home-bg-wave-line evada-dash-flow"
        d="M-60 210C116 154 282 170 430 226C616 296 792 298 980 220C1142 152 1304 162 1500 238"
        stroke="url(#home-wave-cyan)"
        strokeWidth="1.2"
        strokeDasharray="6 18"
        opacity="0.62"
        style={{ "--duration": "34s", "--delay": "-18s" } as CSSProperties}
      />
    </svg>
  );
}

export default function HomepageAnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="evada-animated-background evada-home-premium-bg pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="evada-home-bg-base absolute inset-0" />
      <div className="evada-home-bg-lustre absolute inset-0" />
      <div className="evada-home-bg-vignette absolute inset-0" />

      {premiumOrbs.map((orb) => (
        <span key={orb.className} className={orb.className} style={orb.style} />
      ))}

      <div className="evada-home-bg-mesh evada-home-bg-mesh-right evada-mesh-drift absolute" />
      <div className="evada-home-bg-mesh evada-home-bg-mesh-left evada-mesh-drift absolute" />
      <div className="evada-home-bg-grid evada-dot-drift absolute" />

      <WaveField />

      <NetworkField
        idPrefix="home-network-primary"
        className="left-[max(50%,42rem)] top-[8%] opacity-[0.58]"
      />

      <NetworkField
        idPrefix="home-network-secondary"
        className="bottom-[4%] left-[-7rem] scale-[0.86] opacity-[0.42]"
      />

      <NetworkField
        idPrefix="home-network-tertiary"
        className="right-[-12rem] bottom-[18%] scale-[0.74] opacity-[0.34]"
      />

      {premiumParticles.map((particle, index) => (
        <span
          key={`${particle.left}-${particle.top}-${index}`}
          className="evada-home-bg-particle evada-particle-float absolute rounded-full"
          style={
            {
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity ?? 1,
              "--delay": particle.delay,
              "--duration": particle.duration,
            } as CSSProperties
          }
        />
      ))}

      {chipLayers.map((chip) => (
        <span
          key={chip.className}
          className={`evada-home-bg-chip ${chip.className} evada-particle-float absolute`}
          style={
            {
              left: chip.left,
              right: chip.right,
              top: chip.top,
              bottom: chip.bottom,
              "--delay": chip.delay,
              "--duration": chip.duration ?? "13s",
            } as CSSProperties
          }
        />
      ))}

      <div className="evada-home-bg-noise absolute inset-0" />
    </div>
  );
}