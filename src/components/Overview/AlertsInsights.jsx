export default function AlertsInsights() {
  return (
    <div style={{ ...cardStyle, marginTop: 16 }}>
      <h3>Alerts & Insights</h3>
      <div
        style={{
          background: "#EAF8F2",
          padding: 14,
          borderRadius: 10,
          color: "#0E6B4A",
        }}
      >
        Great job! You are saving 65% of your income this month.
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
};

