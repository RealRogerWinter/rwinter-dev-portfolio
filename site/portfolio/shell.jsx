// Shared shell for all Roger Winter portfolio pages.
// Exports (to window): TW_DEFAULTS, MONO, useShellTweaks, BASE_CSS, SUBPAGE_CSS,
//   Nav, Footer, BaseTweaks, HOME_FILE
const { useTweaks } = window;

const HOME_FILE = "/";

// Shared accent palette for the Tweaks "Accent" swatches.
const ACCENTS = [
  "#57f08d", "#2ee6a6", "#46e3d6", "#38bdf8", "#5b8cff", "#7c8cff",
  "#a78bfa", "#c084fc", "#ec5fd0", "#f472b6", "#fb7185", "#f87171",
  "#fb923c", "#f5b54b", "#facc15", "#a3e635", "#6ee7b7", "#94a3b8",
];
window.ACCENTS = ACCENTS;

const TW_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#5b8cff",
  "theme": "dark",
  "mono": "JetBrains Mono",
  "display": "Syne",
  "background": "weave",
  "layout": "windows",
  "hero": "command",
  "viz": true,
  "vizAnim": true,
  "blink": true,
  "lift": true,
  "scanlines": false,
  "grid": true
}/*EDITMODE-END*/;

const MONO = {
  "JetBrains Mono": "'JetBrains Mono', ui-monospace, monospace",
  "IBM Plex Mono": "'IBM Plex Mono', ui-monospace, monospace",
  "Space Mono": "'Space Mono', ui-monospace, monospace",
  "Fira Code": "'Fira Code', ui-monospace, monospace",
};

const TW_KEY = "rw_tweaks_v1";

// useTweaks + a localStorage layer so values sync across pages at runtime.
function useShellTweaks(){
  let init = TW_DEFAULTS;
  try { const s = JSON.parse(localStorage.getItem(TW_KEY) || "{}"); init = { ...TW_DEFAULTS, ...s }; } catch(e){}
  const [t, setRaw] = useTweaks(init);
  const setTweak = React.useCallback((k, v) => {
    setRaw(k, v);
    try {
      const cur = JSON.parse(localStorage.getItem(TW_KEY) || "{}");
      const edits = (typeof k === "object" && k !== null) ? k : { [k]: v };
      localStorage.setItem(TW_KEY, JSON.stringify({ ...cur, ...edits }));
    } catch(e){}
  }, [setRaw]);
  return [t, setTweak];
}

function rootProps(t){
  const cls = ["tm"];
  if (t.scanlines) cls.push("scan");
  if (t.blink) cls.push("motion-blink");
  if (t.lift) cls.push("motion-lift");
  return {
    className: cls.join(" "),
    "data-theme": t.theme,
    "data-layout": t.layout,
    "data-bg": t.background || "grid",
    style: { "--acc": t.accent, "--mono": MONO[t.mono] || MONO["JetBrains Mono"] },
  };
}

const BASE_CSS = `
.tm{
  --mono:'JetBrains Mono', ui-monospace, monospace;
  --acc:#57f08d;
  --acc-dim:color-mix(in oklab, var(--acc) 64%, #0b0d0c);
  --acc-soft:color-mix(in srgb, var(--acc) 12%, transparent);
  --acc-glow:color-mix(in srgb, var(--acc) 42%, transparent);
  --bg:#0b0d0c; --panel:#101412; --panel2:#0c100e;
  --line:#1d2421; --ink:#d7e0da; --dim:#7e8a83;
  font-family:var(--mono); background:var(--bg); color:var(--ink);
  min-height:100vh; width:100%; position:relative; overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
.tm[data-theme=light]{
  --bg:#eceae2; --panel:#f6f5ef; --panel2:#e6e4da;
  --line:#d5d2c6; --ink:#1a201c; --dim:#6c736c;
  --acc-dim:color-mix(in oklab, var(--acc) 58%, #1a201c);
}
.tm[data-bg=grid]{
  background-image:linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size:64px 64px; background-position:-1px -1px;
}
.tm[data-bg=dots]{ background-image:radial-gradient(var(--line) 1.3px, transparent 1.4px); background-size:28px 28px; }
.tm[data-bg=diagonal]{ background-image:repeating-linear-gradient(45deg, transparent 0 23px, color-mix(in srgb,var(--line) 70%, transparent) 23px 24px); }
.tm[data-bg=void]{}
.tm[data-bg=aurora]::after{ content:''; position:fixed; inset:-12%; pointer-events:none; z-index:0;
  background:radial-gradient(38% 46% at 18% 22%, color-mix(in srgb,var(--acc) 26%, transparent), transparent 70%),
   radial-gradient(44% 52% at 82% 28%, color-mix(in srgb,var(--acc) 16%, transparent), transparent 72%),
   radial-gradient(50% 56% at 62% 88%, color-mix(in srgb,var(--acc) 12%, transparent), transparent 72%);
  filter:blur(40px); }
@media (prefers-reduced-motion: no-preference){ .tm[data-bg=aurora]::after{ animation:tmAurora 22s ease-in-out infinite alternate; } }
@keyframes tmAurora{ from{ transform:translate3d(0,0,0) scale(1); } to{ transform:translate3d(0,-24px,0) scale(1.14); } }
.tm[data-bg=mesh]::after{ content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background:radial-gradient(30% 40% at 12% 18%, color-mix(in srgb,var(--acc) 22%, transparent), transparent 60%),
   radial-gradient(28% 36% at 88% 16%, color-mix(in srgb,var(--acc) 16%, transparent), transparent 60%),
   radial-gradient(36% 44% at 50% 98%, color-mix(in srgb,var(--acc) 18%, transparent), transparent 64%),
   radial-gradient(24% 30% at 80% 72%, color-mix(in srgb,var(--acc) 10%, transparent), transparent 60%); }
.tm[data-bg=spotlight]::after{ content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background:radial-gradient(58% 46% at 50% 8%, color-mix(in srgb,var(--acc) 14%, transparent), transparent 52%),
   radial-gradient(130% 100% at 50% 42%, transparent 50%, rgba(0,0,0,.6)); }
.tm[data-theme=light][data-bg=spotlight]::after{ background:radial-gradient(58% 46% at 50% 8%, color-mix(in srgb,var(--acc) 18%, transparent), transparent 52%),
   radial-gradient(130% 100% at 50% 42%, transparent 56%, rgba(0,0,0,.16)); }
.tm[data-bg=grain]::after{ content:''; position:fixed; inset:0; pointer-events:none; z-index:0; opacity:.07; mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

/* tiled SVG patterns (masked, so they follow accent + theme) */
.tm[data-bg=circuit]::after,
.tm[data-bg=waves]::after,
.tm[data-bg=plus]::after,
.tm[data-bg=chevron]::after,
.tm[data-bg=weave]::after,
.tm[data-bg=triangles]::after{ content:''; position:fixed; inset:0; pointer-events:none; z-index:0; opacity:.5;
  background-color:color-mix(in srgb, var(--acc) 30%, var(--line)); }
.tm[data-bg=circuit]::after{ -webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none' stroke='black' stroke-width='1.4'%3E%3Cpath d='M0,30H22M38,30H60M30,0V22M30,38V60'/%3E%3Ccircle cx='30' cy='30' r='3.4' fill='black' stroke='none'/%3E%3Ccircle cx='0' cy='30' r='1.8' fill='black' stroke='none'/%3E%3Ccircle cx='30' cy='0' r='1.8' fill='black' stroke='none'/%3E%3C/g%3E%3C/svg%3E"); mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none' stroke='black' stroke-width='1.4'%3E%3Cpath d='M0,30H22M38,30H60M30,0V22M30,38V60'/%3E%3Ccircle cx='30' cy='30' r='3.4' fill='black' stroke='none'/%3E%3Ccircle cx='0' cy='30' r='1.8' fill='black' stroke='none'/%3E%3Ccircle cx='30' cy='0' r='1.8' fill='black' stroke='none'/%3E%3C/g%3E%3C/svg%3E"); -webkit-mask-size:60px 60px; mask-size:60px 60px; }
.tm[data-bg=waves]::after{ -webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Cpath d='M0,20Q20,4,40,20T80,20' fill='none' stroke='black' stroke-width='1.6'/%3E%3C/svg%3E"); mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Cpath d='M0,20Q20,4,40,20T80,20' fill='none' stroke='black' stroke-width='1.6'/%3E%3C/svg%3E"); -webkit-mask-size:80px 40px; mask-size:80px 40px; opacity:.42; }
.tm[data-bg=plus]::after{ -webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M16,10V22M10,16H22' fill='none' stroke='black' stroke-width='1.4'/%3E%3C/svg%3E"); mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M16,10V22M10,16H22' fill='none' stroke='black' stroke-width='1.4'/%3E%3C/svg%3E"); -webkit-mask-size:32px 32px; mask-size:32px 32px; }
.tm[data-bg=chevron]::after{ -webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='26'%3E%3Cpath d='M0,19L22,7L44,19' fill='none' stroke='black' stroke-width='1.6'/%3E%3C/svg%3E"); mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='26'%3E%3Cpath d='M0,19L22,7L44,19' fill='none' stroke='black' stroke-width='1.6'/%3E%3C/svg%3E"); -webkit-mask-size:44px 26px; mask-size:44px 26px; opacity:.42; }
.tm[data-bg=weave]::after{ -webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Cpath d='M0,0L44,44M44,0L0,44' fill='none' stroke='black' stroke-width='1'/%3E%3C/svg%3E"); mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Cpath d='M0,0L44,44M44,0L0,44' fill='none' stroke='black' stroke-width='1'/%3E%3C/svg%3E"); -webkit-mask-size:44px 44px; mask-size:44px 44px; opacity:.38; }
.tm[data-bg=triangles]::after{ -webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='38'%3E%3Cpath d='M22,2L42,36H2Z' fill='none' stroke='black' stroke-width='1.3'/%3E%3C/svg%3E"); mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='38'%3E%3Cpath d='M22,2L42,36H2Z' fill='none' stroke='black' stroke-width='1.3'/%3E%3C/svg%3E"); -webkit-mask-size:44px 38px; mask-size:44px 38px; opacity:.4; }
.tm[data-bg=blueprint]{ background-image:linear-gradient(color-mix(in srgb,var(--acc) 16%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--acc) 16%,transparent) 1px,transparent 1px); background-size:42px 42px; background-position:-1px -1px; }
.tm[data-bg=blueprint]::after{ content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image:linear-gradient(color-mix(in srgb,var(--acc) 26%,transparent) 1.4px,transparent 1.4px),linear-gradient(90deg,color-mix(in srgb,var(--acc) 26%,transparent) 1.4px,transparent 1.4px); background-size:210px 210px; background-position:-1px -1px; opacity:.7; }
.tm::before{ content:''; position:absolute; inset:0 0 auto 0; height:760px; pointer-events:none; z-index:0;
  background:radial-gradient(120% 80% at 50% -12%, var(--acc-soft), transparent 60%); }
.tm.scan::after{ content:''; position:fixed; inset:0; pointer-events:none; z-index:9;
  background:repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.16) 3px, transparent 4px);
  mix-blend-mode:overlay; opacity:.5; }
.tm[data-theme=light].scan::after{ background:repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.05) 3px, transparent 4px); }

.tm-wrap{ position:relative; z-index:1; max-width:1180px; margin:0 auto; padding:0 clamp(20px,5vw,56px); }

/* nav (05+ underline active + rounded CTA) */
.tm-nav{ display:flex; align-items:center; justify-content:space-between; height:78px;
  border-bottom:1px solid var(--line); gap:20px; flex-wrap:wrap; }
.tm-brand{ display:flex; align-items:center; gap:12px; white-space:nowrap; text-decoration:none; }
.tm-mono{ width:34px; height:34px; border-radius:9px; flex:0 0 auto; display:flex; align-items:center; justify-content:center;
  border:1px solid color-mix(in srgb,var(--acc) 55%, var(--line)); color:var(--acc);
  font-family:var(--display); font-weight:800; font-size:15px; }
.tm-wordmark{ color:var(--ink); font-weight:600; letter-spacing:.01em; }
.tm-navright{ display:flex; align-items:center; gap:26px; flex-wrap:wrap; }
.tm-navlinks{ display:flex; align-items:center; gap:26px; font-size:14px; }
.tm-navlinks a{ position:relative; color:var(--dim); text-decoration:none; padding:8px 0; transition:color .15s; }
.tm-navlinks a:hover{ color:var(--ink); }
.tm-navlinks a.active{ color:var(--ink); }
.tm-navlinks a.active::after{ content:''; position:absolute; left:0; right:0; bottom:-2px; height:2px;
  background:var(--acc); box-shadow:0 0 10px var(--acc); border-radius:2px; }
.tm-cta{ background:var(--acc); color:#0a130f; font-weight:600; font-size:13px; padding:10px 20px;
  border-radius:100px; text-decoration:none; white-space:nowrap; transition:filter .15s; }
.tm-cta:hover{ filter:brightness(1.08); }

/* section head */
.tm-sec{ display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap;
  border-top:1px solid var(--line); padding-top:22px; margin-bottom:34px; }
.tm-sec h2{ font-size:14px; font-weight:600; letter-spacing:.04em; margin:0; }
.tm-sec h2 span{ color:var(--acc); }
.tm-sec em{ font-style:normal; color:var(--dim); font-size:13px; }

/* tags + buttons (shared) */
.tm-tag{ font-size:11px; color:var(--acc-dim); border:1px solid var(--line); border-radius:20px; padding:4px 11px; }
.tm-tags{ display:flex; flex-wrap:wrap; gap:8px; }
.tm-btn{ font-size:12px; text-decoration:none; padding:8px 13px; border-radius:6px; transition:.15s; white-space:nowrap; display:inline-flex; align-items:center; gap:7px; }
.tm-btn.demo{ background:var(--acc); color:#06160c; font-weight:700; }
.tm-btn.demo:hover{ box-shadow:0 0 0 3px var(--acc-soft); }
.tm-btn.ghost{ border:1px solid var(--line); color:var(--ink); }
.tm-btn.ghost:hover{ border-color:var(--acc-dim); color:var(--acc); }

/* footer */
.tm-foot{ border-top:1px solid var(--line); padding:34px 0 64px; display:flex; justify-content:space-between;
  align-items:center; gap:16px; flex-wrap:wrap; font-size:12px; color:var(--dim); }
.tm-foot a{ color:var(--dim); text-decoration:none; } .tm-foot a:hover{ color:var(--acc); }

@media (max-width:760px){ .tm-navlinks{ gap:16px; } }
@media (prefers-reduced-motion: reduce){ .tm-cur{ animation:none !important; } }
`;

const SUBPAGE_CSS = `
/* page hero */
.pg{ padding:clamp(56px,9vw,104px) 0 clamp(40px,6vw,64px); }
.pg-kicker{ font-size:12px; letter-spacing:.06em; color:var(--dim); margin:0 0 22px; }
.pg-kicker b{ color:var(--acc); font-weight:500; }
.pg-h1{ font-size:clamp(34px,5.4vw,60px); line-height:1.04; font-weight:700; letter-spacing:-.02em; margin:0 0 22px; max-width:18ch; }
.pg-lead{ font-size:clamp(15px,1.5vw,18px); line-height:1.72; color:var(--ink); max-width:62ch; margin:0; font-weight:400; }
.pg-lead .hl{ color:var(--acc); }

/* layout columns */
.pg-cols{ display:grid; grid-template-columns:1.7fr 1fr; gap:clamp(28px,5vw,64px); padding-bottom:90px; align-items:start; }
@media (max-width:820px){ .pg-cols{ grid-template-columns:1fr; gap:44px; } }

/* prose */
.prose p{ font-size:15px; line-height:1.78; color:color-mix(in oklab,var(--ink) 86%, var(--dim)); margin:0 0 20px; max-width:64ch; }
.prose p:last-child{ margin-bottom:0; }
.prose strong{ color:var(--ink); font-weight:600; }
.prose a{ color:var(--acc); text-decoration:none; border-bottom:1px solid var(--acc-dim); }

/* labelled block / aside panel */
.panel{ background:var(--panel); border:1px solid var(--line); border-radius:10px; overflow:hidden; }
.panel-bar{ display:flex; align-items:center; gap:10px; padding:12px 16px; border-bottom:1px solid var(--line); background:var(--panel2); }
.panel-bar .lights{ display:flex; gap:7px; } .panel-bar .lights i{ width:10px; height:10px; border-radius:50%; display:block; }
.panel-bar .lights i:nth-child(1){ background:#f25f57; } .panel-bar .lights i:nth-child(2){ background:#fabd2f; } .panel-bar .lights i:nth-child(3){ background:#3fb950; }
.panel-bar .ttl{ font-size:12px; color:var(--dim); }
.panel-body{ padding:22px 22px; }
.kv{ display:grid; grid-template-columns:auto 1fr; gap:10px 18px; font-size:13.5px; }
.kv dt{ color:var(--dim); } .kv dd{ margin:0; color:var(--ink); }
.kv dd a{ color:var(--acc); text-decoration:none; }

/* generic section title for sub-pages */
.blk{ margin:0 0 54px; }
.blk-h{ font-size:13px; letter-spacing:.05em; color:var(--acc); margin:0 0 22px; padding-bottom:14px; border-bottom:1px solid var(--line); }
.blk-h span{ color:var(--dim); }

/* résumé timeline */
.cv{ display:flex; flex-direction:column; }
.cv-item{ display:grid; grid-template-columns:170px 1fr; gap:28px; padding:26px 0; border-top:1px solid var(--line); }
.cv-item:first-child{ border-top:0; }
.cv-when{ font-size:12.5px; color:var(--dim); padding-top:3px; }
.cv-when .now{ color:var(--acc); }
.cv-role{ font-size:18px; font-weight:600; margin:0 0 4px; }
.cv-org{ font-size:13px; color:var(--acc-dim); margin:0 0 12px; }
.cv-pts{ margin:0; padding:0; list-style:none; }
.cv-pts li{ font-size:14px; line-height:1.7; color:color-mix(in oklab,var(--ink) 84%, var(--dim)); padding-left:18px; position:relative; margin-bottom:7px; }
.cv-pts li::before{ content:'›'; position:absolute; left:0; color:var(--acc); }
@media (max-width:680px){ .cv-item{ grid-template-columns:1fr; gap:10px; } }
.skills{ display:flex; flex-wrap:wrap; gap:9px; }

/* contact form */
.form{ display:flex; flex-direction:column; gap:18px; max-width:560px; }
.field{ display:flex; flex-direction:column; gap:8px; }
.field label{ font-size:12px; color:var(--dim); letter-spacing:.04em; }
.field label b{ color:var(--acc); font-weight:500; }
.field input, .field textarea{ font-family:var(--mono); font-size:14px; color:var(--ink); background:var(--panel2);
  border:1px solid var(--line); border-radius:8px; padding:13px 14px; outline:none; transition:border-color .15s, box-shadow .15s; resize:vertical; }
.field input:focus, .field textarea:focus{ border-color:var(--acc-dim); box-shadow:0 0 0 3px var(--acc-soft); }
.form .send{ align-self:flex-start; cursor:pointer; border:0; font-family:var(--mono); }
.form-ok{ font-size:13.5px; color:var(--acc); line-height:1.7; }
.form-ok .muted{ color:var(--dim); }
.contact-methods{ display:flex; flex-direction:column; gap:0; }
.cm{ display:flex; align-items:center; justify-content:space-between; gap:16px; padding:18px 4px; border-top:1px solid var(--line); text-decoration:none; }
.cm:first-child{ border-top:0; }
.cm .cm-l{ font-size:12px; color:var(--dim); }
.cm .cm-v{ font-size:15px; color:var(--ink); transition:color .15s; }
.cm:hover .cm-v{ color:var(--acc); }
.cm .cm-arrow{ color:var(--dim); }

/* project detail */
.pj-hero{ display:grid; grid-template-columns:auto 1fr; gap:28px; align-items:center; padding:clamp(48px,8vw,84px) 0 40px; }
.pj-logo{ width:104px; height:104px; flex:0 0 104px; border-radius:18px; border:1px solid var(--line); overflow:hidden;
  background:repeating-linear-gradient(45deg, transparent, transparent 6px, var(--acc-soft) 6px, var(--acc-soft) 7px), var(--panel2);
  display:flex; align-items:center; justify-content:center; color:var(--acc); font-size:34px; font-weight:700; }
.pj-logo.has-img{ padding:10px; } .pj-logo.has-img img{ width:100%; height:100%; object-fit:contain; display:block; }
.pj-logo.clef svg{ width:80%; height:80%; overflow:visible; }
.pj-eyebrow{ font-size:12px; color:var(--dim); margin:0 0 10px; }
.pj-eyebrow b{ color:var(--acc); font-weight:500; }
.pj-title{ font-size:clamp(32px,5vw,52px); font-weight:700; letter-spacing:-.02em; margin:0 0 14px; }
.pj-tagline{ font-size:clamp(15px,1.6vw,18px); color:color-mix(in oklab,var(--ink) 86%, var(--dim)); line-height:1.6; margin:0 0 20px; max-width:60ch; }
.pj-actions{ display:flex; gap:11px; flex-wrap:wrap; align-items:center; }
@media (max-width:620px){ .pj-hero{ grid-template-columns:1fr; gap:20px; } .pj-logo{ width:84px; height:84px; flex-basis:84px; } }

.feat{ display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--line); border:1px solid var(--line); border-radius:10px; overflow:hidden; }
.feat .cell{ background:var(--panel); padding:24px 22px; }
.feat .cell h4{ font-size:15px; margin:0 0 9px; color:var(--ink); display:flex; gap:9px; align-items:baseline; }
.feat .cell h4 .n{ color:var(--acc); font-size:12px; }
.feat .cell p{ font-size:13.5px; line-height:1.65; color:color-mix(in oklab,var(--ink) 80%, var(--dim)); margin:0; }
@media (max-width:680px){ .feat{ grid-template-columns:1fr; } }

.shot{ border:1px solid var(--line); border-radius:10px; background:var(--panel2); overflow:hidden; }
.shot .ph{ aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; color:var(--dim); font-size:13px;
  background:repeating-linear-gradient(135deg, transparent, transparent 11px, var(--acc-soft) 11px, var(--acc-soft) 12px); }

.pj-nav{ display:flex; justify-content:space-between; gap:16px; border-top:1px solid var(--line); padding:30px 0 80px; flex-wrap:wrap; }
.pj-nav a{ text-decoration:none; color:var(--dim); font-size:13px; }
.pj-nav a:hover{ color:var(--acc); } .pj-nav a .lbl{ display:block; color:var(--ink); font-size:15px; margin-top:5px; }
.pj-nav a.next{ text-align:right; }
`;

function Nav({ active }){
  const items = [
    { k:"home", label:"Projects", href:HOME_FILE },
    { k:"bio", label:"Bio", href:"bio.html" },
  ];
  return (
    <nav className="tm-nav">
      <a className="tm-brand" href={HOME_FILE}>
        <span className="tm-mono">RW</span><span className="tm-wordmark">Roger Winter</span>
      </a>
      <div className="tm-navright">
        <div className="tm-navlinks">
          {items.map((it)=>(<a key={it.k} href={it.href} className={active===it.k ? "active" : ""}>{it.label}</a>))}
          <a href="https://github.com/RealRogerWinter" target="_blank" rel="noopener">GitHub</a>
        </div>
        <a className="tm-cta" href="contact.html">Contact</a>
      </div>
    </nav>
  );
}

function Footer(){
  return (
    <footer className="tm-foot">
      <span>© 2026 Roger Winter — built &amp; documented in public</span>
      <span><a href="https://github.com/RealRogerWinter" target="_blank" rel="noopener">github</a> · <a href="https://www.linkedin.com/in/roger-winter-content-strategy" target="_blank" rel="noopener">linkedin</a> · <a href="https://github.com/RealRogerWinter/rwinter-dev-portfolio" target="_blank" rel="noopener">site source</a></span>
    </footer>
  );
}

// ── de-teched "creative" mode (rw) — shared by home, project, bio, contact ──
const DISPLAY = {
  "Syne": "'Syne', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
  "Bricolage Grotesque": "'Bricolage Grotesque', sans-serif",
};

function rootPropsRW(t){
  const cls = ["tm", "rw"];
  if (t.lift) cls.push("motion-lift");
  return {
    className: cls.join(" "),
    "data-theme": t.theme,
    "data-bg": t.background || "grid",
    style: { "--acc": t.accent, "--display": DISPLAY[t.display] || DISPLAY["Syne"] },
  };
}

const RW_CSS = `
.tm.rw{ font-family:var(--body); --body:'Hanken Grotesk', system-ui, sans-serif; --mono:'JetBrains Mono', ui-monospace, monospace; }
.tm.rw .tm-wordmark{ font-family:var(--display); font-weight:700; font-size:17px; letter-spacing:-.01em; }
.tm.rw .tm-navlinks{ font-family:var(--body); font-size:14px; }
.tm.rw .pg-kicker{ font-family:var(--mono); letter-spacing:.16em; text-transform:uppercase; color:var(--dim); display:inline-flex; align-items:center; gap:12px; }
.tm.rw .pg-kicker::before{ content:''; width:26px; height:1px; background:var(--acc); }
.tm.rw .pg-kicker b{ color:var(--acc); font-weight:500; }
.tm.rw .pg-h1{ font-family:var(--display); font-weight:700; letter-spacing:-.025em; }
.tm.rw .blk-h{ font-family:var(--display); color:var(--ink); font-size:20px; letter-spacing:-.01em; }
.tm.rw .blk-h span{ display:none; }
.tm.rw .panel{ border-radius:16px; }
.tm.rw .panel-bar{ border-bottom:0; padding:18px 22px 4px; background:transparent; }
.tm.rw .panel-bar .lights{ display:none; }
.tm.rw .panel-bar .ttl{ font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; }
.tm.rw .kv dd, .tm.rw .cm-v{ font-family:var(--display); }
.tm.rw .cv-role{ font-family:var(--display); }
.tm.rw .form .send{ font-family:var(--body); font-weight:700; }
.tm.rw .field label{ font-family:var(--mono); }
.tm.rw .form-ok{ font-family:var(--body); font-size:15px; line-height:1.7; color:var(--ink); }
.tm.rw .tm-tag{ font-family:var(--mono); }
`;

function CreativeTweaks({ t, setTweak, withViz }){
  const { TweakSection, TweakColor, TweakRadio, TweakSelect, TweakToggle } = window;
  return (
    <React.Fragment>
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
      {withViz && (<React.Fragment>
        <TweakSection label="Project visuals" />
        <TweakToggle label="Micro-visualizations" value={t.viz} onChange={(v)=>setTweak('viz', v)} />
        <TweakToggle label="Animate visuals" value={t.vizAnim} onChange={(v)=>setTweak('vizAnim', v)} />
      </React.Fragment>)}
      <TweakSection label="Motion & texture" />
      <TweakSelect label="Background" value={t.background}
        options={["grid","dots","diagonal","void","aurora","mesh","spotlight","grain","circuit","waves","plus","chevron","weave","triangles","blueprint"]}
        onChange={(v)=>setTweak('background', v)} />
      <TweakToggle label="Card hover lift" value={t.lift} onChange={(v)=>setTweak('lift', v)} />
    </React.Fragment>
  );
}

// Shared tweak controls (color / type / motion) — used by every page's panel.
function BaseTweaks({ t, setTweak }){
  const { TweakSection, TweakColor, TweakRadio, TweakSelect, TweakToggle } = window;
  return (
    <React.Fragment>
      <TweakSection label="Color & theme" />
      <TweakColor label="Accent" value={t.accent}
        options={window.ACCENTS}
        onChange={(v)=>setTweak('accent', v)} />
      <TweakRadio label="Theme" value={t.theme} options={["dark","light"]}
        onChange={(v)=>setTweak('theme', v)} />
      <TweakSection label="Typography" />
      <TweakSelect label="Mono font" value={t.mono}
        options={["JetBrains Mono","IBM Plex Mono","Space Mono","Fira Code"]}
        onChange={(v)=>setTweak('mono', v)} />
      <TweakSection label="Motion & texture" />
      <TweakToggle label="Card hover lift" value={t.lift} onChange={(v)=>setTweak('lift', v)} />
      <TweakToggle label="Grid background" value={t.grid} onChange={(v)=>setTweak('grid', v)} />
      <TweakToggle label="Scanlines (CRT)" value={t.scanlines} onChange={(v)=>setTweak('scanlines', v)} />
    </React.Fragment>
  );
}

Object.assign(window, { TW_DEFAULTS, MONO, useShellTweaks, rootProps, BASE_CSS, SUBPAGE_CSS, Nav, Footer, BaseTweaks, HOME_FILE, DISPLAY, rootPropsRW, RW_CSS, CreativeTweaks });

// ── global click-to-zoom lightbox for screenshots ──
(function initLightbox(){
  if (typeof document === "undefined" || window.__rwLightbox) return;
  window.__rwLightbox = true;
  const SEL = ".sl-frame img, .pg-shot .frame img, .pg-dash .frame img, .sp-frame .frame img, .pcy-tour img, .os-tour img";
  const style = document.createElement("style");
  style.textContent =
    SEL.split(",").map(s => s.trim() + "{ cursor:zoom-in; }").join("\n") + `
    .rw-lightbox{ position:fixed; inset:0; z-index:99999; display:none; align-items:center; justify-content:center;
      background:rgba(6,8,10,0.88); -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px); padding:4vmin; cursor:zoom-out; opacity:0; transition:opacity .18s; }
    .rw-lightbox.on{ display:flex; opacity:1; }
    .rw-lightbox img{ max-width:96vw; max-height:92vh; border-radius:10px; box-shadow:0 30px 90px -20px rgba(0,0,0,.8); border:1px solid rgba(255,255,255,.14); }
    .rw-lightbox .rw-x{ position:absolute; top:18px; right:22px; width:42px; height:42px; border-radius:50%;
      border:1px solid rgba(255,255,255,.25); background:rgba(0,0,0,.45); color:#fff; font-size:20px; line-height:1;
      display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .rw-lightbox .rw-x:hover{ background:rgba(0,0,0,.7); }`;
  document.head.appendChild(style);
  const box = document.createElement("div");
  box.className = "rw-lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Expanded screenshot");
  box.innerHTML = '<button class="rw-x" aria-label="Close">\u2715</button><img alt="" />';
  document.body.appendChild(box);
  const boxImg = box.querySelector("img");
  const close = () => { box.classList.remove("on"); setTimeout(() => { if (!box.classList.contains("on")) boxImg.src = ""; }, 200); };
  box.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!t || !t.closest) return;
    const img = t.closest(SEL);
    if (!img) return;
    e.preventDefault();
    e.stopPropagation();
    boxImg.src = img.currentSrc || img.src;
    box.classList.add("on");
  }, true);
})();
