// Pricey — real-data charts + diagrams. Exports: window.PR_VIZ_CSS,
//   BrainTopology, LearningCurve, MoodBars, ArchPipeline, MoodGains
const PR_VIZ_CSS = `
.prv{ width:100%; display:block; color:var(--acc); }
.prv svg{ width:100%; height:auto; display:block; overflow:visible; }
.prv .pnl{ fill:color-mix(in srgb,var(--acc) 9%, var(--panel2)); stroke:var(--line); stroke-width:1.4; }
.prv .pnl-a{ fill:color-mix(in srgb,var(--acc) 18%, var(--panel2)); stroke:var(--acc); stroke-width:1.6; }
.prv .lbl{ fill:var(--ink); font-family:var(--mono); font-size:11px; letter-spacing:.02em; }
.prv .lbl-s{ fill:var(--ink); font-family:var(--mono); font-size:9.5px; }
.prv .lbl-d{ fill:var(--dim); font-family:var(--mono); font-size:9px; letter-spacing:.05em; text-transform:uppercase; }
.prv .lbl-a{ fill:var(--acc); font-family:var(--mono); font-size:9.5px; letter-spacing:.06em; }
.prv .node{ fill:var(--bg); stroke:var(--acc); stroke-width:1.5; }
.prv .edge{ stroke:var(--acc); stroke-width:1; opacity:.16; }
.prv .wire{ fill:none; stroke:var(--line); stroke-width:1.6; }
.prv .flow{ fill:none; stroke:var(--acc); stroke-width:1.8; stroke-dasharray:3 8; opacity:.85; }
.prv-anim .flow{ animation:prFlow 1.1s linear infinite; }
@keyframes prFlow{ to{ stroke-dashoffset:-22; } }
.prv .sig{ fill:var(--acc); opacity:0; }
.prv-anim .sig{ animation:prSig 3s linear infinite; }
@keyframes prSig{ 0%{opacity:0;} 7%{opacity:1;} 92%{opacity:1;} 100%{opacity:0;} }
.prv .grid{ stroke:var(--line); stroke-width:1; opacity:.5; }
.prv .axis{ stroke:var(--dim); stroke-width:1; opacity:.5; }
.prv .curve{ fill:none; stroke:var(--acc); stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; }
.prv .area{ fill:url(#prGrad); opacity:.4; }
.prv .dot{ fill:var(--bg); stroke:var(--acc); stroke-width:2; }
.prv-anim .curve{ stroke-dasharray:600; stroke-dashoffset:600; animation:prDraw 2.4s ease-out forwards; }
@keyframes prDraw{ to{ stroke-dashoffset:0; } }
@media (prefers-reduced-motion: reduce){ .prv *{ animation:none !important; stroke-dashoffset:0 !important; } }
.prv .routeline{ fill:none; stroke:var(--acc); stroke-width:2.4; stroke-linecap:round; opacity:.95;
  filter:drop-shadow(0 0 3px color-mix(in srgb,var(--acc) 70%, transparent)); stroke-dasharray:280; stroke-dashoffset:280; animation:prRoute .5s ease-out forwards; }
@keyframes prRoute{ to{ stroke-dashoffset:0; } }
.prv .routesig{ fill:var(--acc); filter:drop-shadow(0 0 4px var(--acc)); }
.prv .node{ transition:fill .35s, stroke .35s; }
.prv .node.on{ fill:var(--acc); stroke:var(--acc); }
.prv .head rect{ transition:fill .4s, stroke .4s; }
.prv .head .lbl-s{ transition:fill .35s; }
.prv .head.on .lbl-s{ fill:var(--acc); }
@media (prefers-reduced-motion: reduce){ .prv .routeline{ stroke-dashoffset:0 !important; } }

/* mood gains (html) */
.pr-gains{ display:grid; gap:14px; }
.pr-gain{ border:1px solid var(--line); border-radius:13px; padding:18px 20px; background:var(--panel); }
.pr-gain .gh{ display:flex; align-items:baseline; justify-content:space-between; gap:12px; margin-bottom:14px; }
.pr-gain .gh b{ font-family:var(--display); font-weight:600; font-size:15px; color:var(--ink); }
.pr-gain .gh span{ font-family:var(--mono); font-size:11px; color:var(--dim); }
.pr-track{ position:relative; height:8px; border-radius:5px; background:var(--panel2); border:1px solid var(--line); }
.pr-track .seg{ position:absolute; top:-1px; bottom:-1px; border-radius:5px; }
.pr-ends{ display:flex; justify-content:space-between; margin-top:9px; font-family:var(--mono); font-size:10.5px; color:var(--dim); }
.pr-ends b{ color:var(--acc); font-weight:500; }
.pr-gain p{ margin:10px 0 0; font-size:12.5px; line-height:1.55; color:color-mix(in oklab,var(--ink) 74%, var(--dim)); }
`;

// ---- brain topology: 140 -> 32 -> 16 -> 6 heads ----
const PR_HEADS = [
  ["priceClass", "103-bin belief"],
  ["regression", "cents estimate"],
  ["pairLogit", "A pricier than B?"],
  ["pinball Q40", "safe-bid floor"],
  ["logPrice", "mean + variance"],
  ["FiLM", "mood → (γ, β)"],
];
function BrainTopology(){
  const inN = 8, h1N = 6, h2N = 5;
  const col = (x, n, y0, y1)=> Array.from({length:n}, (_,i)=> [x, y0 + (n===1?0:i*(y1-y0)/(n-1))]);
  const inP = col(40, inN, 18, 250);
  const h1P = col(150, h1N, 40, 228);
  const h2P = col(244, h2N, 58, 210);
  const heads = PR_HEADS.map((h,i)=>({ x:330, y:14 + i*42, t:h[0], d:h[1] }));

  const [route, setRoute] = React.useState({ i:2, a:1, b:2, head:0, n:0 });
  React.useEffect(()=>{
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let n = 0;
    const id = setInterval(()=>{
      n++;
      setRoute({
        i: Math.floor(Math.random()*inN),
        a: Math.floor(Math.random()*h1N),
        b: Math.floor(Math.random()*h2N),
        head: n % heads.length,
        n,
      });
    }, 1500);
    return ()=> clearInterval(id);
  }, []);

  const A = inP[route.i], B = h1P[route.a], C = h2P[route.b];
  const hd = heads[route.head];
  const D = [hd.x, hd.y + 15];
  const segs = [[A,B],[B,C],[C,D]];
  const motionPath = `M${A[0]} ${A[1]} L${B[0]} ${B[1]} L${C[0]} ${C[1]} L${D[0]} ${D[1]}`;

  return (
    <div className="prv prv-brain">
      <svg viewBox="0 0 520 268" role="img" aria-label="Neural network topology: 140 input features into a 32 then 16 unit trunk, branching to six output heads, with the active route lighting up the head it selects">
        {inP.map((a,i)=> h1P.map((b,j)=>(<line className="edge" key={`e1${i}${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />)))}
        {h1P.map((a,i)=> h2P.map((b,j)=>(<line className="edge" key={`e2${i}${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />)))}
        {h2P.map((a,i)=> heads.map((b,j)=>(<line className="edge" key={`e3${i}${j}`} x1={a[0]} y1={a[1]} x2={b.x} y2={b.y+15} />)))}

        <g key={route.n}>
          {segs.map((s,i)=>(<path className="routeline" key={i} d={`M${s[0][0]} ${s[0][1]}L${s[1][0]} ${s[1][1]}`} style={{ animationDelay:`${i*0.12}s` }} />))}
          <circle className="routesig" r="3.4">
            <animateMotion dur="1.15s" repeatCount="indefinite" path={motionPath} />
          </circle>
        </g>

        {inP.map((p,i)=>(<circle className={"node" + (i===route.i?" on":"")} key={"i"+i} cx={p[0]} cy={p[1]} r="4.5" />))}
        {h1P.map((p,i)=>(<circle className={"node" + (i===route.a?" on":"")} key={"h1"+i} cx={p[0]} cy={p[1]} r="5" />))}
        {h2P.map((p,i)=>(<circle className={"node" + (i===route.b?" on":"")} key={"h2"+i} cx={p[0]} cy={p[1]} r="5" />))}

        {heads.map((h,i)=>{
          const on = i === route.head;
          return (
            <g key={"hd"+i} className={"head" + (on?" on":"")}>
              <rect className={on?"pnl-a":"pnl"} x={h.x} y={h.y} width="178" height="30" rx="7" />
              <text x={h.x+12} y={h.y+13} className="lbl-s">{h.t}</text>
              <text x={h.x+12} y={h.y+24} className="lbl-d">{h.d}</text>
            </g>
          );
        })}
        <text x="40" y="266" textAnchor="middle" className="lbl-d">140</text>
        <text x="150" y="266" textAnchor="middle" className="lbl-d">32</text>
        <text x="244" y="266" textAnchor="middle" className="lbl-d">16</text>
        <text x="419" y="266" textAnchor="middle" className="lbl-a">6 heads</text>
      </svg>
    </div>
  );
}

// ---- learning curve: correct-rate climb ----
function LearningCurve(){
  const pts = [[0,48.4],[1,49.7],[2,50.9],[3,51.7],[4,52.2],[5,52.6],[6,52.9],[7,53.1],[8,53.3]];
  const x0=52, x1=456, y0=28, y1=168, lo=46, hi=54;
  const X=(i)=> x0 + (i/8)*(x1-x0);
  const Y=(v)=> y1 - ((v-lo)/(hi-lo))*(y1-y0);
  const line = pts.map(p=>`${X(p[0])},${Y(p[1])}`).join(" ");
  const area = `${X(0)},${y1} ${line} ${X(8)},${y1}`;
  return (
    <div className="prv prv-curve">
      <svg viewBox="0 0 480 200" role="img" aria-label="Learning curve: self-graded correct rate climbing from 48.4 percent to 53.3 percent over about 48,000 training rounds">
        <defs><linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity="0.28"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs>
        {[46,48,50,52,54].map((v,i)=>(<g key={i}><line className="grid" x1={x0} y1={Y(v)} x2={x1} y2={Y(v)} /><text x={x0-8} y={Y(v)+3} textAnchor="end" className="lbl-d">{v}%</text></g>))}
        <polygon className="area" points={area} />
        <polyline className="curve" points={line} />
        <circle className="dot" cx={X(0)} cy={Y(48.4)} r="4" />
        <circle className="dot" cx={X(8)} cy={Y(53.3)} r="4.5" />
        <text x={X(0)+6} y={Y(48.4)-9} className="lbl-a">48.4%</text>
        <text x={X(8)} y={Y(53.3)-11} textAnchor="end" className="lbl-a">53.3%</text>
        <text x={x0} y="192" className="lbl-d">first 1k rounds</text>
        <text x={x1} y="192" textAnchor="end" className="lbl-d">~48k rounds · recent 1k</text>
      </svg>
    </div>
  );
}

// ---- mood distribution bars ----
const PR_MOODS_DIST = [
  ["happy", 3604, "oklch(0.79 0.16 150)"],
  ["neutral", 2805, "oklch(0.77 0.13 66)"],
  ["elated", 1097, "oklch(0.86 0.16 110)"],
  ["focused", 740, "oklch(0.70 0.14 250)"],
  ["frustrated", 531, "oklch(0.58 0.17 300)"],
  ["confident", 368, "oklch(0.76 0.12 202)"],
  ["tilted", 352, "oklch(0.63 0.21 352)"],
  ["despondent", 129, "oklch(0.62 0.20 25)"],
];
function MoodBars(){
  const max = 3604, x0 = 96, x1 = 452, rowH = 26, top = 8;
  return (
    <div className="prv prv-bars">
      <svg viewBox={`0 0 480 ${top*2 + PR_MOODS_DIST.length*rowH}`} role="img" aria-label="Lifetime mood distribution: happy 3604, neutral 2805, elated 1097, focused 740, frustrated 531, confident 368, tilted 352, despondent 129">
        {PR_MOODS_DIST.map((m,i)=>{
          const y = top + i*rowH;
          const w = Math.max(3, (m[1]/max)*(x1-x0));
          return (
            <g key={i}>
              <text x={x0-10} y={y+15} textAnchor="end" className="lbl-s">{m[0]}</text>
              <rect x={x0} y={y+5} width={x1-x0} height="14" rx="4" fill="var(--panel2)" stroke="var(--line)" strokeWidth="1" />
              <rect x={x0} y={y+5} width={w} height="14" rx="4" fill={m[2]} />
              <text x={x0+w+8} y={y+15} className="lbl-d">{m[1].toLocaleString()}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---- architecture pipeline ----
function ArchPipeline(){
  const box = (x,y,w,h,t,d,hot)=>(
    <g><rect className={hot?"pnl-a":"pnl"} x={x} y={y} width={w} height={h} rx="9" />
      <text x={x+w/2} y={y+h/2-3} textAnchor="middle" className="lbl">{t}</text>
      {d && <text x={x+w/2} y={y+h/2+12} textAnchor="middle" className="lbl-d">{d}</text>}</g>
  );
  return (
    <div className="prv prv-arch">
      <svg viewBox="0 0 640 250" role="img" aria-label="Architecture: a remote game over Tailscale is rendered in Chromium with a brain worker and TTS audio, captured and encoded by ffmpeg, pushed to nginx-rtmp, and fanned out to YouTube, Twitch, and Kick">
        {/* wires */}
        <path className="wire" d="M112 120h28" /><path className="flow" d="M112 120h28" />
        <path className="wire" d="M204 58v27" /><path className="flow" d="M204 58v27" />
        <path className="wire" d="M204 222v-27" /><path className="flow" d="M204 222v-27" />
        <path className="wire" d="M268 120h32" /><path className="flow" d="M268 120h32" />
        <path className="wire" d="M396 120h30" /><path className="flow" d="M396 120h30" />
        {[[472,86],[472,120],[472,154]].map((p,i)=>(<g key={i}><path className="wire" d={`M530 120 C548 120 548 ${p[1]} 566 ${p[1]}`} /><path className="flow" d={`M530 120 C548 120 548 ${p[1]} 566 ${p[1]}`} /></g>))}
        <circle className="sig" cx="126" cy="120" r="2.6" />
        <circle className="sig" cx="284" cy="120" r="2.6" style={{animationDelay:'.4s'}} />
        <circle className="sig" cx="411" cy="120" r="2.6" style={{animationDelay:'.8s'}} />
        {/* nodes */}
        {box(8,95,104,50,"price.games","remote · Tailscale")}
        {box(140,85,128,70,"Chromium","Playwright · Xvfb",true)}
        {box(140,12,128,44,"Brain worker","MLP · 2 cores")}
        {box(140,184,128,44,"Audio","Piper TTS · mpd")}
        {box(300,95,96,50,"ffmpeg","H.264 · AAC")}
        {box(426,95,104,50,"nginx-rtmp","loopback")}
        {box(566,69,66,34,"YouTube")}
        {box(566,103,66,34,"Twitch")}
        {box(566,137,66,34,"Kick")}
      </svg>
    </div>
  );
}

// ---- mood rewires play (3 gains) ----
function MoodGains(){
  return (
    <div className="pr-gains">
      <div className="pr-gain">
        <div className="gh"><b>Sampler temperature</b><span>×0.70 — ×1.30</span></div>
        <div className="pr-track"><div className="seg" style={{ left:'0%', right:'0%', background:'linear-gradient(90deg, oklch(0.7 0.13 240), oklch(0.62 0.18 18))' }}></div></div>
        <div className="pr-ends"><span><b>focused ×0.70</b> · greedy</span><span>despondent ×1.30 · loose</span></div>
        <p>Locked-in, she trusts her read and samples tight. Spiraling, she widens out and explores.</p>
      </div>
      <div className="pr-gain">
        <div className="gh"><b>Exploration ε</b><span>+0.05 on negative moods</span></div>
        <div className="pr-track"><div className="seg" style={{ left:'0%', width:'62%', background:'var(--line)' }}></div><div className="seg" style={{ left:'62%', right:'0%', background:'oklch(0.68 0.19 35)' }}></div></div>
        <div className="pr-ends"><span>steady when up</span><span><b>+ε</b> to break a rut</span></div>
        <p>A deliberate nudge to try something different only when a run goes bad.</p>
      </div>
      <div className="pr-gain">
        <div className="gh"><b>Learning weight</b><span>mood-congruent credit</span></div>
        <div className="pr-track"><div className="seg" style={{ left:'0%', width:'50%', background:'oklch(0.78 0.15 150)' }}></div><div className="seg" style={{ left:'50%', right:'0%', background:'oklch(0.68 0.19 35)' }}></div></div>
        <div className="pr-ends"><span>good mood over-credits wins</span><span>bad mood over-credits losses</span></div>
        <p>How hard she learns from each round bends with her mood, so she gets streaky on purpose.</p>
      </div>
    </div>
  );
}

Object.assign(window, { PR_VIZ_CSS, BrainTopology, LearningCurve, MoodBars, ArchPipeline, MoodGains });
