export function GoalsList({ goals }) {
  return <div>{goals.map((g) => <p key={g.id}>{g.name}</p>)}</div>;
}
