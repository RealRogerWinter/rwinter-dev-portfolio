// Price Games — mode icons, diagrams, lobby mock, interactive price-guess demo.
// Exports: window.PG_DIAG_CSS, window.MODE_ICON, window.PairingDiagram,
//   window.AgentPipelineDiagram, window.LobbyMock, window.PriceGuessDemo
const { useState: pgUseState } = React;

const PG_DIAG_CSS = `
.pgd{ width:100%; display:block; color:var(--acc); }
.pgd svg{ width:100%; height:auto; display:block; overflow:visible; }
.pgd .pnl{ fill:color-mix(in srgb,var(--acc) 9%, var(--panel2)); stroke:var(--line); stroke-width:1.4; }
.pgd .pnl-a{ fill:color-mix(in srgb,var(--acc) 18%, var(--panel2)); stroke:var(--acc); stroke-width:1.8; }
.pgd .lbl{ fill:var(--ink); font-family:var(--mono); font-size:11px; letter-spacing:.04em; }
.pgd .lbl-d{ fill:var(--dim); font-family:var(--mono); font-size:9.5px; letter-spacing:.08em; text-transform:uppercase; }
.pgd .lbl-a{ fill:var(--acc); font-family:var(--mono); font-size:10px; letter-spacing:.1em; text-transform:uppercase; }
.pgd .wire{ fill:none; stroke:var(--line); stroke-width:1.6; }
.pgd .flow{ fill:none; stroke:var(--acc); stroke-width:1.8; stroke-dasharray:3 8; opacity:.85; }
.pgd-anim .flow{ animation:pgFlow 1.1s linear infinite; }
@keyframes pgFlow{ to{ stroke-dashoffset:-22; } }
.pgd .ico{ fill:none; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
.pgd .chk{ fill:none; stroke:var(--acc); stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.pgd .sig{ fill:var(--acc); opacity:0; }
.pgd-anim .sig{ animation:pgSig 3.2s linear infinite; }
@keyframes pgSig{ 0%{ opacity:0; } 6%{ opacity:1; } 94%{ opacity:1; } 100%{ opacity:0; } }
.pgd .loop{ fill:none; stroke:var(--acc); stroke-width:1.4; stroke-dasharray:4 4; opacity:.6; }
.pgd .ahead{ fill:var(--acc); opacity:.8; }

/* mode icons */
.pg-modeicon{ width:26px; height:26px; color:var(--acc); flex:0 0 auto; }
.pg-modeicon svg{ width:100%; height:100%; fill:none; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }

/* lobby mock (html) */
.pg-lobby{ background:var(--panel); border:1px solid var(--line); border-radius:16px; overflow:hidden; }
.pg-lobby .top{ display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid var(--line);
  background:color-mix(in srgb,var(--acc) 6%, var(--panel2)); }
.pg-lobby .room{ font-family:var(--display); font-weight:600; font-size:15px; color:var(--ink); }
.pg-lobby .priv{ font-family:var(--mono); font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--acc);
  border:1px solid color-mix(in srgb,var(--acc) 45%, var(--line)); border-radius:100px; padding:4px 10px; }
.pg-lobby .players{ padding:8px 0; }
.pg-lobby .pl{ display:flex; align-items:center; gap:12px; padding:10px 18px; }
.pg-lobby .av{ width:30px; height:30px; border-radius:9px; flex:0 0 auto; display:flex; align-items:center; justify-content:center;
  font-family:var(--mono); font-size:12px; font-weight:600; color:#0a130f; background:var(--acc); }
.pg-lobby .av.bot{ background:transparent; border:1.5px dashed color-mix(in srgb,var(--acc) 55%, var(--line)); color:var(--acc); }
.pg-lobby .nm{ flex:1; font-size:14px; color:var(--ink); }
.pg-lobby .tag{ font-family:var(--mono); font-size:10px; letter-spacing:.06em; text-transform:uppercase; color:var(--dim); }
.pg-lobby .ready{ color:var(--acc); }
.pg-lobby .invite{ display:flex; align-items:center; gap:10px; margin:6px 18px 16px; padding:11px 14px; border-radius:10px;
  border:1px dashed var(--line); background:var(--panel2); }
.pg-lobby .invite .lk{ flex:1; font-family:var(--mono); font-size:12px; color:var(--dim); overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
.pg-lobby .invite .lk b{ color:var(--acc); font-weight:500; }
.pg-lobby .invite .lk b.blur{ filter:blur(4px); user-select:none; -webkit-user-select:none; pointer-events:none; }
.pg-lobby .invite .cp{ font-family:var(--mono); font-size:11px; color:var(--acc); border:1px solid color-mix(in srgb,var(--acc) 45%, var(--line));
  border-radius:7px; padding:5px 10px; }

/* price guess demo */
.pgx{ background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:24px; }
.pgx .q{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; flex-wrap:wrap; }
.pgx .q h4{ font-family:var(--display); font-weight:600; font-size:18px; color:var(--ink); margin:0; }
.pgx .streak{ font-family:var(--mono); font-size:12px; color:var(--dim); }
.pgx .streak b{ color:var(--acc); }
.pgx .pair{ display:grid; grid-template-columns:1fr auto 1fr; gap:14px; align-items:stretch; }
.pgx .vs{ align-self:center; font-family:var(--mono); font-size:12px; color:var(--dim); letter-spacing:.1em; }
.pgx .card{ text-align:left; cursor:pointer; border:1.5px solid var(--line); border-radius:14px; padding:18px; background:var(--panel2);
  transition:border-color .15s, transform .15s; font:inherit; color:inherit; }
.pgx .card:hover:not(:disabled){ border-color:var(--acc); transform:translateY(-2px); }
.pgx .card:disabled{ cursor:default; }
.pgx .card .pic{ height:74px; border-radius:9px; border:1px solid var(--line); display:flex; align-items:center; justify-content:center;
  color:var(--dim); margin-bottom:14px; background:color-mix(in srgb,var(--acc) 4%, transparent); }
.pgx .card .pic svg{ width:34px; height:34px; opacity:.7; }
.pgx .card .nm{ font-size:14px; color:var(--ink); font-weight:500; line-height:1.35; }
.pgx .card .pr{ font-family:var(--display); font-weight:700; font-size:24px; margin-top:10px; height:28px; color:var(--acc); }
.pgx .card .pr.hidden{ color:var(--dim); }
.pgx .card.win{ border-color:var(--acc); box-shadow:0 0 0 2px color-mix(in srgb,var(--acc) 30%, transparent); }
.pgx .card.lose{ border-color:color-mix(in srgb, #f2545b 60%, var(--line)); }
.pgx .foot{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:18px; min-height:40px; flex-wrap:wrap; }
.pgx .verdict{ font-family:var(--display); font-weight:600; font-size:15px; }
.pgx .verdict.ok{ color:var(--acc); } .pgx .verdict.no{ color:#f2545b; }
.pgx .hint{ font-size:13px; color:var(--dim); }
.pgx .next{ font-family:var(--body); font-weight:600; font-size:13px; color:#0a130f; background:var(--acc); border:0; border-radius:9px;
  padding:10px 18px; cursor:pointer; }
.pgx .next:hover{ filter:brightness(1.08); }
@media (max-width:520px){ .pgx .pair{ grid-template-columns:1fr; } .pgx .vs{ justify-self:center; } }
`;

// ---- mode icons (concept-matched monoline) ----
const MODE_ICON_PATHS = {
  precision: <g><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/><path d="M12 1.5V4M12 20v2.5M1.5 12H4M20 12h2.5"/></g>,
  higherlower: <g><path d="M7 4v11M7 4 4 7.5M7 4l3 3.5"/><path d="M17 20V9M17 20l3-3.5M17 20l-3-3.5"/></g>,
  comparison: <g><rect x="3" y="6" width="7" height="12" rx="1.5"/><rect x="14" y="6" width="7" height="12" rx="1.5"/><path d="M12 9v6"/></g>,
  underbid: <g><path d="M4 7h16"/><path d="M12 20v-8M12 12l-3.2 3.2M12 12l3.2 3.2"/></g>,
  pricematch: <g><circle cx="6" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="18" cy="17" r="2"/><path d="M8 7h8M8 17h8M8 8.5l8 7"/></g>,
  riser: <g><path d="M4 19 9 12l3 3 7-9"/><path d="M19 6v4h-4"/><path d="M4 21h16"/></g>,
  oddoneout: <g><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="6" cy="18" r="2.4"/><rect x="14.6" y="14.6" width="6.8" height="6.8" rx="1.4"/></g>,
  basket: <g><path d="M5 9h14l-1.4 9.5a2 2 0 0 1-2 1.5H8.4a2 2 0 0 1-2-1.5L5 9Z"/><path d="M9 9 11 4M15 9 13 4"/><path d="M10 13v3M14 13v3"/></g>,
  sort: <g><path d="M4 7h6M4 12h10M4 17h14"/><path d="M19 8V20M19 20l-2.4-2.4M19 20l2.4-2.4"/></g>,
  budget: <g><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1.4"/></g>,
  chain: <g><rect x="3.5" y="13" width="7.5" height="5.2" rx="2.6"/><rect x="13" y="6" width="7.5" height="5.2" rx="2.6"/><path d="M9.5 14.6 14.5 9.6"/></g>,
  bidding: <g><path d="M13 11 7 17a2 2 0 0 1-3-3l6-6"/><path d="M11 5l8 8M9.5 6.5l3-3M17.5 14.5l3-3"/><path d="M4 21h9"/></g>,
};
function MODE_ICON({ kind }){
  return (<span className="pg-modeicon"><svg viewBox="0 0 24 24">{MODE_ICON_PATHS[kind] || MODE_ICON_PATHS.precision}</svg></span>);
}

// ---- AI product-pairing pipeline ----
function PairingDiagram(){
  return (
    <div className="pgd pgd-pair">
      <svg viewBox="0 0 480 168" role="img" aria-label="Pairing pipeline: scrape Amazon listings, classify with AI, match similar products into a game round">
        <text className="lbl-d" x="14" y="26">Amazon listings</text>
        <rect className="pnl" x="14" y="34" width="92" height="92" rx="9" />
        <path className="ico" d="M40 58h40M40 72h40M40 86h26" transform="translate(0,0)" />
        <text x="60" y="112" textAnchor="middle" className="lbl-d">prices · titles</text>

        <path className="wire" d="M106 80h44" /><path className="flow" d="M106 80h44" />
        <rect className="pnl" x="150" y="46" width="96" height="68" rx="9" />
        <text x="198" y="76" textAnchor="middle" className="lbl">Scrape</text>
        <text x="198" y="94" textAnchor="middle" className="lbl-d">fetch listings</text>

        <path className="wire" d="M246 80h44" /><path className="flow" d="M246 80h44" />
        <rect className="pnl-a" x="290" y="40" width="96" height="80" rx="9" />
        <circle className="ico" cx="338" cy="70" r="11" stroke="var(--acc)" />
        <path d="M338 61v18M329 70h18M332 64l12 12M344 64l-12 12" stroke="var(--acc)" strokeWidth="1.4" fill="none" opacity="0.55" />
        <text x="338" y="104" textAnchor="middle" className="lbl-a">AI classify</text>

        <path className="wire" d="M386 80h40" /><path className="flow" d="M386 80h40" />
        <rect className="pnl" x="426" y="52" width="44" height="56" rx="8" />
        <rect x="434" y="62" width="28" height="16" rx="3" fill="none" stroke="var(--acc)" strokeWidth="1.4" />
        <rect x="434" y="82" width="28" height="16" rx="3" fill="none" stroke="var(--dim)" strokeWidth="1.4" />
        <text x="448" y="124" textAnchor="middle" className="lbl-d">round</text>

        <text className="lbl-d" x="290" y="138">category · price tier · similarity</text>
      </svg>
    </div>
  );
}

// ---- agent CI/CD pipeline ----
function AgentPipelineDiagram(){
  const steps = [
    { x: 8,   t: "Failing tests", d: "TDD first" },
    { x: 124, t: "Write code", d: "make it pass" },
    { x: 240, t: "Open PR", d: "agent-authored" },
    { x: 356, t: "Sub-agent review", d: "code + security" },
  ];
  const steps2 = [
    { x: 8,   t: "CI green", d: "watched via MCP" },
    { x: 124, t: "Approve + merge", d: "human gate" },
    { x: 240, t: "Deploy", d: "CircleCI" },
  ];
  const node = (s, key, active) => (
    <g key={key}>
      <rect className={active ? "pnl-a" : "pnl"} x={s.x} y="0" width="104" height="50" rx="9" />
      <text x={s.x + 52} y="22" textAnchor="middle" className="lbl">{s.t}</text>
      <text x={s.x + 52} y="38" textAnchor="middle" className="lbl-d">{s.d}</text>
    </g>
  );
  return (
    <div className="pgd pgd-agent">
      <svg viewBox="0 -32 472 232" role="img" aria-label="Agentic pipeline: write failing tests, write code, open PR, sub-agent code and security review, CI green via MCP, human approval and merge, deploy via CircleCI">
        {/* row 1 */}
        <g transform="translate(0,8)">
          {steps.map((s,i)=>node(s,'a'+i, i===3))}
          {[112,228,344].map((x,i)=>(<g key={'w'+i}><path className="wire" d={`M${x} 25h12`} /><path className="flow" d={`M${x} 25h12`} /><circle className="sig" cx={x+6} cy="25" r="2.6" style={{ animationDelay:`${i*0.25}s` }} /></g>))}
        </g>
        {/* feedback loop: sub-agent review -> write code (arcs above) */}
        <path className="loop" d="M408 8 C408 -24 176 -24 176 8" />
        <path className="ahead" d="M172 1 L180 1 L176 8 Z" />
        <rect x="232" y="-22" width="120" height="13" fill="var(--panel)" />
        <text className="lbl-d" x="292" y="-13" textAnchor="middle">implement findings</text>

        {/* main flow wraps from review down to CI green */}
        <path className="wire" d="M408 58 V88 H60 V116" /><path className="flow" d="M408 58 V88 H60 V116" />
        <circle className="sig" cx="60" cy="88" r="2.6" style={{ animationDelay:'.4s' }} />
        <path className="ahead" d="M56 109 L64 109 L60 116 Z" />

        {/* row 2 */}
        <g transform="translate(0,116)">
          {steps2.map((s,i)=>node(s,'b'+i, i===2))}
          {[112,228].map((x,i)=>(<g key={'w2'+i}><path className="wire" d={`M${x} 25h12`} /><path className="flow" d={`M${x} 25h12`} /><circle className="sig" cx={x+6} cy="25" r="2.6" style={{ animationDelay:`${(i+1)*0.3}s` }} /></g>))}
          <path className="chk" d="M280 25l4 4 7-8" transform="translate(64,-2)" />
        </g>
      </svg>
    </div>
  );
}

// ---- multiplayer lobby (HTML mock) ----
function LobbyMock(){
  return (
    <div className="pg-lobby">
      <div className="top">
        <span className="room">Friday Night Pricing</span>
        <span className="priv">Private</span>
      </div>
      <div className="players">
        <div className="pl"><span className="av">RW</span><span className="nm">Roger</span><span className="tag">host</span></div>
        <div className="pl"><span className="av">JL</span><span className="nm">Jordan</span><span className="tag ready">ready</span></div>
        <div className="pl"><span className="av">MK</span><span className="nm">Mika</span><span className="tag ready">ready</span></div>
        <div className="pl"><span className="av bot">AI</span><span className="nm">Pricey-bot</span><span className="tag">bot · easy</span></div>
      </div>
      <div className="invite">
        <span className="lk">price.games/mp/<b className="blur">FNP-4821</b></span>
        <span className="cp">Copy link</span>
      </div>
    </div>
  );
}

// ---- interactive price-guess demo (Comparison taste) ----
const PG_PAIRS = [
  { a: { n: "Wireless earbuds", p: 79, ic: "earbuds" }, b: { n: "Mechanical keyboard", p: 119, ic: "keyboard" } },
  { a: { n: "Cast iron skillet", p: 35, ic: "skillet" }, b: { n: "Air fryer", p: 99, ic: "airfryer" } },
  { a: { n: "Trail running shoes", p: 128, ic: "shoes" }, b: { n: "Yoga mat", p: 42, ic: "yogamat" } },
  { a: { n: "Burr coffee grinder", p: 54, ic: "grinder" }, b: { n: "Electric kettle", p: 38, ic: "kettle" } },
  { a: { n: "LED desk lamp", p: 46, ic: "lamp" }, b: { n: "Ergonomic office chair", p: 169, ic: "chair" } },
  { a: { n: "Bluetooth speaker", p: 64, ic: "speaker" }, b: { n: "Instant film camera", p: 89, ic: "camera" } },
];
const PG_ICONS = {
  earbuds: <g><path d="M8.5 5A2.5 2.5 0 0 1 11 7.5V14a2 2 0 0 1-4 0V9"/><path d="M15.5 5A2.5 2.5 0 0 0 13 7.5V14a2 2 0 0 0 4 0V9"/></g>,
  keyboard: <g><rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8.5 14h7"/></g>,
  skillet: <g><circle cx="10" cy="13" r="6"/><path d="M16 11.5h6"/></g>,
  airfryer: <g><rect x="5" y="3.5" width="14" height="17" rx="3"/><path d="M9 8h6M9 11.5h6"/><circle cx="12" cy="16.5" r="1.6"/></g>,
  shoes: <g><path d="M3 16.5h13l4.5-1.8c.9 0 1.5.7 1.5 1.6v1.2H3z"/><path d="M3 16.5v-3.2l4-2 2 1.8 3-1"/></g>,
  yogamat: <g><rect x="3" y="8" width="15" height="8" rx="2.5"/><circle cx="18.5" cy="12" r="3.2"/></g>,
  grinder: <g><path d="M8.5 3.5h7v4.5h-7z"/><path d="M9 8l-1 7.5a2 2 0 0 0 2 2.2h4a2 2 0 0 0 2-2.2L15 8"/><circle cx="12" cy="12" r="1.5"/></g>,
  kettle: <g><path d="M5.5 9h10.5l1 7.5a2 2 0 0 1-2 2.2H6.5a2 2 0 0 1-2-2.2z"/><path d="M16 11h3l-2.2-3"/><path d="M9 6h4"/></g>,
  lamp: <g><path d="M4 20.5h8M8 20.5v-6.5"/><path d="M8.2 14l-3-5 6.2-3 3 5z"/></g>,
  chair: <g><path d="M8 4h6v6H8z"/><path d="M11 10v4M6 14h10M11 14v3.5M7 20.5l4-3 4 3"/></g>,
  speaker: <g><rect x="6" y="3" width="12" height="18" rx="2.5"/><circle cx="12" cy="14.5" r="3"/><circle cx="12" cy="7" r="1.1"/></g>,
  camera: <g><rect x="3" y="6.5" width="18" height="12.5" rx="2.5"/><circle cx="12" cy="12.8" r="3.4"/><path d="M7 6.5 8 4.5h3"/></g>,
};
function PgIcon({ kind }){
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{PG_ICONS[kind] || PG_ICONS.keyboard}</svg>);
}

function PriceGuessDemo(){
  const [i, setI] = pgUseState(0);
  const [picked, setPicked] = pgUseState(null);
  const [streak, setStreak] = pgUseState(0);
  const pair = PG_PAIRS[i % PG_PAIRS.length];
  const correct = pair.a.p > pair.b.p ? "a" : "b";
  const done = picked !== null;
  const won = done && picked === correct;

  const pick = (k)=>{
    if (done) return;
    setPicked(k);
    setStreak((s)=> (k === correct ? s + 1 : 0));
  };
  const next = ()=>{ setPicked(null); setI((x)=> (x + 1) % PG_PAIRS.length); };

  const cardCls = (k)=>{
    if (!done) return "card";
    if (k === correct) return "card win";
    if (k === picked) return "card lose";
    return "card";
  };
  const Card = ({ k, item }) => (
    <button className={cardCls(k)} disabled={done} onClick={()=>pick(k)}>
      <div className="pic">{PG_ICONS ? <PgIcon kind={item.ic} /> : null}</div>
      <div className="nm">{item.n}</div>
      <div className={"pr" + (done ? "" : " hidden")}>{done ? "$" + item.p : "$ ??"}</div>
    </button>
  );

  return (
    <div className="pgx">
      <div className="q">
        <h4>Which one costs more?</h4>
        <span className="streak">Streak <b>{streak}</b></span>
      </div>
      <div className="pair">
        <Card k="a" item={pair.a} />
        <span className="vs">VS</span>
        <Card k="b" item={pair.b} />
      </div>
      <div className="foot">
        {!done ? (
          <span className="hint">A taste of Comparison mode. Pick the pricier product.</span>
        ) : (
          <span className={"verdict " + (won ? "ok" : "no")}>{won ? "Nailed it." : "Not quite."}</span>
        )}
        {done && <button className="next" onClick={next}>Next round →</button>}
      </div>
    </div>
  );
}

Object.assign(window, { PG_DIAG_CSS, MODE_ICON, PairingDiagram, AgentPipelineDiagram, LobbyMock, PriceGuessDemo });
