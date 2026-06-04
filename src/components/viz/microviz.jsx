// Per-project micro-visualizations — ESM port of site/portfolio/microviz.jsx
// (window.ProjectViz / window.SeoIcon). Rendered as client:only React islands;
// the CSS lives in src/styles/microviz.css. Logic is 1:1 with the original so
// the hydrated render is pixel-identical to the old client-rendered version.
import { useState as mvUseState, useEffect as mvUseEffect, useRef as mvUseRef } from 'react';

const ML_KW = [
  { lc: 'es', kw: 'zapatillas para correr' },
  { lc: 'de', kw: 'Laufschuhe' },
  { lc: 'pt', kw: 'tênis de corrida' },
  { lc: 'fr', kw: 'chaussures de running' },
  { lc: 'it', kw: 'scarpe da corsa' },
];
const ML_W = [0.94, 0.66, 0.44];
function HelloViz() {
  const [i, setI] = mvUseState(0);
  mvUseEffect(() => {
    const id = setInterval(() => setI((x) => x + 1), 1500);
    return () => clearInterval(id);
  }, []);
  const n = ML_KW.length;
  return (
    <div className="mv mv-rank">
      <div className="mv-src">
        <span className="lc en">en</span>
        <span className="mv-srcw">running shoes</span>
        <span className="mv-tag">source</span>
      </div>
      <div className="mv-morph">↓ translate &amp; rank</div>
      {[0, 1, 2].map((r) => {
        const w = ML_KW[(i + r) % n];
        return (
          <div className={'mv-rrow' + (r === 0 ? ' lead' : '')} key={r}>
            <span className="rk">{r + 1}</span>
            <span className="lc">{w.lc}</span>
            <span className="kw" key={i}>{w.kw}</span>
            <span className="track"><i style={{ width: ML_W[r] * 100 + '%' }}></i></span>
          </div>
        );
      })}
    </div>
  );
}

export function SeoIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" role="img" aria-label="a globe of languages">
      <circle cx="22" cy="25" r="12.5" />
      <ellipse cx="22" cy="25" rx="5.4" ry="12.5" />
      <path d="M9.8 20.5h24.4M9.8 29.5h24.4" />
      <g stroke="currentColor" strokeWidth="1" opacity="0.45" strokeDasharray="1.5 2.2">
        <path d="M32.5 16 L38 12.5" />
        <path d="M11 33.5 L8 38.5" />
        <path d="M33 33 L39 38.5" />
      </g>
      <g stroke="none" fill="currentColor" fontFamily="system-ui, 'Noto Sans', 'Segoe UI', sans-serif" fontWeight="700">
        <text x="39.5" y="11.5" fontSize="9.5" textAnchor="middle" dominantBaseline="central">文</text>
        <text x="7.5" y="40.5" fontSize="8.5" textAnchor="middle" dominantBaseline="central">あ</text>
        <text x="40.5" y="40.5" fontSize="9.5" textAnchor="middle" dominantBaseline="central">A</text>
      </g>
    </svg>
  );
}

const SPARK_PTS = [[10, 92], [46, 84], [82, 88], [118, 72], [154, 76], [190, 58], [226, 62], [262, 42], [298, 34], [330, 20]];

function SparkViz({ animate }) {
  const ref = mvUseRef(null);
  mvUseEffect(() => {
    const dot = ref.current;
    if (!dot) return;
    const pts = SPARK_PTS;
    const segs = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
      const l = Math.hypot(dx, dy);
      segs.push({ l, a: pts[i - 1], b: pts[i] });
      total += l;
    }
    const at = (u) => {
      let d = u * total;
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        if (d <= s.l || i === segs.length - 1) {
          const r = s.l ? d / s.l : 0;
          return [s.a[0] + (s.b[0] - s.a[0]) * r, s.a[1] + (s.b[1] - s.a[1]) * r];
        }
        d -= s.l;
      }
      return pts[pts.length - 1];
    };
    const place = (p) => {
      dot.style.left = (p[0] / 340 * 100) + '%';
      dot.style.top = (p[1] / 120 * 100) + '%';
    };
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!animate || reduce) { place(pts[pts.length - 1]); return; }
    let raf, start;
    const D = 2800;
    const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
    const frame = (ts) => {
      if (!start) start = ts;
      const e = (ts - start) % (2 * D);
      const ph = e / (2 * D);
      let u = ph < 0.5 ? ph * 2 : (1 - ph) * 2;
      place(at(ease(u)));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate]);
  const line = SPARK_PTS.map((p) => p.join(',')).join(' ');
  const area = `10,120 ${line} 330,120`;
  return (
    <div className="mv mv-spark">
      <svg viewBox="0 0 340 120" preserveAspectRatio="none">
        <defs><linearGradient id="mvGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient></defs>
        <polygon className="area" points={area} />
        <polyline className="ln" points={line} />
      </svg>
      <span className="mv-spark-dot" ref={ref}></span>
    </div>
  );
}

const PG_STARS = [[20, 28, 1.5], [50, 70, 1], [300, 30, 1.5], [270, 80, 1], [160, 20, 1], [110, 92, 1.2], [230, 24, 1], [330, 64, 1.2], [14, 90, 1]];
const PG_DOLLARS = [[30, 84, 26], [70, 40, 18], [250, 46, 22], [300, 92, 16], [200, 96, 20], [120, 34, 16]];
const pgRand = () => String(Math.floor(Math.random() * 900) + 100);

function PriceViz({ animate }) {
  const [amt, setAmt] = mvUseState('427');
  const [rolling, setRolling] = mvUseState(false);
  mvUseEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!animate || reduce) { setAmt(pgRand()); setRolling(false); return; }
    let alive = true, rollInt, t1, t2;
    const round = () => {
      setRolling(true);
      rollInt = setInterval(() => setAmt(pgRand()), 70);
      t1 = setTimeout(() => {
        clearInterval(rollInt);
        setAmt(pgRand());
        setRolling(false);
        t2 = setTimeout(() => { if (alive) round(); }, 1600);
      }, 850);
    };
    round();
    return () => { alive = false; clearInterval(rollInt); clearTimeout(t1); clearTimeout(t2); };
  }, [animate]);
  return (
    <div className="mv mv-price"><svg viewBox="0 0 340 120" preserveAspectRatio="xMidYMid slice">
      {PG_STARS.map((s, i) => (<circle className="pgs-star" key={i} cx={s[0]} cy={s[1]} r={s[2]} style={{ animationDelay: `${(i % 5) * 0.6}s` }} />))}
      {PG_DOLLARS.map((d, i) => (<text className="pgs-dollar" key={'d' + i} x={d[0]} y={d[1]} fontSize={d[2]} textAnchor="middle" style={{ animationDelay: `${i * 0.55}s` }}>$</text>))}
      <text className="pgs-label" x="170" y="36" textAnchor="middle">GUESS THE PRICE</text>
      <text className={'pgs-amt' + (rolling ? ' roll' : '')} x="170" y="82" textAnchor="middle">{'$' + amt}</text>
      <line className="pgs-tick" x1="128" y1="94" x2="212" y2="94" />
    </svg></div>
  );
}

function staffNote(type, x, y, key) {
  const sx = x + 5.6;
  const head = (type === 'half')
    ? <ellipse className="nt-open" cx={x} cy={y} rx="6" ry="4.6" transform={`rotate(-20 ${x} ${y})`} />
    : (type === 'whole')
      ? <ellipse className="nt-open" cx={x} cy={y} rx="7.2" ry="5" transform={`rotate(-12 ${x} ${y})`} />
      : <ellipse className="nt" cx={x} cy={y} rx="6" ry="4.6" transform={`rotate(-20 ${x} ${y})`} />;
  return (<g key={key}>
    {head}
    {type !== 'whole' && <line className="stem" x1={sx} y1={y - 1} x2={sx} y2={y - 30} />}
    {type === 'eighth' && <path className="flag" d={`M${sx},${y - 30} q9,3 7,15`} />}
  </g>);
}

function StaffViz() {
  const LINES = [44, 57, 70, 83, 96];
  const seq = [['quarter', 64, 83], ['eighth', 100, 70], ['half', 208, 76], ['quarter', 248, 57], ['whole', 292, 70], ['eighth', 326, 89]];
  const renderSeq = (offset, kp) => (
    <g transform={`translate(${offset},0)`} key={kp}>
      {seq.map((n, i) => staffNote(n[0], n[1], n[2], kp + '-' + i))}
      <g key={kp + '-beam'}>
        <ellipse className="nt" cx="140" cy="63" rx="6" ry="4.6" transform="rotate(-20 140 63)" />
        <ellipse className="nt" cx="170" cy="57" rx="6" ry="4.6" transform="rotate(-20 170 57)" />
        <line className="stem" x1="145.6" y1="62" x2="145.6" y2="33" />
        <line className="stem" x1="175.6" y1="56" x2="175.6" y2="29" />
        <line className="beam" x1="145.6" y1="33" x2="175.6" y2="29" />
      </g>
    </g>
  );
  return (<div className="mv mv-staff"><svg viewBox="0 0 340 120" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="mvStaffFade" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="black" /><stop offset="0.1" stopColor="white" />
        <stop offset="0.9" stopColor="white" /><stop offset="1" stopColor="black" />
      </linearGradient>
      <mask id="mvStaffMask"><rect x="0" y="0" width="340" height="120" fill="url(#mvStaffFade)" /></mask>
    </defs>
    {LINES.map((y, i) => (<line className="ln" key={i} x1="0" y1={y} x2="340" y2={y} />))}
    <text className="clef" x="22" y="98" fontFamily="'Noto Music', serif" fontSize="86">{'\u{1D11E}'}</text>
    <g mask="url(#mvStaffMask)"><g className="scroll">{renderSeq(0, 'a')}{renderSeq(-340, 'b')}</g></g>
  </svg></div>);
}

function NeuralViz() {
  const layers = [3, 4, 4, 2];
  const W = 340, padX = 40;
  const xs = layers.map((_, i) => padX + i * ((W - 2 * padX) / (layers.length - 1)));
  const pos = layers.map((n, li) => {
    const top = 24, bot = 96;
    const ys = n === 1 ? [(top + bot) / 2] : Array.from({ length: n }, (_, i) => top + i * ((bot - top) / (n - 1)));
    return ys.map((y) => [xs[li], y]);
  });
  const edges = [];
  for (let li = 0; li < pos.length - 1; li++) { pos[li].forEach((a) => pos[li + 1].forEach((b) => edges.push({ a, b, li }))); }
  return (<div className="mv mv-net"><svg viewBox="0 0 340 120" preserveAspectRatio="xMidYMid meet">
    {edges.map((e, i) => (<line className="edge" key={'e' + i} x1={e.a[0]} y1={e.a[1]} x2={e.b[0]} y2={e.b[1]} style={{ animationDelay: `${e.li * 0.3 + (i % 5) * 0.07}s` }} />))}
    {pos.map((layer, li) => layer.map(([x, y], ni) => (
      <g key={li + '-' + ni}>
        <circle className="node" cx={x} cy={y} r="6" style={{ animationDelay: `${li * 0.4 + ni * 0.1}s` }} />
        <circle className="core" cx={x} cy={y} r="2.6" style={{ animationDelay: `${li * 0.4 + ni * 0.1}s` }} />
      </g>
    )))}
  </svg></div>);
}

const SV_VIEWERS = [[210, 36], [256, 32], [300, 38], [312, 66], [266, 92], [214, 96], [166, 44], [176, 90]];

function StreamViz() {
  const bx = 86, by = 60;
  return (<div className="mv mv-stream"><svg viewBox="0 0 340 120" preserveAspectRatio="xMidYMid meet">
    {SV_VIEWERS.map((v, i) => (<line className="edge" key={'e' + i} x1={bx} y1={by} x2={v[0]} y2={v[1]} style={{ animationDelay: `${(i % 4) * 0.2}s` }} />))}
    <circle className="ring" cx={bx} cy={by} r="32" />
    <circle className="ring" cx={bx} cy={by} r="32" style={{ animationDelay: '1.3s' }} />
    <rect className="scr" x={bx - 32} y={by - 21} width="64" height="42" rx="7" />
    <circle className="rec" cx={bx} cy={by} r="8" />
    {SV_VIEWERS.map((v, i) => (<g className="vwg" key={'v' + i} style={{ animationDelay: `${(i % 5) * 0.3}s` }}>
      <rect className="vw" x={v[0] - 11} y={v[1] - 8} width="22" height="15" rx="3.5" />
      <path className="play" d={`M${v[0] - 3},${v[1] - 4} L${v[0] - 3},${v[1] + 4} L${v[0] + 4},${v[1]} Z`} />
    </g>))}
    <circle className="lived" cx="20" cy="16" r="3.5" />
    <text className="live" x="30" y="19">LIVE</text>
  </svg></div>);
}

export function ProjectViz({ id, animate }) {
  if (id === 'sheet-llm') return <StaffViz />;
  if (id === 'onestreamer') return <StreamViz />;
  if (id === 'price-games') return <PriceViz animate={animate} />;
  if (id === 'pricey') return <NeuralViz />;
  if (id === 'multilingual-seo') return <HelloViz />;
  return null;
}

export { SparkViz };
