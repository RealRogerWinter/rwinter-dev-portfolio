// sheet-llm — conceptual flow diagrams (no code/flag names). Theme-aware.
// Exports: window.SL_FLOW_CSS, window.OrchestratorFlow, window.ProviderAgnostic, window.ScoreSpine

const SL_FLOW_CSS = `
.slf{ width:100%; display:block; color:var(--acc); }
.slf svg{ width:100%; height:auto; display:block; overflow:visible; }
.slf .pnl{ fill:color-mix(in srgb,var(--acc) 9%, var(--panel2)); stroke:var(--line); stroke-width:1.4; }
.slf .pnl-a{ fill:color-mix(in srgb,var(--acc) 18%, var(--panel2)); stroke:var(--acc); stroke-width:1.8; }
.slf .core{ fill:color-mix(in srgb,var(--acc) 20%, var(--panel2)); stroke:var(--acc); stroke-width:2; }
.slf .lbl{ fill:var(--ink); font-family:var(--mono); font-size:11px; letter-spacing:.03em; }
.slf .lbl-d{ fill:var(--dim); font-family:var(--mono); font-size:9px; letter-spacing:.06em; text-transform:uppercase; }
.slf .lbl-a{ fill:var(--acc); font-family:var(--mono); font-size:9.5px; letter-spacing:.08em; text-transform:uppercase; }
.slf .wire{ fill:none; stroke:var(--line); stroke-width:1.6; }
.slf .flow{ fill:none; stroke:var(--acc); stroke-width:1.8; stroke-dasharray:3 8; opacity:.85; }
.slf-anim .flow{ animation:slFlow 1.1s linear infinite; }
@keyframes slFlow{ to{ stroke-dashoffset:-22; } }
.slf .sig{ fill:var(--acc); opacity:0; }
.slf-anim .sig{ animation:slSig 3s linear infinite; }
@keyframes slSig{ 0%{ opacity:0; } 6%{ opacity:1; } 92%{ opacity:1; } 100%{ opacity:0; } }
.slf .chk{ fill:none; stroke:var(--acc); stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
.slf .ahead{ fill:var(--acc); opacity:.7; }
.slf .disk{ fill:var(--acc); }
.slf-anim .disk{ animation:slPulse 1.8s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
@keyframes slPulse{ 0%,100%{ opacity:.5; } 50%{ opacity:1; } }
@media (prefers-reduced-motion: reduce){ .slf *{ animation:none !important; } }
`;

function OrchestratorFlow(){
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

function ProviderAgnostic(){
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

function ScoreSpine(){
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

function ModelRouter(){
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

Object.assign(window, { SL_FLOW_CSS, OrchestratorFlow, ModelRouter, ProviderAgnostic, ScoreSpine });
