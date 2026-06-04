// Price Games diagrams + interactive demo — ESM port of the window-global
// site/portfolio/pg-diagrams.jsx, co-located in one module so the page's islands
// share a single bundle chunk.
//
// Only PriceGuessDemo carries state (the page's one client:visible island; its
// initial render i=0/picked=null/streak=0 is deterministic). PairingDiagram,
// AgentPipelineDiagram and LobbyMock are pure — the Astro page renders them with
// no client directive (static HTML, zero JS). Bodies reproduced verbatim from the
// original (CSS extracted to src/styles/price-games.css; the `.pgd-anim` gate is
// rekeyed there to the pre-painted [data-anim] attribute). The original's
// MODE_ICON export is omitted: it is unused (the page's mode grid uses images).
import React, { useState } from 'react';
const pgUseState = useState;

// ---- AI product-pairing pipeline ----
export function PairingDiagram(){
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
export function AgentPipelineDiagram(){
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
export function LobbyMock(){
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

export function PriceGuessDemo(){
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
