import { useBudget, MONTHS, FULLMON } from "../context/BudgetContext";

export default function Header() {
  const { curY, curM, refreshing, changeMonth, refresh } = useBudget();

  return (
    <header style={{ marginBottom: 26 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 18 }}>

        {/* Brand */}
        <div style={{ display:"flex", alignItems:"center", gap: 14 }}>
          <div style={{
            width: 44, height: 44,
            background: "linear-gradient(135deg,#4f6ef7 0%,#9c6ffd 100%)",
            borderRadius: 13,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize: 22,
            boxShadow: "0 4px 16px rgba(79,110,247,.4)",
          }}>💰</div>
          <div>
            <h1 style={{
              fontFamily:"'Space Grotesk',sans-serif",
              fontSize: 24, fontWeight: 700,
              background: "linear-gradient(135deg,#e8edf5 0%,#7c96ff 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              letterSpacing:"-.03em", lineHeight:1,
            }}>
              Finance Dashboard
            </h1>
            <p style={{ fontSize:12, color:"var(--text3)", marginTop:3 }}>
              {FULLMON[curM]} {curY} — personal budget tracker
            </p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:"flex", alignItems:"center", gap: 8 }}>

          {/* Refresh */}
          <button
            onClick={refresh}
            className={`btn-icon ${refreshing ? "active" : ""}`}
            title="Refresh dashboard"
            style={{ minWidth: 40 }}
          >
            <span className={refreshing ? "spinning" : ""} style={{ fontSize:16 }}>⟳</span>
          </button>

          {/* Month nav */}
          <div style={{
            display:"flex", alignItems:"center", gap: 4,
            background:"var(--bg2)", border:"1px solid var(--border)",
            borderRadius:"var(--radius-sm)", padding: "4px 6px",
          }}>
            <button
              onClick={() => changeMonth(-1)}
              className="btn-icon"
              style={{ border:"none", background:"transparent", padding:"5px 9px", fontSize:16 }}
            >‹</button>
            <span style={{
              fontSize:13, fontWeight:600,
              minWidth: 94, textAlign:"center",
              color:"var(--text)", fontFamily:"'Space Grotesk',sans-serif",
            }}>
              {MONTHS[curM]} {curY}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="btn-icon"
              style={{ border:"none", background:"transparent", padding:"5px 9px", fontSize:16 }}
            >›</button>
          </div>
        </div>
      </div>

      {/* Gradient rule */}
      <div style={{
        height: 1,
        background:"linear-gradient(90deg,var(--accent) 0%,var(--purple) 50%,transparent 100%)",
        opacity:.35,
      }}/>
    </header>
  );
}

