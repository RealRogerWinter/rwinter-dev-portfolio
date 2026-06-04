// sheet-llm diagram + demo components — ESM port of the window-global trio
// site/portfolio/sl-diagrams.jsx + sl-flows.jsx + sl-chat.jsx. Co-located in one
// module so the project page's React islands share a single bundle chunk.
//
// Of these, only AdditiveEditDemo and ChatDemo carry state (they are the page's
// `client:visible` islands). The flow diagrams, WorkflowSteps, SheetStaff and
// DemoStaff are pure functions of their props — the Astro page renders them with
// no client directive, so they ship as static HTML with zero JS. Component
// bodies are reproduced verbatim from the originals (CSS extracted to
// src/styles/sheet-llm.css; the `.slf-anim` gate is bridged to the pre-painted
// [data-anim] attribute there).
import React, { useState, useEffect } from 'react';
const slUseState = useState, slUseEffect = useEffect, chatUseState = useState;

// ---- staff renderer ----
const SL_CLEF = "\u{1D11E}";
function noteY(p){ return 96 - p * 6; }
export function SheetStaff({ bars, amberFrom, animate, showTags }){
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

export function AdditiveEditDemo(){
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
  { n: "01", t: "Describe", d: "Type a request like “a short waltz in A minor” and press Enter.", kv: "prompt bar", ic: <g><path d="M4 6h16M4 12h10M4 18h7"/></g> },
  { n: "02", t: "Refine in chat", d: "Ask for changes: “add 4 bars”, “make bar 2 staccato.” Bars the request never mentions stay put.", kv: "additive edits", ic: <g><path d="M8 10h8M8 14h5"/><path d="M3 5h18v12H7l-4 4z"/></g> },
  { n: "03", t: "Review AI edits", d: "Changes preview in amber. Press Enter to keep them or Esc to discard.", kv: "accept / reject", ic: <g><path d="M4 12l5 5L20 6"/></g> },
  { n: "04", t: "Edit by hand", d: "Click any note and use the floating menu, arrow keys, or command palette.", kv: "direct edit", ic: <g><path d="m4 20 4-1L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z"/></g> },
  { n: "05", t: "Play and export", d: "Press Space to play. Export to MIDI, PDF, and MusicXML.", kv: "MIDI · PDF · MusicXML", ic: <g><path d="M8 5v14l11-7z"/></g> },
];
export function WorkflowSteps(){
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

// ---- conceptual flow diagrams (pure SVG) ----
export function OrchestratorFlow(){
  const W = 149, H = 56, R1 = 26, R2 = 128;
  const xs = [14, 185, 356];
  const nodes = [
    { x: xs[0], y: R1, t: "Prompt", d: "+ current score" },
    { x: xs[1], y: R1, t: "Safety filter", d: "copyright check" },
    { x: xs[2], y: R1, t: "Reason", d: "pick the edit" },
    { x: xs[0], y: R2, t: "Safety gates", d: "preserve · confirm", hot: true },
    { x: xs[1], y: R2, t: "Ghost preview", d: "accept · reject" },
    { x: xs[2], y: R2, t: "Saved turn", d: "versioned", end: true },
  ];
  const arrow = (x, y, dir) => dir === "down"
    ? <path className="ahead" d={`M${x-4} ${y-5} L${x+4} ${y-5} L${x} ${y} Z`} />
    : <path className="ahead" d={`M${x-5} ${y-4} L${x-5} ${y+4} L${x} ${y} Z`} />;
  return (
    <div className="slf slf-orch">
      <svg viewBox="0 0 519 210" role="img" aria-label="Orchestrator pipeline: a prompt and the current score pass a safety filter, the model reasons and picks an edit, two safety gates verify preservation and confirm rewrites, then the change is staged as a ghost preview and saved as a versioned turn">
        {/* row 1 connectors */}
        <g>
          <path className="wire" d={`M${xs[0]+W} ${R1+H/2}H${xs[1]}`} /><path className="flow" d={`M${xs[0]+W} ${R1+H/2}H${xs[1]}`} />
          <path className="wire" d={`M${xs[1]+W} ${R1+H/2}H${xs[2]}`} /><path className="flow" d={`M${xs[1]+W} ${R1+H/2}H${xs[2]}`} />
          {arrow(xs[1], R1+H/2, "right")}{arrow(xs[2], R1+H/2, "right")}
          <circle className="sig" cx={(xs[0]+W+xs[1])/2} cy={R1+H/2} r="2.6" />
          <circle className="sig" cx={(xs[1]+W+xs[2])/2} cy={R1+H/2} r="2.6" style={{ animationDelay:'.2s' }} />
        </g>
        {/* wrap connector row1 -> row2 */}
        <path className="wire" d={`M${xs[2]+W/2} ${R1+H}V${(R1+H+R2)/2}H${xs[0]+W/2}V${R2}`} />
        <path className="flow" d={`M${xs[2]+W/2} ${R1+H}V${(R1+H+R2)/2}H${xs[0]+W/2}V${R2}`} />
        {arrow(xs[0]+W/2, R2, "down")}
        {/* row 2 connectors */}
        <g>
          <path className="wire" d={`M${xs[0]+W} ${R2+H/2}H${xs[1]}`} /><path className="flow" d={`M${xs[0]+W} ${R2+H/2}H${xs[1]}`} />
          <path className="wire" d={`M${xs[1]+W} ${R2+H/2}H${xs[2]}`} /><path className="flow" d={`M${xs[1]+W} ${R2+H/2}H${xs[2]}`} />
          {arrow(xs[1], R2+H/2, "right")}{arrow(xs[2], R2+H/2, "right")}
          <circle className="sig" cx={(xs[0]+W+xs[1])/2} cy={R2+H/2} r="2.6" style={{ animationDelay:'.4s' }} />
          <circle className="sig" cx={(xs[1]+W+xs[2])/2} cy={R2+H/2} r="2.6" style={{ animationDelay:'.6s' }} />
        </g>
        {/* nodes */}
        {nodes.map((nd,i)=>(
          <g key={i}>
            <rect className={nd.hot ? "pnl-a" : "pnl"} x={nd.x} y={nd.y} width={W} height={H} rx="10" />
            {nd.end && <circle className="disk" cx={nd.x+18} cy={nd.y+H/2} r="5" />}
            <text x={nd.x + W/2 + (nd.end?8:0)} y={nd.y+24} textAnchor="middle" className="lbl">{nd.t}</text>
            <text x={nd.x + W/2 + (nd.end?8:0)} y={nd.y+40} textAnchor="middle" className="lbl-d">{nd.d}</text>
            {nd.hot && <path className="chk" d={`M${nd.x+W-30} ${nd.y+20}l3 3 6-7`} />}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function ProviderAgnostic(){
  return (
    <div className="slf slf-prov">
      <svg viewBox="0 0 440 210" role="img" aria-label="sheet-llm runs locally and open source, with a swappable model provider: a local model, your own API key, or a cloud model">
        {/* spokes */}
        <path className="wire" d="M140 39 C175 39 190 80 200 100" /><path className="flow" d="M140 39 C175 39 190 80 200 100" />
        <path className="wire" d="M300 39 C265 39 250 80 240 100" /><path className="flow" d="M300 39 C265 39 250 80 240 100" />
        <path className="wire" d="M220 156 L220 130" /><path className="flow" d="M220 156 L220 130" />
        <circle className="sig" cx="172" cy="62" r="2.6" />
        <circle className="sig" cx="268" cy="62" r="2.6" style={{ animationDelay:'.4s' }} />
        <circle className="sig" cx="220" cy="144" r="2.6" style={{ animationDelay:'.8s' }} />

        {/* provider chips */}
        <rect className="pnl" x="14" y="18" width="126" height="42" rx="9" />
        <text x="77" y="38" textAnchor="middle" className="lbl">Local model</text>
        <text x="77" y="52" textAnchor="middle" className="lbl-d">on your machine</text>

        <rect className="pnl" x="300" y="18" width="126" height="42" rx="9" />
        <text x="363" y="38" textAnchor="middle" className="lbl">Your API key</text>
        <text x="363" y="52" textAnchor="middle" className="lbl-d">any provider</text>

        <rect className="pnl" x="147" y="156" width="146" height="42" rx="9" />
        <text x="220" y="176" textAnchor="middle" className="lbl">Cloud model</text>
        <text x="220" y="190" textAnchor="middle" className="lbl-d">hosted API</text>

        {/* core */}
        <rect className="core" x="158" y="84" width="124" height="46" rx="11" />
        <text x="220" y="104" textAnchor="middle" className="lbl" style={{ fontSize:'12px' }}>sheet-llm</text>
        <text x="220" y="120" textAnchor="middle" className="lbl-a">open source</text>
      </svg>
    </div>
  );
}

export function ScoreSpine(){
  const outs = [
    { y: 14,  t: "Staff notation", d: "rendered via abcjs" },
    { y: 62,  t: "Playback", d: "transport + synth" },
    { y: 110, t: "Export", d: "MusicXML · MIDI · PDF" },
    { y: 158, t: "Versioned checkpoints", d: "every turn saved" },
  ];
  return (
    <div className="slf slf-spine">
      <svg viewBox="0 0 480 210" role="img" aria-label="The JSON Score is the source of truth; staff notation, playback, export, and versioned checkpoints are all derived from it">
        {/* score spine */}
        <rect className="core" x="16" y="74" width="130" height="58" rx="12" />
        <text x="81" y="98" textAnchor="middle" className="lbl" style={{ fontSize:'12px' }}>JSON Score</text>
        <text x="81" y="114" textAnchor="middle" className="lbl-a">source of truth</text>
        <text x="81" y="150" textAnchor="middle" className="lbl-d">ABC is derived</text>

        {outs.map((o,i)=>(
          <g key={i}>
            <path className="wire" d={`M146 103 C240 103 230 ${o.y+18} 300 ${o.y+18}`} />
            <path className="flow" d={`M146 103 C240 103 230 ${o.y+18} 300 ${o.y+18}`} />
            <circle className="sig" cx="250" cy={(103 + o.y+18)/2} r="2.6" style={{ animationDelay:`${i*0.25}s` }} />
            <rect className="pnl" x="300" y={o.y} width="170" height="38" rx="9" />
            <text x="314" y={o.y+18} className="lbl">{o.t}</text>
            <text x="314" y={o.y+31} className="lbl-d">{o.d}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function ModelRouter(){
  const inB = { x: 8, y: 86, w: 96, h: 44 };
  const clf = { x: 142, y: 78, w: 108, h: 60 };
  const outs = [
    { y: 12,  t: "Fast model", d: "small, cheap", cond: "simple edit" },
    { y: 86,  t: "Capable model", d: "compose, rewrite", cond: "complex edit", hot: true },
    { y: 160, t: "Conversational", d: "answers in words", cond: "a question" },
  ];
  const ox = 322, ow = 190, oh = 46;
  return (
    <div className="slf slf-router">
      <svg viewBox="0 0 520 218" role="img" aria-label="The orchestrator classifies each request and routes it to a different model by complexity: simple edits to a fast model, complex edits to a capable model, and questions to a conversational model">
        <rect className="pnl" x={inB.x} y={inB.y} width={inB.w} height={inB.h} rx="9" />
        <text x={inB.x+inB.w/2} y={inB.y+22} textAnchor="middle" className="lbl">Request</text>
        <text x={inB.x+inB.w/2} y={inB.y+36} textAnchor="middle" className="lbl-d">+ score</text>

        <path className="wire" d={`M${inB.x+inB.w} ${inB.y+inB.h/2}H${clf.x}`} /><path className="flow" d={`M${inB.x+inB.w} ${inB.y+inB.h/2}H${clf.x}`} />
        <rect className="core" x={clf.x} y={clf.y} width={clf.w} height={clf.h} rx="11" />
        <text x={clf.x+clf.w/2} y={clf.y+27} textAnchor="middle" className="lbl" style={{ fontSize:'12px' }}>Classify</text>
        <text x={clf.x+clf.w/2} y={clf.y+43} textAnchor="middle" className="lbl-a">by complexity</text>

        {outs.map((o,i)=>{
          const cy = o.y + oh/2;
          return (
            <g key={i}>
              <path className="wire" d={`M${clf.x+clf.w} ${clf.y+clf.h/2} C${ox-46} ${clf.y+clf.h/2} ${ox-46} ${cy} ${ox} ${cy}`} />
              <path className="flow" d={`M${clf.x+clf.w} ${clf.y+clf.h/2} C${ox-46} ${clf.y+clf.h/2} ${ox-46} ${cy} ${ox} ${cy}`} />
              <circle className="sig" cx={ox-46} cy={cy} r="2.6" style={{ animationDelay:`${i*0.3}s` }} />
              <path className="ahead" d={`M${ox-6} ${cy-4} L${ox-6} ${cy+4} L${ox} ${cy} Z`} />
              <text x={ox-52} y={cy-7} textAnchor="middle" className="lbl-d">{o.cond}</text>
              <rect className={o.hot ? "pnl-a" : "pnl"} x={ox} y={o.y} width={ow} height={oh} rx="10" />
              <text x={ox+16} y={o.y+20} className="lbl">{o.t}</text>
              <text x={ox+16} y={o.y+34} className="lbl-d">{o.d}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---- conversational / educational chat demo ----
// pitch index -> y on a 5-line staff (higher index = higher note = smaller y)
function DemoStaff({ notes, labels }){
  const x0 = 60, step = 38, top = 14;
  const W = x0 + notes.length * step + 20;
  const Y = (p)=> 82 - p * 5;
  return (
    <div className="slc-ds">
      <svg viewBox={`0 0 ${W} 112`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="A short staff demonstration">
        {[44,54,64,74,84].map((y,i)=>(<line className="ln" key={i} x1="6" y1={y} x2={W-6} y2={y} />))}
        <text className="clef" x="10" y="89" fontFamily="'Noto Music', serif" fontSize="48">{"\u{1D11E}"}</text>
        {notes.map((p,i)=>{
          const x = x0 + i*step;
          const y = Y(p);
          return (
            <g key={i}>
              <line className="stem" x1={x+5} y1={y-1} x2={x+5} y2={y-26} />
              <ellipse className="nt" cx={x} cy={y} rx="5.4" ry="4.1" transform={`rotate(-18 ${x} ${y})`} />
              {labels && labels[i] && <text className="lab" x={x} y="106" textAnchor="middle">{labels[i]}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const SLC_QA = [
  {
    q: "Show me the A natural minor scale.",
    a: "A natural minor is all white keys from A: A, B, C, D, E, F, G, A. Here it is climbing the staff.",
    notes: [0,1,2,3,4,5,6,7],
    labels: ["A","B","C","D","E","F","G","A"],
    cap: "A natural minor, ascending",
  },
  {
    q: "Explain a ii–V–I in this key.",
    a: "In A minor that's Bm7♭5 → E7 → Am. The ii is half-diminished, the V borrows a G♯ to pull the ear home, and the I lands on A minor. The roots walk B, E, A.",
    notes: [1,4,0],
    labels: ["ii","V","i"],
    cap: "ii–V–i roots in A minor",
  },
  {
    q: "Why does bar 2 feel unresolved?",
    a: "It settles on E, the fifth, instead of the tonic A. The ear expects that E to step down to A before the phrase feels finished.",
  },
];

export function ChatDemo(){
  const [thread, setThread] = chatUseState([
    { role: "user", text: "What can you tell me about this piece?" },
    { role: "bot", text: "It's a short waltz in A minor, eight bars, in 3/4. Ask about the key, the chords, or any music-theory idea and I'll explain it against the score, or show it on the staff." },
  ]);
  const [asked, setAsked] = chatUseState([]);

  const ask = (i)=>{
    const qa = SLC_QA[i];
    setAsked((a)=> a.includes(i) ? a : [...a, i]);
    setThread((t)=> [...t,
      { role: "user", text: qa.q },
      { role: "bot", text: qa.a, notes: qa.notes, labels: qa.labels, cap: qa.cap },
    ]);
  };

  return (
    <div className="slc">
      <div className="slc-head"><i></i><b>chat · the score is in context</b><span>natural language</span></div>
      <div className="slc-thread">
        {thread.map((m,i)=>(
          <div className={"slc-msg " + (m.role === "user" ? "user" : "bot")} key={i}>
            {m.role === "bot" && <div className="who">sheet-llm</div>}
            <div className="b">
              {m.text}
              {m.notes && (
                <div className="slc-demo">
                  <DemoStaff notes={m.notes} labels={m.labels} />
                  {m.cap && <div className="cap">{m.cap}</div>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="slc-foot">
        <div className="lab">Ask about the score</div>
        <div className="slc-chips">
          {SLC_QA.map((qa,i)=>(
            <button className="slc-chip" key={i} onClick={()=>ask(i)} disabled={asked.includes(i)}>{qa.q}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
