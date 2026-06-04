// Bespoke sheet-llm write-up page. Mount with <window.SheetLlmPage />.
const SL_DISPLAY = {
  "Syne": "'Syne', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
  "Bricolage Grotesque": "'Bricolage Grotesque', sans-serif",
};

const SL_PAGE_CSS = `
.tm.rw{ font-family:var(--body); --body:'Hanken Grotesk', system-ui, sans-serif; --mono:'JetBrains Mono', ui-monospace, monospace; }

.slp-hero{ padding:26px 0 18px; }
.slp-band{ position:relative; height:clamp(300px,42vw,420px); border:1px solid var(--line); border-radius:20px; overflow:hidden;
  background:radial-gradient(120% 130% at 50% 0%, color-mix(in srgb,var(--acc) 13%, var(--panel)), var(--panel)); }
.slp-band .mv{ color:var(--acc); }
.slp-scrim{ position:absolute; inset:0; pointer-events:none; background:linear-gradient(to top, var(--panel) 4%, color-mix(in srgb,var(--panel) 30%, transparent) 40%, transparent 72%); }
.slp-status{ position:absolute; top:18px; right:18px; z-index:3; display:inline-flex; align-items:center; gap:8px; font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--ink);
  background:color-mix(in srgb,var(--bg) 60%, transparent); border:1px solid var(--acc); border-radius:100px; padding:7px 14px; }
.slp-status i{ width:7px; height:7px; border-radius:50%; background:var(--acc); box-shadow:0 0 9px var(--acc); }
.slp-titlewrap{ position:absolute; left:0; right:0; bottom:0; z-index:2; display:flex; align-items:flex-end; gap:20px; padding:30px clamp(20px,4vw,40px); }
.slp-logo{ width:88px; height:88px; flex:0 0 88px; border-radius:18px; border:1px solid var(--line); background:var(--panel2); display:flex; align-items:center; justify-content:center; color:var(--acc); box-shadow:0 14px 40px -16px rgba(0,0,0,.6); }
.slp-logo svg{ width:58%; height:58%; overflow:visible; }
.slp-eyebrow{ font-family:var(--mono); font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--dim); margin:0 0 8px; }
.slp-title{ font-family:var(--display); font-size:clamp(38px,6vw,66px); font-weight:800; letter-spacing:-.03em; line-height:.96; margin:0; }
.slp-intro{ display:flex; align-items:flex-start; justify-content:space-between; gap:24px; flex-wrap:wrap; padding:26px 2px 0; }
.slp-tagline{ font-size:clamp(17px,1.7vw,21px); line-height:1.5; color:color-mix(in oklab,var(--ink) 88%, var(--dim)); margin:0; max-width:46ch; font-weight:500; }
.slp-actions{ display:flex; gap:11px; flex-wrap:wrap; align-items:center; }
@media (max-width:620px){ .slp-titlewrap{ flex-direction:column; align-items:flex-start; gap:14px; } .slp-logo{ width:64px; height:64px; flex-basis:64px; } }

.slp-lede{ padding:48px 0 6px; max-width:62ch; }
.slp-lede p{ font-family:var(--display); font-weight:500; font-size:clamp(17px,1.7vw,21px); line-height:1.45; letter-spacing:-.01em; color:var(--ink); margin:0 0 14px; }
.slp-lede p:last-child{ margin:0; color:color-mix(in oklab,var(--ink) 72%, var(--dim)); }
.slp-lede .hl{ color:var(--acc); }

.slp-sec{ padding:64px 0 0; }
.slp-kicker{ font-family:var(--mono); font-size:12px; letter-spacing:.16em; text-transform:uppercase; color:var(--acc); display:flex; align-items:center; gap:12px; margin:0 0 16px; }
.slp-kicker::before{ content:''; width:26px; height:1px; background:var(--acc); }
.slp-h2{ font-family:var(--display); font-weight:700; font-size:clamp(26px,3.4vw,38px); letter-spacing:-.02em; line-height:1.05; margin:0 0 18px; max-width:20ch; }
.slp-p{ font-size:16px; line-height:1.72; color:color-mix(in oklab,var(--ink) 84%, var(--dim)); margin:0 0 16px; max-width:62ch; }
.slp-p strong{ color:var(--ink); font-weight:600; }
.slp-figcap{ font-family:var(--mono); font-size:11px; letter-spacing:.08em; color:var(--dim); margin-top:14px; text-transform:uppercase; }

.slp-split{ display:grid; grid-template-columns:0.92fr 1.08fr; gap:clamp(28px,4vw,52px); align-items:center; }
.slp-split.rev{ grid-template-columns:1.08fr 0.92fr; }
.slp-split.rev .slp-figure{ order:-1; }
@media (max-width:860px){ .slp-split, .slp-split.rev{ grid-template-columns:1fr; gap:30px; } .slp-split.rev .slp-figure{ order:0; } }
.slp-figure{ margin:0; }
.slp-figbox{ background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:26px 24px; }

/* screenshot placeholder */
.slp-shot{ position:relative; margin-top:24px; border:1px dashed var(--line); border-radius:16px; height:300px; overflow:hidden; background:var(--panel2);
  display:flex; align-items:center; justify-content:center; }
.slp-shot .mvbg{ position:absolute; inset:0; opacity:.12; color:var(--acc); }
.slp-shot span{ position:relative; z-index:2; font-family:var(--mono); font-size:12px; color:var(--dim); letter-spacing:.06em; }
.sl-frame{ margin-top:24px; border:1px solid var(--line); border-radius:14px; overflow:hidden; background:var(--panel); }
.sl-frame .top{ display:flex; align-items:center; gap:10px; padding:11px 14px; border-bottom:1px solid var(--line); background:var(--panel2); }
.sl-frame .dots{ display:flex; gap:5px; flex:0 0 auto; } .sl-frame .dots i{ width:9px; height:9px; border-radius:50%; background:var(--line); display:block; }
.sl-frame .ttl{ font-family:var(--mono); font-size:11px; color:var(--dim); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sl-frame img{ width:100%; display:block; }
.sl-frame .cap{ font-family:var(--mono); font-size:11px; color:var(--dim); padding:12px 14px; border-top:1px solid var(--line); line-height:1.55; }
.sl-frame .cap b{ color:var(--ink); font-weight:600; }

/* tech stack */
.slp-stack{ margin-top:26px; border:1px solid var(--line); border-radius:16px; overflow:hidden; }
.slp-row{ display:grid; grid-template-columns:170px 1fr; gap:24px; padding:18px 24px; border-top:1px solid var(--line); align-items:baseline; }
.slp-row:first-child{ border-top:0; }
.slp-row:hover{ background:color-mix(in srgb,var(--acc) 4%, transparent); }
.slp-row dt{ font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); }
.slp-row dd{ margin:0; display:flex; flex-wrap:wrap; gap:7px; align-items:center; }
.slp-chip{ font-family:var(--mono); font-size:12px; color:var(--ink); border:1px solid var(--line); border-radius:7px; padding:5px 10px; background:color-mix(in srgb,var(--acc) 5%, var(--panel)); }
.slp-chip.key{ color:var(--acc); border-color:color-mix(in srgb,var(--acc) 45%, var(--line)); }
.slp-row dd .note{ font-family:var(--body); font-size:13px; color:var(--dim); }
@media (max-width:680px){ .slp-row{ grid-template-columns:1fr; gap:12px; } }

.slp-cta{ position:relative; margin:70px 0 10px; border:1px solid var(--acc); border-radius:20px; overflow:hidden; background:radial-gradient(110% 160% at 100% 0%, color-mix(in srgb,var(--acc) 22%, var(--panel)), var(--panel)); padding:46px clamp(26px,5vw,52px); }
.slp-cta .mvbg{ position:absolute; inset:0; opacity:.16; color:var(--acc); }
.slp-cta .inner{ position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; gap:28px; flex-wrap:wrap; }
.slp-cta h2{ font-family:var(--display); font-weight:800; font-size:clamp(26px,3.4vw,40px); letter-spacing:-.02em; margin:0 0 8px; color:var(--ink); }
.slp-cta p{ margin:0; font-size:16px; color:color-mix(in oklab,var(--ink) 80%, var(--dim)); }
.slp-cta .big{ font-size:15px; padding:15px 28px; border-radius:12px; }
.slp-cta .url{ font-family:var(--mono); font-size:13px; color:var(--acc); margin-top:6px; display:block; }

.slp-nav{ display:grid; grid-template-columns:1fr 1fr; gap:16px; border-top:1px solid var(--line); margin-top:60px; padding:30px 0 80px; }
.slp-navcard{ position:relative; display:block; text-decoration:none; border:1px solid var(--line); border-radius:14px; overflow:hidden; background:var(--panel); transition:border-color .18s, transform .18s; min-height:96px; }
.slp-navcard:hover{ border-color:var(--acc-dim); transform:translateY(-2px); }
.slp-navcard .miniviz{ position:absolute; inset:0; opacity:.5; }
.slp-navcard .miniscrim{ position:absolute; inset:0; background:linear-gradient(90deg, var(--panel) 30%, color-mix(in srgb,var(--panel) 55%, transparent)); }
.slp-navcard .lbl{ position:relative; z-index:2; padding:20px 22px; }
.slp-navcard .dir{ font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); }
.slp-navcard .nm{ font-family:var(--display); font-size:20px; font-weight:600; color:var(--ink); margin-top:6px; }
.slp-navcard.next{ text-align:right; } .slp-navcard.next .miniscrim{ background:linear-gradient(270deg, var(--panel) 30%, color-mix(in srgb,var(--panel) 55%, transparent)); }
@media (max-width:560px){ .slp-nav{ grid-template-columns:1fr; } .slp-navcard.next{ text-align:left; } }
`;

function SheetLlmPage(){
  const [t, setTweak] = window.useShellTweaks();
  const { BASE_CSS, RW_CSS, MV_CSS, SL_DIAG_CSS, SL_FLOW_CSS, SL_CHAT_CSS, Nav, Footer, ProjectViz,
          AdditiveEditDemo, WorkflowSteps, OrchestratorFlow, ModelRouter, ProviderAgnostic, ScoreSpine, ChatDemo,
          TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakSelect, TweakToggle } = window;
  const P = window.PORTFOLIO;
  const p = P.projects.find((x)=>x.id === "sheet-llm");
  const list = P.projects;
  const idx = list.findIndex((x)=>x.id === "sheet-llm");
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];
  const anim = t.vizAnim;
  const dgc = anim ? " slf-anim" : "";

  const cls = ["tm", "rw", "sl"];
  if (t.lift) cls.push("motion-lift");
  const style = { "--acc": t.accent, "--display": SL_DISPLAY[t.display] || SL_DISPLAY["Syne"] };

  const stack = [
    { layer: "Framework", key: ["Next.js 16", "React 19"], rest: ["TypeScript 5", "App Router"] },
    { layer: "Notation", key: ["abcjs 6"], rest: ["ABC → SVG", "synth playback"] },
    { layer: "Data model", key: ["Zod 4"], rest: ["Score schema + subtree"] },
    { layer: "Persistence", key: ["SQLite"], rest: ["better-sqlite3", "Drizzle ORM"] },
    { layer: "Client state", key: ["Zustand 5"], rest: [] },
    { layer: "LLM", key: ["Anthropic SDK"], rest: ["multi-provider abstraction"], note: "Swap in local or hosted models" },
    { layer: "Auth", key: ["jose session JWT"], rest: ["argon2id", "OAuth (arctic)"], note: "Anon by default, optional accounts" },
    { layer: "Export / import", key: ["MusicXML"], rest: ["MIDI", "PDF (jspdf, svg2pdf)", "import via fast-xml-parser"] },
    { layer: "Tooling", key: ["pnpm 9"], rest: ["Node ≥ 20.9"] },
  ];

  return (
    <div className={cls.join(" ")} data-theme={t.theme} data-bg={t.background || "weave"} style={style}>
      <style>{BASE_CSS + RW_CSS + MV_CSS + SL_DIAG_CSS + SL_FLOW_CSS + SL_CHAT_CSS + SL_PAGE_CSS}</style>
      <div className="tm-wrap">
        <Nav active="" />

        {/* hero */}
        <header className="slp-hero">
          <div className={"slp-band" + (anim ? " mv-anim" : "")}>
            {t.viz && <ProjectViz id="sheet-llm" animate={anim} />}
            <div className="slp-scrim"></div>
            <div className="slp-status"><i></i> {p.status}</div>
            <div className="slp-titlewrap">
              <div className="slp-logo" aria-label="treble clef"><svg viewBox="0 0 40 54"><text x="20" y="27" textAnchor="middle" dominantBaseline="central" fontFamily="'Noto Music', serif" fontSize="50" fill="currentColor">{"\u{1D11E}"}</text></svg></div>
              <div>
                <p className="slp-eyebrow">Project {p.n}</p>
                <h1 className="slp-title">sheet-llm</h1>
              </div>
            </div>
          </div>
          <div className="slp-intro">
            <p className="slp-tagline">A publisher-grade notation editor you talk to. Describe the music; a language model writes it onto the staff.</p>
            <div className="slp-actions">
              <a className="tm-btn demo" href={p.demo}>Try the live demo ↗</a>
              <a className="tm-btn ghost" href={p.repo}>GitHub ↗</a>
              <a className="tm-btn ghost" href={window.HOME_FILE}>← All projects</a>
            </div>
          </div>
        </header>

        {/* lede */}
        <section className="slp-lede">
          <p>sheet-llm is a music notation editor that works like a conversation. Describe the music in plain language, and a language model writes it onto the staff.</p>
          <p>It's real notation under the hood, with one rule that shapes everything: <span className="hl">the editor changes only what it's asked to change.</span> Ask to rewrite bars 5 through 8, and bars 1 through 4 stay exactly as they were.</p>
        </section>

        {/* signature: additive editing */}
        <section className="slp-sec">
          <p className="slp-kicker">The idea</p>
          <h2 className="slp-h2">It changes only what's asked</h2>
          <p className="slp-p">Most AI editing tools rewrite the whole thing. sheet-llm treats every edit as additive: new bars get added, named bars get rewritten, and everything else is left alone. A check on the server hashes the bars that should stay and refuses the edit if any of them moved. A full rewrite can still happen, but only behind a confirmation, never by surprise.</p>
          <figure className="slp-figure" style={{ marginTop: '8px' }}>
            <AdditiveEditDemo />
            <figcaption className="slp-figcap">Interactive · compose, then rewrite bars 5–8 and watch what stays</figcaption>
          </figure>
          <div className="sl-frame">
            <div className="top"><span className="dots"><i></i><i></i><i></i></span><span className="ttl">AI proposal · 48 changes</span></div>
            <img src="portfolio/assets/sl-proposal.png" alt="An AI proposal in sheet-llm: a new sixteenth-note arpeggio run highlighted in amber across the last bars, with Accept all and Reject controls" />
            <div className="cap"><b>The real preview</b> — the new arpeggio bars glow amber as a staged proposal. Accept or reject before anything touches the saved score; untouched bars never move.</div>
          </div>
        </section>

        {/* workflow */}
        <section className="slp-sec">
          <p className="slp-kicker">How it works</p>
          <h2 className="slp-h2">From a sentence to a score</h2>
          <p className="slp-p">The loop is short, and the score keeps up at every step. Describe the music, refine it in chat, review each AI edit, then reach in by hand whenever a note needs moving.</p>
          <WorkflowSteps />
          <div className="sl-frame">
            <div className="top"><span className="dots"><i></i><i></i><i></i></span><span className="ttl">sheet-llm — Simple Waltz in A Major</span></div>
            <img src="portfolio/assets/sl-compose.png" alt="The sheet-llm editor with a composed waltz on the staff and the running conversation of edits on the right" />
            <div className="cap"><b>The editor</b> — the score on the left, the running chat of edits on the right, every turn revertible, with export to MIDI, PDF, and MusicXML.</div>
          </div>
        </section>

        {/* orchestrator */}
        <section className="slp-sec">
          <p className="slp-kicker">The orchestrator</p>
          <h2 className="slp-h2">One brain behind every request</h2>
          <p className="slp-p">Every chat request runs through an orchestrator. It reads the prompt and the current score, clears a copyright filter, then reasons about which edit to make and carries it out.</p>
          <figure className={"slp-figure" + dgc} style={{ marginTop: '8px' }}>
            <div className="slp-figbox"><OrchestratorFlow /></div>
            <figcaption className="slp-figcap">Prompt → filter → reasoning → safety gates → ghost preview → saved turn</figcaption>
          </figure>
          <p className="slp-p" style={{ marginTop: '24px' }}>Before a change reaches the score, two gates run on the server. One verifies that the bars meant to stay were left untouched. The other catches wholesale rewrites and holds them behind a confirmation. Whatever passes is staged as a ghost preview a musician can accept or reject, and every turn is saved as a versioned checkpoint that can be replayed.</p>
        </section>

        {/* model routing */}
        <section className="slp-sec">
          <div className="slp-split">
            <div>
              <p className="slp-kicker">Classify, then route</p>
              <h2 className="slp-h2">The right model for each request</h2>
              <p className="slp-p">The orchestrator's first job is to read intent. It classifies each request, then sends it to the model that fits. A small change like "make bar 2 staccato" doesn't need a frontier model, so it goes to a smaller, faster one. "Harmonize this melody as a chorale" does, so it goes to a more capable model.</p>
              <p className="slp-p">Questions take a third path entirely. The same classifier spots when a request isn't an edit at all and routes it to a conversational model that answers in words. <strong>One orchestrator, several models, picked per request</strong>, so the work matches the cost and the capability every time.</p>
            </div>
            <figure className={"slp-figure" + dgc}>
              <div className="slp-figbox"><ModelRouter /></div>
              <figcaption className="slp-figcap">Classify by complexity → route to the fitting model</figcaption>
            </figure>
          </div>
        </section>

        {/* conversational / educational */}
        <section className="slp-sec">
          <p className="slp-kicker">Talk to the score</p>
          <h2 className="slp-h2">Ask it about the music</h2>
          <p className="slp-p">Because questions get their own path, the editor doubles as something to talk to. A musician can ask what key a piece is in, why a bar sounds tense, or what a ii–V–I is, and get a plain-language answer with the open score as the reference point.</p>
          <p className="slp-p">It can also teach by doing. Ask for a concept and it writes the example straight onto the staff, so an explanation of a scale or a cadence comes with the notes to see and play. That turns the tool into a patient music tutor as much as an editor.</p>
          <figure className="slp-figure" style={{ marginTop: '8px' }}>
            <ChatDemo />
            <figcaption className="slp-figcap">Interactive · ask a question, get an answer or a staff demo</figcaption>
          </figure>
          <div className="sl-frame">
            <div className="top"><span className="dots"><i></i><i></i><i></i></span><span className="ttl">Converse mode · music theory</span></div>
            <img src="portfolio/assets/sl-converse.png" alt="sheet-llm in converse mode giving a full music-theory breakdown of the open score, with a debug panel showing the request routed to a converse model" />
            <div className="cap"><b>In the editor</b> — a full theory breakdown of the open score. The debug panel shows the turn classified as a simple converse request and routed to its model.</div>
          </div>
        </section>

        {/* score is the spine */}
        <section className="slp-sec">
          <div className="slp-split rev">
            <figure className={"slp-figure" + dgc}>
              <div className="slp-figbox"><ScoreSpine /></div>
              <figcaption className="slp-figcap">One Score, many derived views</figcaption>
            </figure>
            <div>
              <p className="slp-kicker">Under the notes</p>
              <h2 className="slp-h2">The score is the spine</h2>
              <p className="slp-p">Everything operates on one structured Score, written as validated JSON. The model is asked to emit that Score, not the notation markup.</p>
              <p className="slp-p">The staff a musician sees is rendered from it, and so are the playback and the export files. The data stays the single source of truth, and the notation never drifts away from it.</p>
            </div>
          </div>
        </section>

        {/* provider-agnostic */}
        <section className="slp-sec">
          <div className="slp-split">
            <div>
              <p className="slp-kicker">Yours to run</p>
              <h2 className="slp-h2">Open source, and yours to run</h2>
              <p className="slp-p">sheet-llm is open source and runs locally. The model provider is swappable: a local model on the same machine, an API key for any provider, or a hosted model all work.</p>
              <p className="slp-p">Nothing about the editor is locked to one vendor, so a musician keeps the score, the software, and the model choice in their own hands.</p>
            </div>
            <figure className={"slp-figure" + dgc}>
              <div className="slp-figbox"><ProviderAgnostic /></div>
              <figcaption className="slp-figcap">Swap the model, keep the editor</figcaption>
            </figure>
          </div>
        </section>

        {/* tech stack */}
        <section className="slp-sec">
          <p className="slp-kicker">Under the hood</p>
          <h2 className="slp-h2">Tech stack</h2>
          <dl className="slp-stack">
            {stack.map((r,i)=>(
              <div className="slp-row" key={i}>
                <dt>{r.layer}</dt>
                <dd>
                  {r.key.map((k,j)=>(<span className="slp-chip key" key={'k'+j}>{k}</span>))}
                  {r.rest.map((k,j)=>(<span className="slp-chip" key={'r'+j}>{k}</span>))}
                  {r.note && <span className="note">{r.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <section className="slp-cta">
          <div className={"mvbg" + (anim ? " mv-anim" : "")}>{t.viz && <ProjectViz id="sheet-llm" animate={anim} />}</div>
          <div className="inner">
            <div>
              <h2>Describe the music. Get the score.</h2>
              <p>A notation editor that listens, and only changes what it's asked to.</p>
              <span className="url">demo coming soon</span>
            </div>
            <a className="tm-btn demo big" href={p.demo}>Try the live demo ↗</a>
          </div>
        </section>

        {/* prev/next */}
        <nav className="slp-nav">
          <a className="slp-navcard prev" href={`project-${prev.id}.html`}>
            <div className={"miniviz" + (anim ? " mv-anim" : "")}><ProjectViz id={prev.id} animate={anim} /></div>
            <div className="miniscrim"></div>
            <div className="lbl"><div className="dir">← Previous</div><div className="nm">{prev.name}</div></div>
          </a>
          <a className="slp-navcard next" href={`project-${next.id}.html`}>
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
window.SheetLlmPage = SheetLlmPage;
