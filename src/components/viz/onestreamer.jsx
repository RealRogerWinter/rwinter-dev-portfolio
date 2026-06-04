// OneStreamer diagrams — ESM port of the window-global site/portfolio/os-diagrams.jsx.
// All three are pure functions of no props (static SVG; their animation is CSS-only,
// gated by the [data-anim] root attribute via src/styles/onestreamer.css). The Astro
// page renders them with no client directive, so they ship as static HTML with zero
// JS. Bodies reproduced verbatim from the original (CSS extracted to the stylesheet).
import React from 'react';

function screen(x, y, w, h, live){
  return <rect className={live ? "pnl-live" : "pnl"} x={x} y={y} width={w} height={h} rx="8" />;
}

export function TakeoverDiagram(){
  return (
    <div className="osd osd-take">
      <svg viewBox="0 0 386 218" role="img" aria-label="Takeover mechanic: a challenger interrupts, attacks the defender's shield, and seizes the live stream">
        {/* queue */}
        <text className="lbl-d" x="20" y="34">Queue</text>
        {screen(20, 44, 92, 56, false)}
        <circle cx="40" cy="72" r="9" fill="none" stroke="var(--dim)" strokeWidth="1.6" />
        <text className="lbl" x="58" y="76" fill="var(--dim)">B</text>
        {screen(20, 120, 92, 56, false)}
        <circle cx="40" cy="148" r="9" fill="none" stroke="var(--dim)" strokeWidth="1.6" />
        <text className="lbl" x="58" y="152" fill="var(--dim)">C</text>

        {/* interrupt arrow */}
        <path className="wire interrupt" d="M118,72 C150,72 150,96 178,100" markerEnd="" />
        <text className="lbl-a interrupt" x="124" y="56">interrupt →</text>

        {/* incoming challenger that slides onto stage */}
        <g className="incoming">
          <circle cx="40" cy="72" r="9" fill="var(--acc)" />
        </g>

        {/* stage */}
        <text className="lbl-a" x="250" y="34">● On air</text>
        {screen(200, 44, 168, 104, true)}
        <path className="play" d="M270,78 L270,114 L300,96 Z" />
        <g className="nameA"><circle cx="232" cy="130" r="7" fill="var(--acc)" /><text className="lbl" x="246" y="134">Streamer A</text></g>
        <g className="nameB"><circle cx="232" cy="130" r="7" fill="none" stroke="var(--acc)" strokeWidth="1.8" /><text className="lbl" x="246" y="134">Streamer B</text></g>

        {/* zaps hitting the stage */}
        <path className="zap z1" d="M150,90 l12,-6 l-6,10 l12,-4" />
        <path className="zap z2" d="M150,108 l12,-6 l-6,10 l12,-4" />
        <path className="zap z3" d="M150,126 l12,-6 l-6,10 l12,-4" />

        {/* takeover flash */}
        <g className="takeover">
          <rect x="222" y="80" width="124" height="30" rx="15" fill="color-mix(in srgb,var(--acc) 22%, var(--panel))" stroke="var(--acc)" strokeWidth="1.6" />
          <text x="284" y="100" textAnchor="middle" className="lbl-a" style={{ fontSize: '13px' }}>TAKEOVER</text>
        </g>

        {/* defense meter */}
        <text className="lbl-d" x="200" y="178">Defense</text>
        <rect x="200" y="186" width="168" height="10" rx="5" fill="var(--panel2)" stroke="var(--line)" strokeWidth="1" />
        <rect className="defFill" x="201" y="187" width="166" height="8" rx="4" />
      </svg>
    </div>
  );
}

export function ViewerPipelineDiagram(){
  return (
    <div className="osd osd-pipe">
      <svg viewBox="0 0 480 240" role="img" aria-label="AI viewer pipeline: the live stream's video frames and audio transcript feed a lightweight LLM that posts chat messages">
        {/* source */}
        {screen(16, 92, 96, 56, true)}
        <path className="play" d="M50,108 l0,24 l20,-12 z" />
        <text className="lbl-d" x="16" y="84">Live stream</text>

        {/* video branch */}
        <path className="wire" d="M112,108 C140,108 140,58 168,58" />
        <path className="flow" d="M112,108 C140,108 140,58 168,58" />
        {screen(168, 36, 96, 44, false)}
        <rect className="ico" x="182" y="48" width="22" height="18" rx="3" />
        <circle className="ico" cx="193" cy="57" r="4" />
        <text className="lbl" x="214" y="62">Frames</text>
        <text className="lbl-d" x="168" y="28">Video</text>

        {/* audio branch */}
        <path className="wire" d="M112,132 C140,132 140,182 168,182" />
        <path className="flow" d="M112,132 C140,132 140,182 168,182" />
        {screen(168, 160, 96, 44, false)}
        <path className="ico" d="M186,170 a5,5 0 0 1 10,0 v10 a5,5 0 0 1 -10,0 z" />
        <path className="ico" d="M182,182 a9,9 0 0 0 18,0 M191,191 v6" />
        <text className="lbl" x="206" y="186">Audio → text</text>
        <text className="lbl-d" x="168" y="152">Audio</text>

        {/* merge into LLM */}
        <path className="wire" d="M264,58 C300,58 300,120 320,120" />
        <path className="flow" d="M264,58 C300,58 300,120 320,120" />
        <path className="wire" d="M264,182 C300,182 300,120 320,120" />
        <path className="flow" d="M264,182 C300,182 300,120 320,120" />
        <g className="brainPulse">
          {screen(320, 96, 60, 48, true)}
          <circle className="brain" cx="350" cy="120" r="13" />
          <path className="brain" d="M350,107 v26 M337,120 h26 M341,111 l18,18 M359,111 l-18,18" opacity="0.6" />
        </g>
        <text className="lbl-a" x="320" y="160" style={{ fontSize: '10px' }}>LLM</text>

        {/* chat out */}
        <path className="wire" d="M380,120 h22" />
        <path className="flow" d="M380,120 h22" />
        <text className="lbl-d" x="402" y="74">AI chat</text>
        <g className="chat c1"><rect x="402" y="84" width="74" height="22" rx="6" fill="var(--panel2)" stroke="var(--line)" strokeWidth="1" /><text className="lbl" x="410" y="99" style={{ fontSize: '9px' }}>shield's low</text></g>
        <g className="chat c2"><rect x="402" y="110" width="74" height="22" rx="6" fill="var(--panel2)" stroke="var(--line)" strokeWidth="1" /><text className="lbl" x="410" y="125" style={{ fontSize: '9px' }}>he loses it</text></g>
        <g className="chat c3"><rect x="402" y="136" width="74" height="22" rx="6" fill="var(--panel2)" stroke="var(--line)" strokeWidth="1" /><text className="lbl" x="410" y="151" style={{ fontSize: '9px' }}>clip that</text></g>
      </svg>
    </div>
  );
}

export function ArchitectureDiagram(){
  const viewers = [[392,40],[392,86],[392,132],[392,178]];
  return (
    <div className="osd osd-arch">
      <svg viewBox="0 0 480 230" role="img" aria-label="Architecture: one broadcaster publishes through a LiveKit selective forwarding unit to many viewers, with a continuous recorder">
        {/* broadcaster */}
        {screen(20, 86, 96, 56, true)}
        <path className="play" d="M54,102 l0,24 l20,-12 z" />
        <text className="lbl-d" x="20" y="78">Broadcaster</text>
        <text className="lbl-d" x="20" y="160">1 live publisher</text>

        {/* link to SFU */}
        <path className="wire" d="M116,114 h60" />
        <path className="flow" d="M116,114 h60" />
        <circle className="sig s1" cx="140" cy="114" r="3" />

        {/* SFU */}
        <rect className="sfu" x="176" y="86" width="96" height="56" rx="10" />
        <text x="224" y="110" textAnchor="middle" className="lbl-a">LiveKit</text>
        <text x="224" y="126" textAnchor="middle" className="lbl-d">SFU</text>
        <text x="224" y="166" textAnchor="middle" className="lbl-d">one-to-many</text>

        {/* fan out to viewers */}
        {viewers.map((v,i)=>(
          <g key={i}>
            <path className="wire" d={`M272,114 C330,114 330,${v[1]+15} ${v[0]},${v[1]+15}`} />
            <path className="flow" d={`M272,114 C330,114 330,${v[1]+15} ${v[0]},${v[1]+15}`} />
            <circle className={"sig s"+((i%4)+1)} cx="320" cy={114+(v[1]+15-114)*0.5} r="2.6" />
            {screen(v[0], v[1], 66, 30, false)}
            <circle cx={v[0]+14} cy={v[1]+15} r="6" fill="none" stroke={i===0?"var(--acc)":"var(--dim)"} strokeWidth="1.5" />
            <text className="lbl" x={v[0]+26} y={v[1]+19} style={{ fontSize: '9px' }} fill={i===0?"var(--ink)":"var(--dim)"}>{i===0?"human":"AI"}</text>
          </g>
        ))}
        <text className="lbl-a" x="392" y="30" style={{ fontSize: '10px' }}>Viewers</text>

        {/* recorder tap */}
        <path className="wire" d="M224,142 v34 h-86" />
        <path className="flow" d="M224,142 v34 h-86" />
        <ellipse className="rec" cx="120" cy="176" rx="16" ry="6" />
        <rect x="104" y="176" width="32" height="20" fill="var(--acc)" opacity="0.5" />
        <ellipse cx="120" cy="196" rx="16" ry="6" fill="var(--acc)" opacity="0.5" />
        <text className="lbl-d" x="60" y="180" textAnchor="end">Recorder</text>
        <text className="lbl-d" x="60" y="194" textAnchor="end">+ clips</text>
      </svg>
    </div>
  );
}
