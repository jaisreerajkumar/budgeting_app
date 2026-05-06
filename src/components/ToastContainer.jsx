import { useBudget } from "../context/BudgetContext";

const STYLES = {
  success: { bg: "rgba(0,200,150,.15)",   border: "rgba(0,200,150,.4)",   icon: "✓", color: "#6ee7b7" },
  danger:  { bg: "rgba(255,77,109,.15)",  border: "rgba(255,77,109,.4)",  icon: "!", color: "#ff8fa3" },
  warn:    { bg: "rgba(249,168,37,.15)",  border: "rgba(249,168,37,.4)",  icon: "⚠", color: "#fcd34d" },
  info:    { bg: "rgba(79,110,247,.15)",  border: "rgba(79,110,247,.4)",  icon: "i", color: "#93aeff" },
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useBudget();
  if (!toasts.length) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 24, right: 24,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      maxWidth: 340,
    }}>
      {toasts.map(t => {
        const s = STYLES[t.type] || STYLES.info;
        return (
          <div key={t.id} style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "12px 14px",
            background: "var(--bg2)",
            border: `1px solid ${s.border}`,
            borderLeft: `3px solid ${s.color}`,
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,.4)",
            animation: "slideIn .3s cubic-bezier(.16,1,.3,1)",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: s.bg, border: `1px solid ${s.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: s.color, flexShrink: 0,
            }}>{s.icon}</div>
            <span style={{ fontSize: 13, color: "var(--text)", flex: 1, lineHeight: 1.5 }}>{t.msg}</span>
            <button onClick={() => dismissToast(t.id)} style={{
              background: "none", border: "none", color: "var(--text3)",
              cursor: "pointer", fontSize: 16, padding: "0 2px", lineHeight: 1,
            }}>×</button>
          </div>
        );
      })}
    </div>
  );
}

