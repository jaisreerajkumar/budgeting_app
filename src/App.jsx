import { useEffect, useRef, useState } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FULL_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const CAT_META = {
  Food:{color:"#1D9E75",bg:"#E1F5EE",tc:"#04342C"},
  Housing:{color:"#185FA5",bg:"#E6F1FB",tc:"#042C53"},
  Transport:{color:"#BA7517",bg:"#FAEEDA",tc:"#412402"},
  Health:{color:"#D85A30",bg:"#FAECE7",tc:"#4A1B0C"},
  Entertainment:{color:"#7F77DD",bg:"#EEEDFE",tc:"#26215C"},
  Shopping:{color:"#D4537E",bg:"#FBEAF0",tc:"#4B1528"},
  Utilities:{color:"#639922",bg:"#EAF3DE",tc:"#173404"},
  Other:{color:"#888780",bg:"#F1EFE8",tc:"#2C2C2A"},
};
const CAT_LIST = Object.keys(CAT_META);

function fmt(n) {
  return "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtShort(n) {
  return n >= 1000 ? "$" + (n / 1000).toFixed(1) + "k" : "$" + Math.round(n);
}

const INIT_STATE = {
  transactions: {
    "2026-3": [
      {id:1,type:"income",desc:"Monthly salary",amt:5200,cat:"",date:"2026-04-01",recurring:true},
      {id:2,type:"income",desc:"Freelance project",amt:950,cat:"",date:"2026-04-08"},
      {id:3,type:"expense",desc:"Rent",amt:1400,cat:"Housing",date:"2026-04-01",recurring:true},
      {id:4,type:"expense",desc:"Grocery run",amt:280,cat:"Food",date:"2026-04-04"},
      {id:5,type:"expense",desc:"Netflix & Spotify",amt:28,cat:"Entertainment",date:"2026-04-05",recurring:true},
      {id:6,type:"expense",desc:"Uber commute",amt:85,cat:"Transport",date:"2026-04-10"},
      {id:7,type:"expense",desc:"Gym membership",amt:55,cat:"Health",date:"2026-04-01",recurring:true},
      {id:8,type:"expense",desc:"Amazon order",amt:145,cat:"Shopping",date:"2026-04-16"},
      {id:9,type:"expense",desc:"Electricity bill",amt:90,cat:"Utilities",date:"2026-04-12",recurring:true},
      {id:10,type:"expense",desc:"Restaurant dinner",amt:72,cat:"Food",date:"2026-04-18"},
    ],
    "2026-2": [
      {id:11,type:"income",desc:"Monthly salary",amt:5200,cat:"",date:"2026-03-01"},
      {id:12,type:"expense",desc:"Rent",amt:1400,cat:"Housing",date:"2026-03-01"},
      {id:13,type:"expense",desc:"Groceries",amt:310,cat:"Food",date:"2026-03-07"},
      {id:14,type:"expense",desc:"Transport",amt:95,cat:"Transport",date:"2026-03-15"},
      {id:15,type:"expense",desc:"Netflix",amt:28,cat:"Entertainment",date:"2026-03-05"},
      {id:16,type:"expense",desc:"Gym",amt:55,cat:"Health",date:"2026-03-01"},
      {id:17,type:"expense",desc:"Electricity",amt:88,cat:"Utilities",date:"2026-03-12"},
    ],
    "2026-1": [
      {id:20,type:"income",desc:"Monthly salary",amt:5200,cat:"",date:"2026-02-01"},
      {id:21,type:"expense",desc:"Rent",amt:1400,cat:"Housing",date:"2026-02-01"},
      {id:22,type:"expense",desc:"Groceries",amt:265,cat:"Food",date:"2026-02-06"},
      {id:23,type:"expense",desc:"Shopping spree",amt:340,cat:"Shopping",date:"2026-02-14"},
      {id:24,type:"expense",desc:"Transport",amt:70,cat:"Transport",date:"2026-02-20"},
      {id:25,type:"expense",desc:"Utilities",amt:95,cat:"Utilities",date:"2026-02-10"},
    ],
  },
  budgets: {Food:400,Housing:1500,Transport:150,Entertainment:80,Shopping:200,Health:100,Utilities:120,Other:100},
  goals: [
    {id:1,name:"Emergency fund",target:10000,saved:4200,color:"#185FA5"},
    {id:2,name:"Vacation to Japan",target:3500,saved:1800,color:"#1D9E75"},
    {id:3,name:"New laptop",target:1500,saved:900,color:"#7F77DD"},
  ],
};

export default function App() {
  const now = new Date();
  const [curY, setCurY] = useState(now.getFullYear());
  const [curM, setCurM] = useState(now.getMonth());
  const [activeTab, setActiveTab] = useState("overview");
  const [state, setState] = useState(INIT_STATE);
  const [txFilter, setTxFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const nextId = useRef(200);

  const key = (y, m) => `${y}-${m}`;
  const getTx = () => state.transactions[key(curY, curM)] || [];

  const changeMonth = (d) => {
    let m = curM + d, y = curY;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setCurM(m); setCurY(y);
  };

  const getCatTotals = (tx) => {
    const cats = {};
    tx.filter(t => t.type === "expense").forEach(t => { cats[t.cat] = (cats[t.cat] || 0) + t.amt; });
    return cats;
  };

  const tx = getTx();
  const income = tx.filter(t => t.type === "income").reduce((s, t) => s + t.amt, 0);
  const expense = tx.filter(t => t.type === "expense").reduce((s, t) => s + t.amt, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.round((income - expense) / income * 100) : 0;
  const cats = getCatTotals(tx);

  const deleteTx = (id) => {
    const k = key(curY, curM);
    setState(s => ({ ...s, transactions: { ...s.transactions, [k]: (s.transactions[k] || []).filter(t => t.id !== id) } }));
  };

  const saveTransaction = () => {
    const { type = "expense", desc = "", amt, cat = "Food", date, recurring } = form;
    if (!desc || !amt || !date) return;
    const k = key(curY, curM);
    const newTx = { id: nextId.current++, type, desc, amt: parseFloat(amt), cat: type === "income" ? "" : cat, date, recurring: !!recurring };
    setState(s => ({ ...s, transactions: { ...s.transactions, [k]: [...(s.transactions[k] || []), newTx] } }));
    setModal(null); setForm({});
  };

  const saveBudget = () => {
    if (!form.cat || !form.limit) return;
    setState(s => ({ ...s, budgets: { ...s.budgets, [form.cat]: parseFloat(form.limit) } }));
    setModal(null); setForm({});
  };

  const saveGoal = () => {
    if (!form.name || !form.target) return;
    const colors = ["#185FA5","#1D9E75","#7F77DD","#D4537E","#BA7517","#D85A30"];
    setState(s => ({ ...s, goals: [...s.goals, { id: nextId.current++, name: form.name, target: parseFloat(form.target), saved: parseFloat(form.saved || 0), color: colors[s.goals.length % colors.length] }] }));
    setModal(null); setForm({});
  };

  const filteredTx = [...tx]
    .filter(t => txFilter === "all" || t.type === txFilter)
    .filter(t => !search || t.desc.toLowerCase().includes(search.toLowerCase()) || (t.cat || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));

  const tabs = ["overview","transactions","budgets","goals","analytics"];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif", color: "#111" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Finance Dashboard</h1>
          <p style={{ fontSize: 13, color: "#888", margin: "2px 0 0" }}>{FULL_MONTHS[curM]} {curY} overview</p>
        </div>
        <div style={{ display:"flex", gap: 8, alignItems:"center" }}>
          <div style={{ display:"flex", gap:3, background:"#f3f3f3", borderRadius: 8, padding: 3 }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding:"5px 13px", fontSize:12, border:"none", borderRadius:6, cursor:"pointer", background: activeTab===t ? "#fff" : "transparent", fontWeight: activeTab===t ? 600 : 400, color: activeTab===t ? "#111" : "#888", boxShadow: activeTab===t ? "0 0 0 0.5px #ddd" : "none" }}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Month Nav + Add */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={() => changeMonth(-1)} style={navBtn}>&#8249;</button>
          <span style={{ fontSize:13, fontWeight:600, minWidth:82, textAlign:"center" }}>{MONTHS[curM]} {curY}</span>
          <button onClick={() => changeMonth(1)} style={navBtn}>&#8250;</button>
        </div>
        <button onClick={() => { setModal("tx"); setForm({ type:"expense", date: new Date().toISOString().slice(0,10) }); }} style={fabBtn}>+ Add transaction</button>
      </div>

      {/* Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
        {[
          { label:"Income", value: fmt(income), color:"#1D9E75", sub:`${tx.filter(t=>t.type==="income").length} entries` },
          { label:"Expenses", value: fmt(expense), color:"#D85A30", sub:`${tx.filter(t=>t.type==="expense").length} entries` },
          { label:"Net balance", value: (balance<0?"-":"")+fmt(balance), color: balance>=0?"#185FA5":"#D85A30", sub: balance>=0?"Surplus":"Deficit" },
          { label:"Savings rate", value: savingsRate+"%", color: savingsRate>=20?"#1D9E75":savingsRate>=10?"#BA7517":"#D85A30", sub:"of income saved" },
        ].map(m => (
          <div key={m.label} style={{ background:"#f7f7f7", borderRadius:8, padding:"12px 14px" }}>
            <div style={{ fontSize:11, color:"#888", textTransform:"uppercase", letterSpacing:".04em", marginBottom:4 }}>{m.label}</div>
            <div style={{ fontSize:20, fontWeight:600, color:m.color }}>{m.value}</div>
            <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div style={card}>
              <div style={cardTitle}>Budget health</div>
              {Object.entries(state.budgets).map(([cat, limit]) => {
                const spent = cats[cat] || 0;
                const pct = Math.min(100, Math.round(spent / limit * 100));
                const c = CAT_META[cat] || CAT_META.Other;
                const barColor = pct > 90 ? "#D85A30" : pct > 70 ? "#BA7517" : c.color;
                return (
                  <div key={cat} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:c.color, flexShrink:0 }} />
                    <div style={{ flex:1, fontSize:13 }}>{cat}</div>
                    <div style={{ flex:2, height:6, background:"#eee", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ width:pct+"%", height:"100%", background:barColor, borderRadius:3 }} />
                    </div>
                    <div style={{ fontSize:11, color:"#888", minWidth:90, textAlign:"right" }}>{fmt(spent)} / {fmt(limit)}</div>
                  </div>
                );
              })}
            </div>
            <div style={card}>
              <div style={cardTitle}>Savings goals</div>
              {state.goals.map(g => {
                const pct = Math.min(100, Math.round(g.saved / g.target * 100));
                return (
                  <div key={g.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:500 }}>{g.name}</div>
                      <div style={{ fontSize:11, color:"#888" }}>{fmt(g.saved)} of {fmt(g.target)}</div>
                    </div>
                    <div style={{ flex:2, height:8, background:"#eee", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ width:pct+"%", height:"100%", background:g.color, borderRadius:4 }} />
                    </div>
                    <div style={{ fontSize:12, color:"#888", minWidth:36, textAlign:"right" }}>{pct}%</div>
                  </div>
                );
              })}
              {state.goals.length === 0 && <div style={empty}>No goals yet</div>}
            </div>
          </div>
          <div style={card}>
            <div style={cardTitle}>Alerts & insights</div>
            {(() => {
              const alerts = [];
              Object.entries(state.budgets).forEach(([cat, limit]) => {
                const spent = cats[cat] || 0; const pct = spent / limit * 100;
                if (pct > 100) alerts.push({ type:"danger", msg:`${cat} is over budget — spent ${fmt(spent)} of ${fmt(limit)}` });
                else if (pct > 80) alerts.push({ type:"warn", msg:`${cat} at ${Math.round(pct)}% of budget (${fmt(limit-spent)} remaining)` });
              });
              if (income > 0 && expense / income < 0.5) alerts.push({ type:"ok", msg:`Great job! You are saving ${Math.round((1 - expense/income)*100)}% of your income this month.` });
              if (alerts.length === 0) alerts.push({ type:"ok", msg:"All budgets look healthy this month!" });
              return alerts.map((a, i) => (
                <div key={i} style={{ display:"flex", gap:10, padding:"10px 12px", borderRadius:8, marginBottom:6, background: a.type==="danger"?"#FCEBEB":a.type==="warn"?"#FAEEDA":"#E1F5EE", color: a.type==="danger"?"#501313":a.type==="warn"?"#412402":"#04342C", fontSize:13 }}>
                  <span>{a.type==="danger"?"⚠":a.type==="warn"?"●":"✓"}</span><span>{a.msg}</span>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div style={card}>
          <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
            {["all","income","expense"].map(f => (
              <button key={f} onClick={() => setTxFilter(f)} style={{ padding:"4px 12px", fontSize:12, border:"0.5px solid #ddd", borderRadius:8, cursor:"pointer", background: txFilter===f?"#f0f0f0":"transparent", fontWeight: txFilter===f?600:400 }}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
            ))}
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ flex:1, padding:"4px 10px", fontSize:12, border:"0.5px solid #ddd", borderRadius:8, background:"#f7f7f7" }} />
          </div>
          <table style={{ width:"100%", fontSize:13, borderCollapse:"collapse" }}>
            <thead>
              <tr>{["Date","Description","Category","Type","Amount",""].map(h => <th key={h} style={{ fontSize:11, color:"#aaa", textAlign:"left", padding:"4px 8px", borderBottom:"0.5px solid #eee", fontWeight:400 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredTx.length ? filteredTx.map(t => {
                const m = CAT_META[t.cat] || { bg:"#eee", tc:"#444" };
                return (
                  <tr key={t.id} style={{ borderBottom:"0.5px solid #f5f5f5" }}>
                    <td style={{ padding:"7px 8px", color:"#888" }}>{t.date}</td>
                    <td style={{ padding:"7px 8px" }}>{t.desc}{t.recurring && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:10, background:"#E6F1FB", color:"#0C447C", marginLeft:6 }}>Recurring</span>}</td>
                    <td style={{ padding:"7px 8px" }}>{t.cat && <span style={{ fontSize:11, padding:"2px 8px", borderRadius:20, background:m.bg, color:m.tc }}>{t.cat}</span>}</td>
                    <td style={{ padding:"7px 8px", fontSize:11, color: t.type==="income"?"#1D9E75":"#D85A30" }}>{t.type}</td>
                    <td style={{ padding:"7px 8px", textAlign:"right", fontWeight:500, color: t.type==="income"?"#1D9E75":"#D85A30" }}>{t.type==="income"?"+":"-"}{fmt(t.amt)}</td>
                    <td style={{ padding:"7px 8px" }}><button onClick={() => deleteTx(t.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#ccc", fontSize:13 }}>✕</button></td>
                  </tr>
                );
              }) : <tr><td colSpan={6} style={{ textAlign:"center", padding:20, color:"#bbb", fontSize:12 }}>No transactions found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Budgets Tab */}
      {activeTab === "budgets" && (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
            <button onClick={() => { setModal("budget"); setForm({ cat:"Food" }); }} style={fabBtn}>+ Set budget</button>
          </div>
          <div style={card}>
            {Object.entries(state.budgets).map(([cat, limit]) => {
              const spent = cats[cat] || 0; const pct = Math.min(100, Math.round(spent / limit * 100));
              const c = CAT_META[cat] || CAT_META.Other;
              const barColor = pct > 90 ? "#D85A30" : pct > 70 ? "#BA7517" : c.color;
              return (
                <div key={cat} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:c.color }} />
                  <div style={{ flex:1, fontSize:13, fontWeight:500 }}>{cat}</div>
                  <div style={{ flex:3, height:6, background:"#eee", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ width:pct+"%", height:"100%", background:barColor, borderRadius:3 }} />
                  </div>
                  <div style={{ fontSize:12, color:"#888", minWidth:130, textAlign:"right" }}>{fmt(spent)} / {fmt(limit)} <span style={{ color: pct>100?"#D85A30":"#1D9E75" }}>{pct}%</span></div>
                  <button onClick={() => setState(s => { const b={...s.budgets}; delete b[cat]; return {...s,budgets:b}; })} style={{ background:"none", border:"none", cursor:"pointer", color:"#ccc" }}>✕</button>
                </div>
              );
            })}
            {Object.keys(state.budgets).length === 0 && <div style={empty}>No budgets set</div>}
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === "goals" && (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
            <button onClick={() => { setModal("goal"); setForm({}); }} style={fabBtn}>+ Add goal</button>
          </div>
          <div style={card}>
            {state.goals.map(g => {
              const pct = Math.min(100, Math.round(g.saved / g.target * 100));
              return (
                <div key={g.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500 }}>{g.name}</div>
                    <div style={{ fontSize:11, color:"#888" }}>{fmt(g.saved)} saved of {fmt(g.target)}</div>
                  </div>
                  <div style={{ flex:3, height:8, background:"#eee", borderRadius:4, overflow:"hidden" }}>
                    <div style={{ width:pct+"%", height:"100%", background:g.color, borderRadius:4 }} />
                  </div>
                  <div style={{ fontSize:12, color:"#888", minWidth:36, textAlign:"right" }}>{pct}%</div>
                  <button onClick={() => setState(s => ({ ...s, goals: s.goals.filter(x => x.id !== g.id) }))} style={{ background:"none", border:"none", cursor:"pointer", color:"#ccc" }}>✕</button>
                </div>
              );
            })}
            {state.goals.length === 0 && <div style={empty}>No goals yet</div>}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            {(() => {
              const prevM = curM-1<0?11:curM-1, prevY = curM-1<0?curY-1:curY;
              const prevTx = state.transactions[key(prevY,prevM)] || [];
              const prevExp = prevTx.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amt,0);
              const expChange = prevExp>0?Math.round((expense-prevExp)/prevExp*100):0;
              const largest = tx.filter(t=>t.type==="expense").sort((a,b)=>b.amt-a.amt)[0];
              const recurring = tx.filter(t=>t.type==="expense"&&t.recurring).reduce((s,t)=>s+t.amt,0);
              return [
                { label:"vs last month", value:(expChange>0?"+":"")+expChange+"%", sub: expChange<=0?"Lower spending":"Higher spending", color: expChange<=0?"#1D9E75":"#D85A30" },
                { label:"Largest expense", value: largest?fmt(largest.amt):"—", sub: largest?.desc||"N/A", color:"#185FA5" },
                { label:"Recurring costs", value: fmt(recurring), sub:`${tx.filter(t=>t.recurring).length} items`, color:"#BA7517" },
                { label:"Savings rate", value: savingsRate+"%", sub: savingsRate>=20?"On track":"Needs attention", color: savingsRate>=20?"#1D9E75":"#D85A30" },
              ].map(c => (
                <div key={c.label} style={{ background:"#f7f7f7", borderRadius:8, padding:"12px 14px" }}>
                  <div style={{ fontSize:11, color:"#888", marginBottom:4 }}>{c.label}</div>
                  <div style={{ fontSize:20, fontWeight:600, color:c.color }}>{c.value}</div>
                  <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>{c.sub}</div>
                </div>
              ));
            })()}
          </div>
          <div style={card}>
            <div style={cardTitle}>Spending by category</div>
            {Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([cat, amt]) => {
              const total = Object.values(cats).reduce((s,v)=>s+v,0);
              const pct = total>0?Math.round(amt/total*100):0;
              const c = CAT_META[cat] || CAT_META.Other;
              return (
                <div key={cat} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:c.color, flexShrink:0 }} />
                  <div style={{ flex:1, fontSize:13 }}>{cat}</div>
                  <div style={{ flex:3, height:6, background:"#eee", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ width:pct+"%", height:"100%", background:c.color, borderRadius:3 }} />
                  </div>
                  <div style={{ fontSize:12, color:"#888", minWidth:100, textAlign:"right" }}>{fmt(amt)} ({pct}%)</div>
                </div>
              );
            })}
            {Object.keys(cats).length === 0 && <div style={empty}>No expense data this month</div>}
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div onClick={e => { if(e.target===e.currentTarget) setModal(null); }} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:12, padding:24, width:320, boxShadow:"0 8px 32px rgba(0,0,0,0.15)" }}>
            {modal === "tx" && <>
              <div style={modalTitle}>Add transaction</div>
              <div style={frow}><label style={flabel}>Type</label>
                <select style={finput} value={form.type||"expense"} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  <option value="expense">Expense</option><option value="income">Income</option>
                </select></div>
              <div style={frow}><label style={flabel}>Description</label><input style={finput} placeholder="e.g. Grocery run" value={form.desc||""} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} /></div>
              <div style={frow}><label style={flabel}>Amount ($)</label><input style={finput} type="number" placeholder="0.00" value={form.amt||""} onChange={e=>setForm(f=>({...f,amt:e.target.value}))} /></div>
              {(form.type||"expense")==="expense" && <div style={frow}><label style={flabel}>Category</label>
                <select style={finput} value={form.cat||"Food"} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>
                  {CAT_LIST.map(c=><option key={c}>{c}</option>)}
                </select></div>}
              <div style={frow}><label style={flabel}>Date</label><input style={finput} type="date" value={form.date||""} onChange={e=>setForm(f=>({...f,date:e.target.value}))} /></div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <input type="checkbox" id="rec" checked={!!form.recurring} onChange={e=>setForm(f=>({...f,recurring:e.target.checked}))} />
                <label htmlFor="rec" style={{ fontSize:13 }}>Mark as recurring</label>
              </div>
            </>}
            {modal === "budget" && <>
              <div style={modalTitle}>Set budget limit</div>
              <div style={frow}><label style={flabel}>Category</label>
                <select style={finput} value={form.cat||"Food"} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>
                  {CAT_LIST.map(c=><option key={c}>{c}</option>)}
                </select></div>
              <div style={frow}><label style={flabel}>Monthly limit ($)</label><input style={finput} type="number" placeholder="500" value={form.limit||""} onChange={e=>setForm(f=>({...f,limit:e.target.value}))} /></div>
            </>}
            {modal === "goal" && <>
              <div style={modalTitle}>Add savings goal</div>
              <div style={frow}><label style={flabel}>Goal name</label><input style={finput} placeholder="e.g. Emergency fund" value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))} /></div>
              <div style={frow}><label style={flabel}>Target amount ($)</label><input style={finput} type="number" placeholder="5000" value={form.target||""} onChange={e=>setForm(f=>({...f,target:e.target.value}))} /></div>
              <div style={frow}><label style={flabel}>Amount saved ($)</label><input style={finput} type="number" placeholder="0" value={form.saved||""} onChange={e=>setForm(f=>({...f,saved:e.target.value}))} /></div>
            </>}
            <div style={{ display:"flex", gap:8, marginTop:14 }}>
              <button onClick={() => setModal(null)} style={{ flex:1, padding:8, border:"0.5px solid #ddd", borderRadius:8, background:"none", fontSize:13, cursor:"pointer" }}>Cancel</button>
              <button onClick={modal==="tx"?saveTransaction:modal==="budget"?saveBudget:saveGoal} style={{ flex:1, padding:8, border:"none", borderRadius:8, background:"#185FA5", color:"#fff", fontSize:13, cursor:"pointer", fontWeight:500 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const navBtn = { background:"none", border:"0.5px solid #ddd", borderRadius:8, padding:"4px 10px", cursor:"pointer", fontSize:13 };
const fabBtn = { display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"#185FA5", color:"#fff", border:"none", borderRadius:8, fontSize:13, cursor:"pointer", fontWeight:500 };
const card = { background:"#fff", border:"0.5px solid #eee", borderRadius:12, padding:14, marginBottom:0 };
const cardTitle = { fontSize:13, fontWeight:600, marginBottom:12 };
const empty = { textAlign:"center", padding:20, color:"#bbb", fontSize:12 };
const modalTitle = { fontSize:16, fontWeight:600, marginBottom:14 };
const frow = { marginBottom:10 };
const flabel = { fontSize:11, color:"#888", display:"block", marginBottom:4 };
const finput = { width:"100%", padding:"7px 10px", fontSize:13, border:"0.5px solid #ddd", borderRadius:8, background:"#f7f7f7", boxSizing:"border-box" };