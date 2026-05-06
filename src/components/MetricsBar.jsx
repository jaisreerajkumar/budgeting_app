import { useBudget, fmt } from "../context/BudgetContext";

export default function MetricsBar() {
  const { income, expense, balance, savingsRate, tx, refreshing } = useBudget();

  const metrics = [
    {
      label: "Total Income",
      value: fmt(income),
      color: "var(--green)",
      icon: "↑",
      sub: `${tx.filter(t=>t.type==="income").length} sources`,
      glow: "rgba(0,200,150,.2)",
    },
    {
      label: "Total Expenses",
      value: fmt(expense),
      color: "var(--red)",
      icon: "↓",
      sub: `${tx.filter(t=>t.type==="expense").length} transactions`,
      glow: "rgba(255,77,109,.2)",
    },
    {
      label: "Net Balance",
      value: (balance < 0 ? "−" : "") + fmt(balance),
      color: balance >= 0 ? "var(--accent2)" : "var(--red)",
      icon: balance >= 0 ? "◈" : "▽",
      sub: balance >= 0 ? "Surplus" : "Deficit",
      glow: balance >= 0 ? "rgba(79,110,247,.2)" : "rgba(255,77,109,.2)",
    },
    {
      label: "Savings Rate",
      value: savingsRate + "%",
      color: savingsRate >= 20 ? "var(--green)" : savingsRate >= 10 ? "var(--amber)" : "var(--red)",
      icon: "◬",
      sub: savingsRate >= 20 ? "On track 🎉" : savingsRate >= 10 ? "Getting there" : "Needs attention",
      glow: "rgba(0,200,150,.15)",
    },
  ];

  return (
    <div className="grid4" style={{ marginBottom: 18 }}>
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className="card fade-up"
          style={{
            animationDelay:`${i*70}ms`,
            boxShadow: refreshing ? `0 0 20px ${m.glow}` : "none",
            transition:"box-shadow .4s",
          }}
        >
          <div className="metric-accent" style={{ background: m.color }} />

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, marginTop:4 }}>
            <span style={{ fontSize:11, color:"var(--text2)", textTransform:"uppercase", letterSpacing:".07em", fontWeight:700 }}>
              {m.label}
            </span>
            <div style={{
              width:30, height:30, borderRadius:8,
              background:`${m.glow}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14, color:m.color,
              border:"1px solid rgba(128,128,128,.15)",
            }}>
              {m.icon}
            </div>
          </div>

          <div
            className={refreshing ? "pulsing" : ""}
            style={{
              fontSize:24, fontWeight:700,
              color:m.color, letterSpacing:"-.03em",
              fontFamily:"'Space Grotesk',sans-serif",
              marginBottom:4,
            }}
          >
            {income === 0 && expense === 0 ? "—" : m.value}
          </div>
          <div style={{ fontSize:11, color:"var(--text2)", fontWeight:500 }}>
            {income === 0 && expense === 0 ? "No data this month" : m.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

