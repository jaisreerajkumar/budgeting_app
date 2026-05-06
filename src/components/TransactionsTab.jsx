import { useState } from "react";
import { useBudget, CAT_META, fmt } from "../context/BudgetContext";

export default function TransactionsTab({ onAdd }) {
  const { tx, deleteTransaction } = useBudget();
  const [filter, setFilter] = useState("all");
  const [search, setSearch]  = useState("");

  const filtered = [...tx]
    .filter(t => filter === "all" || t.type === filter)
    .filter(t => !search ||
      t.desc.toLowerCase().includes(search.toLowerCase()) ||
      (t.cat||"").toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => b.date.localeCompare(a.date));

  return (
    <div className="fade-up">
      <div className="card">
        {/* Toolbar */}
        <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
          {["all","income","expense"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding:"6px 14px", fontSize:12, fontWeight:600,
                border:`1px solid ${filter===f ? "var(--accent)" : "var(--border2)"}`,
                borderRadius:"var(--radius-sm)",
                background: filter===f ? "rgba(79,110,247,.18)" : "transparent",
                color: filter===f ? "var(--accent)" : "var(--text)",
                cursor:"pointer", transition:"all .15s", fontFamily:"inherit",
                textTransform:"capitalize",
              }}
            >{f}</button>
          ))}
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="form-input"
            style={{ flex:1, minWidth:160 }}
          />
          <button onClick={onAdd} className="btn-primary" style={{ whiteSpace:"nowrap" }}>
            + Add
          </button>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            No transactions found. Add one above!
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign:"right" }}>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const m = CAT_META[t.cat] || { bg:"var(--bg4)", tc:"var(--text)" };
                  return (
                    <tr key={t.id}>
                      <td style={{ fontSize:12, fontWeight:500 }}>{t.date}</td>
                      <td style={{ fontWeight:500 }}>
                        {t.desc}
                        {t.recurring && (
                          <span className="badge" style={{ background:"rgba(79,110,247,.18)", color:"var(--accent)", marginLeft:7 }}>
                            ↻ recurring
                          </span>
                        )}
                      </td>
                      <td>
                        {t.cat && (
                          <span className="tag" style={{ background:m.bg, color:m.tc, fontWeight:700 }}>
                            {t.cat}
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{
                          fontSize:11, fontWeight:700,
                          color: t.type==="income" ? "var(--green)" : "var(--red)",
                          textTransform:"capitalize",
                        }}>{t.type}</span>
                      </td>
                      <td style={{
                        textAlign:"right", fontWeight:700,
                        fontFamily:"'Space Grotesk',sans-serif",
                        color: t.type==="income" ? "var(--green)" : "var(--red)",
                      }}>
                        {t.type==="income"?"+":"−"}{fmt(t.amt)}
                      </td>
                      <td style={{ textAlign:"right" }}>
                        <button className="del-btn" onClick={()=>deleteTransaction(t.id)}>×</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

