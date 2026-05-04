const cardStyle = {
  background: "white",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
};

export default function BudgetHealth({ budgets }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ marginBottom: 20 }}>Budget Health</h3>

      {Object.entries(budgets).map(([cat, value]) => (
        <div key={cat} style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span>{cat}</span>
            <strong>${value}</strong>
          </div>

          <div
            style={{
              height: 8,
              background: "#eee",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "70%",
                height: "100%",
                background: "#185FA5",
                borderRadius: 20,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
