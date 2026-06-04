// Multilingual SEO Tool diagrams + demo — ESM port of the window-global pair
// site/portfolio/seo-viz.jsx + seo-demo.jsx, co-located in one module so the
// page's islands share a single bundle chunk.
//
// Only SeoRunDemo carries state (the page's one client:visible island). The four
// viz components (IntentVariants, PipelineDiagram, HybridLLM, LocaleFanout) are
// pure functions — the Astro page renders them with no client directive, so they
// ship as static HTML with zero JS. Bodies reproduced verbatim from the originals
// (CSS extracted to src/styles/multilingual-seo.css; the `.sev-anim` gate is
// rekeyed there to the pre-painted [data-anim] attribute).
import React, { useState, useRef } from 'react';
const seoUseState = useState, seoUseRef = useRef;

// ---- intent-preserving variant search ----
export function IntentVariants(){
  const rows = [
    { k: "rennende Schuhe", g: "“running shoes,” word for word", vol: 0, mark: "no", note: "literal — nobody types it", strike: true },
    { k: "Schuhe zum Joggen", g: "shoes for jogging", vol: 1300, mark: "mid", note: "related, thin demand" },
    { k: "Laufschuhe", g: "what German shoppers actually search", vol: 18100, mark: "yes", note: "intent-preserving", win: true },
  ];
  const max = 18100;
  const mk = { no: "✕", mid: "~", yes: "✓" };
  return (
    <div className="iv">
      <div className="iv-head"><span className="loc">de</span><span className="src">source: <b>best running shoes</b> · candidate variants</span></div>
      <div className="iv-body">
        {rows.map((r,i)=>(
          <div className={"iv-row" + (r.win ? " win" : "")} key={i}>
            <div className="iv-kw">
              <span className={"mk " + r.mark}>{mk[r.mark]}</span>
              <div className="t">
                <div className="k">{r.strike ? <s>{r.k}</s> : r.k}{r.win && <span className="iv-tag">picked</span>}</div>
                <div className="g">{r.g} · {r.note}</div>
              </div>
            </div>
            <div className="iv-vol">
              <div className="track"><i style={{ width: `${Math.max(2,(r.vol/max)*100)}%`, background: r.win ? "var(--acc)" : "var(--dim)" }}></i></div>
              <span className="n">{r.vol.toLocaleString()}/mo</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- 6-stage pipeline ----
const SEO_STAGES = [
  { t: "URL", d: "a page", hot: false },
  { t: "fetch", d: "httpx · selectolax" },
  { t: "extract", d: "Groq Llama 4 Scout", hot: true },
  { t: "translate", d: "Claude Sonnet 4.6", hot: true },
  { t: "volume", d: "DataForSEO" },
  { t: "score", d: "pure Python" },
  { t: "stream", d: "Next.js SSE" },
];
export function PipelineDiagram(){
  const W = 92, H = 46, gap = 14, x0 = 4, y = 14;
  const X = (i)=> x0 + i*(W+gap);
  return (
    <div className="sev sev-pipe">
      <svg viewBox={`0 0 ${x0*2 + SEO_STAGES.length*(W+gap) - gap} 104`} role="img" aria-label="Pipeline: a URL is fetched, keywords extracted with Groq, translated with Claude, search volume checked via DataForSEO, scored, and streamed to the UI over server-sent events">
        {SEO_STAGES.map((s,i)=>(
          <g key={i}>
            {i>0 && (<g>
              <path className="wire" d={`M${X(i-1)+W} ${y+H/2}H${X(i)}`} /><path className="flow" d={`M${X(i-1)+W} ${y+H/2}H${X(i)}`} />
              <path className="ahead" d={`M${X(i)-6} ${y+H/2-4} L${X(i)-6} ${y+H/2+4} L${X(i)} ${y+H/2} Z`} />
              <circle className="sig" cx={X(i-1)+W+gap/2} cy={y+H/2} r="2.4" style={{ animationDelay:`${i*0.18}s` }} />
            </g>)}
            <rect className={s.hot ? "pnl-a" : "pnl"} x={X(i)} y={y} width={W} height={H} rx="9" />
            <text x={X(i)+W/2} y={y+H/2+4} textAnchor="middle" className="lbl">{s.t}</text>
            <text x={X(i)+W/2} y={y+H+16} textAnchor="middle" className="lbl-d">{s.d}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ---- hybrid LLM split ----
export function HybridLLM(){
  return (
    <div className="sev sev-hybrid">
      <svg viewBox="0 0 520 188" role="img" aria-label="Hybrid model split: page text goes to Groq Llama 4 Scout for fast keyword extraction, then keywords go to Claude Sonnet 4.6 for translation with prompt caching">
        {/* wires */}
        <path className="wire" d="M118 96h36" /><path className="flow" d="M118 96h36" />
        <path className="wire" d="M308 96h34" /><path className="flow" d="M308 96h34" />
        <path className="ahead" d="M148 92 L148 100 L154 96 Z" />
        <path className="ahead" d="M336 92 L336 100 L342 96 Z" />
        <circle className="sig" cx="136" cy="96" r="2.6" />
        <circle className="sig" cx="325" cy="96" r="2.6" style={{ animationDelay:'.5s' }} />

        <rect className="pnl" x="8" y="74" width="110" height="44" rx="9" />
        <text x="63" y="92" textAnchor="middle" className="lbl">Page text</text>
        <text x="63" y="106" textAnchor="middle" className="lbl-d">fetched HTML</text>

        <rect className="pnl-a" x="154" y="62" width="154" height="68" rx="11" />
        <text x="231" y="88" textAnchor="middle" className="lbl">Groq · Llama 4 Scout</text>
        <text x="231" y="104" textAnchor="middle" className="lbl-d">extract keywords</text>
        <text x="231" y="150" textAnchor="middle" className="lbl-a">fast · cheap</text>

        <rect className="pnl-a" x="342" y="62" width="170" height="68" rx="11" />
        <text x="427" y="88" textAnchor="middle" className="lbl">Claude · Sonnet 4.6</text>
        <text x="427" y="104" textAnchor="middle" className="lbl-d">translate per locale</text>
        <text x="427" y="150" textAnchor="middle" className="lbl-a">strong · prompt-cached</text>

        <text x="136" y="48" textAnchor="middle" className="lbl-d">keywords →</text>
        <text x="325" y="48" textAnchor="middle" className="lbl-d">variants →</text>
      </svg>
    </div>
  );
}

// ---- locale fan-out ----
const SEO_LOCALES = ["es", "fr", "de", "it", "pt"];
export function LocaleFanout(){
  const cx = 70, cy = 110, n = SEO_LOCALES.length;
  const rx = 360, y0 = 18, rowH = 38;
  return (
    <div className="sev sev-fan">
      <svg viewBox="0 0 480 220" role="img" aria-label="Locale fan-out: one source page fans into multiple target locales, each resolved with a single batched DataForSEO call">
        <rect className="pnl-a" x="8" y={cy-26} width="116" height="52" rx="10" />
        <text x="66" y={cy-4} textAnchor="middle" className="lbl">Source page</text>
        <text x="66" y={cy+12} textAnchor="middle" className="lbl-d">extracted keywords</text>
        {SEO_LOCALES.map((loc,i)=>{
          const y = y0 + i*rowH + 14;
          return (
            <g key={loc}>
              <path className="wire" d={`M124 ${cy} C200 ${cy} 200 ${y} 250 ${y}`} />
              <path className="flow" d={`M124 ${cy} C200 ${cy} 200 ${y} 250 ${y}`} />
              <circle className="sig" cx="200" cy={(cy+y)/2} r="2.4" style={{ animationDelay:`${i*0.2}s` }} />
              <rect className="pnl" x="250" y={y-14} width="58" height="28" rx="7" />
              <text x="279" y={y+4} textAnchor="middle" className="lbl-s" style={{ textTransform:'uppercase' }}>{loc}</text>
              <text x="320" y={y+4} className="lbl-d">1 batched DataForSEO call · $0.01</text>
            </g>
          );
        })}
        <text x="66" y={cy+44} textAnchor="middle" className="lbl-a">one source</text>
      </svg>
    </div>
  );
}

// ---- interactive "run the pipeline" demo ----
const SEO_DATA = {
  de: { kw: "beste Laufschuhe", vol: 18100, score: 92 },
  es: { kw: "mejores zapatillas para correr", vol: 27400, score: 95 },
  fr: { kw: "meilleures chaussures de running", vol: 12300, score: 84 },
  it: { kw: "scarpe da corsa", vol: 6800, score: 79 },
  pt: { kw: "melhores tênis de corrida", vol: 14800, score: 88 },
};
const SEO_ALL = ["de", "es", "fr", "it", "pt"];
const SEO_STAGE_NAMES = ["fetch", "extract", "translate", "volume", "score"];

export function SeoRunDemo(){
  const [picked, setPicked] = seoUseState(["de", "es", "fr", "it"]);
  const [phase, setPhase] = seoUseState("idle"); // idle | running | done
  const [stage, setStage] = seoUseState(-1);
  const timers = seoUseRef([]);

  const toggle = (loc)=>{
    if (phase === "running") return;
    setPicked((p)=> p.includes(loc) ? p.filter(x=>x!==loc) : [...p, loc]);
  };
  const clearTimers = ()=>{ timers.current.forEach(clearTimeout); timers.current = []; };
  const run = ()=>{
    if (!picked.length) return;
    clearTimers();
    setPhase("running"); setStage(0);
    SEO_STAGE_NAMES.forEach((_,i)=>{
      timers.current.push(setTimeout(()=> setStage(i+1), (i+1)*560));
    });
    timers.current.push(setTimeout(()=>{ setPhase("done"); setStage(SEO_STAGE_NAMES.length); }, SEO_STAGE_NAMES.length*560 + 200));
  };

  const ranked = picked.map(loc=>({ loc, ...SEO_DATA[loc] })).sort((a,b)=> b.score - a.score);
  const maxVol = Math.max(...SEO_ALL.map(l=>SEO_DATA[l].vol));

  return (
    <div className="seo-demo">
      <div className="bar">
        <div className="urlbox"><span className="g">https://</span>blog.example.com/best-running-shoes</div>
        <button className="run" onClick={run} disabled={phase==="running" || !picked.length}>
          {phase==="running" ? "Running…" : phase==="done" ? "Run again" : "Run pipeline ↵"}
        </button>
      </div>
      <div className="locales">
        <span className="lab">Target locales</span>
        {SEO_ALL.map(loc=>(
          <button key={loc} className={"seo-chip" + (picked.includes(loc) ? " on" : "")} onClick={()=>toggle(loc)}>{loc.toUpperCase()}</button>
        ))}
      </div>
      {phase !== "idle" && (
        <div className="seo-stages">
          {SEO_STAGE_NAMES.map((nm,i)=>(
            <div key={nm} className={"seo-stage" + (stage>i ? " done" : stage===i ? " active" : "")}>
              <i></i><span>{nm}</span>
            </div>
          ))}
        </div>
      )}
      <div className="seo-results">
        {phase === "idle" && <p className="empty">Pick a few locales and run the pipeline. It extracts the page's keywords, translates them, checks real search volume, and ranks what's worth translating.</p>}
        {phase === "running" && <p className="empty">Streaming results over SSE…</p>}
        {phase === "done" && (
          <React.Fragment>
            <div className="rh"><span className="src">source keyword: <b>best running shoes</b></span><span className="src">{ranked.length} locales · ranked by score</span></div>
            {ranked.map((r,i)=>(
              <div className={"seo-res" + (i===0 ? " top" : "")} key={r.loc} style={{ animationDelay:`${i*0.08}s` }}>
                <div className="loc">{r.loc}</div>
                <div className="mid">
                  <div className="kw">{r.kw}</div>
                  <div className="vol">
                    <div className="track"><i style={{ width:`${(r.vol/maxVol)*100}%` }}></i></div>
                    <span className="vn">{r.vol.toLocaleString()}/mo</span>
                  </div>
                </div>
                <div className="score">
                  <div className="n">{r.score}</div>
                  <div className="l">score</div>
                  {i===0 && <span className="tag">translate first</span>}
                </div>
              </div>
            ))}
            <p className="seo-note">Illustrative data — real runs pull live volume from DataForSEO.</p>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
