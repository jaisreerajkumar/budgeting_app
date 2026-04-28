export function SavingsGoals({ goals }) {
  return (
    <div>
      <h2>Savings Goals</h2>
      {goals.map((g) => (
        <p key={g.id}>{g.name} - ${g.saved}/${g.target}</p>
      ))}
    </div>
  );
}