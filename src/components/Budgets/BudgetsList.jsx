export function BudgetsList({ budgets }) {
  return <div>{Object.keys(budgets).map((b) => <p key={b}>{b}</p>)}</div>;
}
