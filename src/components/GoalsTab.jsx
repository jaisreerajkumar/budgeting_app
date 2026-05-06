import { useBudget, fmt } from "../context/BudgetContext";

export default function GoalsTab({ onAdd }) {
  const { goals, deleteGoal } = useBudget();

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <p style={{ fontSize:13, fontWeight:600, color:"var(--text2)" }}>Track your savings milestones</p>
        <button onClick={onAdd} className="btn-primary">+ Add goal</button>
      </div>

      {goals.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            No goals yet. Set your first savings milestone!
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {goals.map(g => {
            const pct  = Math.min(100, Math.round(g.saved / g.target * 100));
            const left = Math.max(0, g.target - g.saved);
            return (
              <div key={g.id} className="card" style={{ border:`1px solid ${g.color}33`, boxShadow:`0 0 20px ${g.color}15` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:"var(--text)", marginBottom:4 }}>{g.name}</div>
                    <div style={{ fontSize:12, fontWeight:500, color:"var(--text2)" }}>
                      {fmt(g.saved)} saved · {fmt(left)} to go
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:g.color }}>
                      {pct}%
                    </div>
                    <button className="del-btn" onClick={()=>deleteGoal(g.id)}>×</button>
                  </div>
                </div>

                <div style={{ height:10, background:"var(--bg4)", borderRadius:5, overflow:"hidden", marginBottom:8 }}>
                  <div style={{
                    height:"100%", borderRadius:5,
                    width:pct+"%",
                    background:`linear-gradient(90deg,${g.color} 0%,${g.color}99 100%)`,
                    boxShadow:`0 0 10px ${g.color}77`,
                    transition:"width .5s cubic-bezier(.16,1,.3,1)",
                  }} />
                </div>

                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontWeight:600 }}>
                  <span style={{ color:"var(--text2)" }}>$0</span>
                  <span style={{ color:"var(--text)" }}>{fmt(g.saved)}</span>
                  <span style={{ color:"var(--text2)" }}>{fmt(g.target)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

