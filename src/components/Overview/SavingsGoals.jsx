const cardStyle = {
  background: "white",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
};

export default function SavingsGoals({ goals }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ marginBottom: 20 }}>Savings Goals</h3>

      {goals.map((goal) => (
        <div key={goal.id} style={{ marginBottom: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <strong>{goal.name}</strong>
            <span>
              ${goal.saved} / ${goal.target}
            </span>
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
                width: `${(goal.saved / goal.target) * 100}%`,
                height: "100%",
                background: "#1D9E75",
                borderRadius: 20,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}