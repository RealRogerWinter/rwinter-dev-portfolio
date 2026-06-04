// Bespoke diagrams for the OneStreamer page. Theme-aware (currentColor + tokens).
// Exports: window.OS_DIAG_CSS, window.TakeoverDiagram, window.ViewerPipelineDiagram, window.ArchitectureDiagram

const OS_DIAG_CSS = `
.osd{ width:100%; display:block; color:var(--acc); }
.osd svg{ width:100%; height:auto; display:block; overflow:visible; }
.osd .pnl{ fill:color-mix(in srgb,var(--acc) 9%, var(--panel2)); stroke:var(--line); stroke-width:1.4; }
.osd .pnl-live{ fill:color-mix(in srgb,var(--acc) 18%, var(--panel2)); stroke:var(--acc); stroke-width:1.8; }
.osd .lbl{ fill:var(--ink); font-family:var(--mono); font-size:11px; letter-spacing:.06em; }
.osd .lbl-d{ fill:var(--dim); font-family:var(--mono); font-size:10px; letter-spacing:.1em; text-transform:uppercase; }
.osd .lbl-a{ fill:var(--acc); font-family:var(--mono); font-size:10px; letter-spacing:.12em; text-transform:uppercase; }
.osd .wire{ fill:none; stroke:var(--line); stroke-width:1.6; }
.osd .flow{ fill:none; stroke:var(--acc); stroke-width:1.8; stroke-dasharray:3 8; opacity:.85; }
.osd .play{ fill:var(--acc); }
.osd .ico{ fill:none; stroke:currentColor; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }

/* takeover */
.osd-take .liveDot{ fill:var(--acc); }
.osd-take .nameA{ opacity:1; } .osd-take .nameB{ opacity:0; }
.osd-take .defFill{ fill:var(--acc); transform-box:fill-box; transform-origin:left center; }
.osd-take .zap{ stroke:var(--acc); stroke-width:2.2; fill:none; opacity:0; stroke-linecap:round; stroke-linejoin:round; }
.osd-take .takeover{ opacity:0; }
.osd-take .interrupt{ opacity:.5; }
.osd-take .incoming{ opacity:0; }

.osd-anim .osd-take .defFill{ animation:osDef 9s ease-in-out infinite; }
@keyframes osDef{ 0%,8%{ transform:scaleX(1); } 46%{ transform:scaleX(.06); } 60%{ transform:scaleX(.06); } 78%,100%{ transform:scaleX(1); } }
.osd-anim .osd-take .nameA{ animation:osFadeA 9s steps(1) infinite; }
.osd-anim .osd-take .nameB{ animation:osFadeB 9s steps(1) infinite; }
@keyframes osFadeA{ 0%,52%{ opacity:1; } 54%,100%{ opacity:0; } }
@keyframes osFadeB{ 0%,52%{ opacity:0; } 54%,100%{ opacity:1; } }
.osd-anim .osd-take .z1{ animation:osZap 9s ease-out infinite; }
.osd-anim .osd-take .z2{ animation:osZap 9s ease-out infinite .5s; }
.osd-anim .osd-take .z3{ animation:osZap 9s ease-out infinite 1s; }
@keyframes osZap{ 0%,14%{ opacity:0; transform:translateX(-8px); } 18%{ opacity:1; transform:translateX(0); } 30%{ opacity:0; transform:translateX(6px); } 100%{ opacity:0; } }
.osd-anim .osd-take .takeover{ animation:osTake 9s ease-out infinite; }
@keyframes osTake{ 0%,48%{ opacity:0; transform:scale(.8); } 53%{ opacity:1; transform:scale(1); } 64%{ opacity:1; } 70%,100%{ opacity:0; } }
.osd-anim .osd-take .interrupt{ animation:osPulse 9s ease-in-out infinite; }
@keyframes osPulse{ 0%,40%{ opacity:.85; } 50%,100%{ opacity:.2; } }
.osd-anim .osd-take .incoming{ animation:osIncoming 9s ease-in-out infinite; }
@keyframes osIncoming{ 0%,40%{ opacity:0; transform:translate(0,0); } 46%{ opacity:1; } 54%{ opacity:1; transform:translate(118px,-44px); } 60%{ opacity:0; transform:translate(118px,-44px); } 100%{ opacity:0; } }

/* pipeline */
.osd-anim .osd-pipe .flow{ animation:osFlow 1.1s linear infinite; }
@keyframes osFlow{ to{ stroke-dashoffset:-22; } }
.osd-pipe .chat{ opacity:0; transform-box:fill-box; transform-origin:left center; }
.osd-anim .osd-pipe .c1{ animation:osChat 4.5s ease-out infinite .4s; }
.osd-anim .osd-pipe .c2{ animation:osChat 4.5s ease-out infinite 1.4s; }
.osd-anim .osd-pipe .c3{ animation:osChat 4.5s ease-out infinite 2.4s; }
@keyframes osChat{ 0%{ opacity:0; transform:translateY(6px) scale(.96); } 12%{ opacity:1; transform:translateY(0) scale(1); } 80%{ opacity:1; } 100%{ opacity:.15; } }
.osd-pipe .brain{ fill:none; stroke:var(--acc); stroke-width:1.8; }
.osd-anim .osd-pipe .brainPulse{ animation:osBrain 2.2s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
@keyframes osBrain{ 0%,100%{ opacity:.35; } 50%{ opacity:1; } }

/* architecture */
.osd-anim .osd-arch .flow{ animation:osFlow 1.1s linear infinite; }
.osd-arch .sfu{ fill:color-mix(in srgb,var(--acc) 16%, var(--panel2)); stroke:var(--acc); stroke-width:1.8; }
.osd-arch .sig{ fill:var(--acc); opacity:0; }
.osd-anim .osd-arch .s1{ animation:osSig 2.4s linear infinite; }
.osd-anim .osd-arch .s2{ animation:osSig 2.4s linear infinite .3s; }
.osd-anim .osd-arch .s3{ animation:osSig 2.4s linear infinite .6s; }
.osd-anim .osd-arch .s4{ animation:osSig 2.4s linear infinite .9s; }
@keyframes osSig{ 0%{ opacity:0; } 10%{ opacity:1; } 90%{ opacity:1; } 100%{ opacity:0; } }
.osd-arch .rec{ fill:var(--acc); }
.osd-anim .osd-arch .rec{ animation:osBrain 1.6s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }

@media (prefers-reduced-motion: reduce){ .osd *{ animation:none !important; } }
`;

function screen(x, y, w, h, live){
  return <rect className={live ? "pnl-live" : "pnl"} x={x} y={y} width={w} height={h} rx="8" />;
}

function TakeoverDiagram(){
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

function ViewerPipelineDiagram(){
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

function ArchitectureDiagram(){
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

Object.assign(window, { OS_DIAG_CSS, TakeoverDiagram, ViewerPipelineDiagram, ArchitectureDiagram });
