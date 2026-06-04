// Bespoke Multilingual SEO Tool write-up page. Mount with <window.SeoToolPage />.
const SEO_DISPLAY = {
  "Syne": "'Syne', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
  "Bricolage Grotesque": "'Bricolage Grotesque', sans-serif",
};

const SEO_PAGE_CSS = `
.tm.rw{ font-family:var(--body); --body:'Hanken Grotesk', system-ui, sans-serif; --mono:'JetBrains Mono', ui-monospace, monospace; }

.sp-hero{ padding:26px 0 18px; }
.sp-band{ position:relative; height:clamp(300px,42vw,420px); border:1px solid var(--line); border-radius:20px; overflow:hidden; background:radial-gradient(120% 130% at 50% 0%, color-mix(in srgb,var(--acc) 13%, var(--panel)), var(--panel)); }
.sp-band .mv{ color:var(--acc); }
.sp-scrim{ position:absolute; inset:0; pointer-events:none; background:linear-gradient(to top, var(--panel) 4%, color-mix(in srgb,var(--panel) 30%, transparent) 40%, transparent 72%); }
.sp-status{ position:absolute; top:18px; right:18px; z-index:3; display:inline-flex; align-items:center; gap:8px; font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--ink); background:color-mix(in srgb,var(--bg) 60%, transparent); border:1px solid var(--acc); border-radius:100px; padding:7px 14px; }
.sp-status i{ width:7px; height:7px; border-radius:50%; background:var(--acc); box-shadow:0 0 9px var(--acc); }
.sp-titlewrap{ position:absolute; left:0; right:0; bottom:0; z-index:2; display:flex; align-items:flex-end; gap:20px; padding:30px clamp(20px,4vw,40px); }
.sp-logo{ width:88px; height:88px; flex:0 0 88px; border-radius:18px; border:1px solid var(--line); background:var(--panel2); display:flex; align-items:center; justify-content:center; color:var(--acc); box-shadow:0 14px 40px -16px rgba(0,0,0,.6); }
.sp-logo svg{ width:52%; height:52%; }
.sp-eyebrow{ font-family:var(--mono); font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--dim); margin:0 0 8px; }
.sp-title{ font-family:var(--display); font-size:clamp(30px,4.6vw,52px); font-weight:800; letter-spacing:-.03em; line-height:.98; margin:0; }
.sp-intro{ display:flex; align-items:flex-start; justify-content:space-between; gap:24px; flex-wrap:wrap; padding:26px 2px 0; }
.sp-tagline{ font-size:clamp(17px,1.7vw,21px); line-height:1.5; color:color-mix(in oklab,var(--ink) 88%, var(--dim)); margin:0; max-width:48ch; font-weight:500; }
.sp-actions{ display:flex; gap:11px; flex-wrap:wrap; align-items:center; }
@media (max-width:620px){ .sp-titlewrap{ flex-direction:column; align-items:flex-start; gap:14px; } .sp-logo{ width:64px; height:64px; flex-basis:64px; } }

.sp-lede{ padding:48px 0 6px; max-width:62ch; }
.sp-lede p{ font-family:var(--display); font-weight:500; font-size:clamp(17px,1.7vw,21px); line-height:1.45; letter-spacing:-.01em; color:var(--ink); margin:0 0 14px; }
.sp-lede p:last-child{ margin:0; color:color-mix(in oklab,var(--ink) 72%, var(--dim)); }
.sp-lede .hl{ color:var(--acc); }

.sp-sec{ padding:64px 0 0; }
.sp-kicker{ font-family:var(--mono); font-size:12px; letter-spacing:.16em; text-transform:uppercase; color:var(--acc); display:flex; align-items:center; gap:12px; margin:0 0 16px; }
.sp-kicker::before{ content:''; width:26px; height:1px; background:var(--acc); }
.sp-h2{ font-family:var(--display); font-weight:700; font-size:clamp(26px,3.4vw,38px); letter-spacing:-.02em; line-height:1.05; margin:0 0 18px; max-width:22ch; }
.sp-p{ font-size:16px; line-height:1.72; color:color-mix(in oklab,var(--ink) 84%, var(--dim)); margin:0 0 16px; max-width:62ch; }
.sp-p strong{ color:var(--ink); font-weight:600; }
.sp-figcap{ font-family:var(--mono); font-size:11px; letter-spacing:.08em; color:var(--dim); margin-top:14px; text-transform:uppercase; }

.sp-split{ display:grid; grid-template-columns:0.95fr 1.05fr; gap:clamp(28px,4vw,52px); align-items:center; }
.sp-split.rev{ grid-template-columns:1.05fr 0.95fr; }
.sp-split.rev .sp-figure{ order:-1; }
@media (max-width:860px){ .sp-split, .sp-split.rev{ grid-template-columns:1fr; gap:30px; } .sp-split.rev .sp-figure{ order:0; } }
.sp-figure{ margin:0; }
.sp-figbox{ background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:26px 24px; }

.sp-callout{ display:flex; gap:18px; align-items:flex-start; margin-top:24px; padding:22px 26px; border:1px solid var(--line); border-left:3px solid var(--acc); border-radius:14px; background:color-mix(in srgb,var(--acc) 6%, var(--panel)); }
.sp-callout h3{ font-family:var(--display); font-weight:600; font-size:17px; color:var(--ink); margin:0 0 7px; }
.sp-callout p{ margin:0; font-size:14px; line-height:1.62; color:color-mix(in oklab,var(--ink) 80%, var(--dim)); max-width:70ch; }

.sp-shot{ position:relative; margin-top:24px; border:1px dashed var(--line); border-radius:16px; height:300px; overflow:hidden; background:var(--panel2); display:flex; align-items:center; justify-content:center; }
.sp-shot .mvbg{ position:absolute; inset:0; opacity:.12; color:var(--acc); }
.sp-shot span{ position:relative; z-index:2; font-family:var(--mono); font-size:12px; color:var(--dim); letter-spacing:.06em; }
.sp-frame{ margin-top:22px; border:1px solid var(--line); border-radius:16px; overflow:hidden; background:var(--panel); }
.sp-frame .top{ display:flex; align-items:center; gap:10px; padding:12px 15px; border-bottom:1px solid var(--line); background:var(--panel2); }
.sp-frame .dots{ display:flex; gap:5px; flex:0 0 auto; } .sp-frame .dots i{ width:9px; height:9px; border-radius:50%; background:var(--line); display:block; }
.sp-frame .ttl{ font-family:var(--mono); font-size:11px; color:var(--dim); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sp-frame .frame{ position:relative; max-height:520px; overflow:hidden; background:#0e0f1a; }
.sp-frame .frame img{ width:100%; display:block; }
.sp-frame .frame::after{ content:''; position:absolute; left:0; right:0; bottom:0; height:84px; background:linear-gradient(to top, var(--panel), transparent); pointer-events:none; }
.sp-frame .cap{ font-family:var(--mono); font-size:11px; color:var(--dim); padding:12px 15px; border-top:1px solid var(--line); line-height:1.55; }
.sp-frame .cap b{ color:var(--ink); font-weight:600; }

.sp-stack{ margin-top:26px; border:1px solid var(--line); border-radius:16px; overflow:hidden; }
.sp-row{ display:grid; grid-template-columns:150px 1fr; gap:24px; padding:18px 24px; border-top:1px solid var(--line); align-items:baseline; }
.sp-row:first-child{ border-top:0; }
.sp-row:hover{ background:color-mix(in srgb,var(--acc) 4%, transparent); }
.sp-row dt{ font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); }
.sp-row dd{ margin:0; display:flex; flex-wrap:wrap; gap:7px; align-items:center; }
.sp-chip{ font-family:var(--mono); font-size:12px; color:var(--ink); border:1px solid var(--line); border-radius:7px; padding:5px 10px; background:color-mix(in srgb,var(--acc) 5%, var(--panel)); }
.sp-chip.key{ color:var(--acc); border-color:color-mix(in srgb,var(--acc) 45%, var(--line)); }
.sp-row dd .note{ font-family:var(--body); font-size:13px; color:var(--dim); }
@media (max-width:620px){ .sp-row{ grid-template-columns:1fr; gap:10px; } }

.sp-cta{ position:relative; margin:70px 0 10px; border:1px solid var(--acc); border-radius:20px; overflow:hidden; background:radial-gradient(110% 160% at 100% 0%, color-mix(in srgb,var(--acc) 22%, var(--panel)), var(--panel)); padding:46px clamp(26px,5vw,52px); }
.sp-cta .mvbg{ position:absolute; inset:0; opacity:.16; color:var(--acc); }
.sp-cta .inner{ position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; gap:28px; flex-wrap:wrap; }
.sp-cta h2{ font-family:var(--display); font-weight:800; font-size:clamp(26px,3.4vw,40px); letter-spacing:-.02em; margin:0 0 8px; color:var(--ink); }
.sp-cta p{ margin:0; font-size:16px; color:color-mix(in oklab,var(--ink) 80%, var(--dim)); }
.sp-cta .big{ font-size:15px; padding:15px 28px; border-radius:12px; }
.sp-cta .url{ font-family:var(--mono); font-size:13px; color:var(--acc); margin-top:6px; display:block; }

.sp-nav{ display:grid; grid-template-columns:1fr 1fr; gap:16px; border-top:1px solid var(--line); margin-top:60px; padding:30px 0 80px; }
.sp-navcard{ position:relative; display:block; text-decoration:none; border:1px solid var(--line); border-radius:14px; overflow:hidden; background:var(--panel); transition:border-color .18s, transform .18s; min-height:96px; }
.sp-navcard:hover{ border-color:var(--acc-dim); transform:translateY(-2px); }
.sp-navcard .miniviz{ position:absolute; inset:0; opacity:.5; }
.sp-navcard .miniscrim{ position:absolute; inset:0; background:linear-gradient(90deg, var(--panel) 30%, color-mix(in srgb,var(--panel) 55%, transparent)); }
.sp-navcard .lbl{ position:relative; z-index:2; padding:20px 22px; }
.sp-navcard .dir{ font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); }
.sp-navcard .nm{ font-family:var(--display); font-size:20px; font-weight:600; color:var(--ink); margin-top:6px; }
.sp-navcard.next{ text-align:right; } .sp-navcard.next .miniscrim{ background:linear-gradient(270deg, var(--panel) 30%, color-mix(in srgb,var(--panel) 55%, transparent)); }
@media (max-width:560px){ .sp-nav{ grid-template-columns:1fr; } .sp-navcard.next{ text-align:left; } }
`;

function SeoToolPage(){
  const [t, setTweak] = window.useShellTweaks();
  const { BASE_CSS, RW_CSS, MV_CSS, SEO_VIZ_CSS, SEO_DEMO_CSS, Nav, Footer, ProjectViz,
          PipelineDiagram, HybridLLM, LocaleFanout, IntentVariants, SeoRunDemo,
          TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakSelect, TweakToggle } = window;
  const P = window.PORTFOLIO;
  const p = P.projects.find((x)=>x.id === "multilingual-seo");
  const list = P.projects;
  const idx = list.findIndex((x)=>x.id === "multilingual-seo");
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];
  const anim = t.vizAnim;
  const vc = anim ? " sev-anim" : "";

  const cls = ["tm", "rw"];
  if (t.lift) cls.push("motion-lift");
  const style = { "--acc": t.accent, "--display": SEO_DISPLAY[t.display] || SEO_DISPLAY["Syne"] };

  const stack = [
    { layer: "Backend", key: ["Python 3.12", "FastAPI", "LangGraph"], rest: ["LangSmith (opt-in)"] },
    { layer: "Persistence", key: ["SQLite checkpointer"], rest: ["AsyncSqliteSaver", "24h SERP cache"], note: "Repeat runs replay from disk" },
    { layer: "Frontend", key: ["Next.js 15", "React 19"], rest: ["TypeScript", "Tailwind"] },
    { layer: "LLMs", key: ["Groq Llama 4 Scout", "Claude Sonnet 4.6"], rest: ["prompt caching"], note: "Extraction · translation" },
    { layer: "SERP", key: ["DataForSEO"], rest: ["Live Search Volume"], note: "Batched per locale" },
    { layer: "CI / test", key: ["CircleCI"], rest: ["pytest", "respx", "syrupy", "vitest"], note: "Hybrid TDD" },
  ];

  return (
    <div className={cls.join(" ")} data-theme={t.theme} data-bg={t.background || "weave"} style={style}>
      <style>{BASE_CSS + RW_CSS + MV_CSS + SEO_VIZ_CSS + SEO_DEMO_CSS + SEO_PAGE_CSS}</style>
      <div className="tm-wrap">
        <Nav active="" />

        {/* hero */}
        <header className="sp-hero">
          <div className={"sp-band" + (anim ? " mv-anim" : "")}>
            {t.viz && <ProjectViz id="multilingual-seo" animate={anim} />}
            <div className="sp-scrim"></div>
            <div className="sp-status"><i></i> {p.status}</div>
            <div className="sp-titlewrap">
              <div className="sp-logo" aria-label="a globe of languages">
                <window.SeoIcon />
              </div>
              <div>
                <p className="sp-eyebrow">Project {p.n}</p>
                <h1 className="sp-title">Multilingual SEO Tool</h1>
              </div>
            </div>
          </div>
          <div className="sp-intro">
            <p className="sp-tagline">It decides which content is worth translating into another language, before anyone pays for the translation.</p>
            <div className="sp-actions">
              <a className="tm-btn demo" href={p.repo}>GitHub ↗</a>
              <a className="tm-btn ghost" href={window.HOME_FILE}>← All projects</a>
            </div>
          </div>
        </header>

        {/* lede */}
        <section className="sp-lede">
          <p>Translating a page into five languages costs real money. The hard question is which five, and which pages are even worth it.</p>
          <p>This tool answers that before the work starts. Give it a URL, and it <span className="hl">finds the page's keywords, translates them per locale, checks real search demand, and ranks what's worth translating</span> first.</p>
        </section>

        {/* interactive demo */}
        <section className="sp-sec">
          <p className="sp-kicker">Try it</p>
          <h2 className="sp-h2">A URL in, ranked targets out</h2>
          <p className="sp-p">Pick a few target locales and run it. For each one, the tool returns the best keyword to translate toward, its monthly search volume, and a score ranking which locales are worth the translation budget first.</p>
          <figure className="sp-figure" style={{ marginTop: '8px' }}>
            <SeoRunDemo />
            <figcaption className="sp-figcap">Interactive sample · illustrative volumes</figcaption>
          </figure>
        </section>

        {/* pipeline */}
        <section className="sp-sec">
          <p className="sp-kicker">The pipeline</p>
          <h2 className="sp-h2">Six steps, one stream</h2>
          <p className="sp-p">A LangGraph agent runs the page through a linear pipeline. The pure-code steps, fetching and scoring, stay deterministic, and the two language-model steps do the work that actually needs judgment. Everything streams to the UI as it finishes, so results show up step by step instead of after one long wait.</p>
          <figure className={"sp-figure" + vc} style={{ marginTop: '8px' }}>
            <div className="sp-figbox"><PipelineDiagram /></div>
            <figcaption className="sp-figcap">URL → fetch → extract → translate → volume → score → stream</figcaption>
          </figure>
        </section>

        {/* hybrid LLMs */}
        <section className="sp-sec">
          <div className="sp-split rev">
            <figure className={"sp-figure" + vc}>
              <div className="sp-figbox"><HybridLLM /></div>
              <figcaption className="sp-figcap">Fast model to extract, strong model to translate</figcaption>
            </figure>
            <div>
              <p className="sp-kicker">Two models, on purpose</p>
              <h2 className="sp-h2">The right model for each job</h2>
              <p className="sp-p">Pulling keywords out of a page is fast, high-volume work, so that runs on Groq's Llama 4 Scout. Translating those keywords while keeping the search intent intact is where quality matters, so that runs on Claude Sonnet 4.6.</p>
              <p className="sp-p">Claude's translation prompts are cached, so the repeated, shared parts of each request don't get paid for twice.</p>
            </div>
          </div>
        </section>

        {/* intent over literal translation */}
        <section className="sp-sec">
          <p className="sp-kicker">Meaning, not words</p>
          <h2 className="sp-h2">The literal translation rarely ranks</h2>
          <p className="sp-p">A word-for-word translation often lands on a phrase nobody searches. "Running shoes" rendered literally into German is "rennende Schuhe," which no one types. The term German shoppers actually search is "Laufschuhe."</p>
          <p className="sp-p">So the translator proposes several intent-preserving variants for each locale instead of one literal guess. The search-volume check then picks between them, and the winner is the phrase that keeps the original meaning <strong>and</strong> has real demand on that country's search engine, not the first translation that came back.</p>
          <figure className="sp-figure" style={{ marginTop: '8px' }}>
            <IntentVariants />
            <figcaption className="sp-figcap">Candidate variants per locale, ranked by real search volume</figcaption>
          </figure>
        </section>

        {/* locale fan-out + cost */}
        <section className="sp-sec">
          <div className="sp-split">
            <div>
              <p className="sp-kicker">Validate before you pay</p>
              <h2 className="sp-h2">One source, many locales, one call each</h2>
              <p className="sp-p">Search volume comes from DataForSEO. To keep it cheap, every locale resolves in a single batched request of up to 1,000 keywords that bills one cent, instead of one call per keyword.</p>
              <p className="sp-p">The whole point is to spend a few cents checking real demand before spending a translator's time on a page nobody searches for.</p>
            </div>
            <figure className={"sp-figure" + vc}>
              <div className="sp-figbox"><LocaleFanout /></div>
              <figcaption className="sp-figcap">One batched DataForSEO call per locale</figcaption>
            </figure>
          </div>
          <div className="sp-callout">
            <div>
              <h3>Run it twice, pay once</h3>
              <p>A SQLite checkpointer saves each run's final state. Submitting the same URL and locale set again replays the saved result straight from disk, with no repeat model or search-volume cost.</p>
            </div>
          </div>
        </section>

        {/* screens */}
        <section className="sp-sec">
          <p className="sp-kicker">In the UI</p>
          <h2 className="sp-h2">Results as they arrive</h2>
          <p className="sp-p">The front end renders each locale's result the moment its score lands. Beyond the ranked list, it surfaces hreflang gaps the page hasn't covered yet and flags where dialects split on the actual term, like Spain's "zapatillas" against Mexico's "tenis".</p>
          <figure className="sp-frame">
            <div className="top"><span className="dots"><i></i><i></i><i></i></span><span className="ttl">multilingual-seo · results + cross-dialect divergence</span></div>
            <div className="frame"><img src="portfolio/assets/seo-results.png" alt="The results view: opportunity stat band, hreflang coverage with already-served versus missing locales, and side-by-side cross-dialect divergence cards" /></div>
            <figcaption className="cap"><b>Run summary</b> — opportunity stats, hreflang coverage gaps, and side-by-side dialect divergence.</figcaption>
          </figure>
          <figure className="sp-frame">
            <div className="top"><span className="dots"><i></i><i></i><i></i></span><span className="ttl">multilingual-seo · keyword opportunities</span></div>
            <div className="frame"><img src="portfolio/assets/seo-opps.png" alt="The keyword opportunities table: each translated variant scored on volume, competition, CPC, intent and traffic value, with a why-this-variant note" /></div>
            <figcaption className="cap"><b>Keyword opportunities</b> — every variant scored on volume, competition, CPC, intent, and traffic value, with a note on why it wins its locale.</figcaption>
          </figure>
          <div className="sp-callout">
            <div>
              <h3>Download it and run it locally</h3>
              <p>The tool is open source. Clone the repo, drop in API keys for the models and the search-volume provider, and run the whole pipeline on a local machine. There's no hosted service to sign up for.</p>
            </div>
          </div>
        </section>

        {/* tech stack */}
        <section className="sp-sec">
          <p className="sp-kicker">Under the hood</p>
          <h2 className="sp-h2">Tech stack</h2>
          <dl className="sp-stack">
            {stack.map((r,i)=>(
              <div className="sp-row" key={i}>
                <dt>{r.layer}</dt>
                <dd>{r.key.map((k,j)=>(<span className="sp-chip key" key={'k'+j}>{k}</span>))}{r.rest.map((k,j)=>(<span className="sp-chip" key={'r'+j}>{k}</span>))}{r.note && <span className="note">{r.note}</span>}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <section className="sp-cta">
          <div className={"mvbg" + (anim ? " mv-anim" : "")}>{t.viz && <ProjectViz id="multilingual-seo" animate={anim} />}</div>
          <div className="inner">
            <div>
              <h2>Know before you translate.</h2>
              <p>Check real demand per language in a single run.</p>
              <span className="url">open source · run it locally</span>
            </div>
            <a className="tm-btn demo big" href={p.repo}>Get it on GitHub ↗</a>
          </div>
        </section>

        {/* prev/next */}
        <nav className="sp-nav">
          <a className="sp-navcard prev" href={`project-${prev.id}.html`}>
            <div className={"miniviz" + (anim ? " mv-anim" : "")}><ProjectViz id={prev.id} animate={anim} /></div>
            <div className="miniscrim"></div>
            <div className="lbl"><div className="dir">← Previous</div><div className="nm">{prev.name}</div></div>
          </a>
          <a className="sp-navcard next" href={`project-${next.id}.html`}>
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
window.SeoToolPage = SeoToolPage;
