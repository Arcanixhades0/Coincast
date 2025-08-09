import React from "react";

interface MetallicCircleProps {
  size?: number; // px
  className?: string;
}

// SVG-based metallic fluid inside a fixed circular shape.
// Uses animated turbulence + moving light to create smooth chrome-like motion
const MetallicCircle: React.FC<MetallicCircleProps> = ({ size = 48, className = "" }) => {
  const id = React.useMemo(() => Math.random().toString(36).slice(2), []);
  const s = size;
  const r = s / 2;

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable={false}
    >
      <defs>
        <clipPath id={`clip-${id}`}>
          <circle cx={r} cy={r} r={r} />
        </clipPath>

        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="50%" stopColor="#0f0f0f" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>

        <filter id={`metallic-${id}`} x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.02"
            numOctaves="3"
            seed="2"
            result="noise"
          >
            <animate attributeName="baseFrequency" dur="12s" values="0.012 0.02;0.02 0.012;0.012 0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
          <feSpecularLighting
            in="mono"
            surfaceScale="3"
            specularConstant="1"
            specularExponent="25"
            lighting-color="#ffffff"
            result="spec"
          >
            <feDistantLight azimuth="0" elevation="55">
              <animate attributeName="azimuth" from="0" to="360" dur="16s" repeatCount="indefinite" />
            </feDistantLight>
          </feSpecularLighting>
          <feComposite in="spec" in2="mono" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="lit" />
          <feGaussianBlur in="lit" stdDeviation="0.6" result="glow" />
          <feBlend in="glow" in2="SourceGraphic" mode="screen" />
        </filter>
      </defs>

      {/* Hard circle edge */}
      <circle cx={r} cy={r} r={r - 0.75} fill="#0a0a0a" stroke="#3a3a3a" strokeWidth="1.5" />

      {/* Metallic fluid content clipped to circle so the shape stays perfectly round */}
      <g clipPath={`url(#clip-${id})`}>
        <rect x={0} y={0} width={s} height={s} fill={`url(#bg-${id})`} filter={`url(#metallic-${id})`} />
      </g>

      {/* Soft rim highlight to enhance chrome feel */}
      <circle
        cx={r}
        cy={r}
        r={r - 1.2}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />
    </svg>
  );
};

export default MetallicCircle;


