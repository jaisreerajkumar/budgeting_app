export default function TransactionsTable({ transactions }) {
  return (
    <div style={{ background: "white", padding: 20, borderRadius: 14 }}>
      <h2>Transactions</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Description</th>
            <th align="left">Type</th>
            <th align="left">Amount</th>
          </tr>
        </thead>
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
    </div>
  );
}

