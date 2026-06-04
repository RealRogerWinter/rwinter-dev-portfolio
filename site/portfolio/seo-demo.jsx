// Multilingual SEO Tool — interactive "run the pipeline" demo.
// Exports: window.SEO_DEMO_CSS, window.SeoRunDemo
const { useState: seoUseState, useRef: seoUseRef } = React;

const SEO_DEMO_CSS = `
.seo-demo{ background:var(--panel); border:1px solid var(--line); border-radius:18px; overflow:hidden; }
.seo-demo .bar{ display:flex; align-items:center; gap:10px; padding:16px 18px; border-bottom:1px solid var(--line); background:var(--panel2); flex-wrap:wrap; }
.seo-demo .urlbox{ flex:1; min-width:220px; display:flex; align-items:center; gap:9px; background:var(--bg); border:1px solid var(--line); border-radius:10px; padding:10px 13px; font-family:var(--mono); font-size:13px; color:var(--ink); }
.seo-demo .urlbox .g{ color:var(--dim); }
.seo-demo .run{ font-family:var(--body); font-weight:600; font-size:13px; color:#0a130f; background:var(--acc); border:0; border-radius:10px; padding:11px 18px; cursor:pointer; white-space:nowrap; transition:filter .15s; }
.seo-demo .run:hover:not(:disabled){ filter:brightness(1.08); }
.seo-demo .run:disabled{ opacity:.6; cursor:default; }
.seo-demo .locales{ display:flex; gap:7px; padding:12px 18px; border-bottom:1px solid var(--line); flex-wrap:wrap; align-items:center; }
.seo-demo .locales .lab{ font-family:var(--mono); font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); margin-right:4px; }
.seo-chip{ font-family:var(--mono); font-size:12px; color:var(--dim); border:1px solid var(--line); border-radius:8px; padding:6px 11px; cursor:pointer; transition:.14s; background:transparent; }
.seo-chip.on{ color:#0a130f; background:var(--acc); border-color:var(--acc); font-weight:600; }
.seo-chip:hover:not(.on){ color:var(--ink); border-color:var(--acc-dim); }

.seo-stages{ display:flex; gap:0; padding:16px 18px; border-bottom:1px solid var(--line); }
.seo-stage{ flex:1; display:flex; flex-direction:column; align-items:center; gap:7px; position:relative; }
.seo-stage::after{ content:''; position:absolute; top:9px; left:50%; width:100%; height:2px; background:var(--line); z-index:0; }
.seo-stage:last-child::after{ display:none; }
.seo-stage i{ width:18px; height:18px; border-radius:50%; border:2px solid var(--line); background:var(--panel); z-index:1; transition:.2s; }
.seo-stage.done i{ border-color:var(--acc); background:var(--acc); }
.seo-stage.active i{ border-color:var(--acc); box-shadow:0 0 0 4px color-mix(in srgb,var(--acc) 22%, transparent); animation:seoPulse 1s ease-in-out infinite; }
@keyframes seoPulse{ 0%,100%{ box-shadow:0 0 0 4px color-mix(in srgb,var(--acc) 22%, transparent); } 50%{ box-shadow:0 0 0 7px color-mix(in srgb,var(--acc) 8%, transparent); } }
.seo-stage span{ font-family:var(--mono); font-size:10px; color:var(--dim); }
.seo-stage.done span, .seo-stage.active span{ color:var(--ink); }

.seo-results{ padding:18px; }
.seo-results .rh{ display:flex; align-items:baseline; justify-content:space-between; gap:12px; margin-bottom:14px; }
.seo-results .rh .src{ font-family:var(--mono); font-size:12px; color:var(--dim); }
.seo-results .rh .src b{ color:var(--acc); }
.seo-results .empty{ font-size:13px; color:var(--dim); padding:18px 2px; }
.seo-res{ display:grid; grid-template-columns:auto 1fr auto; gap:16px; align-items:center; padding:13px 14px; border:1px solid var(--line); border-radius:12px; margin-bottom:9px; background:var(--panel2); animation:seoIn .35s ease both; }
.seo-res.top{ border-color:var(--acc); }
@keyframes seoIn{ from{ transform:translateY(6px); } to{ transform:none; } }
.seo-res .loc{ font-family:var(--mono); font-size:11px; font-weight:600; color:#0a130f; background:var(--acc); border-radius:6px; padding:5px 8px; text-transform:uppercase; }
.seo-res .mid .kw{ font-size:14px; color:var(--ink); font-weight:500; }
.seo-res .mid .vol{ display:flex; align-items:center; gap:9px; margin-top:7px; }
.seo-res .mid .track{ flex:1; max-width:240px; height:7px; border-radius:4px; background:var(--bg); overflow:hidden; border:1px solid var(--line); }
.seo-res .mid .track i{ display:block; height:100%; background:var(--acc); border-radius:4px; transform-origin:left; animation:seoBar .6s ease both; }
@keyframes seoBar{ from{ transform:scaleX(0); } }
.seo-res .mid .vn{ font-family:var(--mono); font-size:11px; color:var(--dim); white-space:nowrap; }
.seo-res .score{ text-align:right; }
.seo-res .score .n{ font-family:var(--display); font-weight:700; font-size:22px; color:var(--acc); line-height:1; }
.seo-res .score .l{ font-family:var(--mono); font-size:9px; color:var(--dim); text-transform:uppercase; letter-spacing:.08em; margin-top:3px; }
.seo-res .score .tag{ font-family:var(--mono); font-size:9px; color:#0a130f; background:var(--acc); border-radius:5px; padding:2px 6px; margin-top:6px; display:inline-block; }
.seo-note{ font-family:var(--mono); font-size:11px; color:var(--dim); margin-top:6px; }
@media (max-width:560px){ .seo-res{ grid-template-columns:auto 1fr; } .seo-res .score{ grid-column:2; text-align:left; } }
`;

const SEO_DATA = {
  de: { kw: "beste Laufschuhe", vol: 18100, score: 92 },
  es: { kw: "mejores zapatillas para correr", vol: 27400, score: 95 },
  fr: { kw: "meilleures chaussures de running", vol: 12300, score: 84 },
  it: { kw: "scarpe da corsa", vol: 6800, score: 79 },
  pt: { kw: "melhores tênis de corrida", vol: 14800, score: 88 },
};
const SEO_ALL = ["de", "es", "fr", "it", "pt"];
const SEO_STAGE_NAMES = ["fetch", "extract", "translate", "volume", "score"];

function SeoRunDemo(){
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

Object.assign(window, { SEO_DEMO_CSS, SeoRunDemo });
