// Pricey — interactive 8-sector mood wheel + verbatim mood lines.
// Exports: window.PR_MOOD_CSS, window.MoodWheel, window.MoodLines
const { useState: prUseState } = React;

// cyclic order around the wheel (clockwise from top) — matches Pricey's on-stream wheel
const PR_MOODS = [
  { k: "focused",    c: "oklch(0.70 0.14 250)", val: "in a groove", line: "Correct. Next.",                             play: "Sampler ×0.70 — greedy and tight." },
  { k: "confident",  c: "oklch(0.76 0.12 202)", val: "+ sure",      line: "Told you. I told you all.",                  play: "Trusts its read, samples tighter." },
  { k: "happy",      c: "oklch(0.79 0.16 150)", val: "+ up",        line: null,                                        play: "Warm and steady." },
  { k: "elated",     c: "oklch(0.86 0.16 110)", val: "++ peak",     line: "YES! YES! I am uncontainable!",              play: "Loose and quick." },
  { k: "neutral",    c: "oklch(0.77 0.13 66)",  val: "baseline",    line: null,                                        play: "Plays its plain read." },
  { k: "despondent", c: "oklch(0.62 0.20 25)",  val: "−− low",      line: "I peaked. The peak was twenty minutes ago.", play: "Sampler ×1.30, +ε to break the rut." },
  { k: "tilted",     c: "oklch(0.63 0.21 352)", val: "−− off",      line: "WHO. WHO IS BUYING THESE.",                  play: "Gambles wider." },
  { k: "frustrated", c: "oklch(0.58 0.17 300)", val: "− down",      line: "I quit. I'm not quitting. But I want to.",   play: "Pacing drags." },
];

const PR_MOOD_CSS = `
.pr-wheelwrap{ display:grid; grid-template-columns:1fr 1fr; gap:clamp(24px,4vw,44px); align-items:center; }
@media (max-width:760px){ .pr-wheelwrap{ grid-template-columns:1fr; gap:26px; } }
.pr-wheel svg{ width:100%; height:auto; max-width:340px; margin:0 auto; display:block; overflow:visible; }
.pr-wheel .sec{ cursor:pointer; transition:opacity .18s; }
.pr-wheel .ctr-k{ fill:var(--ink); font-family:var(--display); font-weight:700; }
.pr-wheel .ctr-v{ fill:var(--dim); font-family:var(--mono); font-size:10px; letter-spacing:.1em; text-transform:uppercase; }
.pr-detail .dk{ display:flex; align-items:center; gap:11px; margin-bottom:14px; }
.pr-detail .dk i{ width:14px; height:14px; border-radius:4px; }
.pr-detail .dk b{ font-family:var(--display); font-weight:700; font-size:24px; color:var(--ink); text-transform:capitalize; }
.pr-detail .dk span{ font-family:var(--mono); font-size:11px; color:var(--dim); letter-spacing:.08em; }
.pr-detail .quote{ font-family:var(--display); font-weight:500; font-size:clamp(18px,2.2vw,24px); line-height:1.34; color:var(--ink); margin:0 0 16px; min-height:1.4em; }
.pr-detail .quote.none{ color:var(--dim); font-style:italic; font-weight:400; font-size:16px; }
.pr-detail .play{ display:flex; gap:10px; align-items:flex-start; font-size:14px; line-height:1.55; color:color-mix(in oklab,var(--ink) 80%, var(--dim)); }
.pr-detail .play .pl{ font-family:var(--mono); font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:var(--acc); border:1px solid var(--line); border-radius:6px; padding:3px 8px; white-space:nowrap; margin-top:2px; }
.pr-hint{ font-family:var(--mono); font-size:11px; color:var(--dim); margin-top:18px; letter-spacing:.04em; }

/* verbatim line cards */
.pr-lines{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:24px; }
@media (max-width:780px){ .pr-lines{ grid-template-columns:1fr 1fr; } }
@media (max-width:520px){ .pr-lines{ grid-template-columns:1fr; } }
.pr-linecard{ border:1px solid var(--line); border-left-width:3px; border-radius:12px; padding:18px 18px; background:var(--panel); }
.pr-linecard .m{ font-family:var(--mono); font-size:10px; letter-spacing:.12em; text-transform:uppercase; margin-bottom:10px; }
.pr-linecard q{ font-family:var(--display); font-weight:500; font-size:17px; line-height:1.36; color:var(--ink); quotes:none; }
`;

function arcPath(cx, cy, ri, ro, a0, a1){
  const p = (r,a)=>[cx + r*Math.cos(a), cy + r*Math.sin(a)];
  const large = (a1 - a0) > Math.PI ? 1 : 0;
  const [x0,y0] = p(ro,a0), [x1,y1] = p(ro,a1), [x2,y2] = p(ri,a1), [x3,y3] = p(ri,a0);
  return `M${x0} ${y0} A${ro} ${ro} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${ri} ${ri} 0 ${large} 0 ${x3} ${y3} Z`;
}

function MoodWheel(){
  const [active, setActive] = prUseState(0); // focused
  const n = PR_MOODS.length;
  const cx = 120, cy = 120, ro = 112, ri = 70;
  const gap = 0.045;
  const m = PR_MOODS[active];
  return (
    <div className="pr-wheelwrap">
      <div className="pr-wheel">
        <svg viewBox="0 0 240 240" role="img" aria-label="Pricey's mood wheel: eight moods arranged as a cycle">
          {PR_MOODS.map((mo,i)=>{
            const center = -Math.PI/2 + i*(2*Math.PI/n);
            const a0 = center - Math.PI/n + gap, a1 = center + Math.PI/n - gap;
            const isActive = i === active;
            const isNeighbor = Math.abs(((i - active + n) % n)) === 1 || Math.abs(((active - i + n) % n)) === 1;
            const op = isActive ? 1 : (isNeighbor ? 0.6 : 0.28);
            return (
              <path key={i} className="sec" d={arcPath(cx,cy,ri,ro,a0,a1)} fill={mo.c} opacity={op}
                stroke={isActive ? "var(--ink)" : "transparent"} strokeWidth={isActive ? 1.5 : 0}
                onClick={()=>setActive(i)} onMouseEnter={()=>setActive(i)} />
            );
          })}
          <text x={cx} y={cy-4} textAnchor="middle" className="ctr-k" fontSize="20" style={{ textTransform:'capitalize' }}>{m.k}</text>
          <text x={cx} y={cy+14} textAnchor="middle" className="ctr-v">{m.val}</text>
        </svg>
      </div>
      <div className="pr-detail">
        <div className="dk"><i style={{ background:m.c }}></i><b>{m.k}</b><span>{m.val}</span></div>
        {m.line
          ? <p className="quote">“{m.line}”</p>
          : <p className="quote none">No catchphrase — she just plays.</p>}
        <div className="play"><span className="pl">plays</span><span>{m.play}</span></div>
        <p className="pr-hint">Hover or tap a sector. The wheel is a cycle: the low arc turns a corner at focused and climbs back up.</p>
      </div>
    </div>
  );
}

function MoodLines(){
  const withLines = PR_MOODS.filter(m=>m.line);
  return (
    <div className="pr-lines">
      {withLines.map((m)=>(
        <div className="pr-linecard" key={m.k} style={{ borderLeftColor:m.c }}>
          <div className="m" style={{ color:m.c }}>{m.k}</div>
          <q>{m.line}</q>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { PR_MOOD_CSS, MoodWheel, MoodLines });
