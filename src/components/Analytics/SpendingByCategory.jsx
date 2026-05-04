export default function SpendingByCategory({ transactions }) {
  return (
    <div style={{ background: "white", padding: 20, borderRadius: 14, marginTop: 20 }}>
      <h2>Spending by Category</h2>
      <p>Total transactions: {transactions.length}</p>
    </div>
  );
}
