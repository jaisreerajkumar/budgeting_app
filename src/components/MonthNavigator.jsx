export default function MonthNavigator() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <button>‹</button>
        <button>›</button>
      </div>

      <button
        style={{
          padding: "10px 18px",
          background: "#185FA5",
          color: "white",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
        }}
      >
        + Add Transaction
      </button>
    </div>
  );
}