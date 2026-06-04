// sheet-llm — conversational / educational chat demo (with mini staff demos).
// Exports: window.SL_CHAT_CSS, window.ChatDemo
const { useState: chatUseState } = React;

const SL_CHAT_CSS = `
.slc{ background:var(--panel); border:1px solid var(--line); border-radius:18px; overflow:hidden; display:flex; flex-direction:column; }
.slc-head{ display:flex; align-items:center; gap:9px; padding:13px 18px; border-bottom:1px solid var(--line); background:var(--panel2); }
.slc-head i{ width:9px; height:9px; border-radius:50%; background:var(--acc); box-shadow:0 0 9px var(--acc); }
.slc-head b{ font-family:var(--mono); font-size:12px; color:var(--ink); letter-spacing:.04em; }
.slc-head span{ font-family:var(--mono); font-size:10px; color:var(--dim); margin-left:auto; letter-spacing:.08em; text-transform:uppercase; }
.slc-thread{ padding:20px 18px; display:flex; flex-direction:column; gap:14px; min-height:120px; }
.slc-msg{ max-width:84%; animation:slcIn .3s ease both; }
@keyframes slcIn{ from{ transform:translateY(6px); } to{ transform:none; } }
.slc-msg.user{ align-self:flex-end; }
.slc-msg.user .b{ background:var(--acc); color:#0a130f; border-radius:13px 13px 4px 13px; padding:11px 15px; font-size:14px; font-weight:500; }
.slc-msg.bot .b{ background:var(--panel2); border:1px solid var(--line); color:var(--ink); border-radius:13px 13px 13px 4px; padding:13px 16px; font-size:14px; line-height:1.6; }
.slc-msg.bot .who{ font-family:var(--mono); font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--acc); margin:0 0 7px 2px; }
.slc-demo{ margin-top:12px; border:1px solid var(--line); border-radius:11px; padding:12px 12px 6px; background:var(--bg); }
.slc-demo .cap{ font-family:var(--mono); font-size:10px; color:var(--dim); margin-top:4px; letter-spacing:.04em; }
.slc-ds{ width:100%; color:var(--acc); }
.slc-ds svg{ width:100%; height:auto; display:block; overflow:visible; }
.slc-ds .ln{ stroke:currentColor; stroke-width:1; opacity:.26; }
.slc-ds .clef{ fill:currentColor; opacity:.9; }
.slc-ds .nt{ fill:currentColor; }
.slc-ds .stem{ stroke:currentColor; stroke-width:1.5; }
.slc-ds .lab{ fill:var(--dim); font-family:var(--mono); font-size:8.5px; }
.slc-foot{ border-top:1px solid var(--line); padding:14px 16px; background:var(--panel2); }
.slc-foot .lab{ font-family:var(--mono); font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); margin-bottom:9px; }
.slc-chips{ display:flex; flex-wrap:wrap; gap:8px; }
.slc-chip{ font-size:13px; color:var(--ink); border:1px solid var(--line); border-radius:9px; padding:9px 13px; cursor:pointer; background:var(--bg); transition:.14s; text-align:left; }
.slc-chip:hover:not(:disabled){ border-color:var(--acc); color:var(--acc); }
.slc-chip:disabled{ opacity:.4; cursor:default; }
`;

// pitch index -> y on a 5-line staff (higher index = higher note = smaller y)
function DemoStaff({ notes, labels }){
  const x0 = 60, step = 38, top = 14;
  const W = x0 + notes.length * step + 20;
  const Y = (p)=> 82 - p * 5;
  return (
    <div className="slc-ds">
      <svg viewBox={`0 0 ${W} 112`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="A short staff demonstration">
        {[44,54,64,74,84].map((y,i)=>(<line className="ln" key={i} x1="6" y1={y} x2={W-6} y2={y} />))}
        <text className="clef" x="10" y="89" fontFamily="'Noto Music', serif" fontSize="48">{"\u{1D11E}"}</text>
        {notes.map((p,i)=>{
          const x = x0 + i*step;
          const y = Y(p);
          return (
            <g key={i}>
              <line className="stem" x1={x+5} y1={y-1} x2={x+5} y2={y-26} />
              <ellipse className="nt" cx={x} cy={y} rx="5.4" ry="4.1" transform={`rotate(-18 ${x} ${y})`} />
              {labels && labels[i] && <text className="lab" x={x} y="106" textAnchor="middle">{labels[i]}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const SLC_QA = [
  {
    q: "Show me the A natural minor scale.",
    a: "A natural minor is all white keys from A: A, B, C, D, E, F, G, A. Here it is climbing the staff.",
    notes: [0,1,2,3,4,5,6,7],
    labels: ["A","B","C","D","E","F","G","A"],
    cap: "A natural minor, ascending",
  },
  {
    q: "Explain a ii–V–I in this key.",
    a: "In A minor that's Bm7♭5 → E7 → Am. The ii is half-diminished, the V borrows a G♯ to pull the ear home, and the I lands on A minor. The roots walk B, E, A.",
    notes: [1,4,0],
    labels: ["ii","V","i"],
    cap: "ii–V–i roots in A minor",
  },
  {
    q: "Why does bar 2 feel unresolved?",
    a: "It settles on E, the fifth, instead of the tonic A. The ear expects that E to step down to A before the phrase feels finished.",
  },
];

function ChatDemo(){
  const [thread, setThread] = chatUseState([
    { role: "user", text: "What can you tell me about this piece?" },
    { role: "bot", text: "It's a short waltz in A minor, eight bars, in 3/4. Ask about the key, the chords, or any music-theory idea and I'll explain it against the score, or show it on the staff." },
  ]);
  const [asked, setAsked] = chatUseState([]);

  const ask = (i)=>{
    const qa = SLC_QA[i];
    setAsked((a)=> a.includes(i) ? a : [...a, i]);
    setThread((t)=> [...t,
      { role: "user", text: qa.q },
      { role: "bot", text: qa.a, notes: qa.notes, labels: qa.labels, cap: qa.cap },
    ]);
  };

  return (
    <div className="slc">
      <div className="slc-head"><i></i><b>chat · the score is in context</b><span>natural language</span></div>
      <div className="slc-thread">
        {thread.map((m,i)=>(
          <div className={"slc-msg " + (m.role === "user" ? "user" : "bot")} key={i}>
            {m.role === "bot" && <div className="who">sheet-llm</div>}
            <div className="b">
              {m.text}
              {m.notes && (
                <div className="slc-demo">
                  <DemoStaff notes={m.notes} labels={m.labels} />
                  {m.cap && <div className="cap">{m.cap}</div>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="slc-foot">
        <div className="lab">Ask about the score</div>
        <div className="slc-chips">
          {SLC_QA.map((qa,i)=>(
            <button className="slc-chip" key={i} onClick={()=>ask(i)} disabled={asked.includes(i)}>{qa.q}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SL_CHAT_CSS, ChatDemo });
