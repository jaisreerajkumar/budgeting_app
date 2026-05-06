import { FULLMON, CAT_META, fmt } from "../context/BudgetContext";

export function generatePDFReport({ transactions, budgets, goals, curY, curM }) {
  const key     = `${curY}-${curM}`;
  const tx      = transactions[key] || [];
  const month   = `${FULLMON[curM]} ${curY}`;
  const income  = tx.filter(t => t.type === "income").reduce((s, t) => s + t.amt, 0);
  const expense = tx.filter(t => t.type === "expense").reduce((s, t) => s + t.amt, 0);
  const balance = income - expense;
  const sr      = income > 0 ? Math.round((income - expense) / income * 100) : 0;

  const cats = {};
  tx.filter(t => t.type === "expense").forEach(t => { cats[t.cat] = (cats[t.cat] || 0) + t.amt; });
  const catEntries = Object.entries(cats).sort((a, b) => b[1] - a[1]);

  const txRows = [...tx].sort((a, b) => a.date.localeCompare(b.date)).map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.desc}${t.recurring ? ' <span class="badge">↻</span>' : ""}</td>
      <td><span class="cat-tag" style="background:${(CAT_META[t.cat] || CAT_META.Other).bg.replace("rgba","rgba").replace(".15","0.3")}">${t.cat || "—"}</span></td>
      <td class="${t.type === "income" ? "green" : "red"}">${t.type === "income" ? "+" : "−"}${fmt(t.amt)}</td>
    </tr>`).join("");

  const catBars = catEntries.map(([cat, amt]) => {
    const pct = expense > 0 ? Math.round(amt / expense * 100) : 0;
    const col = (CAT_META[cat] || CAT_META.Other).color;
    return `
      <div class="cat-row">
        <div class="cat-name"><span class="dot" style="background:${col}"></span>${cat}</div>
        <div class="cat-bar-wrap"><div class="cat-bar" style="width:${pct}%;background:${col}"></div></div>
        <div class="cat-amt">${fmt(amt)} (${pct}%)</div>
      </div>`;
  }).join("");

  const goalRows = goals.map(g => {
    const pct = Math.min(100, Math.round(g.saved / g.target * 100));
    return `
      <div class="cat-row">
        <div class="cat-name"><span class="dot" style="background:${g.color}"></span>${g.name}</div>
        <div class="cat-bar-wrap"><div class="cat-bar" style="width:${pct}%;background:${g.color}"></div></div>
        <div class="cat-amt">${fmt(g.saved)} / ${fmt(g.target)}</div>
      </div>`;
  }).join("");

  const budgetRows = Object.entries(budgets).map(([cat, limit]) => {
    const spent = cats[cat] || 0;
    const pct   = Math.min(100, Math.round(spent / limit * 100));
    const col   = pct > 90 ? "#ff4d6d" : pct > 70 ? "#f9a825" : (CAT_META[cat] || CAT_META.Other).color;
    return `
      <div class="cat-row">
        <div class="cat-name"><span class="dot" style="background:${col}"></span>${cat}</div>
        <div class="cat-bar-wrap"><div class="cat-bar" style="width:${pct}%;background:${col}"></div></div>
        <div class="cat-amt">${fmt(spent)} / ${fmt(limit)}</div>
      </div>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Budget Report — ${month}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Plus Jakarta Sans',sans-serif; background:#fff; color:#111; padding:40px; font-size:13px; }
  h1 { font-size:26px; font-weight:700; color:#0f1117; margin-bottom:4px; }
  .subtitle { color:#7e8fa8; font-size:13px; margin-bottom:28px; }
  .metrics { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px; }
  .metric { background:#f7f8fa; border-radius:12px; padding:16px; border:1px solid #eee; }
  .metric-label { font-size:10px; color:#7e8fa8; text-transform:uppercase; letter-spacing:.07em; margin-bottom:6px; }
  .metric-value { font-size:20px; font-weight:700; }
  .green { color:#00a878; } .red { color:#e53056; } .blue { color:#3a5ce0; } .amber { color:#d48d0a; }
  h2 { font-size:14px; font-weight:700; color:#0f1117; margin:24px 0 12px; padding-bottom:6px; border-bottom:2px solid #f0f0f0; }
  table { width:100%; border-collapse:collapse; font-size:12px; }
  th { font-size:10px; color:#7e8fa8; text-align:left; padding:6px 10px; border-bottom:1px solid #eee; text-transform:uppercase; letter-spacing:.05em; }
  td { padding:9px 10px; border-bottom:1px solid #f5f5f5; }
  .cat-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .cat-name { min-width:110px; font-size:12px; display:flex; align-items:center; gap:6px; }
  .dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; display:inline-block; }
  .cat-bar-wrap { flex:1; height:7px; background:#f0f0f0; border-radius:4px; overflow:hidden; }
  .cat-bar { height:100%; border-radius:4px; }
  .cat-amt { min-width:110px; text-align:right; font-size:11px; color:#555; }
  .cat-tag { padding:2px 8px; border-radius:20px; font-size:10px; font-weight:600; }
  .badge { font-size:9px; background:#e8edff; color:#3a5ce0; padding:1px 5px; border-radius:8px; margin-left:4px; }
  .footer { margin-top:36px; padding-top:14px; border-top:1px solid #eee; font-size:11px; color:#aaa; text-align:center; }
  @media print { body { padding:20px; } }
</style>
</head>
<body>
  <h1>Monthly Budget Report</h1>
  <p class="subtitle">Generated for ${month} · ${new Date().toLocaleDateString("en-US",{dateStyle:"long"})}</p>

  <div class="metrics">
    <div class="metric"><div class="metric-label">Income</div><div class="metric-value green">${fmt(income)}</div></div>
    <div class="metric"><div class="metric-label">Expenses</div><div class="metric-value red">${fmt(expense)}</div></div>
    <div class="metric"><div class="metric-label">Net Balance</div><div class="metric-value ${balance >= 0 ? "blue" : "red"}">${balance < 0 ? "−" : ""}${fmt(balance)}</div></div>
    <div class="metric"><div class="metric-label">Savings Rate</div><div class="metric-value ${sr >= 20 ? "green" : sr >= 10 ? "amber" : "red"}">${sr}%</div></div>
  </div>

  ${catEntries.length ? `<h2>Spending by Category</h2>${catBars}` : ""}
  ${Object.keys(budgets).length ? `<h2>Budget Health</h2>${budgetRows}` : ""}
  ${goals.length ? `<h2>Savings Goals</h2>${goalRows}` : ""}

  <h2>All Transactions (${tx.length})</h2>
  ${tx.length ? `<table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th></tr></thead><tbody>${txRows}</tbody></table>` : "<p style='color:#aaa;font-size:13px'>No transactions this month.</p>"}

  <div class="footer">Finance Dashboard · Budget Report · ${month}</div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=700");
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 600);
}