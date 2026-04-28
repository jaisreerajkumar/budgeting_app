export function MetricsCards({ income, expense, balance }) {
  return (
    <div>
      <h3>Income: ${income}</h3>
      <h3>Expense: ${expense}</h3>
      <h3>Balance: ${balance}</h3>
    </div>
  );
}