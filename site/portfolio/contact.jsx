// Contact page — info-only, de-teched creative styling. Mount with <window.ContactPage />.
function ContactPage(){
  const [t, setTweak] = window.useShellTweaks();
  const { BASE_CSS, SUBPAGE_CSS, RW_CSS, Nav, Footer, CreativeTweaks, rootPropsRW, TweaksPanel } = window;
  const P = window.PORTFOLIO;

  const gh = P.social.find((s)=> s.label === "GitHub");
  const li = P.social.find((s)=> s.label === "LinkedIn");

  const ICONS = {
    mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>,
    github: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>,
    linkedin: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.3 8.65 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21H9V9Z"/></svg>,
  };

  const cards = [
    { k: "email", label: "Email", value: P.email, href: `mailto:${P.email}`, icon: ICONS.mail, arrow: "→" },
    { k: "github", label: "GitHub", value: gh ? gh.handle : "", href: gh ? gh.href : "#", icon: ICONS.github, arrow: "↗" },
    { k: "linkedin", label: "LinkedIn", value: li ? li.handle : "", href: li ? li.href : "#", icon: ICONS.linkedin, arrow: "↗" },
  ];

  const EXTRA = `
  .ct-wrap{ display:grid; grid-template-columns:1fr 1fr; gap:clamp(28px,5vw,64px); align-items:center; padding:36px 0 10px; }
  .ct-wrap > *{ min-width:0; }
  @media (max-width:820px){ .ct-wrap{ grid-template-columns:1fr; gap:36px; } }
  .ct-avail{ display:inline-flex; align-items:center; gap:9px; font-family:var(--mono); font-size:12px; letter-spacing:.08em;
    text-transform:uppercase; color:var(--ink); border:1px solid var(--line); border-radius:100px; padding:8px 15px; margin-bottom:26px; }
  .ct-avail i{ width:9px; height:9px; border-radius:50%; background:var(--acc); box-shadow:0 0 10px var(--acc); animation:ctDot 1.6s ease-in-out infinite; }
  @keyframes ctDot{ 0%,100%{ opacity:1; } 50%{ opacity:.4; } }
  .ct-lead{ font-size:clamp(17px,1.8vw,21px); line-height:1.55; color:color-mix(in oklab,var(--ink) 86%, var(--dim)); margin:0 0 30px; max-width:42ch; }
  .ct-cards{ display:flex; flex-direction:column; gap:12px; }
  .ct-card{ display:flex; align-items:center; gap:16px; text-decoration:none; border:1px solid var(--line); border-radius:14px;
    padding:18px 20px; background-color:var(--panel); transition:border-color .18s, transform .18s, background-color .18s; }
  .ct-card:hover{ border-color:var(--acc); transform:translateY(-2px); background-color:color-mix(in srgb,var(--acc) 6%, var(--panel)); }
  .ct-card .ic{ width:40px; height:40px; flex:0 0 40px; border-radius:11px; display:flex; align-items:center; justify-content:center;
    color:var(--acc); background:color-mix(in srgb,var(--acc) 12%, transparent); }
  .ct-card .ic svg{ width:21px; height:21px; }
  .ct-card .tx{ flex:1; min-width:0; }
  .ct-card .tx .l{ font-family:var(--mono); font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--dim); }
  .ct-card .tx .v{ display:block; font-family:var(--display); font-weight:600; font-size:17px; color:var(--ink); margin-top:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ct-card .go{ font-family:var(--mono); font-size:16px; color:var(--acc); flex:0 0 auto; transition:transform .18s; }
  .ct-card:hover .go{ transform:translate(2px,-2px); }

  .ct-anim{ width:100%; max-width:380px; margin:0 auto; color:var(--acc); }
  .ct-anim svg{ width:100%; height:auto; overflow:visible; display:block; }
  .ct-ring{ fill:none; stroke:var(--acc); stroke-width:1.5; transform-box:fill-box; transform-origin:center; opacity:0; }
  .ct-anim .r1{ animation:ctPing 3.6s ease-out infinite; }
  .ct-anim .r2{ animation:ctPing 3.6s ease-out infinite 1.2s; }
  .ct-anim .r3{ animation:ctPing 3.6s ease-out infinite 2.4s; }
  @keyframes ctPing{ 0%{ transform:scale(.28); opacity:.7; } 100%{ transform:scale(1); opacity:0; } }
  .ct-core{ fill:var(--acc); }
  .ct-coreglow{ fill:var(--acc); opacity:.25; transform-box:fill-box; transform-origin:center; animation:ctGlow 2.4s ease-in-out infinite; }
  @keyframes ctGlow{ 0%,100%{ transform:scale(1); opacity:.22; } 50%{ transform:scale(1.5); opacity:.05; } }
  .ct-line{ stroke:var(--line); stroke-width:1.5; fill:none; }
  .ct-flow{ stroke:var(--acc); stroke-width:2; fill:none; stroke-dasharray:2 9; opacity:.9; }
  .ct-anim .f1{ animation:ctFlow 1.3s linear infinite; }
  .ct-anim .f2{ animation:ctFlow 1.3s linear infinite .45s; }
  .ct-anim .f3{ animation:ctFlow 1.3s linear infinite .9s; }
  @keyframes ctFlow{ to{ stroke-dashoffset:-22; } }
  .ct-end{ fill:var(--bg); stroke:var(--acc); stroke-width:2; }
  .ct-endic{ color:var(--acc); }
  .ct-endic svg{ width:15px; height:15px; }
  .ct-wm{ fill:#0a130f; font-family:var(--display); font-weight:800; font-size:13px; }
  @media (prefers-reduced-motion: reduce){ .ct-anim *{ animation:none !important; } }
  `;

  const ends = [
    { x: 58, y: 44, icon: ICONS.mail },
    { x: 320, y: 70, icon: ICONS.github },
    { x: 84, y: 168, icon: ICONS.linkedin },
  ];
  const cx = 190, cy = 104;

  return (
    <div {...rootPropsRW(t)}>
      <style>{BASE_CSS + SUBPAGE_CSS + RW_CSS + EXTRA}</style>
      <div className="tm-wrap">
        <Nav active="contact" />

        <header className="pg">
          <p className="pg-kicker">Contact</p>
          <h1 className="pg-h1">Let's talk.</h1>
        </header>

        <div className="ct-wrap">
          <div>
            <div className="ct-avail"><i></i> Open to select work &amp; collaboration</div>
            <p className="ct-lead">Building something AI-native, or need someone who can ship it <span className="hl">and</span> explain it? Here's where to find me.</p>
            <div className="ct-cards">
              {cards.map((c)=>(
                <a className="ct-card" key={c.k} href={c.href} target={c.k === "email" ? undefined : "_blank"} rel="noopener">
                  <span className="ic">{c.icon}</span>
                  <span className="tx"><span className="l">{c.label}</span><span className="v">{c.value}</span></span>
                  <span className="go">{c.arrow}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="ct-anim" aria-hidden="true">
            <svg viewBox="0 0 380 208" role="img">
              {ends.map((e,i)=>(<g key={"l"+i}>
                <path className="ct-line" d={`M${cx} ${cy} L${e.x} ${e.y}`} />
                <path className={"ct-flow f" + (i+1)} d={`M${cx} ${cy} L${e.x} ${e.y}`} />
              </g>))}
              <circle className="ct-ring r1" cx={cx} cy={cy} r="74" />
              <circle className="ct-ring r2" cx={cx} cy={cy} r="74" />
              <circle className="ct-ring r3" cx={cx} cy={cy} r="74" />
              {ends.map((e,i)=>(<g key={"e"+i}>
                <circle className="ct-end" cx={e.x} cy={e.y} r="17" />
                <foreignObject x={e.x-9} y={e.y-9} width="18" height="18">
                  <div className="ct-endic" style={{ width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center' }}>{e.icon}</div>
                </foreignObject>
              </g>))}
              <circle className="ct-coreglow" cx={cx} cy={cy} r="22" />
              <circle className="ct-core" cx={cx} cy={cy} r="17" />
              <text className="ct-wm" x={cx} y={cy+4} textAnchor="middle">RW</text>
            </svg>
          </div>
        </div>

        <Footer />
      </div>

      <TweaksPanel title="Tweaks">
        <CreativeTweaks t={t} setTweak={setTweak} withViz={false} />
      </TweaksPanel>
    </div>
  );
}
window.ContactPage = ContactPage;
