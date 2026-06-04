// Bespoke Price Games write-up page. Mount with <window.PriceGamesPage />.
const PG_DISPLAY = {
  "Syne": "'Syne', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
  "Bricolage Grotesque": "'Bricolage Grotesque', sans-serif",
};

const PG_MODES = [
  { n: "Precision", d: "Guess the exact price of a product.", href: "/play/classic", img: "portfolio/assets/modes/precision.webp" },
  { n: "Higher or Lower", d: "Is the next price higher or lower?", href: "/play/higher-lower", img: "portfolio/assets/modes/higher-or-lower.webp" },
  { n: "Comparison", d: "Pick which product costs more, or less.", href: "/play/comparison", img: "portfolio/assets/modes/comparison.webp" },
  { n: "Price Match", d: "Match four products to four prices.", href: "/play/price-match", img: "portfolio/assets/modes/price-match.webp" },
  { n: "Riser", d: "Stop the rising price before it's over.", href: "/play/riser", img: "portfolio/assets/modes/riser.webp" },
  { n: "Budget Builder", d: "Fill a budget without going over.", href: "/play/budget-builder", img: "portfolio/assets/modes/budget-builder.webp" },
  { n: "Bidding War", d: "Bid in turns; closest under wins.", href: "/mp", img: "portfolio/assets/modes/bidding-war.webp" },
];

const PG_PAGE_CSS = `
.tm.rw{ font-family:var(--body); --body:'Hanken Grotesk', system-ui, sans-serif; --mono:'JetBrains Mono', ui-monospace, monospace; }

/* hero */
.pg-hero{ padding:26px 0 18px; }
.pg-band{ position:relative; height:clamp(300px,42vw,420px); border:1px solid var(--line); border-radius:20px; overflow:hidden;
  background:radial-gradient(120% 130% at 50% 0%, color-mix(in srgb,var(--acc) 13%, var(--panel)), var(--panel)); }
.pg-band .mv{ color:var(--acc); }
.pg-scrim{ position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(to top, var(--panel) 4%, color-mix(in srgb,var(--panel) 30%, transparent) 40%, transparent 72%); }
.pg-status{ position:absolute; top:18px; right:18px; z-index:3; display:inline-flex; align-items:center; gap:8px;
  font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--ink);
  background:color-mix(in srgb,var(--bg) 60%, transparent); border:1px solid var(--acc); border-radius:100px; padding:7px 14px; }
.pg-status i{ width:7px; height:7px; border-radius:50%; background:var(--acc); box-shadow:0 0 9px var(--acc); animation:pgLiveDot 1.4s ease-in-out infinite; }
@keyframes pgLiveDot{ 0%,100%{ opacity:1; } 50%{ opacity:.35; } }
.pg-titlewrap{ position:absolute; left:0; right:0; bottom:0; z-index:2; display:flex; align-items:flex-end; gap:20px; padding:30px clamp(20px,4vw,40px); }
.pg-logo{ width:88px; height:88px; flex:0 0 88px; border-radius:18px; border:1px solid var(--line); overflow:hidden;
  background:#14152b; display:flex; align-items:center; justify-content:center; padding:9px; box-shadow:0 14px 40px -16px rgba(0,0,0,.6); }
.pg-logo img{ width:100%; height:100%; object-fit:contain; display:block; }
.pg-eyebrow{ font-family:var(--mono); font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--dim); margin:0 0 8px; }
.pg-title{ font-family:var(--display); font-size:clamp(26px,7vw,66px); font-weight:800; letter-spacing:-.03em; line-height:.98; margin:0; overflow-wrap:break-word; }
.pg-intro{ display:flex; align-items:flex-start; justify-content:space-between; gap:24px; flex-wrap:wrap; padding:26px 2px 0; }
.pg-tagline{ font-size:clamp(17px,1.7vw,21px); line-height:1.5; color:color-mix(in oklab,var(--ink) 88%, var(--dim)); margin:0; max-width:44ch; font-weight:500; }
.pg-actions{ display:flex; gap:11px; flex-wrap:wrap; align-items:center; }
@media (max-width:620px){ .pg-titlewrap{ flex-direction:column; align-items:flex-start; gap:14px; } .pg-logo{ width:64px; height:64px; flex-basis:64px; } }

/* lede */
.pg-lede{ padding:48px 0 6px; max-width:62ch; }
.pg-lede p{ font-family:var(--display); font-weight:500; font-size:clamp(17px,1.7vw,21px); line-height:1.45; letter-spacing:-.01em; color:var(--ink); margin:0 0 14px; }
.pg-lede p:last-child{ margin:0; color:color-mix(in oklab,var(--ink) 72%, var(--dim)); }
.pg-lede .hl{ color:var(--acc); }

/* section scaffold */
.pg-sec{ padding:64px 0 0; }
.pg-kicker{ font-family:var(--mono); font-size:12px; letter-spacing:.16em; text-transform:uppercase; color:var(--acc); display:flex; align-items:center; gap:12px; margin:0 0 16px; }
.pg-kicker::before{ content:''; width:26px; height:1px; background:var(--acc); }
.pg-h2{ font-family:var(--display); font-weight:700; font-size:clamp(26px,3.4vw,38px); letter-spacing:-.02em; line-height:1.05; margin:0 0 18px; max-width:20ch; }
.pg-p{ font-size:16px; line-height:1.72; color:color-mix(in oklab,var(--ink) 84%, var(--dim)); margin:0 0 16px; max-width:62ch; }
.pg-p strong{ color:var(--ink); font-weight:600; }

.pg-split{ display:grid; grid-template-columns:0.92fr 1.08fr; gap:clamp(28px,4vw,52px); align-items:center; }
.pg-split.rev{ grid-template-columns:1.08fr 0.92fr; }
.pg-split.rev .pg-figure{ order:-1; }
@media (max-width:860px){ .pg-split, .pg-split.rev{ grid-template-columns:1fr; gap:30px; } .pg-split.rev .pg-figure{ order:0; } }
.pg-figure{ margin:0; }
.pg-figbox{ background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:26px 24px; }
.pg-figcap{ font-family:var(--mono); font-size:11px; letter-spacing:.08em; color:var(--dim); margin-top:14px; text-transform:uppercase; }
.pg-gallery{ display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:8px; }
@media (max-width:720px){ .pg-gallery{ grid-template-columns:1fr; } }
.pg-shot{ border:1px solid var(--line); border-radius:16px; overflow:hidden; background:var(--panel); transition:border-color .18s, transform .18s; }
.pg-shot:hover{ border-color:var(--acc-dim); transform:translateY(-3px); }
.pg-shot .top{ display:flex; align-items:center; gap:10px; padding:12px 15px; border-bottom:1px solid var(--line); background:var(--panel2); }
.pg-shot .dots{ display:flex; gap:5px; flex:0 0 auto; }
.pg-shot .dots i{ width:9px; height:9px; border-radius:50%; display:block; background:var(--line); }
.pg-shot .url{ font-family:var(--mono); font-size:11px; color:var(--dim); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pg-shot .url b{ color:var(--acc-dim); font-weight:500; }
.pg-shot .frame{ position:relative; aspect-ratio:3 / 4; overflow:hidden; background:#1a1430; }
.pg-shot .frame img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top; }
.pg-shot .cap{ font-family:var(--mono); font-size:11px; letter-spacing:.04em; color:var(--dim); padding:12px 15px; border-top:1px solid var(--line); }
.pg-shot .cap b{ color:var(--ink); font-weight:600; }
.pg-dash{ margin-top:22px; border:1px solid var(--line); border-radius:16px; overflow:hidden; background:var(--panel); }
.pg-dash .top{ display:flex; align-items:center; gap:10px; padding:12px 15px; border-bottom:1px solid var(--line); background:var(--panel2); }
.pg-dash .dots{ display:flex; gap:5px; flex:0 0 auto; } .pg-dash .dots i{ width:9px; height:9px; border-radius:50%; background:var(--line); display:block; }
.pg-dash .url{ font-family:var(--mono); font-size:11px; color:var(--dim); } .pg-dash .url b{ color:var(--acc-dim); font-weight:500; }
.pg-dash .tag{ margin-left:auto; font-family:var(--mono); font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:var(--acc); border:1px solid color-mix(in srgb,var(--acc) 40%, var(--line)); border-radius:6px; padding:3px 8px; }
.pg-dash .frame{ position:relative; max-height:470px; overflow:hidden; background:#11162a; }
.pg-dash .frame img{ width:100%; display:block; }
.pg-dash .frame::after{ content:''; position:absolute; left:0; right:0; bottom:0; height:90px; background:linear-gradient(to top, var(--panel), transparent); pointer-events:none; }
.pg-dash .cap{ font-family:var(--mono); font-size:11px; color:var(--dim); padding:12px 15px; border-top:1px solid var(--line); line-height:1.5; }
.pg-dash .cap b{ color:var(--ink); font-weight:600; }

/* modes grid */
.pg-modes{ display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:24px; }
@media (max-width:780px){ .pg-modes{ grid-template-columns:1fr 1fr; } }
@media (max-width:520px){ .pg-modes{ grid-template-columns:1fr; } }
.pg-mode{ display:flex; gap:14px; align-items:flex-start; text-decoration:none; border:1px solid var(--line); border-radius:13px; padding:16px;
  background:color-mix(in srgb,var(--acc) 4%, var(--panel)); transition:border-color .15s, transform .15s; }
.pg-mode:hover{ border-color:var(--acc); transform:translateY(-2px); }
.pg-mode .mt{ font-family:var(--display); font-weight:600; font-size:15.5px; color:var(--ink); margin:0 0 4px; display:flex; align-items:center; gap:7px; }
.pg-mode .mt .arr{ color:var(--acc); opacity:0; transition:opacity .15s; font-size:13px; }
.pg-mode:hover .mt .arr{ opacity:1; }
.pg-mode p{ margin:0; font-size:12.5px; line-height:1.5; color:color-mix(in oklab,var(--ink) 74%, var(--dim)); }
.pg-modeimg{ width:42px; height:42px; flex:0 0 42px; object-fit:contain; }

/* engagement cells */
.pg-cells{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:24px; }
@media (max-width:780px){ .pg-cells{ grid-template-columns:1fr 1fr; } }
@media (max-width:520px){ .pg-cells{ grid-template-columns:1fr; } }
.pg-cell{ border:1px solid var(--line); border-radius:14px; padding:20px; background:var(--panel); transition:border-color .18s; }
.pg-cell:hover{ border-color:var(--acc-dim); }
.pg-cell .ch{ display:flex; align-items:center; gap:10px; margin:0 0 9px; }
.pg-cell .ch svg{ width:20px; height:20px; color:var(--acc); flex:0 0 auto; }
.pg-cell .ch span{ font-family:var(--display); font-weight:600; font-size:15px; color:var(--ink); }
.pg-cell p{ margin:0; font-size:13px; line-height:1.58; color:color-mix(in oklab,var(--ink) 74%, var(--dim)); }

/* multiplayer highlight (bidding war) */
.pg-bw{ display:flex; gap:14px; align-items:center; margin-top:16px; padding:16px 18px; border:1px solid var(--line); border-radius:13px;
  background:color-mix(in srgb,var(--acc) 6%, var(--panel)); }
.pg-bw .pg-modeicon{ width:24px; height:24px; }
.pg-bw .pg-bwimg{ width:34px; height:34px; flex:0 0 34px; object-fit:contain; }
.pg-bw b{ font-family:var(--display); color:var(--ink); font-weight:600; }
.pg-bw span{ font-size:13.5px; color:color-mix(in oklab,var(--ink) 76%, var(--dim)); }

/* tech stack */
.pg-stack{ margin-top:26px; border:1px solid var(--line); border-radius:16px; overflow:hidden; }
.pg-row{ display:grid; grid-template-columns:160px 1fr; gap:24px; padding:18px 24px; border-top:1px solid var(--line); align-items:baseline; }
.pg-row:first-child{ border-top:0; }
.pg-row:hover{ background:color-mix(in srgb,var(--acc) 4%, transparent); }
.pg-row dt{ font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); }
.pg-row dd{ margin:0; display:flex; flex-wrap:wrap; gap:7px; align-items:center; }
.pg-chip{ font-family:var(--mono); font-size:12px; color:var(--ink); border:1px solid var(--line); border-radius:7px; padding:5px 10px; background:color-mix(in srgb,var(--acc) 5%, var(--panel)); }
.pg-chip.key{ color:var(--acc); border-color:color-mix(in srgb,var(--acc) 45%, var(--line)); }
.pg-row dd .note{ font-family:var(--body); font-size:13px; color:var(--dim); }
@media (max-width:680px){ .pg-row{ grid-template-columns:1fr; gap:12px; } }

/* pricey cross-link */
.pg-related{ position:relative; margin-top:30px; border:1px solid var(--line); border-radius:18px; overflow:hidden; background:var(--panel);
  display:flex; align-items:center; gap:22px; padding:24px 28px; text-decoration:none; transition:border-color .18s, transform .18s; }
.pg-related:hover{ border-color:var(--acc); transform:translateY(-2px); }
.pg-related .rv{ position:absolute; inset:0; opacity:.16; color:var(--acc); }
.pg-related .ri{ position:relative; z-index:2; width:58px; height:58px; flex:0 0 58px; border-radius:14px; overflow:hidden; border:1px solid var(--line); background:#1d1518; padding:7px; }
.pg-related .ri img{ width:100%; height:100%; object-fit:contain; }
.pg-related .rt{ position:relative; z-index:2; flex:1; min-width:0; }
.pg-related .rt .k{ font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--acc); }
.pg-related .rt h3{ font-family:var(--display); font-weight:700; font-size:21px; color:var(--ink); margin:5px 0 4px; }
.pg-related .rt p{ margin:0; font-size:14px; color:color-mix(in oklab,var(--ink) 78%, var(--dim)); }
.pg-related .rgo{ position:relative; z-index:2; font-family:var(--mono); font-size:13px; color:var(--acc); white-space:nowrap; }

/* CTA */
.pg-cta{ position:relative; margin:70px 0 10px; border:1px solid var(--acc); border-radius:20px; overflow:hidden;
  background:radial-gradient(110% 160% at 100% 0%, color-mix(in srgb,var(--acc) 22%, var(--panel)), var(--panel)); padding:46px clamp(26px,5vw,52px); }
.pg-cta .mvbg{ position:absolute; inset:0; opacity:.16; color:var(--acc); }
.pg-cta .inner{ position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; gap:28px; flex-wrap:wrap; }
.pg-cta h2{ font-family:var(--display); font-weight:800; font-size:clamp(26px,3.4vw,40px); letter-spacing:-.02em; margin:0 0 8px; color:var(--ink); }
.pg-cta p{ margin:0; font-size:16px; color:color-mix(in oklab,var(--ink) 80%, var(--dim)); }
.pg-cta .big{ font-size:15px; padding:15px 28px; border-radius:12px; }
.pg-cta .url{ font-family:var(--mono); font-size:13px; color:var(--acc); margin-top:6px; display:block; }

/* prev/next */
.pg-nav{ display:grid; grid-template-columns:1fr 1fr; gap:16px; border-top:1px solid var(--line); margin-top:60px; padding:30px 0 80px; }
.pg-navcard{ position:relative; display:block; text-decoration:none; border:1px solid var(--line); border-radius:14px; overflow:hidden; background:var(--panel); transition:border-color .18s, transform .18s; min-height:96px; }
.pg-navcard:hover{ border-color:var(--acc-dim); transform:translateY(-2px); }
.pg-navcard .miniviz{ position:absolute; inset:0; opacity:.5; }
.pg-navcard .miniscrim{ position:absolute; inset:0; background:linear-gradient(90deg, var(--panel) 30%, color-mix(in srgb,var(--panel) 55%, transparent)); }
.pg-navcard .lbl{ position:relative; z-index:2; padding:20px 22px; }
.pg-navcard .dir{ font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); }
.pg-navcard .nm{ font-family:var(--display); font-size:20px; font-weight:600; color:var(--ink); margin-top:6px; }
.pg-navcard.next{ text-align:right; } .pg-navcard.next .miniscrim{ background:linear-gradient(270deg, var(--panel) 30%, color-mix(in srgb,var(--panel) 55%, transparent)); }
@media (max-width:560px){ .pg-nav{ grid-template-columns:1fr; } .pg-navcard.next{ text-align:left; } }
`;

const EI = {
  utm: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 15 15 9M10.5 6.5 12 5a4 4 0 0 1 6 6l-1.5 1.5M13.5 17.5 12 19a4 4 0 0 1-6-6l1.5-1.5"/></svg>,
  qr: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M17 21h4M21 17v4" strokeLinecap="round"/></svg>,
  analytics: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>,
  push: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M10.3 21a2 2 0 0 0 3.4 0"/></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>,
  trophy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M9 19h6M10 19v-3M14 19v-3M8 22h8"/></svg>,
};

function PriceGamesPage(){
  const [t, setTweak] = window.useShellTweaks();
  const { BASE_CSS, RW_CSS, MV_CSS, PG_DIAG_CSS, Nav, Footer, ProjectViz,
          MODE_ICON, PairingDiagram, AgentPipelineDiagram, LobbyMock, PriceGuessDemo,
          TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakSelect, TweakToggle } = window;
  const P = window.PORTFOLIO;
  const p = P.projects.find((x)=>x.id === "price-games");
  const list = P.projects;
  const idx = list.findIndex((x)=>x.id === "price-games");
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];
  const anim = t.vizAnim;
  const dgc = anim ? " pgd-anim" : "";
  const SITE = "https://price.games";

  const cls = ["tm", "rw"];
  if (t.lift) cls.push("motion-lift");
  const style = { "--acc": t.accent, "--display": PG_DISPLAY[t.display] || PG_DISPLAY["Syne"] };

  const stack = [
    { layer: "Frontend", key: ["React 18", "Vite 7", "TypeScript 5.4+"], rest: ["React Router 7"] },
    { layer: "Backend", key: ["Express", "Socket.IO"], rest: ["TypeScript"] },
    { layer: "Database", key: ["SQLite"], rest: ["better-sqlite3"] },
    { layer: "Auth", key: ["OAuth 2.0"], rest: ["bcryptjs", "httpOnly sessions", "Cloudflare Turnstile", "TOTP (admins)"], note: "Google · Facebook · Amazon" },
    { layer: "Email", key: ["Resend"], rest: [], note: "Verification, reset, notifications" },
    { layer: "Push", key: ["Web Push"], rest: ["VAPID"] },
    { layer: "Testing", key: ["Vitest"], rest: ["@vitest/coverage-v8", "React Testing Library"] },
    { layer: "Infra", key: ["Docker"], rest: ["docker-compose", "Caddy (auto HTTPS)", "Tailscale (admin)"] },
    { layer: "CI/CD", key: ["CircleCI"], rest: [], note: "build → tests → docker push → deploy" },
    { layer: "Monorepo", key: ["npm workspaces"], rest: [] },
  ];

  return (
    <div className={cls.join(" ")} data-theme={t.theme} data-bg={t.background || "weave"} style={style}>
      <style>{BASE_CSS + RW_CSS + MV_CSS + PG_DIAG_CSS + PG_PAGE_CSS}</style>
      <div className="tm-wrap">
        <Nav active="" />

        {/* hero */}
        <header className="pg-hero">
          <div className={"pg-band" + (anim ? " mv-anim" : "")}>
            {t.viz && <ProjectViz id="price-games" animate={anim} />}
            <div className="pg-scrim"></div>
            <div className="pg-status"><i></i> {p.status}</div>
            <div className="pg-titlewrap">
              <div className="pg-logo"><img src={p.logo} alt="Price Games logo" /></div>
              <div>
                <p className="pg-eyebrow">Project {p.n}</p>
                <h1 className="pg-title">Price Games</h1>
              </div>
            </div>
          </div>
          <div className="pg-intro">
            <p className="pg-tagline">{p.tagline}</p>
            <div className="pg-actions">
              <a className="tm-btn demo" href={SITE} target="_blank" rel="noopener">Play the games ↗</a>
              <a className="tm-btn ghost" href={p.repo} target="_blank" rel="noopener">GitHub ↗</a>
              <a className="tm-btn ghost" href={window.HOME_FILE}>← All projects</a>
            </div>
          </div>
        </header>

        {/* lede */}
        <section className="pg-lede">
          <p>Price Games is a free browser game about one tricky skill: knowing what things actually cost.</p>
          <p>It's a side-project with two jobs. As a game, it has <span className="hl">seven game modes, real Amazon prices, and live multiplayer</span>. As an engineering project, it's where I test marketing instrumentation and an agent-run build pipeline on something real people play.</p>
        </section>

        {/* game modes */}
        <section className="pg-sec">
          <p className="pg-kicker">The games</p>
          <h2 className="pg-h2">Seven ways to test your price instincts</h2>
          <p className="pg-p">Every mode runs on the same real-price data, so the skill carries from one to the next. No signup to play, whether solo or in multiplayer.</p>
          <div className="pg-modes">
            {PG_MODES.map((m)=>(
              <a className="pg-mode" key={m.n} href={SITE + m.href} target="_blank" rel="noopener">
                <img className="pg-modeimg" src={m.img} alt="" />
                <div>
                  <p className="mt">{m.n} <span className="arr">↗</span></p>
                  <p>{m.d}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* try a round */}
        <section className="pg-sec">
          <div className="pg-split">
            <div>
              <p className="pg-kicker">Try a round</p>
              <h2 className="pg-h2">Comparison mode, right here</h2>
              <p className="pg-p">Two real products, one question: which one costs more? It's the same loop the full game runs, just without leaving the page. Build a streak, then take it to the real thing.</p>
            </div>
            <figure className="pg-figure">
              <PriceGuessDemo />
              <figcaption className="pg-figcap">Live sample · prices are illustrative</figcaption>
            </figure>
          </div>
        </section>

        {/* real screens */}
        <section className="pg-sec">
          <p className="pg-kicker">The real thing</p>
          <h2 className="pg-h2">Straight from price.games</h2>
          <p className="pg-p">These are screenshots straight from the live web app: the game picker, and a round in progress. The interface keeps the action in one centered column, so a guess, a timer, and the field of players all stay in view at once.</p>
          <div className="pg-gallery">
            <div className="pg-shot">
              <div className="top"><span className="dots"><i></i><i></i><i></i></span><span className="url"><b>price.games</b></span></div>
              <div className="frame"><img src="portfolio/assets/pg-hero.png" alt="The Price Games home screen with the daily challenge and the grid of game modes" /></div>
              <div className="cap"><b>Pick a game</b> — daily challenge, multiplayer, and every mode</div>
            </div>
            <div className="pg-shot">
              <div className="top"><span className="dots"><i></i><i></i><i></i></span><span className="url"><b>price.games</b>/mp</span></div>
              <div className="frame"><img src="portfolio/assets/pg-round.png" alt="A Price Games round in progress: a Magna-Tiles set to price, a guess slider, a turn timer, and three players" /></div>
              <div className="cap"><b>In a round</b> — guess the price before the timer runs out</div>
            </div>
          </div>
        </section>

        {/* real prices + pairing */}
        <section className="pg-sec">
          <div className="pg-split rev">
            <figure className={"pg-figure" + dgc}>
              <div className="pg-figbox"><PairingDiagram /></div>
              <figcaption className="pg-figcap">Scrape listings → AI classify → match a round</figcaption>
            </figure>
            <div>
              <p className="pg-kicker">Real data</p>
              <h2 className="pg-h2">Real prices, matched on purpose</h2>
              <p className="pg-p">Every product and price comes from an actual Amazon listing. An AI pipeline scrapes those listings, then classifies each product by category and price tier.</p>
              <p className="pg-p">The game engine uses those labels to build matchups worth playing. In Comparison mode that means two genuinely comparable items, not a random pair where the answer is obvious.</p>
            </div>
          </div>
        </section>

        {/* multiplayer */}
        <section className="pg-sec">
          <div className="pg-split">
            <div>
              <p className="pg-kicker">Multiplayer</p>
              <h2 className="pg-h2">Bring friends, or fill seats with bots</h2>
              <p className="pg-p">Public and private lobbies run on shareable links: open a room, send the link, and play together in real time. Short on players? Add bots at a difficulty that fits the table.</p>
              <div className="pg-bw">
                <img className="pg-bwimg" src="portfolio/assets/modes/bidding-war.webp" alt="" />
                <span><b>Bidding War</b> is the multiplayer headliner: players bid in turns on one product, closest under the real price wins.</span>
              </div>
            </div>
            <figure className="pg-figure">
              <LobbyMock />
              <figcaption className="pg-figcap">Private lobby with a shareable invite link</figcaption>
            </figure>
          </div>
        </section>

        {/* engagement */}
        <section className="pg-sec">
          <p className="pg-kicker">Built to bring people back</p>
          <h2 className="pg-h2">Marketing instrumentation, built in</h2>
          <p className="pg-p">Price Games doubles as a test bed for growth tooling. The site tracks where players come from and gives them reasons to return, all on systems built for the project.</p>
          <div className="pg-cells">
            <div className="pg-cell"><div className="ch">{EI.utm}<span>UTM tracking</span></div><p>A custom tagging and tracking system attributes every visit to its source campaign.</p></div>
            <div className="pg-cell"><div className="ch">{EI.qr}<span>QR + short links</span></div><p>Short links and QR codes carry UTM data from print and screens into the same pipeline.</p></div>
            <div className="pg-cell"><div className="ch">{EI.analytics}<span>Custom analytics</span></div><p>A purpose-built analytics layer records games played and how sessions move between modes.</p></div>
            <div className="pg-cell"><div className="ch">{EI.push}<span>Push notifications</span></div><p>A self-hosted Web Push setup (VAPID) brings players back for giveaways and new modes.</p></div>
            <div className="pg-cell"><div className="ch">{EI.mail}<span>Email</span></div><p>Resend handles verification, password resets, and notification emails.</p></div>
            <div className="pg-cell"><div className="ch">{EI.trophy}<span>Leaderboard + giveaway</span></div><p>A running leaderboard and a monthly giveaway give regulars something to chase.</p></div>
          </div>
          <div className="pg-dash">
            <div className="top"><span className="dots"><i></i><i></i><i></i></span><span className="url">Analytics</span><span className="tag">Admin</span></div>
            <div className="frame"><img src="portfolio/assets/pg-analytics.png" alt="The custom analytics dashboard: games completed by variant over time, games completed by mode, and game starts by source" /></div>
            <div className="cap"><b>The custom analytics dashboard</b> — games by variant and mode over time, and where each game started: homepage, room link, quickplay, or the game browser.</div>
          </div>
        </section>

        {/* AI dev pipeline (standout) */}
        <section className="pg-sec">
          <p className="pg-kicker">How it's built</p>
          <h2 className="pg-h2">Made by agents, test-first</h2>
          <p className="pg-p">Price Games was written end to end with Claude Code, mostly Opus 4.7 and 4.8. It's the project where I push how much of a real build agents can own, from the first failing test to the deploy.</p>
          <figure className={"pg-figure" + dgc} style={{ marginTop: '24px' }}>
            <div className="pg-figbox"><AgentPipelineDiagram /></div>
            <figcaption className="pg-figcap">Test-driven loop · agent-authored PRs · sub-agent review · CI watched over MCP</figcaption>
          </figure>
          <p className="pg-p" style={{ marginTop: '24px' }}>Every change follows test-driven development: a failing test first, then the code to pass it. An agent opens the PR, spawns sub-agents for code and security review, implements their findings, and watches CI through to green over MCP before a human approves the merge. CircleCI builds, tests, pushes the Docker image, and deploys. The agents document the work in PR comments and the project docs as they go.</p>
        </section>

        {/* pricey cross-link */}
        <a className="pg-related" href="project-pricey.html">
          <div className={"rv" + (anim ? " mv-anim" : "")}>{t.viz && <ProjectViz id="pricey" animate={anim} />}</div>
          <div className="ri"><img src={P.projects.find((x)=>x.id==='pricey').logo} alt="Pricey logo" /></div>
          <div className="rt">
            <div className="k">Related project</div>
            <h3>Pricey plays this on Twitch</h3>
            <p>An AI streamer powered by a neural network that plays Price Games and improves as it goes.</p>
          </div>
          <span className="rgo">See Pricey →</span>
        </a>

        {/* tech stack */}
        <section className="pg-sec">
          <p className="pg-kicker">Under the hood</p>
          <h2 className="pg-h2">Tech stack</h2>
          <dl className="pg-stack">
            {stack.map((r,i)=>(
              <div className="pg-row" key={i}>
                <dt>{r.layer}</dt>
                <dd>
                  {r.key.map((k,j)=>(<span className="pg-chip key" key={'k'+j}>{k}</span>))}
                  {r.rest.map((k,j)=>(<span className="pg-chip" key={'r'+j}>{k}</span>))}
                  {r.note && <span className="note">{r.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <section className="pg-cta">
          <div className={"mvbg" + (anim ? " mv-anim" : "")}>{t.viz && <ProjectViz id="price-games" animate={anim} />}</div>
          <div className="inner">
            <div>
              <h2>Think you know what things cost?</h2>
              <p>Seven modes, real prices, no signup. Find out in a minute.</p>
              <span className="url">price.games</span>
            </div>
            <a className="tm-btn demo big" href={SITE} target="_blank" rel="noopener">Play the games ↗</a>
          </div>
        </section>

        {/* prev/next */}
        <nav className="pg-nav">
          <a className="pg-navcard prev" href={`project-${prev.id}.html`}>
            <div className={"miniviz" + (anim ? " mv-anim" : "")}><ProjectViz id={prev.id} animate={anim} /></div>
            <div className="miniscrim"></div>
            <div className="lbl"><div className="dir">← Previous</div><div className="nm">{prev.name}</div></div>
          </a>
          <a className="pg-navcard next" href={`project-${next.id}.html`}>
            <div className={"miniviz" + (anim ? " mv-anim" : "")}><ProjectViz id={next.id} animate={anim} /></div>
            <div className="miniscrim"></div>
            <div className="lbl"><div className="dir">Next →</div><div className="nm">{next.name}</div></div>
          </a>
        </nav>

        <Footer />
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Color & theme" />
        <TweakColor label="Accent" value={t.accent}
          options={window.ACCENTS}
          onChange={(v)=>setTweak('accent', v)} />
        <TweakRadio label="Theme" value={t.theme} options={["dark","light"]}
          onChange={(v)=>setTweak('theme', v)} />
        <TweakSection label="Typography" />
        <TweakSelect label="Display font" value={t.display}
          options={["Syne","Space Grotesk","Bricolage Grotesque"]}
          onChange={(v)=>setTweak('display', v)} />
        <TweakSection label="Visuals" />
        <TweakToggle label="Diagrams & visuals" value={t.viz} onChange={(v)=>setTweak('viz', v)} />
        <TweakToggle label="Animate" value={t.vizAnim} onChange={(v)=>setTweak('vizAnim', v)} />
        <TweakSection label="Motion & texture" />
        <TweakSelect label="Background" value={t.background}
          options={["grid","dots","diagonal","void","aurora","mesh","spotlight","grain","circuit","waves","plus","chevron","weave","triangles","blueprint"]}
          onChange={(v)=>setTweak('background', v)} />
        <TweakToggle label="Card hover lift" value={t.lift} onChange={(v)=>setTweak('lift', v)} />
      </TweaksPanel>
    </div>
  );
}
window.PriceGamesPage = PriceGamesPage;
