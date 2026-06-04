// Bespoke Pricey write-up page. Mount with <window.PriceyPage />.
const PCY_DISPLAY = {
  "Syne": "'Syne', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
  "Bricolage Grotesque": "'Bricolage Grotesque', sans-serif",
};

const PCY_PAGE_CSS = `
.tm.rw{ font-family:var(--body); --body:'Hanken Grotesk', system-ui, sans-serif; --mono:'JetBrains Mono', ui-monospace, monospace; }

.pcy-hero{ padding:26px 0 18px; }
.pcy-band{ position:relative; height:clamp(300px,42vw,420px); border:1px solid var(--line); border-radius:20px; overflow:hidden;
  background:radial-gradient(120% 130% at 50% 0%, color-mix(in srgb,var(--acc) 13%, var(--panel)), var(--panel)); }
.pcy-band .mv{ color:var(--acc); }
.pcy-scrim{ position:absolute; inset:0; pointer-events:none; background:linear-gradient(to top, var(--panel) 4%, color-mix(in srgb,var(--panel) 30%, transparent) 40%, transparent 72%); }
.pcy-status{ position:absolute; top:18px; right:18px; z-index:3; display:inline-flex; align-items:center; gap:8px; font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--ink);
  background:color-mix(in srgb,var(--bg) 60%, transparent); border:1px solid var(--acc); border-radius:100px; padding:7px 14px; }
.pcy-status i{ width:7px; height:7px; border-radius:50%; background:#e23b3b; box-shadow:0 0 9px #e23b3b; animation:pcyLive 1.4s ease-in-out infinite; }
@keyframes pcyLive{ 0%,100%{ opacity:1; } 50%{ opacity:.35; } }
.pcy-titlewrap{ position:absolute; left:0; right:0; bottom:0; z-index:2; display:flex; align-items:flex-end; gap:20px; padding:30px clamp(20px,4vw,40px); }
.pcy-logo{ width:88px; height:88px; flex:0 0 88px; border-radius:18px; border:1px solid var(--line); overflow:hidden; background:#1d1518; display:flex; align-items:center; justify-content:center; padding:7px; box-shadow:0 14px 40px -16px rgba(0,0,0,.6); }
.pcy-logo img{ width:100%; height:100%; object-fit:contain; display:block; }
.pcy-eyebrow{ font-family:var(--mono); font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--dim); margin:0 0 8px; }
.pcy-title{ font-family:var(--display); font-size:clamp(26px,7vw,66px); font-weight:800; letter-spacing:-.03em; line-height:.98; margin:0; overflow-wrap:break-word; }
.pcy-intro{ display:flex; align-items:flex-start; justify-content:space-between; gap:24px; flex-wrap:wrap; padding:26px 2px 0; }
.pcy-tagline{ font-size:clamp(17px,1.7vw,21px); line-height:1.5; color:color-mix(in oklab,var(--ink) 88%, var(--dim)); margin:0; max-width:48ch; font-weight:500; }
.pcy-actions{ display:flex; gap:11px; flex-wrap:wrap; align-items:center; }
@media (max-width:620px){ .pcy-titlewrap{ flex-direction:column; align-items:flex-start; gap:14px; } .pcy-logo{ width:64px; height:64px; flex-basis:64px; } }

.pcy-lede{ padding:48px 0 6px; max-width:62ch; }
.pcy-lede p{ font-family:var(--display); font-weight:500; font-size:clamp(17px,1.7vw,21px); line-height:1.45; letter-spacing:-.01em; color:var(--ink); margin:0 0 14px; }
.pcy-lede p:last-child{ margin:0; color:color-mix(in oklab,var(--ink) 72%, var(--dim)); }
.pcy-lede .hl{ color:var(--acc); }

/* stat band */
.pcy-stats{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:34px; }
@media (max-width:900px){ .pcy-stats{ grid-template-columns:1fr 1fr; } }
@media (max-width:480px){ .pcy-stats{ grid-template-columns:1fr; } }
.pcy-stat{ border:1px solid var(--line); border-radius:14px; padding:20px; background:var(--panel); }
.pcy-stat .v{ font-family:var(--display); font-weight:800; font-size:clamp(26px,3.2vw,34px); letter-spacing:-.02em; color:var(--acc); line-height:1; white-space:nowrap; }
.pcy-stat .l{ font-size:13px; color:color-mix(in oklab,var(--ink) 78%, var(--dim)); margin-top:8px; }
.pcy-stat .s{ font-family:var(--mono); font-size:10.5px; color:var(--dim); margin-top:3px; }

.pcy-sec{ padding:64px 0 0; }
.pcy-stream{ display:block; text-decoration:none; border:1px solid var(--line); border-radius:16px; overflow:hidden; margin-top:8px; background:var(--panel); transition:border-color .18s; }
.pcy-stream:hover{ border-color:var(--acc); }
.ps-bar{ display:flex; align-items:center; gap:12px; padding:12px 16px; border-bottom:1px solid var(--line); background:var(--panel2); flex-wrap:wrap; }
.ps-live{ display:inline-flex; align-items:center; gap:7px; font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink); }
.ps-live i{ width:8px; height:8px; border-radius:50%; background:#e23b3b; box-shadow:0 0 8px #e23b3b; animation:pcyLive 1.4s ease-in-out infinite; }
.ps-ch{ font-family:var(--mono); font-size:12px; color:var(--dim); }
.ps-cta{ margin-left:auto; font-family:var(--body); font-weight:600; font-size:12px; color:#0a130f; background:var(--acc); border-radius:8px; padding:8px 14px; white-space:nowrap; }
.ps-video{ position:relative; aspect-ratio:16 / 9; background:#000 center/cover no-repeat; background-image:url("portfolio/assets/pricey-stream.png"); }
.ps-video img{ width:100%; height:100%; object-fit:cover; display:block; }
.ps-video iframe{ position:absolute; inset:0; width:100%; height:100%; border:0; display:block; }
.ps-fallback{ position:absolute; inset:0; display:block; }
.ps-play{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; }
.ps-play span{ width:72px; height:72px; border-radius:50%; background:color-mix(in srgb,var(--acc) 92%, transparent); display:flex; align-items:center; justify-content:center; box-shadow:0 10px 34px rgba(0,0,0,.5); transition:transform .18s; }
.pcy-stream:hover .ps-play span{ transform:scale(1.08); }
.ps-play svg{ width:30px; height:30px; fill:#0a130f; margin-left:4px; }
.pcy-kicker{ font-family:var(--mono); font-size:12px; letter-spacing:.16em; text-transform:uppercase; color:var(--acc); display:flex; align-items:center; gap:12px; margin:0 0 16px; }
.pcy-kicker::before{ content:''; width:26px; height:1px; background:var(--acc); }
.pcy-h2{ font-family:var(--display); font-weight:700; font-size:clamp(26px,3.4vw,38px); letter-spacing:-.02em; line-height:1.05; margin:0 0 18px; max-width:22ch; }
.pcy-p{ font-size:16px; line-height:1.72; color:color-mix(in oklab,var(--ink) 84%, var(--dim)); margin:0 0 16px; max-width:62ch; }
.pcy-p strong{ color:var(--ink); font-weight:600; }
.pcy-figcap{ font-family:var(--mono); font-size:11px; letter-spacing:.08em; color:var(--dim); margin-top:14px; text-transform:uppercase; }

.pcy-split{ display:grid; grid-template-columns:0.95fr 1.05fr; gap:clamp(28px,4vw,52px); align-items:center; }
.pcy-split.rev{ grid-template-columns:1.05fr 0.95fr; }
.pcy-split.rev .pcy-figure{ order:-1; }
@media (max-width:860px){ .pcy-split, .pcy-split.rev{ grid-template-columns:1fr; gap:30px; } .pcy-split.rev .pcy-figure{ order:0; } }
.pcy-figure{ margin:0; }
.pcy-figbox{ background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:26px 24px; }

.pcy-callout{ display:flex; gap:18px; align-items:flex-start; margin-top:24px; padding:22px 26px; border:1px solid var(--line); border-left:3px solid var(--acc); border-radius:14px; background:color-mix(in srgb,var(--acc) 6%, var(--panel)); }
.pcy-callout h3{ font-family:var(--display); font-weight:600; font-size:17px; color:var(--ink); margin:0 0 7px; }
.pcy-callout p{ margin:0; font-size:14px; line-height:1.62; color:color-mix(in oklab,var(--ink) 80%, var(--dim)); max-width:70ch; }
.pcy-cite{ font-family:var(--mono); font-size:11px; color:var(--dim); margin-top:14px; }
.pcy-cite a{ color:var(--acc); text-decoration:none; border-bottom:1px solid color-mix(in srgb,var(--acc) 35%, transparent); transition:border-color .15s; }
.pcy-cite a:hover{ border-color:var(--acc); }

.pcy-stack{ margin-top:26px; border:1px solid var(--line); border-radius:16px; overflow:hidden; }
.pcy-row{ display:grid; grid-template-columns:150px 1fr; gap:24px; padding:18px 24px; border-top:1px solid var(--line); align-items:baseline; }
.pcy-row:first-child{ border-top:0; }
.pcy-row dt{ font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); }
.pcy-row dd{ margin:0; display:flex; flex-wrap:wrap; gap:7px; }
.pcy-chip{ font-family:var(--mono); font-size:12px; color:var(--ink); border:1px solid var(--line); border-radius:7px; padding:5px 10px; background:color-mix(in srgb,var(--acc) 5%, var(--panel)); }
.pcy-chip.key{ color:var(--acc); border-color:color-mix(in srgb,var(--acc) 45%, var(--line)); }
@media (max-width:620px){ .pcy-row{ grid-template-columns:1fr; gap:10px; } }

.pcy-persona{ display:grid; grid-template-columns:auto 1fr; gap:28px; align-items:center; margin-top:24px; padding:28px; border:1px solid var(--line); border-radius:18px; background:var(--panel); }
@media (max-width:620px){ .pcy-persona{ grid-template-columns:1fr; gap:18px; text-align:left; } }
.pcy-persona .av{ width:128px; height:128px; border-radius:18px; border:1px solid var(--line); background:#1d1518; padding:12px; }
.pcy-persona .av img{ width:100%; height:100%; object-fit:contain; }
.pcy-persona p{ margin:0 0 14px; font-size:15px; line-height:1.66; color:color-mix(in oklab,var(--ink) 84%, var(--dim)); }
.pcy-persona p:last-child{ margin:0; }
.pcy-tags2{ display:flex; flex-wrap:wrap; gap:8px; margin-top:4px; }
.pcy-tags2 span{ font-family:var(--mono); font-size:11px; color:var(--acc-dim); border:1px solid var(--line); border-radius:20px; padding:5px 11px; }
.pcy-tour{ position:relative; margin-top:16px; border:1px solid var(--line); border-radius:16px; overflow:hidden; }
.pcy-tour img{ width:100%; display:block; }
.pcy-tour .pin{ position:absolute; transform:translateY(-50%); display:flex; align-items:center; gap:8px; z-index:2; }
.pcy-tour .pin .dot{ width:12px; height:12px; border-radius:50%; flex:0 0 auto; background:var(--acc); box-shadow:0 0 0 4px color-mix(in srgb,var(--acc) 24%, transparent), 0 0 12px var(--acc); }
.pcy-tour .pin .lab{ font-family:var(--mono); font-size:10.5px; font-weight:600; color:#0a130f; background:var(--acc); border-radius:6px; padding:3px 8px; white-space:nowrap; }
.pcy-tourcap{ font-family:var(--mono); font-size:11px; letter-spacing:.08em; color:var(--dim); margin-top:14px; text-transform:uppercase; }
@media (max-width:600px){ .pcy-tour .pin .lab{ display:none; } }
.pcy-related{ position:relative; margin-top:64px; border:1px solid var(--line); border-radius:18px; overflow:hidden; background:var(--panel); display:flex; align-items:center; gap:22px; padding:24px 28px; text-decoration:none; transition:border-color .18s, transform .18s; }
.pcy-related:hover{ border-color:var(--acc); transform:translateY(-2px); }
.pcy-related .rv{ position:absolute; inset:0; opacity:.16; color:var(--acc); }
.pcy-related .ri{ position:relative; z-index:2; width:58px; height:58px; flex:0 0 58px; border-radius:14px; overflow:hidden; border:1px solid var(--line); background:#14152b; padding:7px; }
.pcy-related .ri img{ width:100%; height:100%; object-fit:contain; }
.pcy-related .rt{ position:relative; z-index:2; flex:1; }
.pcy-related .rt .k{ font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--acc); }
.pcy-related .rt h3{ font-family:var(--display); font-weight:700; font-size:21px; color:var(--ink); margin:5px 0 4px; }
.pcy-related .rt p{ margin:0; font-size:14px; color:color-mix(in oklab,var(--ink) 78%, var(--dim)); }
.pcy-related .rgo{ position:relative; z-index:2; font-family:var(--mono); font-size:13px; color:var(--acc); white-space:nowrap; }
@media (max-width:560px){ .pcy-related{ flex-wrap:wrap; gap:14px; } .pcy-related .rgo{ width:100%; } }

.pcy-cta{ position:relative; margin:70px 0 10px; border:1px solid var(--acc); border-radius:20px; overflow:hidden; background:radial-gradient(110% 160% at 100% 0%, color-mix(in srgb,var(--acc) 22%, var(--panel)), var(--panel)); padding:46px clamp(26px,5vw,52px); }
.pcy-cta .mvbg{ position:absolute; inset:0; opacity:.16; color:var(--acc); }
.pcy-cta .inner{ position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; gap:28px; flex-wrap:wrap; }
.pcy-cta h2{ font-family:var(--display); font-weight:800; font-size:clamp(26px,3.4vw,40px); letter-spacing:-.02em; margin:0 0 8px; color:var(--ink); }
.pcy-cta p{ margin:0; font-size:16px; color:color-mix(in oklab,var(--ink) 80%, var(--dim)); }
.pcy-cta .big{ font-size:15px; padding:15px 28px; border-radius:12px; }
.pcy-cta .url{ font-family:var(--mono); font-size:13px; color:var(--acc); margin-top:6px; display:block; }

.pcy-nav{ display:grid; grid-template-columns:1fr 1fr; gap:16px; border-top:1px solid var(--line); margin-top:60px; padding:30px 0 80px; }
.pcy-navcard{ position:relative; display:block; text-decoration:none; border:1px solid var(--line); border-radius:14px; overflow:hidden; background:var(--panel); transition:border-color .18s, transform .18s; min-height:96px; }
.pcy-navcard:hover{ border-color:var(--acc-dim); transform:translateY(-2px); }
.pcy-navcard .miniviz{ position:absolute; inset:0; opacity:.5; }
.pcy-navcard .miniscrim{ position:absolute; inset:0; background:linear-gradient(90deg, var(--panel) 30%, color-mix(in srgb,var(--panel) 55%, transparent)); }
.pcy-navcard .lbl{ position:relative; z-index:2; padding:20px 22px; }
.pcy-navcard .dir{ font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); }
.pcy-navcard .nm{ font-family:var(--display); font-size:20px; font-weight:600; color:var(--ink); margin-top:6px; }
.pcy-navcard.next{ text-align:right; } .pcy-navcard.next .miniscrim{ background:linear-gradient(270deg, var(--panel) 30%, color-mix(in srgb,var(--panel) 55%, transparent)); }
@media (max-width:560px){ .pcy-nav{ grid-template-columns:1fr; } .pcy-navcard.next{ text-align:left; } }
`;

function PriceyPage(){
  const [t, setTweak] = window.useShellTweaks();
  const { BASE_CSS, RW_CSS, MV_CSS, PR_VIZ_CSS, PR_MOOD_CSS, Nav, Footer, ProjectViz,
          BrainTopology, LearningCurve, MoodBars, ArchPipeline, MoodGains, MoodWheel, MoodLines,
          TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakSelect, TweakToggle } = window;
  const P = window.PORTFOLIO;
  const p = P.projects.find((x)=>x.id === "pricey");
  const list = P.projects;
  const idx = list.findIndex((x)=>x.id === "pricey");
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];
  const anim = t.vizAnim;
  const vc = anim ? " prv-anim" : "";
  const TWITCH = "https://www.twitch.tv/pricegamespricey";
  const twHost = (typeof window !== "undefined" && window.location && window.location.hostname) ? window.location.hostname : "";

  const cls = ["tm", "rw"];
  if (t.lift) cls.push("motion-lift");
  const style = { "--acc": t.accent, "--display": PCY_DISPLAY[t.display] || PCY_DISPLAY["Syne"] };

  const stats = [
    { v: "48,205", l: "training rounds", s: "live, and counting" },
    { v: "~7,000", l: "Float32 weights", s: "tens of KB" },
    { v: "<2 ms", l: "per-round fwd+back", s: "2 pinned CPU cores" },
    { v: "48→53%", l: "correct-rate climb", s: "first 1k vs recent 1k" },
  ];
  const stack = [
    { layer: "Capture", key: ["Playwright", "ffmpeg"], rest: ["Chromium", "Xvfb", "nginx-rtmp"] },
    { layer: "Audio", key: ["Piper TTS"], rest: ["mpd", "PulseAudio"] },
    { layer: "Brain", key: ["worker-thread MLP"], rest: ["online learning", "AdamW"] },
    { layer: "Network", key: ["Tailscale"], rest: ["remote game host"] },
  ];

  return (
    <div className={cls.join(" ")} data-theme={t.theme} data-bg={t.background || "weave"} style={style}>
      <style>{BASE_CSS + RW_CSS + MV_CSS + PR_VIZ_CSS + PR_MOOD_CSS + PCY_PAGE_CSS}</style>
      <div className="tm-wrap">
        <Nav active="" />

        {/* hero */}
        <header className="pcy-hero">
          <div className={"pcy-band" + (anim ? " mv-anim" : "")}>
            {t.viz && <ProjectViz id="pricey" animate={anim} />}
            <div className="pcy-scrim"></div>
            <div className="pcy-status"><i></i> {p.status}</div>
            <div className="pcy-titlewrap">
              <div className="pcy-logo"><img src={p.logo} alt="Pricey avatar" /></div>
              <div>
                <p className="pcy-eyebrow">Project {p.n}</p>
                <h1 className="pcy-title">Pricey</h1>
              </div>
            </div>
          </div>
          <div className="pcy-intro">
            <p className="pcy-tagline">{p.tagline}</p>
            <div className="pcy-actions">
              <a className="tm-btn demo" href={TWITCH} target="_blank" rel="noopener">Watch live ↗</a>
              <a className="tm-btn ghost" href={p.repo} target="_blank" rel="noopener">GitHub ↗</a>
              <a className="tm-btn ghost" href={window.HOME_FILE}>← All projects</a>
            </div>
          </div>
        </header>

        {/* lede + stats */}
        <section className="pcy-lede">
          <p>Pricey is a 24/7 AI streamer. She logs into <a href="project-price-games.html" style={{ color: 'var(--acc)', textDecoration: 'none', borderBottom: '1px solid color-mix(in srgb, var(--acc) 40%, transparent)' }}>Price Games</a> like any other player, guesses the prices of real products round after round, narrates her reasoning out loud, and broadcasts the whole thing to Twitch.</p>
          <p>Two things make her more than a bot playing a game: <span className="hl">a tiny neural network that learns on stream</span>, and a simulated mood wired straight into it that changes both what she says and how she plays.</p>
          <div className="pcy-stats">
            {stats.map((s,i)=>(<div className="pcy-stat" key={i}><div className="v">{s.v}</div><div className="l">{s.l}</div><div className="s">{s.s}</div></div>))}
          </div>
        </section>

        {/* live on twitch */}
        <section className="pcy-sec">
          <p className="pcy-kicker">Live on Twitch</p>
          <h2 className="pcy-h2">Watch her play, right now</h2>
          <p className="pcy-p">Pricey streams around the clock. The overlay shows her avatar and mood ring, a running win/loss and streak, her live "brain" panels, and the thought bubble narrating each guess, all on top of the real game.</p>
          <div className="pcy-stream">
            <div className="ps-bar">
              <span className="ps-live"><i></i> Live</span>
              <span className="ps-ch">twitch.tv/pricegamespricey</span>
              <a className="ps-cta" href={TWITCH} target="_blank" rel="noopener">Watch on Twitch ↗</a>
            </div>
            <div className="ps-video">
              {twHost
                ? <iframe title="Pricey live on Twitch" src={`https://player.twitch.tv/?channel=pricegamespricey&parent=${twHost}&muted=true&autoplay=true`} allowFullScreen frameBorder="0" scrolling="no"></iframe>
                : <a className="ps-fallback" href={TWITCH} target="_blank" rel="noopener"><img src="portfolio/assets/pricey-stream.png" alt="Pricey playing Price Games live on Twitch, with her avatar, mood wheel, neural-network brain panel, and a price-guess slider" /><span className="ps-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span></a>}
            </div>
          </div>
        </section>

        {/* the brain */}
        <section className="pcy-sec">
          <div className="pcy-split rev">
            <figure className={"pcy-figure" + vc}>
              <div className="pcy-figbox"><BrainTopology /></div>
              <figcaption className="pcy-figcap">140 features → 32 → 16 → six task heads</figcaption>
            </figure>
            <div>
              <p className="pcy-kicker">The brain</p>
              <h2 className="pcy-h2">A hand-rolled net, no PyTorch</h2>
              <p className="pcy-p">Pricey's brain is a tiny multi-task network where every weight is a Float32 array the author owns byte for byte. A 140-feature read of each product runs through a small trunk into six heads, one per job: a 103-bin price belief, a cents estimate, a "which is pricier" call, a safe-bid floor, an uncertainty signal, and a mood head.</p>
              <p className="pcy-p">It doesn't predict the raw price. It predicts where a simple built-in estimator is <strong>wrong</strong>, so it only has to learn the hard part. Forward, backward, and the optimizer step all finish in under 2 ms.</p>
            </div>
          </div>
        </section>

        {/* learning */}
        <section className="pcy-sec">
          <div className="pcy-split">
            <div>
              <p className="pcy-kicker">Learning in public</p>
              <h2 className="pcy-h2">She gets better on camera</h2>
              <p className="pcy-p">The network trains while it plays. Across roughly 48,000 logged rounds, her self-graded correct-rate climbed from <strong>48.4% to 53.3%</strong>, comparing her first thousand rounds to her most recent thousand.</p>
              <p className="pcy-p">Getting there took real network surgery: an early build collapsed its heads and starved several game modes, and one feature column that sat at zero for 1,500 rounds detonated the gradients the moment it saw real data. Re-specialized heads, action-masking to feasible prices, and a looser gradient clip turned the curve back upward.</p>
            </div>
            <figure className={"pcy-figure" + vc}>
              <div className="pcy-figbox"><LearningCurve /></div>
              <figcaption className="pcy-figcap">Self-graded correct-rate · 5k-round windows</figcaption>
            </figure>
          </div>
        </section>

        {/* mood wheel */}
        <section className="pcy-sec">
          <p className="pcy-kicker">The mood</p>
          <h2 className="pcy-h2">Eight moods, on two hidden dials</h2>
          <p className="pcy-p">A fast "vibe" reads the last few rounds and a slow "morale" tracks whole games. A small table over those two, plus her current streak, resolves to one of eight moods. One lucky guess can't fake a comeback, but a genuinely good session lifts her, and a long streak either way reads as locked-in focus.</p>
          <figure className="pcy-figure" style={{ marginTop: '8px' }}>
            <div className="pcy-figbox"><MoodWheel /></div>
          </figure>
        </section>

        {/* mood rewires play */}
        <section className="pcy-sec">
          <div className="pcy-split rev">
            <figure className="pcy-figure">
              <MoodGains />
            </figure>
            <div>
              <p className="pcy-kicker">Mood → optimizer</p>
              <h2 className="pcy-h2">Her feelings rewire how she plays</h2>
              <p className="pcy-p">The mood isn't a costume painted on top. It turns into three multiplicative gains on her decisions and her learning, all exactly identity when a master knob is off, so there's a provably emotionless baseline to compare against.</p>
              <p className="pcy-p">The grounding is real affective-neuroscience: arousal-biased competition makes her learn harder from high-stakes rounds whether she's up or down, and mood-as-momentum makes her over-credit whatever matches her mood. She gets streaky and superstitious for the same computational reason people do.</p>
              <p className="pcy-cite">GANE — <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3110019/" target="_blank" rel="noopener">Mather &amp; Sutherland (2011)</a> · Mood-congruent learning — <a href="https://www.nature.com/articles/ncomms7149" target="_blank" rel="noopener">Eldar &amp; Niv (2015)</a></p>
            </div>
          </div>
        </section>

        {/* verbatim lines */}
        <section className="pcy-sec">
          <p className="pcy-kicker">In her words</p>
          <h2 className="pcy-h2">Same win, very different deliveries</h2>
          <p className="pcy-p">Every round maps to a line, and her mood biases which pool it's drawn from. Her voice changes too: Piper TTS speeds up when she's winning and drags when she's losing, and a test forbids ever making a defeated line sound chipper.</p>
          <MoodLines />
        </section>

        {/* mood distribution */}
        <section className="pcy-sec">
          <div className="pcy-split">
            <div>
              <p className="pcy-kicker">How she feels, lifetime</p>
              <h2 className="pcy-h2">Mostly upbeat, occasionally despairing</h2>
              <p className="pcy-p">Tallied across every round she's played, Pricey runs warm. Happy and neutral dominate, elation spikes on streaks, and despondent is rare, the bottom of a curve she usually climbs back out of.</p>
            </div>
            <figure className={"pcy-figure" + vc}>
              <div className="pcy-figbox"><MoodBars /></div>
              <figcaption className="pcy-figcap">Lifetime mood counts, from the live DB</figcaption>
            </figure>
          </div>
        </section>

        {/* architecture */}
        <section className="pcy-sec">
          <p className="pcy-kicker">The system</p>
          <h2 className="pcy-h2">A small distributed broadcast</h2>
          <p className="pcy-p">Pricey is several moving parts. A headless Chromium runs the game and a custom overlay, ffmpeg grabs the framebuffer and audio, and an nginx-rtmp loopback fans one encode out to every platform. Her voice is local Piper TTS mixed with music, and the brain runs in a worker thread on its own cores. The game she plays lives on a separate machine, reached over a Tailscale tailnet.</p>
          <figure className={"pcy-figure" + vc} style={{ marginTop: '8px' }}>
            <div className="pcy-figbox"><ArchPipeline /></div>
            <figcaption className="pcy-figcap">Remote game · capture · encode · RTMP fan-out</figcaption>
          </figure>
          <dl className="pcy-stack">
            {stack.map((r,i)=>(
              <div className="pcy-row" key={i}>
                <dt>{r.layer}</dt>
                <dd>{r.key.map((k,j)=>(<span className="pcy-chip key" key={'k'+j}>{k}</span>))}{r.rest.map((k,j)=>(<span className="pcy-chip" key={'r'+j}>{k}</span>))}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* persona */}
        <section className="pcy-sec">
          <p className="pcy-kicker">Persona</p>
          <h2 className="pcy-h2">A piggy bank with opinions</h2>
          <div className="pcy-persona">
            <div className="av"><img src={p.logo} alt="Pricey avatar" /></div>
            <div>
              <p>Pricey is a piggy-bank character drawn across 24 sprites, eight moods by three mouth shapes, so her body language shifts with her mood and her mouth lip-syncs to the live voice. The show around her adds a thinking bubble, an aim reticle that telegraphs each click, subtitles, music, and multi-platform chat with viewer commands.</p>
              <p><strong>She is not an LLM.</strong> Her lines come from a large hand-authored, mood-biased library read by local TTS. Her intelligence is the price-prediction network and the affect engine, not a chatbot reading the screen.</p>
              <div className="pcy-tags2"><span>piggy-bank avatar</span><span>24 mood sprites</span><span>Piper TTS</span><span>!hint · !stats · !join</span></div>
            </div>
          </div>
          <figure className="pcy-tour" style={{ margin: 0 }}>
            <img src="portfolio/assets/pricey-stream.png" alt="An annotated frame of Pricey's stream overlay" />
            {[
              { left: 23, top: 17, l: "Thought bubble" },
              { left: 10, top: 51, l: "Mood wheel" },
              { left: 10, top: 80, l: "Live neural net" },
              { left: 49, top: 13, l: "W/L · streak" },
              { left: 50, top: 73, l: "Her guess" },
            ].map((pin,i)=>(
              <span className="pin" key={i} style={{ left: pin.left + '%', top: pin.top + '%' }}>
                <span className="dot"></span><span className="lab">{pin.l}</span>
              </span>
            ))}
          </figure>
          <figcaption className="pcy-tourcap">The glass-shell overlay, live over the real game</figcaption>
        </section>

        {/* related: price games */}
        <a className="pcy-related" href="project-price-games.html">
          <div className={"rv" + (anim ? " mv-anim" : "")}>{t.viz && <ProjectViz id="price-games" animate={anim} />}</div>
          <div className="ri"><img src={P.projects.find((x)=>x.id==='price-games').logo} alt="Price Games logo" /></div>
          <div className="rt">
            <div className="k">The game she plays</div>
            <h3>Price Games</h3>
            <p>The free browser pricing game Pricey competes in, round after round. See how it's built.</p>
          </div>
          <span className="rgo">See Price Games →</span>
        </a>

        {/* CTA */}
        <section className="pcy-cta">
          <div className={"mvbg" + (anim ? " mv-anim" : "")}>{t.viz && <ProjectViz id="pricey" animate={anim} />}</div>
          <div className="inner">
            <div>
              <h2>Can you beat Pricey?</h2>
              <p>She's live right now, learning and emoting in real time.</p>
              <span className="url">twitch.tv/pricegamespricey</span>
            </div>
            <a className="tm-btn demo big" href={TWITCH} target="_blank" rel="noopener">Watch live ↗</a>
          </div>
        </section>

        {/* prev/next */}
        <nav className="pcy-nav">
          <a className="pcy-navcard prev" href={`project-${prev.id}.html`}>
            <div className={"miniviz" + (anim ? " mv-anim" : "")}><ProjectViz id={prev.id} animate={anim} /></div>
            <div className="miniscrim"></div>
            <div className="lbl"><div className="dir">← Previous</div><div className="nm">{prev.name}</div></div>
          </a>
          <a className="pcy-navcard next" href={`project-${next.id}.html`}>
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
window.PriceyPage = PriceyPage;
