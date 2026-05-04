export default function Header({ tabs, activeTab, setActiveTab }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <div>
        <h1 style={{ margin: 0 }}>Finance Dashboard</h1>
        <p style={{ color: "#777", marginTop: 4 }}>April 2026 overview</p>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: activeTab === tab ? "#185FA5" : "white",
              color: activeTab === tab ? "white" : "#222",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}