import { FULLMON } from "../context/BudgetContext";

export function exportToCSV(transactions, curY, curM) {
  const key   = `${curY}-${curM}`;
  const tx    = transactions[key] || [];
  const month = `${FULLMON[curM]} ${curY}`;

  const headers = ["Date", "Description", "Type", "Category", "Amount", "Recurring"];
  const rows    = tx
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(t => [
      t.date,
      `"${t.desc.replace(/"/g, '""')}"`,
      t.type,
      t.cat || "—",
      t.amt.toFixed(2),
      t.recurring ? "Yes" : "No",
    ]);

  // Summary rows
  const income  = tx.filter(t => t.type === "income").reduce((s, t) => s + t.amt, 0);
  const expense = tx.filter(t => t.type === "expense").reduce((s, t) => s + t.amt, 0);

  const csv = [
    [`Budget Report — ${month}`],
    [],
    headers,
    ...rows,
    [],
    ["", "", "", "Total Income",  income.toFixed(2),  ""],
    ["", "", "", "Total Expense", expense.toFixed(2), ""],
    ["", "", "", "Net Balance",   (income - expense).toFixed(2), ""],
  ].map(r => r.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `budget-${FULLMON[curM].toLowerCase()}-${curY}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}