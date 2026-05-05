import { useBudget, CAT_META, fmt } from "../context/BudgetContext";

export default function BudgetsTab({ onAdd }) {
  const { budgets, cats, deleteBudget } = useBudget();
  const entries = Object.entries(budgets);

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <p style={{ fontSize:13, color:"var(--text3)" }}>Set monthly spending caps per category</p>
        <button onClick={onAdd} className="btn-primary">+ Set budget</button>
      </div>

      <div className="card">
        {entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            No budgets yet. Set one above to start tracking.
          </div>
        ) : entries.map(([cat, limit]) => {
          const spent  = cats[cat] || 0;
          const pct    = Math.min(100, Math.round(spent / limit * 100));
          const c      = CAT_META[cat] || CAT_META.Other;
          const bar    = pct > 90 ? "var(--red)" : pct > 70 ? "var(--amber)" : c.color;
          const remain = limit - spent;

          return (
            <div key={cat} style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"14px 0",
              borderBottom:"1px solid var(--border)",
            }}>
              {/* Dot + name */}
              <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:110 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:c.color, flexShrink:0 }} />
                <span style={{ fontSize:14, fontWeight:500, color:"var(--text)" }}>{cat}</span>
              </div>

              {/* Bar */}
              <div style={{ flex:1 }}>
                <div className="bar-track" style={{ height:8 }}>
                  <div className="bar-fill" style={{
                    width:pct+"%", background:bar,
                    boxShadow:`0 0 6px ${bar}66`,
                  }} />
                </div>
              </div>

              {/* Stats */}
              <div style={{ minWidth:160, textAlign:"right", fontSize:12 }}>
                <span style={{ color:"var(--text)", fontWeight:600 }}>{fmt(spent)}</span>
                <span style={{ color:"var(--text3)" }}> / {fmt(limit)}</span>
                <span style={{
                  marginLeft:8, fontWeight:700, fontSize:11,
                  color:bar, background:`${bar}22`,
                  padding:"2px 7px", borderRadius:8,
                }}>{pct}%</span>
              </div>

              {/* Remaining */}
              <div style={{ minWidth:80, textAlign:"right", fontSize:11, color: remain < 0 ? "var(--red)" : "var(--green)" }}>
                {remain < 0 ? `−${fmt(Math.abs(remain))} over` : `${fmt(remain)} left`}
              </div>

              <button className="del-btn" onClick={()=>deleteBudget(cat)}>×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

