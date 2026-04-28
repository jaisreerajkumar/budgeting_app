export function TransactionsTable({ transactions }) {
  return (
    <table>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id}>
            <td>{t.desc}</td>
            <td>{t.type}</td>
            <td>${t.amt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
