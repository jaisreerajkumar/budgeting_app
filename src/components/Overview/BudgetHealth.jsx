export default function BudgetHealth({ budgets }) {
  return (
    <div>
      <h2>Budget Health</h2>
      {Object.entries(budgets).map(([cat, amount]) => (
        <p key={cat}>{cat}: ${amount}</p>
      ))}
    </div>
  );
}
