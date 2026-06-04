// Roger Winter — home page. Creative-technologist catalogue (de-teched). Uses shell + microviz.
const { useShellTweaks, BASE_CSS, Nav, Footer } = window;
const { TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakSelect, TweakToggle } = window;

const PC_HUE = {
  "sheet-llm": "oklch(0.72 0.16 285)",
  "onestreamer": "oklch(0.70 0.18 25)",
  "price-games": "oklch(0.78 0.15 150)",
  "pricey": "oklch(0.80 0.15 85)",
  "multilingual-seo": "oklch(0.72 0.14 235)",
};

const DISPLAY = {
  "Syne": "'Syne', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
  "Bricolage Grotesque": "'Bricolage Grotesque', sans-serif",
};

const HOME_CSS = `
.tm.rw{ font-family:var(--body); --body:'Hanken Grotesk', system-ui, sans-serif; --mono:'JetBrains Mono', ui-monospace, monospace; }
.tm.rw .tm-wordmark{ font-family:var(--display); font-weight:700; font-size:17px; letter-spacing:-.01em; }
.tm.rw .tm-navlinks{ font-family:var(--body); font-size:14px; }

/* hero */
.hero{ padding:clamp(64px,10vw,108px) 0 clamp(52px,7vw,80px); max-width:980px; }
.hero-kicker{ font-family:var(--mono); font-size:12px; letter-spacing:.16em; text-transform:uppercase; color:var(--dim); margin:0 0 26px; display:flex; align-items:center; gap:12px; }
.hero-kicker::before{ content:''; width:26px; height:1px; background:var(--acc); }
.hero-h1{ font-family:var(--display); font-weight:700; font-size:clamp(40px,6.8vw,76px); line-height:1.0; letter-spacing:-.025em; margin:0 0 28px; }
.hero-h1 .em{ font-style:italic; color:var(--acc); }
.hero-lead{ font-size:clamp(16px,1.6vw,20px); line-height:1.66; color:color-mix(in oklab,var(--ink) 88%, var(--dim)); max-width:60ch; margin:0; font-weight:400; }
.hero-lead .hl{ color:var(--acc); }

/* section head */
.rw-sec{ display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap;
  border-top:1px solid var(--line); padding-top:24px; margin-bottom:30px; }
.rw-sec h2{ font-family:var(--display); font-size:24px; font-weight:600; letter-spacing:-.01em; margin:0; }
.rw-sec em{ font-style:normal; font-family:var(--mono); color:var(--dim); font-size:12px; letter-spacing:.04em; }

/* cards */
.rw-grid{ display:grid; grid-template-columns:1fr 1fr; gap:26px; padding-bottom:96px; }
/* center a lone last card when there's an odd number */
@media (min-width:761px){
  .rw-grid > .pc:last-child:nth-child(odd){ grid-column:1 / -1; max-width:calc(50% - 13px); justify-self:center; }
}
.pc{ position:relative; background:var(--panel); border:1px solid var(--line); border-radius:16px; overflow:hidden;
  display:flex; flex-direction:column; transition:border-color .2s, transform .2s, box-shadow .2s; }
.tm.motion-lift .pc:hover{ transform:translateY(-4px); box-shadow:0 26px 60px -34px var(--acc-glow); }
.pc:hover{ border-color:var(--acc-dim); }
.pc-viz{ position:relative; height:132px; overflow:hidden; border-bottom:1px solid var(--line);
  background:radial-gradient(120% 140% at 50% 0%, color-mix(in srgb,var(--acc) 7%, var(--panel)), var(--panel)); }
.pc-viz::after{ content:''; position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(to bottom, transparent 55%, var(--panel)); }
.pc-main{ padding:24px 26px 24px; display:flex; flex-direction:column; flex:1; }
.pc-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.pc-num{ font-family:var(--display); font-size:26px; font-weight:700; color:var(--line); line-height:1; }
.pc:hover .pc-num{ color:var(--acc-dim); }
.pc-logo{ width:46px; height:46px; border-radius:11px; border:1px solid var(--line); overflow:hidden;
  background:var(--panel2); display:flex; align-items:center; justify-content:center; color:var(--acc); font-family:var(--display); font-weight:700; font-size:16px; }
.pc-logo.has-img{ padding:5px; } .pc-logo.has-img img{ width:100%; height:100%; object-fit:contain; display:block; }
.pc-logo.clef svg{ width:80%; height:80%; overflow:visible; }
.pc-logo.seo svg{ width:80%; height:80%; }
.pc-name{ font-family:var(--display); font-size:25px; font-weight:600; letter-spacing:-.01em; margin:0 0 10px; }
.pc-name a{ color:inherit; text-decoration:none; transition:color .15s; }
.pc-name a:hover{ color:var(--acc); }
.pc-desc{ font-size:14.5px; line-height:1.6; color:color-mix(in oklab,var(--ink) 80%, var(--dim)); margin:0 0 18px; }
.pc-tags{ margin-bottom:22px; }
.pc-links{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-top:auto; }
.pc-more{ margin-left:auto; font-size:13px; color:var(--dim); text-decoration:none; transition:color .15s; }
.pc-more:hover{ color:var(--acc); }
.pc-readmore{ color:var(--acc); text-decoration:none; font-weight:600; white-space:nowrap; }
.pc-readmore:hover{ text-decoration:underline; }
.pc-mini{ font-family:var(--mono); font-size:12px; color:var(--dim); text-decoration:none; display:inline-flex; align-items:center; gap:6px; border:1px solid var(--line); border-radius:8px; padding:8px 12px; transition:color .15s, border-color .15s, background-color .15s, transform .15s; }
.pc-mini .ar{ transition:transform .15s; }
.pc-mini:hover{ color:var(--acc); border-color:var(--acc-dim); transform:translateY(-1px); }
.pc-mini:hover .ar{ transform:translate(1px,-1px); }
.pc-mini.live{ color:var(--acc); border-color:color-mix(in srgb,var(--acc) 32%, var(--line)); }
.pc-mini.live:hover{ background-color:color-mix(in srgb,var(--acc) 10%, var(--panel)); border-color:var(--acc); }
.pc-cta{ position:relative; display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:13px;
  border:1px solid color-mix(in srgb, var(--acc) 28%, var(--line)); border-radius:12px; padding:13px 18px;
  background-color:color-mix(in srgb, var(--acc) 7%, var(--panel)); color:var(--acc);
  font-family:var(--display); font-weight:600; font-size:14.5px; letter-spacing:-.01em; text-decoration:none;
  transition:transform .18s, box-shadow .18s, background-color .18s, border-color .18s; }
.pc-cta::after{ content:''; position:absolute; inset:0; border-radius:12px; pointer-events:none;
  box-shadow:0 0 15px -8px color-mix(in srgb,var(--acc) 28%, transparent); animation:pcGlow 5.5s ease-in-out infinite; }
@keyframes pcGlow{ 0%,100%{ opacity:.3; } 50%{ opacity:.65; } }
.pc-cta:hover{ transform:translateY(-2px); background-color:color-mix(in srgb,var(--acc) 13%, var(--panel)); border-color:color-mix(in srgb,var(--acc) 50%, var(--line));
  box-shadow:0 12px 28px -14px color-mix(in srgb,var(--acc) 45%, transparent); }
.pc-cta .arr{ display:inline-flex; transition:transform .18s; }
.pc-cta:hover .arr{ transform:translateX(5px); }
@media (prefers-reduced-motion: reduce){ .pc-cta::after{ animation:none; } }
.tm.rw .tm-tag{ font-family:var(--mono); }

/* entrance */
@media (prefers-reduced-motion: no-preference){
  .tm.rw[data-anim=on] .pc{ animation:rwUp .55s cubic-bezier(.2,.7,.3,1) both; }
  @keyframes rwUp{ from{ transform:translateY(16px); } to{ transform:none; } }
}

@media (max-width:760px){ .rw-grid{ grid-template-columns:1fr; } }
`;

function HomeLogo({ p }){
  if (p.logo) return (<div className="pc-logo has-img" style={{ background: p.logoBg || '#000' }}><img src={p.logo} alt={p.name+' logo'} loading="lazy" /></div>);
  if (p.id === "multilingual-seo" && window.SeoIcon) return (<div className="pc-logo seo" aria-label="a globe of languages"><window.SeoIcon /></div>);
  if (p.clef) return (<div className="pc-logo clef" aria-label="treble clef"><svg viewBox="0 0 40 54" role="img"><text x="20" y="27" textAnchor="middle" dominantBaseline="central" fontFamily="'Noto Music', serif" fontSize="50" fill="currentColor">{"\u{1D11E}"}</text></svg></div>);
  return <div className="pc-logo">{p.name.replace(/[^A-Za-z]/g,'').slice(0,2).toUpperCase()}</div>;
}

function PortfolioSite(){
  const [t, setTweak] = useShellTweaks();
  const P = window.PORTFOLIO;
  const { ProjectViz, MV_CSS } = window;

  const cls = ["tm", "rw"];
  if (t.lift) cls.push("motion-lift");
  const style = {
    "--acc": t.accent,
    "--display": DISPLAY[t.display] || DISPLAY["Syne"],
  };

  return (
    <div className={cls.join(" ")} data-theme={t.theme} data-bg={t.background || "grid"} data-anim={t.vizAnim ? "on" : "off"} style={style}>
      <style>{BASE_CSS + MV_CSS + HOME_CSS}</style>
      <div className="tm-wrap">
        <Nav active="home" />

        <header className="hero">
          <p className="hero-kicker">Building in public</p>
          <h1 className="hero-h1">AI-native developer &amp; <span className="em">technical content creator</span></h1>
          <p className="hero-lead">I build AI-native software and write the tutorials that teach people how it works. Each project here is an experiment I shipped <span className="hl">and documented</span> — try the demo, read the writeup, dig through the code.</p>
        </header>

        <div className="rw-sec">
          <h2>Selected work</h2>
          <em>five experiments · demo · code · writeup</em>
        </div>

        <div className="rw-grid">
          {P.projects.map((p, i)=>(
            <article className="pc" key={p.id} style={{ animationDelay: `${0.06 + i*0.07}s`, ["--ph"]: PC_HUE[p.id] || "var(--acc)" }}>
              {t.viz && (
                <div className={"pc-viz" + (t.vizAnim ? " mv-anim" : "")}>
                  <ProjectViz id={p.id} animate={t.vizAnim} />
                </div>
              )}
              <div className="pc-main">
                <div className="pc-head">
                  <HomeLogo p={p} />
                  <span className="pc-num">{p.n}</span>
                </div>
                <h3 className="pc-name"><a href={`project-${p.id}.html`}>{p.name}</a></h3>
                <p className="pc-desc">{p.desc} <a className="pc-readmore" href={`project-${p.id}.html`}>Read more →</a></p>
                <div className="tm-tags pc-tags">{p.tags.map((tg,j)=>(<span className="tm-tag" key={j}>{tg}</span>))}</div>
                <div className="pc-links">
                  {p.id !== "multilingual-seo" && (
                    <a className="pc-mini live" href={p.demo} target={p.id === "pricey" ? "_blank" : undefined} rel="noopener">{p.id === "pricey" ? "Watch live" : "Live demo"} <span className="ar">↗</span></a>
                  )}
                  <a className="pc-mini" href={p.repo}>GitHub <span className="ar">↗</span></a>
                </div>
                <a className="pc-cta" href={`project-${p.id}.html`}>
                  <span>Read the writeup</span>
                  <span className="arr">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

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
        <TweakSection label="Project visuals" />
        <TweakToggle label="Micro-visualizations" value={t.viz} onChange={(v)=>setTweak('viz', v)} />
        <TweakToggle label="Animate visuals" value={t.vizAnim} onChange={(v)=>setTweak('vizAnim', v)} />
        <TweakSection label="Motion & texture" />
        <TweakSelect label="Background" value={t.background}
          options={["grid","dots","diagonal","void","aurora","mesh","spotlight","grain","circuit","waves","plus","chevron","weave","triangles","blueprint"]}
          onChange={(v)=>setTweak('background', v)} />
        <TweakToggle label="Card hover lift" value={t.lift} onChange={(v)=>setTweak('lift', v)} />
      </TweaksPanel>
    </div>
  );
}
window.PortfolioSite = PortfolioSite;
