import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useBudget, CAT_META, fmt, fmtK, MONTHS } from "../context/BudgetContext";

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"var(--bg3)", border:"1px solid var(--border2)",
      borderRadius:10, padding:"10px 14px", fontSize:12,
    }}>
      <p style={{ color:"var(--text2)", marginBottom:6, fontWeight:600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color:p.color, marginBottom:2 }}>
          {p.name}: <strong>{fmtK(p.value)}</strong>
        </p>
      ))}
    </div>
  );
}

/* ── 6-month area chart ── */
function CashflowChart() {
  const { getTx, curY, curM } = useBudget();
  const data = [];
  for (let i = 5; i >= 0; i--) {
    let m = curM - i, y = curY;
    while (m < 0) { m += 12; y--; }
    const monthTx = getTx(y, m);
    data.push({
      month: MONTHS[m],
      Income:  monthTx.filter(t=>t.type==="income").reduce((s,t)=>s+t.amt,0),
      Expenses:monthTx.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amt,0),
    });
  }
  const hasData = data.some(d => d.Income > 0 || d.Expenses > 0);
  if (!hasData) return <div className="empty-state" style={{ height:180 }}><div className="empty-icon">📈</div>Add transactions to see trends</div>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top:10, right:10, left:0, bottom:0 }}>
        <defs>
          <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#00c896" stopOpacity={0.35}/>
            <stop offset="95%" stopColor="#00c896" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#ff4d6d" stopOpacity={0.35}/>
            <stop offset="95%" stopColor="#ff4d6d" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
        <XAxis dataKey="month" tick={{ fill:"#3e4f68", fontSize:11 }} axisLine={false} tickLine={false}/>
        <YAxis tickFormatter={fmtK} tick={{ fill:"#3e4f68", fontSize:11 }} axisLine={false} tickLine={false}/>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize:12, color:"var(--text2)", paddingTop:8 }}/>
        <Area type="monotone" dataKey="Income"   stroke="#00c896" strokeWidth={2} fill="url(#gInc)"/>
        <Area type="monotone" dataKey="Expenses" stroke="#ff4d6d" strokeWidth={2} fill="url(#gExp)"/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── Spending donut ── */
function SpendingDonut() {
  const { cats } = useBudget();
  const entries = Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,7);
  if (!entries.length) return <div className="empty-state" style={{ height:200 }}><div className="empty-icon">🍩</div>No expense data</div>;
  const total = entries.reduce((s,[,v])=>s+v,0);

  return (
    <div style={{ display:"flex", gap:16, alignItems:"center" }}>
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie data={entries.map(([cat,val])=>({ name:cat, value:val }))}
            cx="50%" cy="50%" innerRadius={45} outerRadius={72}
            paddingAngle={2} dataKey="value" strokeWidth={0}
          >
            {entries.map(([cat]) => (
              <Cell key={cat} fill={(CAT_META[cat]||CAT_META.Other).color}/>
            ))}
          </Pie>
          <Tooltip formatter={(v)=>fmt(v)} contentStyle={{
            background:"var(--bg3)", border:"1px solid var(--border2)",
            borderRadius:8, fontSize:12, color:"var(--text)",
          }}/>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:7 }}>
        {entries.map(([cat, val]) => {
          const c   = CAT_META[cat]||CAT_META.Other;
          const pct = Math.round(val/total*100);
          return (
            <div key={cat} style={{ display:"flex", alignItems:"center", gap:7, fontSize:12 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:c.color, flexShrink:0 }}/>
              <span style={{ color:"var(--text)", flex:1 }}>{cat}</span>
              <span style={{ color:"var(--text2)" }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Category bar chart ── */
function CategoryBars() {
  const { cats } = useBudget();
  const data = Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,7)
    .map(([cat,val]) => ({ cat, val, fill:(CAT_META[cat]||CAT_META.Other).color }));
  if (!data.length) return <div className="empty-state" style={{ height:180 }}><div className="empty-icon">📊</div>No expense data</div>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ top:0, right:16, left:0, bottom:0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" horizontal={false}/>
        <XAxis type="number" tickFormatter={fmtK} tick={{ fill:"#3e4f68", fontSize:11 }} axisLine={false} tickLine={false}/>
        <YAxis type="category" dataKey="cat" tick={{ fill:"#7e8fa8", fontSize:12 }} axisLine={false} tickLine={false} width={90}/>
        <Tooltip formatter={v=>fmt(v)} contentStyle={{
          background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:8, fontSize:12, color:"var(--text)",
        }}/>
        <Bar dataKey="val" name="Spent" radius={[0,6,6,0]}>
          {data.map((d,i) => <Cell key={i} fill={d.fill}/>)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Radial savings gauge ── */
function SavingsGauge() {
  const { goals } = useBudget();
  if (!goals.length) return <div className="empty-state" style={{ height:180 }}><div className="empty-icon">🎯</div>Add goals to track</div>;

  const data = goals.map(g => ({
    name: g.name,
    value: Math.min(100, Math.round(g.saved / g.target * 100)),
    fill: g.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={90}
        data={data} startAngle={90} endAngle={-270}
      >
        <RadialBar minAngle={5} background={{ fill:"var(--bg4)" }} dataKey="value"
          cornerRadius={6} label={{ position:"insideStart", fill:"#fff", fontSize:10 }}
        />
        <Tooltip formatter={v=>`${v}%`} contentStyle={{
          background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:8, fontSize:12, color:"var(--text)",
        }}/>
        <Legend iconSize={10} wrapperStyle={{ fontSize:11, color:"var(--text2)" }}/>
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

/* ── Income vs expense composed ── */
function IncomeExpenseBar() {
  const { getTx, curY, curM } = useBudget();
  const data = [];
  for (let i = 5; i >= 0; i--) {
    let m = curM - i, y = curY;
    while (m < 0) { m += 12; y--; }
    const monthTx = getTx(y, m);
    const inc = monthTx.filter(t=>t.type==="income").reduce((s,t)=>s+t.amt,0);
    const exp = monthTx.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amt,0);
    data.push({ month:MONTHS[m], Income:inc, Expenses:exp, Net:inc-exp });
  }
  const hasData = data.some(d => d.Income > 0 || d.Expenses > 0);
  if (!hasData) return <div className="empty-state" style={{ height:200 }}><div className="empty-icon">📊</div>No data yet</div>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={data} margin={{ top:10, right:10, left:0, bottom:0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
        <XAxis dataKey="month" tick={{ fill:"#3e4f68", fontSize:11 }} axisLine={false} tickLine={false}/>
        <YAxis tickFormatter={fmtK} tick={{ fill:"#3e4f68", fontSize:11 }} axisLine={false} tickLine={false}/>
        <Tooltip content={<CustomTooltip />}/>
        <Legend wrapperStyle={{ fontSize:12, color:"var(--text2)", paddingTop:8 }}/>
        <Bar dataKey="Income"   fill="#00c896" radius={[4,4,0,0]} opacity={0.85}/>
        <Bar dataKey="Expenses" fill="#ff4d6d" radius={[4,4,0,0]} opacity={0.85}/>
        <Line type="monotone" dataKey="Net" stroke="#9c6ffd" strokeWidth={2.5} dot={{ r:3, fill:"#9c6ffd" }}/>
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* ── Insight cards ── */
function InsightCards() {
  const { income, expense, tx, getTx, curY, curM } = useBudget();
  const prevM = curM-1<0?11:curM-1, prevY = curM-1<0?curY-1:curY;
  const prevTx  = getTx(prevY, prevM);
  const prevExp = prevTx.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amt,0);
  const expChange = prevExp > 0 ? Math.round((expense-prevExp)/prevExp*100) : null;
  const largest = [...tx].filter(t=>t.type==="expense").sort((a,b)=>b.amt-a.amt)[0];
  const recurring = tx.filter(t=>t.type==="expense"&&t.recurring).reduce((s,t)=>s+t.amt,0);
  const sr = income > 0 ? Math.round((income-expense)/income*100) : 0;

  const cards = [
    {
      label:"vs Last Month",
      value: expChange !== null ? `${expChange > 0 ? "+" : ""}${expChange}%` : "—",
      sub: expChange !== null ? (expChange<=0?"Lower spending ↓":"Higher spending ↑") : "No previous data",
      color: expChange !== null ? (expChange<=0?"var(--green)":"var(--red)") : "var(--text3)",
    },
    {
      label:"Largest Expense",
      value: largest ? fmt(largest.amt) : "—",
      sub: largest?.desc || "None yet",
      color:"var(--accent2)",
    },
    {
      label:"Recurring Costs",
      value: fmt(recurring),
      sub:`${tx.filter(t=>t.recurring).length} recurring items`,
      color:"var(--amber)",
    },
    {
      label:"Savings Rate",
      value: income > 0 ? `${sr}%` : "—",
      sub: sr >= 20 ? "On track 🎉" : sr >= 10 ? "Getting there" : "Needs improvement",
      color: sr>=20?"var(--green)":sr>=10?"var(--amber)":"var(--red)",
    },
  ];

  return (
    <div className="grid4" style={{ marginBottom:14 }}>
      {cards.map(c => (
        <div key={c.label} className="card">
          <div style={{ fontSize:11, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".07em", marginBottom:8 }}>{c.label}</div>
          <div style={{ fontSize:22, fontWeight:700, color:c.color, fontFamily:"'Space Grotesk',sans-serif", marginBottom:4 }}>{c.value}</div>
          <div style={{ fontSize:11, color:"var(--text3)" }}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsTab() {
  return (
    <div className="fade-up">
      <InsightCards />
      <div className="grid2" style={{ marginBottom:14 }}>
        <div className="card">
          <div className="card-title">6-Month Cash Flow</div>
          <CashflowChart />
        </div>
        <div className="card">
          <div className="card-title">Spending by Category</div>
          <SpendingDonut />
        </div>
      </div>
      <div className="grid2" style={{ marginBottom:14 }}>
        <div className="card">
          <div className="card-title">Income vs Expenses (Monthly)</div>
          <IncomeExpenseBar />
        </div>
        <div className="card">
          <div className="card-title">Category Breakdown</div>
          <CategoryBars />
        </div>
      </div>
      <div className="card">
        <div className="card-title">Goals Progress — Radial View</div>
        <SavingsGauge />
      </div>
    </div>
  );
}