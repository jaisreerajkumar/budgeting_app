export default function BudgetsList({ budgets }) {
  return (
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 14,
        boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
        marginTop: 20,
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Budgets</h2>

      {Object.entries(budgets).map(([name, value]) => (
        <div
          key={name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <span>{name}</span>
          <strong>${value}</strong>
        </div>
      ))}
    </div>
  );
}