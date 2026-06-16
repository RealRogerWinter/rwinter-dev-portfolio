// Algebra 1 Tutor — diagrams + interactive demos, co-located in one module so the
// page's islands share a single bundle chunk (same pattern as price-games.jsx).
//
// VerificationFlow is pure (rendered with NO client directive: static HTML, zero
// JS). TutorChatDemo, CheckMyAnswer, BalanceStepper and CurriculumMap are the
// page's client:visible islands; each has a deterministic initial render so SSR
// and hydration agree. Motion respects the pre-painted [data-anim] attribute on
// #rw-root and prefers-reduced-motion. CSS lives in src/styles/algebra-1-tutor.css.
import { useState, useEffect, useRef } from 'react';

// Read the site's motion preference once: the pre-painted [data-anim] flag on
// #rw-root (user tweak) plus the OS reduced-motion setting. Used by the
// auto-playing chat so it degrades to "everything already shown".
function motionOn() {
  try {
    const root = document.getElementById('rw-root');
    if (root && root.getAttribute('data-anim') === 'off') return false;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  } catch {
    /* SSR / no DOM */
  }
  return true;
}

// ---- single-source-of-truth verification pipeline (static diagram) ----
export function VerificationFlow() {
  const surfaces = [
    { y: 26, t: 'Textbook' },
    { y: 62, t: 'Tutor skill' },
    { y: 98, t: 'Student guide' },
    { y: 134, t: 'Tutor guide' },
  ];
  return (
    <div className="a1d a1d-verify">
      <svg viewBox="0 0 480 188" role="img" aria-label="One source of truth: curriculum.yaml feeds four surfaces, SymPy re-checks every answer, and CircleCI gates on zero failures">
        {/* source of truth */}
        <rect className="pnl-a" x="8" y="62" width="104" height="64" rx="10" />
        <text x="60" y="90" textAnchor="middle" className="lbl">curriculum.yaml</text>
        <text x="60" y="107" textAnchor="middle" className="lbl-a">source of truth</text>

        {/* fan out to four surfaces */}
        {surfaces.map((s, i) => (
          <g key={i}>
            <path className="wire" d={`M112 94 C168 94 176 ${s.y + 15} 232 ${s.y + 15}`} />
            <path className="flow" d={`M112 94 C168 94 176 ${s.y + 15} 232 ${s.y + 15}`} />
            <rect className="pnl" x="232" y={s.y} width="120" height="30" rx="8" />
            <text x="292" y={s.y + 20} textAnchor="middle" className="lbl">{s.t}</text>
          </g>
        ))}

        {/* SymPy re-check + CI gate */}
        <path className="wire" d="M352 94 h28" />
        <path className="flow" d="M352 94 h28" />
        <rect className="pnl-a" x="380" y="62" width="92" height="64" rx="10" />
        <circle className="ico" cx="426" cy="88" r="11" stroke="var(--acc)" />
        <path className="chk" d="M421 88 l4 4 7-8" />
        <text x="426" y="112" textAnchor="middle" className="lbl-a">SymPy check</text>

        <text x="240" y="172" textAnchor="middle" className="lbl-d">909 problems · 614 auto-verified · 0 failures, enforced in CI</text>
      </svg>
    </div>
  );
}

// ---- interactive balance scale: concrete -> symbolic ----
// x + 3 = 5, shown as blocks on a balance; take 3 from each side -> x = 2.
// A pan's blocks are laid out centred on its hang point so they never overflow.
function Pan({ cx, count, mystery }) {
  // bw/gap sized so the widest pan (5 blocks) fits inside the 80px-wide pan rim:
  // 5*13 + 4*3 = 77px, centred on cx, clears both rims.
  const bw = 13, gap = 3, y = 60;
  const total = count * bw + (count - 1) * gap;
  const startX = cx - total / 2;
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const x = startX + i * (bw + gap);
        const isMys = mystery && i === 0;
        return (
          <g key={i}>
            <rect className={'a1-blk' + (isMys ? ' mys' : '')} x={x} y={y} width={bw} height={bw} rx="3" />
            {isMys && <text className="a1-blktx" x={x + bw / 2} y={y + bw / 2 + 4} textAnchor="middle">x</text>}
          </g>
        );
      })}
    </g>
  );
}

export function BalanceStepper() {
  const [removed, setRemoved] = useState(false);
  const eq = removed ? 'x = 2' : 'x + 3 = 5';
  return (
    <div className="a1-bal">
      <svg viewBox="0 0 340 152" role="img" aria-label="A balance scale showing x plus 3 equals 5; removing 3 from both sides leaves x equals 2">
        <line className="a1-arm" x1="60" y1="40" x2="280" y2="40" />
        <line className="a1-post" x1="170" y1="40" x2="170" y2="118" />
        <path className="a1-base" d="M144 122 H196 L186 114 H154 Z" />
        <line className="a1-str" x1="90" y1="40" x2="90" y2="56" />
        <path className="a1-pan" d="M50 56 H130 L120 80 Q90 90 60 80 Z" />
        <Pan cx={90} count={removed ? 1 : 4} mystery />
        <line className="a1-str" x1="250" y1="40" x2="250" y2="56" />
        <path className="a1-pan" d="M210 56 H290 L280 80 Q250 90 220 80 Z" />
        <Pan cx={250} count={removed ? 2 : 5} />
        <circle className="a1-piv" cx="170" cy="40" r="4" />
        <text className="a1-baleq" x="170" y="144" textAnchor="middle">{eq}</text>
      </svg>
      <div className="a1-balfoot">
        {!removed ? (
          <button className="a1-btn" onClick={() => setRemoved(true)}>Take 3 from both sides →</button>
        ) : (
          <>
            <span className="a1-balnote">The same move on both sides keeps it balanced, and x stands alone.</span>
            <button className="a1-btn ghost" onClick={() => setRemoved(false)}>↻ Reset</button>
          </>
        )}
      </div>
    </div>
  );
}

// ---- interactive tutor chat (auto-plays the conversation) ----
const CHAT = [
  { who: 'me', text: 'Can you help me solve 8 − 2x = 14?' },
  { who: 'tutor', text: 'Let’s do it together. What could you do to both sides to get the −2x term by itself?' },
  { who: 'me', text: 'Subtract 8 from both sides?' },
  { who: 'tutor', text: 'Exactly. That leaves −2x = 6. Try the last step and send me a photo of your work.' },
  { who: 'me', photo: 'x = 3', text: '' },
  { who: 'tutor', text: 'I read x = 3 in your photo. Let’s test it: 8 − 2(3) = 2, not 14. The −2 is the tricky part. What’s 6 ÷ (−2)?' },
  { who: 'me', text: '−3!' },
  { who: 'tutor', verify: true, text: '✓ x = −3. Checked: 8 − 2(−3) = 14. That sign flip trips up almost everyone, but you caught it.' },
];

function ChatBubble({ turn, visible }) {
  // Every bubble is always rendered so the chat panel reserves its full height
  // up front; `visible` only toggles visibility, so revealing a turn never
  // reflows the page. (Pending rows stay visibility:hidden and keep their box.)
  const vis = visible ? ' is-shown' : ' is-pending';
  if (turn.photo !== undefined) {
    return (
      <div className={'a1-row me' + vis}>
        <figure className="a1-photo">
          <span className="a1-hand">{turn.photo}</span>
          <figcaption>your photo</figcaption>
        </figure>
      </div>
    );
  }
  return (
    <div className={'a1-row ' + turn.who + vis}>
      <div className={'a1-bub ' + turn.who + (turn.verify ? ' verify' : '')}>
        {turn.verify && <span className="a1-vchip">verified by SymPy</span>}
        <p>{turn.text}</p>
      </div>
    </div>
  );
}

export function TutorChatDemo() {
  const [shown, setShown] = useState(1); // deterministic SSR: first turn only
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef([]);

  const clearAll = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  const play = () => {
    clearAll();
    setDone(false);
    if (!motionOn()) {
      setShown(CHAT.length);
      setTyping(false);
      setDone(true);
      return;
    }
    setShown(1);
    setTyping(false);
    let acc = 0;
    for (let i = 1; i < CHAT.length; i++) {
      const isTutor = CHAT[i].who === 'tutor';
      if (isTutor) {
        acc += 520;
        timers.current.push(setTimeout(() => setTyping(true), acc));
        acc += 780;
        timers.current.push(setTimeout(() => { setTyping(false); setShown(i + 1); }, acc));
      } else {
        acc += 760;
        timers.current.push(setTimeout(() => setShown(i + 1), acc));
      }
    }
    timers.current.push(setTimeout(() => setDone(true), acc + 200));
  };

  useEffect(() => {
    play();
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="a1-chat">
      <div className="a1-chathead">
        <span className="a1-dot" /> Claude · Algebra 1 Tutor
      </div>
      <div className="a1-chatbody">
        {CHAT.map((t, i) => (
          <ChatBubble turn={t} visible={i < shown} key={i} />
        ))}
      </div>
      <div className="a1-chatfoot">
        {done ? (
          <button className="a1-btn ghost" onClick={play}>↻ Replay</button>
        ) : typing ? (
          <span className="a1-chatcap">Claude is typing<span className="a1-tw"><i /><i /><i /></span></span>
        ) : (
          <span className="a1-chatcap">A sample tutoring session: ask-before-telling, photo review, then a verified answer.</span>
        )}
      </div>
    </div>
  );
}

// ---- interactive "check my answer" stepper (multiple choice, verified) ----
const SOLVE = [
  {
    eq: '8 − 2x = 14',
    prompt: 'What’s the first move to get x by itself?',
    opts: [
      { t: 'Subtract 8 from both sides', ok: true, becomes: '−2x = 6' },
      { t: 'Add 2x to both sides', hint: 'That works eventually, but it leaves terms on both sides, so clear the constant 8 first.' },
      { t: 'Divide both sides by 2', hint: 'Too early: the −2x term isn’t alone yet. Move the 8 first.' },
    ],
  },
  {
    eq: '−2x = 6',
    prompt: 'Now finish it: solve for x.',
    opts: [
      { t: 'Divide both sides by −2', ok: true, becomes: 'x = −3' },
      { t: 'Divide both sides by 2', hint: 'Watch the sign: you’re undoing × (−2), so divide by −2, not 2.' },
      { t: 'Subtract 6 from both sides', hint: 'x is multiplied by −2, so use division to undo it, not subtraction.' },
    ],
  },
];

export function CheckMyAnswer() {
  const [step, setStep] = useState(0);
  const [chain, setChain] = useState([SOLVE[0].eq]); // derivation so far
  const [wrong, setWrong] = useState(null); // index of wrong option this step
  const [hint, setHint] = useState('');
  const finished = step >= SOLVE.length;

  const choose = (opt, idx) => {
    if (opt.ok) {
      setChain((c) => [...c, opt.becomes]);
      setWrong(null);
      setHint('');
      setStep((s) => s + 1);
    } else {
      setWrong(idx);
      setHint(opt.hint);
    }
  };
  const reset = () => {
    setStep(0);
    setChain([SOLVE[0].eq]);
    setWrong(null);
    setHint('');
  };

  return (
    <div className="a1-solve">
      <div className="a1-deriv">
        {chain.map((e, i) => (
          <div className={'a1-line' + (i === chain.length - 1 && !finished ? ' active' : '')} key={i}>
            <span className="a1-step">{i + 1}</span>
            <span className="a1-eq">{e}</span>
          </div>
        ))}
      </div>

      {!finished ? (
        <div className="a1-ask">
          <p className="a1-prompt">{SOLVE[step].prompt}</p>
          <div className="a1-opts">
            {SOLVE[step].opts.map((o, i) => (
              <button
                className={'a1-opt' + (wrong === i ? ' wrong' : '')}
                key={i}
                onClick={() => choose(o, i)}
              >
                {o.t}
              </button>
            ))}
          </div>
          {hint && <p className="a1-hint">{hint}</p>}
        </div>
      ) : (
        <div className="a1-result">
          <span className="a1-vchip">verified by SymPy</span>
          <p className="a1-check">✓ x = −3 &nbsp;·&nbsp; 8 − 2(−3) = 14</p>
          <button className="a1-btn ghost" onClick={reset}>↻ Try again</button>
        </div>
      )}
    </div>
  );
}

// ---- interactive curriculum map: a phased course path (prerequisite-aware) ----
// `phase` groups Units 1-12 into the five stages of the course; Unit A (stats)
// is phase 5, shown as a standalone track. `f` is a one-line focus for the
// detail panel, which is always populated (defaults to Unit 1) so the map never
// reads as empty.
const UNITS = [
  { n: '1', t: 'Foundations & the Language of Algebra', f: 'Variables, expressions, and the vocabulary the rest of the course builds on.', phase: 0 },
  { n: '2', t: 'Solving Linear Equations', f: 'Balance moves that isolate the unknown.', phase: 0 },
  { n: '3', t: 'Proportional Reasoning', f: 'Ratios and rates, the bridge to linearity.', phase: 0 },
  { n: '4', t: 'Introducing Functions', f: 'Inputs, outputs, and the function machine.', phase: 1 },
  { n: '5', t: 'Linear Functions & Their Graphs', f: 'Slope, intercepts, and y = mx + b.', phase: 1 },
  { n: '6', t: 'Modeling & Translation', f: 'Turning real situations and word problems into equations.', phase: 1 },
  { n: '7', t: 'Systems of Equations', f: 'Two equations, one shared solution.', phase: 2 },
  { n: '8', t: 'Inequalities', f: 'Ranges of solutions, and how to graph them.', phase: 2 },
  { n: '9', t: 'Sequences & Exponential Functions', f: 'Patterns that grow by adding, then by multiplying.', phase: 3 },
  { n: '10', t: 'Exponents & Polynomials', f: 'Powers, and arithmetic with polynomial expressions.', phase: 3 },
  { n: '11', t: 'Factoring', f: 'Breaking polynomials back into their factors.', phase: 3 },
  { n: '12', t: 'Quadratic Functions & Equations', f: 'The capstone: parabolas and the quadratic formula.', phase: 4 },
  { n: 'A', t: 'Data & Statistics', f: 'Describing and interpreting data; stands on its own.', phase: 5 },
];
const PHASES = ['Foundations', 'Functions & lines', 'Systems & inequalities', 'Growth & polynomials', 'Capstone'];

export function CurriculumMap() {
  const [sel, setSel] = useState(0); // default Unit 1 so the detail panel is always populated
  const u = UNITS[sel];
  const isStats = u.n === 'A';
  const note = isStats
    ? 'Standalone: jump in whenever it’s useful.'
    : sel === 0
      ? 'The foundation, and the natural place to begin.'
      : `Prerequisite-aware: the tutor checks Units 1–${UNITS[sel - 1].n} first and patches any gaps.`;

  const node = (unit, i) => {
    const cls = 'a1-node'
      + (sel === i ? ' sel' : '')
      + (!isStats && unit.phase < 5 && i < sel ? ' lit' : '')
      + (unit.n === '12' ? ' cap' : '')
      + (unit.n === 'A' ? ' stats' : '');
    return (
      <button className={cls} key={unit.n} onClick={() => setSel(i)} aria-pressed={sel === i} title={`Unit ${unit.n}: ${unit.t}`}>
        {unit.n}
      </button>
    );
  };

  return (
    <div className="a1-map">
      <div className="a1-maphead">
        <span className="a1-mapstat"><b>13</b> units</span>
        <span className="a1-mapstat"><b>52</b> lessons</span>
        <span className="a1-mapstat">foundations → capstone</span>
      </div>
      <div className="a1-path">
        {PHASES.map((label, pi) => (
          <div className={'a1-phase' + (pi === 4 ? ' capstone' : '')} key={label}>
            <span className="a1-phlabel">{label}</span>
            <div className="a1-phnodes">
              {UNITS.map((unit, i) => (unit.phase === pi ? node(unit, i) : null))}
            </div>
          </div>
        ))}
      </div>
      <div className="a1-aside">
        <span className="a1-aslabel">Anytime</span>
        {UNITS.map((unit, i) => (unit.n === 'A' ? node(unit, i) : null))}
        <span className="a1-asname">Data &amp; Statistics</span>
      </div>
      <div className="a1-detail">
        <span className={'a1-dno' + (isStats ? ' stats' : '')}>{u.n}</span>
        <div className="a1-dtext">
          <b>Unit {u.n} · {u.t}</b>
          <p>{u.f}</p>
          <p className="a1-dnote">{note}</p>
        </div>
      </div>
    </div>
  );
}
