// Multilingual SEO Tool — pipeline + hybrid-LLM + locale fan-out diagrams.
// Exports: window.SEO_VIZ_CSS, PipelineDiagram, HybridLLM, LocaleFanout
const SEO_VIZ_CSS = `
.sev{ width:100%; display:block; color:var(--acc); }
.sev svg{ width:100%; height:auto; display:block; overflow:visible; }
.sev .pnl{ fill:color-mix(in srgb,var(--acc) 9%, var(--panel2)); stroke:var(--line); stroke-width:1.4; }
.sev .pnl-a{ fill:color-mix(in srgb,var(--acc) 18%, var(--panel2)); stroke:var(--acc); stroke-width:1.7; }
.sev .lbl{ fill:var(--ink); font-family:var(--mono); font-size:11px; letter-spacing:.02em; }
.sev .lbl-s{ fill:var(--ink); font-family:var(--mono); font-size:10px; }
.sev .lbl-d{ fill:var(--dim); font-family:var(--mono); font-size:8.5px; letter-spacing:.04em; }
.sev .lbl-a{ fill:var(--acc); font-family:var(--mono); font-size:9px; letter-spacing:.06em; }
.sev .wire{ fill:none; stroke:var(--line); stroke-width:1.6; }
.sev .flow{ fill:none; stroke:var(--acc); stroke-width:1.8; stroke-dasharray:3 8; opacity:.85; }
.sev-anim .flow{ animation:sevFlow 1.1s linear infinite; }
@keyframes sevFlow{ to{ stroke-dashoffset:-22; } }
.sev .sig{ fill:var(--acc); opacity:0; }
.sev-anim .sig{ animation:sevSig 3s linear infinite; }
@keyframes sevSig{ 0%{opacity:0;} 7%{opacity:1;} 92%{opacity:1;} 100%{opacity:0;} }
.sev .ahead{ fill:var(--acc); opacity:.75; }
@media (prefers-reduced-motion: reduce){ .sev *{ animation:none !important; } }

/* intent variants (html) */
.iv{ border:1px solid var(--line); border-radius:16px; overflow:hidden; background:var(--panel); }
.iv-head{ display:flex; align-items:center; gap:10px; padding:14px 18px; border-bottom:1px solid var(--line); background:var(--panel2); }
.iv-head .loc{ font-family:var(--mono); font-size:11px; font-weight:600; color:#0a130f; background:var(--acc); border-radius:6px; padding:5px 8px; text-transform:uppercase; }
.iv-head .src{ font-family:var(--mono); font-size:12px; color:var(--dim); }
.iv-head .src b{ color:var(--ink); }
.iv-body{ padding:8px 18px 16px; }
.iv-row{ display:grid; grid-template-columns:1fr auto; gap:8px 16px; align-items:center; padding:14px 0; border-top:1px solid var(--line); }
.iv-row:first-child{ border-top:0; }
.iv-row.win{ position:relative; }
.iv-kw{ display:flex; align-items:center; gap:10px; min-width:0; }
.iv-kw .t{ min-width:0; }
.iv-kw .mk{ width:20px; height:20px; border-radius:50%; flex:0 0 auto; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; }
.iv-kw .mk.no{ background:color-mix(in srgb,#f2545b 18%, transparent); color:#f2545b; }
.iv-kw .mk.mid{ background:color-mix(in srgb,var(--dim) 22%, transparent); color:var(--dim); }
.iv-kw .mk.yes{ background:var(--acc); color:#0a130f; }
.iv-kw .t .k{ font-size:14.5px; color:var(--ink); font-weight:500; }
.iv-kw .t .k s{ color:var(--dim); text-decoration-color:color-mix(in srgb,#f2545b 70%, transparent); }
.iv-kw .t .g{ font-size:12px; color:var(--dim); margin-top:2px; }
.iv-vol{ text-align:right; min-width:104px; }
.iv-vol .track{ height:7px; border-radius:4px; background:var(--bg); border:1px solid var(--line); overflow:hidden; }
.iv-vol .track i{ display:block; height:100%; border-radius:4px; }
.iv-vol .n{ font-family:var(--mono); font-size:11px; color:var(--dim); margin-top:6px; display:block; }
.iv-row.win .iv-kw .t .k{ color:var(--acc); }
.iv-tag{ font-family:var(--mono); font-size:9.5px; letter-spacing:.06em; text-transform:uppercase; color:#0a130f; background:var(--acc); border-radius:5px; padding:2px 7px; margin-left:8px; }
`;

// ---- intent-preserving variant search ----
function IntentVariants(){
  const rows = [
    { k: "rennende Schuhe", g: "\u201crunning shoes,\u201d word for word", vol: 0, mark: "no", note: "literal — nobody types it", strike: true },
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
function PipelineDiagram(){
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
function HybridLLM(){
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
function LocaleFanout(){
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

Object.assign(window, { SEO_VIZ_CSS, PipelineDiagram, HybridLLM, LocaleFanout, IntentVariants });
