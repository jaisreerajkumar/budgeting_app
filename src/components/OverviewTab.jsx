import { useBudget, CAT_META, fmt } from "../context/BudgetContext";

function BudgetHealth() {
  const { budgets, cats } = useBudget();
  const entries = Object.entries(budgets);
  if (!entries.length) return (
    <div className="empty-state"><div className="empty-icon">📊</div>No budgets set yet</div>
  );
  return entries.map(([cat, limit]) => {
    const spent = cats[cat] || 0;
    const pct   = Math.min(100, Math.round(spent / limit * 100));
    const c     = CAT_META[cat] || CAT_META.Other;
    const bar   = pct > 90 ? "var(--red)" : pct > 70 ? "var(--amber)" : c.color;
    return (
      <div key={cat} style={{ marginBottom: 13 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:c.color }} />
            <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{cat}</span>
          </div>
          <div style={{ fontSize:12, color:"var(--text2)", display:"flex", gap:6, alignItems:"center", fontWeight:500 }}>
            {fmt(spent)}
            <span style={{ color:"var(--text2)" }}>/ {fmt(limit)}</span>
            <span style={{ fontSize:10, fontWeight:700, color:bar, background:`${bar}22`, padding:"1px 6px", borderRadius:8 }}>
              {pct}%
            </span>
          </div>
        </div>
        <div className="bar-track">
          <div className="bar-fill" style={{ width:pct+"%", background:bar }} />
        </div>
      </div>
    );
  });
}

function GoalsList() {
  const { goals } = useBudget();
  if (!goals.length) return (
    <div className="empty-state"><div className="empty-icon">🎯</div>No goals added yet</div>
  );
  return goals.map(g => {
    const pct = Math.min(100, Math.round(g.saved / g.target * 100));
    return (
      <div key={g.id} style={{ marginBottom: 14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{g.name}</span>
          <span style={{ fontSize:12, color:g.color, fontWeight:700 }}>{pct}%</span>
        </div>
        <div className="bar-track" style={{ height:8 }}>
          <div className="bar-fill" style={{ width:pct+"%", background:`linear-gradient(90deg,${g.color} 0%,${g.color}cc 100%)`, height:"100%", boxShadow:`0 0 8px ${g.color}55` }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <span style={{ fontSize:11, fontWeight:500, color:"var(--text2)" }}>{fmt(g.saved)} saved</span>
          <span style={{ fontSize:11, fontWeight:500, color:"var(--text2)" }}>target: {fmt(g.target)}</span>
        </div>
      </div>
    );
  });
}

function Alerts() {
  const { budgets, cats, income, expense } = useBudget();
  const alerts = [];
  Object.entries(budgets).forEach(([cat, limit]) => {
    const spent = cats[cat] || 0, pct = spent / limit * 100;
    if (pct > 100) alerts.push({ type:"danger", msg:`${cat} exceeded budget — spent ${fmt(spent)} of ${fmt(limit)}` });
    else if (pct > 80) alerts.push({ type:"warn", msg:`${cat} at ${Math.round(pct)}% of ${fmt(limit)} budget (${fmt(limit-spent)} left)` });
  });
  if (income > 0 && expense / income < 0.5)
    alerts.push({ type:"ok", msg:`You're saving ${Math.round((1-expense/income)*100)}% of income — great discipline!` });
  if (!alerts.length && income === 0)
    alerts.push({ type:"warn", msg:"No data for this month. Add your income and expenses to get started." });
  if (!alerts.length)
    alerts.push({ type:"ok", msg:"All budgets are healthy this month. Keep it up! 🎉" });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {alerts.map((a, i) => (
        <div key={i} className={`alert alert-${a.type}`}>
          <span style={{ fontSize:16, lineHeight:1 }}>
            {a.type==="danger"?"⚠":a.type==="warn"?"●":"✓"}
          </span>
          <span style={{ fontWeight:500 }}>{a.msg}</span>
        </div>
      ))}
    </div>
  );
}

export default function OverviewTab() {
  return (
    <div className="fade-up">
      <div className="grid2" style={{ marginBottom:14 }}>
        <div className="card">
          <div className="card-title">Budget Health</div>
          <BudgetHealth />
        </div>
        <div className="card">
          <div className="card-title">Savings Goals</div>
          <GoalsList />
        </div>
      </div>
      <div className="card">
        <div className="card-title">Alerts & Insights</div>
        <Alerts />
      </div>
    </div>
  );
}

