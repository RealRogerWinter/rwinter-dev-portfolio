// Bio page — de-teched creative styling. Mount with <window.BioPage />.
function BioPage(){
  const [t, setTweak] = window.useShellTweaks();
  const { BASE_CSS, SUBPAGE_CSS, RW_CSS, Nav, Footer, CreativeTweaks, rootPropsRW, TweaksPanel } = window;

  const EXTRA = `
  .bio-cta{ border-top:1px solid var(--line); padding:34px 0 80px; }
  .bio-cta a{ font-family:var(--display); color:var(--acc); text-decoration:none; font-size:clamp(20px,3vw,30px); font-weight:600; letter-spacing:-.01em; }
  .bio-cta a:hover{ opacity:.8; }
  .bio-aside{ position:sticky; top:30px; }
  @media (max-width:820px){ .bio-aside{ position:static; } }
  .at-glance dt{ margin-top:14px; } .at-glance dt:first-child{ margin-top:0; }
  .tm.rw .pg-lead{ font-size:clamp(17px,1.7vw,21px); }
  .tm.rw .prose p{ font-family:var(--body); font-size:16px; }
  `;

  return (
    <div {...rootPropsRW(t)}>
      <style>{BASE_CSS + SUBPAGE_CSS + RW_CSS + EXTRA}</style>
      <div className="tm-wrap">
        <Nav active="bio" />

        <header className="pg">
          <p className="pg-kicker">About</p>
          <h1 className="pg-h1">Hi, I'm Roger Winter.</h1>
          <p className="pg-lead">I build AI-native software and write the tutorials that explain how it works — <span className="hl">the project is the experiment, the writeup is the result.</span></p>
        </header>

        <div className="pg-cols">
          <div className="prose">
            <p>Most of what I make starts as a question I want answered in public. What happens if only one person can be live at a time? Can a neural network learn a pricing game on camera, while people watch? The build is how I find out — and the writeup is how everyone else gets to.</p>
            <p>I work end-to-end: design, build, ship, then document. I care about software that's <strong>legible</strong> — tools where the AI is a collaborator you can see and steer, not a black box. That bias runs through everything here, from a notation editor you can talk to, to an SEO workspace that treats five languages as a single workflow.</p>
            <p>When something works, I write it down. The tutorials are how I think out loud, and how each project earns a second life as something other people can actually learn from. If you're a team building in this space, that's the overlap I'm best at: <strong>shipping the thing and explaining the thing.</strong></p>
          </div>

          <aside className="bio-aside">
            <div className="panel">
              <div className="panel-bar"><span className="ttl">At a glance</span></div>
              <div className="panel-body">
                <dl className="kv at-glance">
                  <dt>role</dt><dd>AI-native developer &amp; technical content creator</dd>
                  <dt>writes</dt><dd>Written tutorials &amp; deep-dives</dd>
                  <dt>focus</dt><dd>AI &amp; LLM tooling · full-stack web · realtime &amp; games</dd>
                  <dt>open to</dt><dd>Select work &amp; collaboration</dd>
                </dl>
                <div style={{ height: '20px' }}></div>
                <h4 style={{ margin: '0 0 12px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--dim)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Works with</h4>
                <div className="tm-tags skills">
                  {["TypeScript","Python","React","Node","PyTorch","LLM APIs","WebRTC"].map((s,i)=>(<span className="tm-tag" key={i}>{s}</span>))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="bio-cta">
          <a href="contact.html">Want to build something together? →</a>
        </div>

        <Footer />
      </div>

      <TweaksPanel title="Tweaks">
        <CreativeTweaks t={t} setTweak={setTweak} withViz={false} />
      </TweaksPanel>
    </div>
  );
}
window.BioPage = BioPage;
