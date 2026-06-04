// sheet-llm — interactive additive-edit demo, staff renderer, 5-step workflow.
// Exports: window.SL_DIAG_CSS, window.SheetStaff, window.AdditiveEditDemo, window.WorkflowSteps
const { useState: slUseState, useEffect: slUseEffect } = React;

const SL_DIAG_CSS = `
.sl{ --amber:#f5b54b; }
/* staff */
.sl-staff{ width:100%; display:block; color:var(--acc); }
.sl-staff svg{ width:100%; height:auto; display:block; overflow:visible; }
.sl-staff .ln{ stroke:currentColor; stroke-width:1; opacity:.28; }
.sl-staff .bar{ stroke:currentColor; stroke-width:1; opacity:.32; }
.sl-staff .clef{ fill:currentColor; opacity:.92; }
.sl-staff .nt{ fill:currentColor; }
.sl-staff .stem{ stroke:currentColor; stroke-width:1.5; }
.sl-staff .bnum{ fill:var(--dim); font-family:var(--mono); font-size:9px; }
.sl-staff .amberbg{ fill:color-mix(in srgb, var(--amber) 13%, transparent); stroke:color-mix(in srgb,var(--amber) 45%, transparent); stroke-width:1; stroke-dasharray:4 4; }
.sl-staff .amber .nt{ fill:var(--amber); }
.sl-staff .amber .stem{ stroke:var(--amber); }
.sl-staff .keeptag{ fill:var(--acc); font-family:var(--mono); font-size:9px; letter-spacing:.08em; }
.sl-staff .ambertag{ fill:var(--amber); font-family:var(--mono); font-size:9px; letter-spacing:.08em; }
.sl-staff.anim .ng{ opacity:0; animation:slNote .4s ease forwards; }
.sl-staff .ng{ opacity:1; }
@keyframes slNote{ from{ opacity:0; transform:translateY(5px); } to{ opacity:1; transform:translateY(0); } }

/* interactive demo shell */
.sl-demo{ background:var(--panel); border:1px solid var(--line); border-radius:18px; overflow:hidden; }
.sl-demo .stage{ padding:26px 26px 10px; background:radial-gradient(120% 120% at 50% 0%, color-mix(in srgb,var(--acc) 7%, var(--panel)), var(--panel)); }
.sl-demo .console{ border-top:1px solid var(--line); padding:18px 22px 20px; background:var(--panel2); }
.sl-prompt{ display:flex; align-items:center; gap:12px; background:var(--bg); border:1px solid var(--line); border-radius:11px; padding:11px 14px; }
.sl-prompt . chev,.sl-prompt .pc{ color:var(--acc); font-family:var(--mono); font-size:14px; }
.sl-prompt .txt{ flex:1; font-family:var(--mono); font-size:13.5px; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sl-prompt .cur{ display:inline-block; width:7px; height:15px; background:var(--acc); vertical-align:-2px; animation:slBlink 1.1s steps(1) infinite; }
@keyframes slBlink{ 50%{ opacity:0; } }
.sl-btn{ font-family:var(--body); font-weight:600; font-size:13px; border:0; border-radius:9px; padding:10px 16px; cursor:pointer; white-space:nowrap; transition:filter .15s, border-color .15s; }
.sl-btn.go{ background:var(--acc); color:#0a130f; }
.sl-btn.go:hover{ filter:brightness(1.08); }
.sl-btn.amber{ background:var(--amber); color:#2a1c00; }
.sl-btn.ghost{ background:transparent; border:1px solid var(--line); color:var(--ink); }
.sl-btn.ghost:hover{ border-color:var(--acc); }
.sl-row{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.sl-status{ font-size:13px; color:var(--dim); flex:1; min-width:140px; }
.sl-status b{ color:var(--ink); font-weight:600; }
.sl-status .ok{ color:var(--acc); }
.sl-banner{ display:flex; align-items:center; gap:9px; font-family:var(--mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase;
  color:var(--amber); margin-bottom:12px; }
.sl-banner i{ width:8px; height:8px; border-radius:2px; background:var(--amber); box-shadow:0 0 9px var(--amber); }
.sl-kbd{ font-family:var(--mono); font-size:10px; color:var(--dim); border:1px solid var(--line); border-radius:5px; padding:2px 6px; }

/* workflow */
.sl-flow{ display:grid; grid-template-columns:repeat(5,1fr); gap:0; margin-top:24px; border:1px solid var(--line); border-radius:16px; overflow:hidden; }
@media (max-width:780px){ .sl-flow{ grid-template-columns:1fr; } }
.sl-step{ padding:22px 20px; border-right:1px solid var(--line); position:relative; background:var(--panel); }
.sl-step:last-child{ border-right:0; }
@media (max-width:780px){ .sl-step{ border-right:0; border-bottom:1px solid var(--line); } .sl-step:last-child{ border-bottom:0; } }
.sl-step .n{ font-family:var(--mono); font-size:11px; color:var(--acc); letter-spacing:.1em; }
.sl-step .ic{ width:30px; height:30px; color:var(--acc); margin:12px 0 12px; }
.sl-step .ic svg{ width:100%; height:100%; fill:none; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
.sl-step h4{ font-family:var(--display); font-weight:600; font-size:15.5px; color:var(--ink); margin:0 0 7px; }
.sl-step p{ margin:0; font-size:12.5px; line-height:1.55; color:color-mix(in oklab,var(--ink) 74%, var(--dim)); }
.sl-step .kv{ font-family:var(--mono); font-size:10px; color:var(--dim); margin-top:9px; }
.sl-step .kv b{ color:var(--acc); font-weight:500; }
`;

// ---- staff renderer ----
const SL_CLEF = "\u{1D11E}";
function noteY(p){ return 96 - p * 6; }
function SheetStaff({ bars, amberFrom, animate, showTags }){
  const startX = 60, endX = 760, n = 8;
  const barW = (endX - startX) / n;
  const lines = [36, 48, 60, 72, 84];
  let gi = 0;
  return (
    <div className={"sl-staff" + (animate ? " anim" : "")}>
      <svg viewBox="0 0 768 124" preserveAspectRatio="xMidYMid meet" role="img" aria-label="A musical staff of eight bars; an AI edit recolors only the final four bars in amber while the first four stay unchanged">
        {typeof amberFrom === "number" && (
          <rect className="amberbg" x={startX + amberFrom * barW} y="22" width={(n - amberFrom) * barW} height="72" rx="6" />
        )}
        {lines.map((y,i)=>(<line className="ln" key={"l"+i} x1="8" y1={y} x2={endX} y2={y} />))}
        <text className="clef" x="14" y="86" fontFamily="'Noto Music', serif" fontSize="74">{SL_CLEF}</text>
        {/* barlines */}
        {Array.from({length:n+1}).map((_,i)=>(<line className="bar" key={"b"+i} x1={startX + i*barW} y1="36" x2={startX + i*barW} y2="84" />))}
        {/* bar numbers */}
        {Array.from({length:n}).map((_,i)=>(<text className="bnum" key={"n"+i} x={startX + i*barW + 4} y="106">{i+1}</text>))}
        {/* notes */}
        {bars && bars.map((bar, bi)=>{
          const amber = typeof amberFrom === "number" && bi >= amberFrom;
          const bx = startX + bi*barW;
          return (
            <g className={amber ? "amber" : ""} key={"bar"+bi}>
              {bar.map((p, ni)=>{
                const x = bx + barW * (0.26 + ni*0.27);
                const y = noteY(p);
                const delay = (gi++ * 0.05);
                return (
                  <g className="ng" key={ni} style={animate ? { animationDelay: delay + "s" } : null}>
                    <line className="stem" x1={x+5} y1={y-1} x2={x+5} y2={y-24} />
                    <ellipse className="nt" cx={x} cy={y} rx="5.2" ry="4" transform={`rotate(-18 ${x} ${y})`} />
                  </g>
                );
              })}
            </g>
          );
        })}
        {showTags && typeof amberFrom === "number" && (
          <g>
            <text className="keeptag" x={startX + 4} y="20">bars 1–{amberFrom} unchanged</text>
            <text className="ambertag" x={startX + amberFrom*barW + 4} y="20">AI edit · bars {amberFrom+1}–{n}</text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ---- interactive additive-edit demo ----
const SL_ORIG = [[3,5,7],[8,7,5],[4,6,8],[7,5,3],[5,7,9],[8,6,4],[6,8,10],[9,7,5]];
const SL_NEW = [[2,4,3],[5,3,2],[4,6,5],[3,1,0]]; // replacement for bars 5-8

function AdditiveEditDemo(){
  const [phase, setPhase] = slUseState("idle"); // idle | composed | preview | accepted
  const bars = (()=>{
    if (phase === "idle") return null;
    if (phase === "preview") return SL_ORIG.slice(0,4).concat(SL_NEW);
    if (phase === "accepted") return SL_ORIG.slice(0,4).concat(SL_NEW);
    return SL_ORIG;
  })();
  const amberFrom = phase === "preview" ? 4 : null;

  slUseEffect(()=>{
    const onKey = (e)=>{
      if (e.key === "Enter"){ if (phase === "idle") setPhase("composed"); else if (phase === "preview") setPhase("accepted"); }
      if (e.key === "Escape" && phase === "preview") setPhase("composed");
    };
    // only listen when the demo is the focused context — keep it light: attach always but guard phase
    return ()=>{};
  }, [phase]);

  return (
    <div className="sl-demo">
      <div className="stage">
        <SheetStaff bars={bars} amberFrom={amberFrom} animate={phase==="composed"} showTags={phase==="preview"} />
      </div>
      <div className="console">
        {phase === "idle" && (
          <div className="sl-row">
            <div className="sl-prompt"><span className="pc">›</span><span className="txt">a short waltz in A minor</span><span className="cur"></span></div>
            <button className="sl-btn go" onClick={()=>setPhase("composed")}>Compose ↵</button>
          </div>
        )}
        {phase === "composed" && (
          <React.Fragment>
            <div className="sl-row" style={{ marginBottom: "12px" }}>
              <div className="sl-prompt"><span className="pc">›</span><span className="txt">rewrite bars 5–8</span><span className="cur"></span></div>
              <button className="sl-btn go" onClick={()=>setPhase("preview")}>Send edit ↵</button>
            </div>
            <p className="sl-status">Eight bars composed. Now ask for a change, and watch what the edit touches.</p>
          </React.Fragment>
        )}
        {phase === "preview" && (
          <React.Fragment>
            <div className="sl-banner"><i></i> AI edit staged · review before it lands</div>
            <div className="sl-row">
              <p className="sl-status">Only bars 5–8 are rewritten. <b>Bars 1–4 stay exactly as they were.</b></p>
              <button className="sl-btn amber" onClick={()=>setPhase("accepted")}>Keep <span className="sl-kbd">↵</span></button>
              <button className="sl-btn ghost" onClick={()=>setPhase("composed")}>Discard <span className="sl-kbd">esc</span></button>
            </div>
          </React.Fragment>
        )}
        {phase === "accepted" && (
          <div className="sl-row">
            <p className="sl-status"><span className="ok">Kept.</span> The new bars 5–8 are in. Bars 1–4 never changed, and nothing was rewritten without asking.</p>
            <button className="sl-btn ghost" onClick={()=>setPhase("idle")}>Reset</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- 5-step workflow ----
const SL_STEPS = [
  { n: "01", t: "Describe", d: "Type a request like \u201ca short waltz in A minor\u201d and press Enter.", kv: "prompt bar", ic: <g><path d="M4 6h16M4 12h10M4 18h7"/></g> },
  { n: "02", t: "Refine in chat", d: "Ask for changes: \u201cadd 4 bars\u201d, \u201cmake bar 2 staccato.\u201d Bars the request never mentions stay put.", kv: "additive edits", ic: <g><path d="M8 10h8M8 14h5"/><path d="M3 5h18v12H7l-4 4z"/></g> },
  { n: "03", t: "Review AI edits", d: "Changes preview in amber. Press Enter to keep them or Esc to discard.", kv: "accept / reject", ic: <g><path d="M4 12l5 5L20 6"/></g> },
  { n: "04", t: "Edit by hand", d: "Click any note and use the floating menu, arrow keys, or command palette.", kv: "direct edit", ic: <g><path d="m4 20 4-1L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z"/></g> },
  { n: "05", t: "Play and export", d: "Press Space to play. Export to MIDI, PDF, and MusicXML.", kv: "MIDI · PDF · MusicXML", ic: <g><path d="M8 5v14l11-7z"/></g> },
];
function WorkflowSteps(){
  return (
    <div className="sl-flow">
      {SL_STEPS.map((s)=>(
        <div className="sl-step" key={s.n}>
          <div className="n">{s.n}</div>
          <div className="ic"><svg viewBox="0 0 24 24">{s.ic}</svg></div>
          <h4>{s.t}</h4>
          <p>{s.d}</p>
          <div className="kv"><b>{s.kv}</b></div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { SL_DIAG_CSS, SheetStaff, AdditiveEditDemo, WorkflowSteps });
