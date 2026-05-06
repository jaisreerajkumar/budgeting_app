import { useBudget, MONTHS, FULLMON } from "../context/BudgetContext";
import { exportToCSV }       from "../utils/csvExport";
import { generatePDFReport }  from "../utils/pdfReport";

export default function Header() {
  const {
    curY, curM, refreshing, theme,
    changeMonth, refresh, toggleTheme,
    transactions, budgets, goals, addToast,
  } = useBudget();

  const handleCSV = () => {
    exportToCSV(transactions, curY, curM);
    addToast("📥 CSV exported successfully", "success");
  };

  const handlePDF = () => {
    generatePDFReport({ transactions, budgets, goals, curY, curM });
    addToast("📄 PDF report opening...", "info");
  };

  return (
    <header style={{ marginBottom: 26 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:12 }}>

        {/* Brand */}
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{
            width:44, height:44,
            background:"linear-gradient(135deg,#4f6ef7 0%,#9c6ffd 100%)",
            borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:22, boxShadow:"0 4px 16px rgba(79,110,247,.4)",
          }}>💰</div>
          <div>
            <h1 style={{
              fontFamily:"'Space Grotesk',sans-serif",
              fontSize:24, fontWeight:700,
              background:"linear-gradient(135deg,var(--text) 0%,var(--accent) 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              letterSpacing:"-.03em", lineHeight:1,
            }}>Finance Dashboard</h1>
            <p style={{ fontSize:12, fontWeight:600, color:"var(--text2)", marginTop:3 }}>
              {FULLMON[curM]} {curY} · personal budget tracker
            </p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>

          <button onClick={handleCSV} className="btn-ghost" title="Export CSV"
            style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600 }}>
            <span>⬇</span> CSV
          </button>

          <button onClick={handlePDF} className="btn-ghost" title="Monthly PDF Report"
            style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600 }}>
            <span>📄</span> PDF
          </button>

          <button onClick={toggleTheme} className="btn-icon"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            style={{ fontSize:16 }}>
            {theme === "dark" ? "☀" : "🌙"}
          </button>

          <button onClick={refresh} className={`btn-icon ${refreshing ? "active" : ""}`} title="Refresh dashboard">
            <span className={refreshing ? "spinning" : ""} style={{ fontSize:16, display:"inline-block" }}>⟳</span>
          </button>

          <div style={{
            display:"flex", alignItems:"center", gap:4,
            background:"var(--bg2)", border:"1px solid var(--border2)",
            borderRadius:"var(--radius-sm)", padding:"4px 6px",
          }}>
            <button onClick={() => changeMonth(-1)} className="btn-icon"
              style={{ border:"none", background:"transparent", padding:"5px 9px", fontSize:16 }}>‹</button>
            <span style={{
              fontSize:13, fontWeight:700, minWidth:94, textAlign:"center",
              color:"var(--text)", fontFamily:"'Space Grotesk',sans-serif",
            }}>{MONTHS[curM]} {curY}</span>
            <button onClick={() => changeMonth(1)} className="btn-icon"
              style={{ border:"none", background:"transparent", padding:"5px 9px", fontSize:16 }}>›</button>
          </div>
        </div>
      </div>

      <div style={{
        height:1,
        background:"linear-gradient(90deg,var(--accent) 0%,var(--purple,#9c6ffd) 50%,transparent 100%)",
        opacity:.4,
      }}/>
    </header>
  );
}

