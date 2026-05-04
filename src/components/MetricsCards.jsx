export default function MetricsCards({ income, expense, balance }) {
  const cards = [
    { title: "Income", value: `$${income}`, color: "#1D9E75" },
    { title: "Expenses", value: `$${expense}`, color: "#D85A30" },
    { title: "Net Balance", value: `$${balance}`, color: "#185FA5" },
    { title: "Savings Rate", value: "65%", color: "#7F77DD" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 14,
        marginTop: 20,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "white",
            padding: 20,
            borderRadius: 14,
            boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ fontSize: 13, color: "#888" }}>{card.title}</p>
          <h2 style={{ color: card.color }}>{card.value}</h2>
        </div>
      ))}
    </div>
  );
}
