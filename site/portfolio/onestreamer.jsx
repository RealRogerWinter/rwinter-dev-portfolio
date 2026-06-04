// Bespoke OneStreamer write-up page. Mount with <window.OneStreamerPage />.
// Reuses: BASE_CSS, RW_CSS, MV_CSS, Nav, Footer, ProjectViz, StreamViz,
//   OS_DIAG_CSS + TakeoverDiagram/ViewerPipelineDiagram/ArchitectureDiagram.

const OS_DISPLAY = {
  "Syne": "'Syne', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
  "Bricolage Grotesque": "'Bricolage Grotesque', sans-serif",
};

const OS_PAGE_CSS = `
.tm.rw{ font-family:var(--body); --body:'Hanken Grotesk', system-ui, sans-serif; --mono:'JetBrains Mono', ui-monospace, monospace; }

/* hero */
.os-hero{ padding:26px 0 18px; }
.os-band{ position:relative; height:clamp(300px,42vw,420px); border:1px solid var(--line); border-radius:20px; overflow:hidden;
  background:radial-gradient(120% 130% at 50% 0%, color-mix(in srgb,var(--acc) 13%, var(--panel)), var(--panel)); }
.os-band .mv{ color:var(--acc); }
.os-scrim{ position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(to top, var(--panel) 4%, color-mix(in srgb,var(--panel) 30%, transparent) 40%, transparent 72%); }
.os-status{ position:absolute; top:18px; right:18px; z-index:3; display:inline-flex; align-items:center; gap:8px;
  font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--ink);
  background:color-mix(in srgb,var(--bg) 60%, transparent); border:1px solid var(--acc); border-radius:100px; padding:7px 14px; }
.os-status i{ width:7px; height:7px; border-radius:50%; background:var(--acc); box-shadow:0 0 9px var(--acc); animation:osLiveDot 1.4s ease-in-out infinite; }
@keyframes osLiveDot{ 0%,100%{ opacity:1; } 50%{ opacity:.35; } }
.os-titlewrap{ position:absolute; left:0; right:0; bottom:0; z-index:2; display:flex; align-items:flex-end; gap:20px; padding:30px clamp(20px,4vw,40px); }
.os-logo{ width:88px; height:88px; flex:0 0 88px; border-radius:18px; border:1px solid var(--line); overflow:hidden;
  background:#000; display:flex; align-items:center; justify-content:center; padding:9px; box-shadow:0 14px 40px -16px rgba(0,0,0,.6); }
.os-logo img{ width:100%; height:100%; object-fit:contain; display:block; }
.os-eyebrow{ font-family:var(--mono); font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--dim); margin:0 0 8px; }
.os-title{ font-family:var(--display); font-size:clamp(26px,7vw,66px); font-weight:800; letter-spacing:-.03em; line-height:.98; margin:0; overflow-wrap:break-word; }
.os-intro{ display:flex; align-items:flex-start; justify-content:space-between; gap:24px; flex-wrap:wrap; padding:26px 2px 0; }
.os-tagline{ font-size:clamp(17px,1.7vw,21px); line-height:1.5; color:color-mix(in oklab,var(--ink) 88%, var(--dim)); margin:0; max-width:46ch; font-weight:500; }
.os-actions{ display:flex; gap:11px; flex-wrap:wrap; align-items:center; }
@media (max-width:620px){ .os-titlewrap{ flex-direction:column; align-items:flex-start; gap:14px; } .os-logo{ width:64px; height:64px; flex-basis:64px; } }

/* lede */
.os-lede{ padding:48px 0 6px; max-width:62ch; }
.os-lede p{ font-family:var(--display); font-weight:500; font-size:clamp(17px,1.7vw,21px); line-height:1.45; letter-spacing:-.01em;
  color:var(--ink); margin:0 0 14px; }
.os-lede p:last-child{ margin:0; color:color-mix(in oklab,var(--ink) 72%, var(--dim)); }
.os-lede .hl{ color:var(--acc); }

/* section scaffold */
.os-sec{ padding:64px 0 0; }
.os-kicker{ font-family:var(--mono); font-size:12px; letter-spacing:.16em; text-transform:uppercase; color:var(--acc);
  display:flex; align-items:center; gap:12px; margin:0 0 16px; }
.os-kicker::before{ content:''; width:26px; height:1px; background:var(--acc); }
.os-h2{ font-family:var(--display); font-weight:700; font-size:clamp(26px,3.4vw,38px); letter-spacing:-.02em; line-height:1.05; margin:0 0 18px; max-width:20ch; }
.os-p{ font-size:16px; line-height:1.72; color:color-mix(in oklab,var(--ink) 84%, var(--dim)); margin:0 0 16px; max-width:62ch; }
.os-p strong{ color:var(--ink); font-weight:600; }
.os-doclink{ display:inline-flex; align-items:center; gap:7px; margin-top:6px; font-family:var(--mono); font-size:13px;
  color:var(--acc); text-decoration:none; border-bottom:1px solid color-mix(in srgb,var(--acc) 40%, transparent); padding-bottom:2px; transition:border-color .15s; }
.os-doclink:hover{ border-color:var(--acc); }

/* split: text + diagram */
.os-split{ display:grid; grid-template-columns:0.92fr 1.08fr; gap:clamp(28px,4vw,52px); align-items:center; }
.os-split.rev{ grid-template-columns:1.08fr 0.92fr; }
.os-split.rev .os-figure{ order:-1; }
@media (max-width:860px){ .os-split, .os-split.rev{ grid-template-columns:1fr; gap:30px; } .os-split.rev .os-figure{ order:0; } }

.os-figure{ margin:0; }
.os-figbox{ background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:26px 24px; }
.os-figcap{ font-family:var(--mono); font-size:11px; letter-spacing:.08em; color:var(--dim); margin-top:14px; text-transform:uppercase; }
.os-tour{ position:relative; margin-top:16px; border:1px solid var(--line); border-radius:16px; overflow:hidden; }
.os-tour img{ width:100%; height:auto; display:block; }
.os-tour .pin{ position:absolute; transform:translateY(-50%); display:flex; align-items:center; gap:8px; z-index:2; }
.os-tour .pin.r{ flex-direction:row-reverse; transform:translate(-100%,-50%); }
.os-tour .pin .dot{ width:12px; height:12px; border-radius:50%; flex:0 0 auto; background:var(--acc); box-shadow:0 0 0 4px color-mix(in srgb,var(--acc) 24%, transparent), 0 0 12px var(--acc); }
.os-tour .pin .lab{ font-family:var(--mono); font-size:10.5px; font-weight:600; color:#0a130f; background:var(--acc); border-radius:6px; padding:3px 8px; white-space:nowrap; }
@media (max-width:600px){ .os-tour .pin .lab{ display:none; } }

/* moves (takeover) */
.os-moves{ display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:24px; }
@media (max-width:680px){ .os-moves{ grid-template-columns:1fr; } }
.os-move{ border:1px solid var(--line); border-radius:13px; padding:18px; background:color-mix(in srgb,var(--acc) 4%, var(--panel)); }
.os-move .mh{ display:flex; align-items:center; gap:9px; font-family:var(--display); font-weight:600; font-size:16px; color:var(--ink); margin:0 0 8px; }
.os-move .mh svg{ width:18px; height:18px; color:var(--acc); flex:0 0 auto; }
.os-move p{ margin:0; font-size:13.5px; line-height:1.6; color:color-mix(in oklab,var(--ink) 76%, var(--dim)); }

/* moderation callout */
.os-callout{ display:flex; gap:20px; align-items:flex-start; margin-top:28px; padding:26px 28px;
  border:1px solid var(--line); border-left:3px solid var(--acc); border-radius:14px;
  background:color-mix(in srgb,var(--acc) 6%, var(--panel)); }
.os-callout .ci{ flex:0 0 auto; width:42px; height:42px; border-radius:11px; display:flex; align-items:center; justify-content:center;
  background:color-mix(in srgb,var(--acc) 16%, transparent); color:var(--acc); }
.os-callout .ci svg{ width:22px; height:22px; }
.os-callout h3{ font-family:var(--display); font-weight:600; font-size:18px; color:var(--ink); margin:2px 0 8px; }
.os-callout p{ margin:0; font-size:14.5px; line-height:1.65; color:color-mix(in oklab,var(--ink) 80%, var(--dim)); max-width:64ch; }

/* effects cells */
.os-cells{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:24px; }
@media (max-width:680px){ .os-cells{ grid-template-columns:1fr; } }
.os-cell{ border:1px solid var(--line); border-radius:14px; padding:22px; background:var(--panel); transition:border-color .18s; }
.os-cell:hover{ border-color:var(--acc-dim); }
.os-cell .ch{ display:flex; align-items:center; gap:10px; margin:0 0 10px; }
.os-cell .ch svg{ width:20px; height:20px; color:var(--acc); }
.os-cell .ch span{ font-family:var(--display); font-weight:600; font-size:16px; color:var(--ink); }
.os-cell p{ margin:0; font-size:13.5px; line-height:1.6; color:color-mix(in oklab,var(--ink) 76%, var(--dim)); }

/* tech stack table */
.os-stack{ margin-top:26px; border:1px solid var(--line); border-radius:16px; overflow:hidden; }
.os-row{ display:grid; grid-template-columns:170px 1fr; gap:24px; padding:18px 24px; border-top:1px solid var(--line); align-items:baseline; }
.os-row:first-child{ border-top:0; }
.os-row:hover{ background:color-mix(in srgb,var(--acc) 4%, transparent); }
.os-row dt{ font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); }
.os-row dd{ margin:0; display:flex; flex-wrap:wrap; gap:7px; align-items:center; }
.os-chip{ font-family:var(--mono); font-size:12px; color:var(--ink); border:1px solid var(--line); border-radius:7px; padding:5px 10px;
  background:color-mix(in srgb,var(--acc) 5%, var(--panel)); }
.os-chip.key{ color:var(--acc); border-color:color-mix(in srgb,var(--acc) 45%, var(--line)); }
.os-row dd .note{ font-family:var(--body); font-size:13px; color:var(--dim); }
@media (max-width:680px){ .os-row{ grid-template-columns:1fr; gap:12px; } }
.os-stacknote{ font-family:var(--mono); font-size:11px; color:var(--dim); margin-top:14px; letter-spacing:.04em; }
.os-stacknote code{ color:var(--acc-dim); }

/* dev timeline */
.os-timeline{ margin-top:30px; position:relative; padding-left:30px; }
.os-timeline::before{ content:''; position:absolute; left:5px; top:6px; bottom:6px; width:2px;
  background:linear-gradient(to bottom, var(--acc), color-mix(in srgb,var(--acc) 20%, var(--line))); }
.os-stop{ position:relative; padding:0 0 34px; }
.os-stop:last-child{ padding-bottom:0; }
.os-stop::before{ content:''; position:absolute; left:-30px; top:4px; width:12px; height:12px; border-radius:50%;
  background:var(--bg); border:2.5px solid var(--acc); box-shadow:0 0 10px color-mix(in srgb,var(--acc) 60%, transparent); }
.os-stop .when{ font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--acc); margin:0 0 4px; }
.os-stop .what{ font-family:var(--display); font-weight:600; font-size:18px; color:var(--ink); margin:0 0 7px; }
.os-stop p{ margin:0; font-size:14.5px; line-height:1.65; color:color-mix(in oklab,var(--ink) 78%, var(--dim)); max-width:60ch; }

/* CTA band */
.os-cta{ position:relative; margin:70px 0 10px; border:1px solid var(--acc); border-radius:20px; overflow:hidden;
  background:radial-gradient(110% 160% at 100% 0%, color-mix(in srgb,var(--acc) 22%, var(--panel)), var(--panel)); padding:46px clamp(26px,5vw,52px); }
.os-cta .mvbg{ position:absolute; inset:0; opacity:.16; color:var(--acc); }
.os-cta .inner{ position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; gap:28px; flex-wrap:wrap; }
.os-cta h2{ font-family:var(--display); font-weight:800; font-size:clamp(26px,3.4vw,40px); letter-spacing:-.02em; margin:0 0 8px; color:var(--ink); }
.os-cta p{ margin:0; font-size:16px; color:color-mix(in oklab,var(--ink) 80%, var(--dim)); }
.os-cta .big{ font-size:15px; padding:15px 28px; border-radius:12px; }
.os-cta .url{ font-family:var(--mono); font-size:13px; color:var(--acc); margin-top:6px; display:block; }

/* prev/next */
.os-nav{ display:grid; grid-template-columns:1fr 1fr; gap:16px; border-top:1px solid var(--line); margin-top:60px; padding:30px 0 80px; }
.os-navcard{ position:relative; display:block; text-decoration:none; border:1px solid var(--line); border-radius:14px; overflow:hidden;
  background:var(--panel); transition:border-color .18s, transform .18s; min-height:96px; }
.os-navcard:hover{ border-color:var(--acc-dim); transform:translateY(-2px); }
.os-navcard .miniviz{ position:absolute; inset:0; opacity:.5; }
.os-navcard .miniscrim{ position:absolute; inset:0; background:linear-gradient(90deg, var(--panel) 30%, color-mix(in srgb,var(--panel) 55%, transparent)); }
.os-navcard .lbl{ position:relative; z-index:2; padding:20px 22px; }
.os-navcard .dir{ font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); }
.os-navcard .nm{ font-family:var(--display); font-size:20px; font-weight:600; color:var(--ink); margin-top:6px; }
.os-navcard.next{ text-align:right; } .os-navcard.next .miniscrim{ background:linear-gradient(270deg, var(--panel) 30%, color-mix(in srgb,var(--panel) 55%, transparent)); }
@media (max-width:560px){ .os-nav{ grid-template-columns:1fr; } .os-navcard.next{ text-align:left; } }
`;

// small inline icons (stroke = currentColor)
const I = {
  bolt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z"/></svg>,
  sword: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 3.5 21 3l-.5 6.5L9 21l-3-3L17.5 6.5ZM6 18l-3 3M4 14l3 3"/></svg>,
  ban: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6 18.4 18.4" strokeLinecap="round"/></svg>,
  pen: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m4 20 4-1L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z"/></svg>,
  speaker: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg>,
  mic: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4"/></svg>,
};

function OneStreamerPage(){
  const [t, setTweak] = window.useShellTweaks();
  const { BASE_CSS, RW_CSS, MV_CSS, OS_DIAG_CSS, Nav, Footer, ProjectViz,
          TakeoverDiagram, ViewerPipelineDiagram, ArchitectureDiagram, StreamViz,
          TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakSelect, TweakToggle } = window;
  const P = window.PORTFOLIO;
  const p = P.projects.find((x)=>x.id === "onestreamer");
  const list = P.projects;
  const idx = list.findIndex((x)=>x.id === "onestreamer");
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];
  const anim = t.vizAnim;
  const animCls = anim ? " osd-anim" : "";

  const cls = ["tm", "rw"];
  if (t.lift) cls.push("motion-lift");
  const style = { "--acc": t.accent, "--display": OS_DISPLAY[t.display] || OS_DISPLAY["Syne"] };

  const stack = [
    { layer: "Runtime", key: ["Node.js 18+", "Express 4", "Socket.IO 4.7"], rest: [] },
    { layer: "Frontend", key: ["React 19", "TypeScript 4.9"], rest: ["livekit-client", "hls.js", "socket.io-client", "lucide-react", "CRA build"] },
    { layer: "Realtime media", key: ["LiveKit"], rest: ["livekit-server-sdk", "@livekit/rtc-node", "coturn (TURN/STUN)"], note: "Sole WebRTC SFU · ADR-0024" },
    { layer: "Media tooling", key: ["ffmpeg"], rest: ["streamlink", "yt-dlp"], note: "URL-relay ingest" },
    { layer: "Storage", key: ["SQLite"], rest: ["Backblaze B2 (S3-compatible)", "Redis (optional cache)"], note: "Recordings + clips on B2" },
    { layer: "Auth", key: ["Passport"], rest: ["JWT", "Cloudflare Turnstile", "bcrypt"], note: "Google OAuth + Local" },
    { layer: "CMS", key: ["Strapi 4"], rest: [], note: "Blog content, separate process" },
    { layer: "AI / ML", key: ["Ollama", "whisper.cpp"], rest: ["Groq (optional cloud LLM)"], note: "Local-first: default mistral, local STT" },
    { layer: "Email", key: ["SendGrid"], rest: ["nodemailer"], note: "SMTP" },
    { layer: "Ops", key: ["PM2", "nginx"], rest: ["Let's Encrypt TLS"], note: "Process mgmt + reverse proxy" },
  ];

  return (
    <div className={cls.join(" ")} data-theme={t.theme} data-bg={t.background || "weave"} style={style}>
      <style>{BASE_CSS + RW_CSS + MV_CSS + OS_DIAG_CSS + OS_PAGE_CSS}</style>
      <div className="tm-wrap">
        <Nav active="" />

        {/* hero */}
        <header className="os-hero">
          <div className={"os-band" + (anim ? " mv-anim" : "")}>
            {t.viz && <StreamViz />}
            <div className="os-scrim"></div>
            <div className="os-status"><i></i> {p.status}</div>
            <div className="os-titlewrap">
              <div className="os-logo"><img src={p.logo} alt="OneStreamer logo" /></div>
              <div>
                <p className="os-eyebrow">Project {p.n}</p>
                <h1 className="os-title">OneStreamer</h1>
              </div>
            </div>
          </div>
          <div className="os-intro">
            <p className="os-tagline">{p.tagline}</p>
            <div className="os-actions">
              <a className="tm-btn demo" href={p.demo} target="_blank" rel="noopener">Try the live demo ↗</a>
              <a className="tm-btn ghost" href={p.repo} target="_blank" rel="noopener">GitHub ↗</a>
              <a className="tm-btn ghost" href={window.HOME_FILE}>← All projects</a>
            </div>
          </div>
        </header>

        {/* lede */}
        <section className="os-lede">
          <p>OneStreamer started with one question: what if streamers competed for the audience by taking the broadcast away from each other?</p>
          <p>Only one person holds the stream at a time. Anyone can cut in and seize it, so the show keeps changing hands. It's also where I test how far AI agents can carry a real product, with <span className="hl">AI viewers watching alongside real people</span> and talking back in chat.</p>
        </section>

        {/* interface tour */}
        <section className="os-sec">
          <p className="os-kicker">The interface</p>
          <h2 className="os-h2">One stream, wrapped in a control room</h2>
          <p className="os-p">Every viewer sees the same thing: the live game full-bleed, the streamer's own cam, a switch timer counting down to the next takeover, and a chat where real people and AI viewers talk over each other.</p>
          <figure className="os-tour" style={{ margin: '8px 0 0' }}>
            <picture><source srcSet="portfolio/assets/onestreamer-stream.webp" type="image/webp" /><img src="portfolio/assets/onestreamer-stream.png" width="2560" height="1440" alt="An annotated frame of the OneStreamer interface" loading="lazy" /></picture>
            {[
              { left: 48, top: 3.4, l: "Next-switch timer" },
              { left: 46, top: 46, l: "The live game" },
              { left: 10, top: 70, l: "Streamer cam" },
              { left: 87, top: 30, l: "Live chat · AI + people", r: true },
            ].map((pin,i)=>(
              <span className={"pin" + (pin.r ? " r" : "")} key={i} style={{ left: pin.left + '%', top: pin.top + '%' }}>
                <span className="dot"></span><span className="lab">{pin.l}</span>
              </span>
            ))}
          </figure>
          <figcaption className="os-figcap">The live broadcast overlay, over whatever's being streamed</figcaption>
        </section>

        {/* takeover mechanic */}
        <section className="os-sec">
          <div className="os-split">
            <div>
              <p className="os-kicker">The mechanic</p>
              <h2 className="os-h2">One live seat. Anyone can take it.</h2>
              <p className="os-p">The platform never runs more than a single broadcast, so attention doesn't fragment across a hundred parallel streams. Holding the seat is the whole game, and it's always up for grabs.</p>
              <p className="os-p">Streamers and viewers pick up items between rounds. Some raise a stream's defense so it can't be grabbed. Others cut that defense or disrupt the broadcast, opening a window for the next takeover.</p>
            </div>
            <figure className={"os-figure" + animCls}>
              <div className="os-figbox"><TakeoverDiagram /></div>
              <figcaption className="os-figcap">Interrupt → attack the defense → seize the stream</figcaption>
            </figure>
          </div>
          <div className="os-moves">
            <div className="os-move"><h3 className="mh">{I.bolt} Interrupt</h3><p>Anyone watching can cut in. The current broadcast stops and the challenger becomes the show.</p></div>
            <div className="os-move"><h3 className="mh">{I.shield} Defend</h3><p>Items raise a stream's defense, making it harder for anyone to grab the seat.</p></div>
            <div className="os-move"><h3 className="mh">{I.sword} Attack</h3><p>Other items drain a stream's defense or disrupt it, setting up the next takeover.</p></div>
          </div>
        </section>

        {/* AI viewers */}
        <section className="os-sec">
          <div className="os-split rev">
            <figure className={"os-figure" + animCls}>
              <div className="os-figbox"><ViewerPipelineDiagram /></div>
              <figcaption className="os-figcap">Frames + audio transcript → lightweight LLM → chat</figcaption>
            </figure>
            <div>
              <p className="os-kicker">AI viewers</p>
              <h2 className="os-h2">Viewers that watch and react</h2>
              <p className="os-p">Real people fill the room, and OneStreamer seeds it with LLM-powered viewers too. Each AI viewer takes screenshots of the stream and a transcript of the audio, feeds both into a lightweight model, and posts back to chat.</p>
              <p className="os-p">Because the reactions come from the current frame and the current audio, they track what's on screen right now instead of running a generic script. Every viewer keeps a consistent personality across a session, so running jokes and callbacks build over time.</p>
            </div>
          </div>

          {/* moderation callout */}
          <div className="os-callout">
            <div className="ci">{I.ban}</div>
            <div>
              <h3>The same eyes and ears keep the room safe</h3>
              <p>AI moderation runs on the same pipeline as the viewers. Frames from the live video and the audio transcript pass through a detection step, and when something crosses the line the offending account is banned automatically, without waiting for a human to catch it.</p>
            </div>
          </div>
        </section>

        {/* interactive effects */}
        <section className="os-sec">
          <p className="os-kicker">On the stream</p>
          <h2 className="os-h2">Effects that reach into the broadcast</h2>
          <p className="os-p">Viewers don't just watch. They can change what the broadcast looks and sounds like in real time.</p>
          <div className="os-cells">
            <div className="os-cell"><div className="ch">{I.pen}<span>Draw on the stream</span></div><p>Mark up the live video with drawings and graphic effects layered straight over the feed.</p></div>
            <div className="os-cell"><div className="ch">{I.speaker}<span>Sound effects</span></div><p>Triggered sounds play through the broadcast audio for everyone watching.</p></div>
            <div className="os-cell"><div className="ch">{I.mic}<span>Text to speech</span></div><p>TTS voices speak into the stream, so chat can talk out loud mid-broadcast.</p></div>
          </div>
        </section>

        {/* architecture */}
        <section className="os-sec">
          <div className="os-split">
            <div>
              <p className="os-kicker">Architecture</p>
              <h2 className="os-h2">Built on LiveKit, one to many</h2>
              <p className="os-p">OneStreamer uses LiveKit as its only WebRTC SFU. A single publisher sends video into the SFU, which forwards it to every viewer at once — the one-to-many shape the takeover game needs.</p>
              <p className="os-p">Latency stays low enough that a takeover feels instant. A recorder taps the same feed continuously, so any moment can be turned into a clip after the fact.</p>
              <a className="os-doclink" href="https://github.com/RealRogerWinter/onestreamer/blob/main/docs/architecture/overview.md" target="_blank" rel="noopener">Read the architecture overview ↗</a>
            </div>
            <figure className={"os-figure" + animCls}>
              <div className="os-figbox"><ArchitectureDiagram /></div>
              <figcaption className="os-figcap">One publisher · LiveKit SFU · many viewers · continuous recording</figcaption>
            </figure>
          </div>

          {/* tech stack */}
          <dl className="os-stack">
            {stack.map((r,i)=>(
              <div className="os-row" key={i}>
                <dt>{r.layer}</dt>
                <dd>
                  {r.key.map((k,j)=>(<span className="os-chip key" key={'k'+j}>{k}</span>))}
                  {r.rest.map((k,j)=>(<span className="os-chip" key={'r'+j}>{k}</span>))}
                  {r.note && <span className="note">{r.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
          <p className="os-stacknote">Full per-dependency notes live in <code>docs/integrations/</code>.</p>
        </section>

        {/* dev timeline */}
        <section className="os-sec">
          <p className="os-kicker">Built with</p>
          <h2 className="os-h2">A test bed for AI development</h2>
          <p className="os-p">OneStreamer predates vibecoding and today's agents, so its history doubles as a record of how AI tooling changed under it. Each rebuild used whatever was the best tool at the time.</p>
          <div className="os-timeline">
            <div className="os-stop"><p className="when">First prototype</p><h3 className="what">Hand-assembled from ChatGPT</h3><p>The earliest version came together by copy-pasting code out of an early ChatGPT, one piece at a time, before agents could touch a repo directly.</p></div>
            <div className="os-stop"><p className="when">Agent takes the wheel</p><h3 className="what">Claude Code · Sonnet 4.5</h3><p>Claude Code took over the codebase running Sonnet 4.5. Whole features started landing in a sitting instead of a weekend.</p></div>
            <div className="os-stop"><p className="when">Bigger changes</p><h3 className="what">Claude Code · Opus</h3><p>Switching to Opus made larger, system-wide edits hold together — refactors that touched many files at once instead of one corner.</p></div>
            <div className="os-stop"><p className="when">Now</p><h3 className="what">Heavy refactor · Opus 4.8</h3><p>The current version is a deep refactor done with Opus 4.8, and development keeps going from here.</p></div>
          </div>
        </section>

        {/* CTA */}
        <section className="os-cta">
          <div className={"mvbg" + (anim ? " mv-anim" : "")}>{t.viz && <StreamViz />}</div>
          <div className="inner">
            <div>
              <h2>See who's holding the stream</h2>
              <p>One seat, an audience of real people and AI, and a takeover always one item away.</p>
              <span className="url">onestreamer.live</span>
            </div>
            <a className="tm-btn demo big" href={p.demo} target="_blank" rel="noopener">Try the live demo ↗</a>
          </div>
        </section>

        {/* prev/next */}
        <nav className="os-nav">
          <a className="os-navcard prev" href={`project-${prev.id}.html`}>
            <div className={"miniviz" + (anim ? " mv-anim" : "")}><ProjectViz id={prev.id} animate={anim} /></div>
            <div className="miniscrim"></div>
            <div className="lbl"><div className="dir">← Previous</div><div className="nm">{prev.name}</div></div>
          </a>
          <a className="os-navcard next" href={`project-${next.id}.html`}>
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
window.OneStreamerPage = OneStreamerPage;
