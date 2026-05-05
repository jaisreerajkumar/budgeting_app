const TABS = [
  { id:"overview",     label:"Overview",     icon:"◈" },
  { id:"transactions", label:"Transactions", icon:"⇄" },
  { id:"budgets",      label:"Budgets",      icon:"◎" },
  { id:"goals",        label:"Goals",        icon:"◇" },
  { id:"analytics",    label:"Analytics",    icon:"∿" },
];

export default function TabBar({ active, onChange }) {
  return (
    <div className="tab-bar">
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`tab-btn ${active === t.id ? "active" : ""}`}
        >
          <span style={{ fontSize:14 }}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}

