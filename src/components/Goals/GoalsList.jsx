export default function GoalsList({ goals }) {
  return (
    <div style={{ background: "white", padding: 20, borderRadius: 14 }}>
      <h2>Goals</h2>
      {goals.map((goal) => (
        <p key={goal.id}>{goal.name} — ${goal.saved}/${goal.target}</p>
      ))}
    </div>
  );
}
