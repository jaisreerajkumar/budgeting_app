import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export const CAT_META = {
  Food:          { color: "#00c896", bg: "rgba(0,200,150,.15)",   tc: "#6ee7b7" },
  Housing:       { color: "#4f6ef7", bg: "rgba(79,110,247,.15)",  tc: "#93aeff" },
  Transport:     { color: "#f9a825", bg: "rgba(249,168,37,.15)",  tc: "#fcd34d" },
  Health:        { color: "#ff4d6d", bg: "rgba(255,77,109,.15)",  tc: "#ff8fa3" },
  Entertainment: { color: "#9c6ffd", bg: "rgba(156,111,253,.15)", tc: "#c4b5fd" },
  Shopping:      { color: "#00d4f5", bg: "rgba(0,212,245,.15)",   tc: "#67e8f9" },
  Utilities:     { color: "#fb923c", bg: "rgba(251,146,60,.15)",  tc: "#fdba74" },
  Other:         { color: "#7e8fa8", bg: "rgba(126,143,168,.15)", tc: "#94a3b8" },
};
export const CAT_LIST = Object.keys(CAT_META);

const LS_KEY = "budgetapp_v2";
function loadState() {
  try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
function saveState(d) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch {}
}

const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const saved = loadState();
  const now   = new Date();

  const [curY,         setCurY]         = useState(now.getFullYear());
  const [curM,         setCurM]         = useState(now.getMonth());
  const [transactions, setTransactions] = useState(saved?.transactions || {});
  const [budgets,      setBudgetsState] = useState(saved?.budgets      || {});
  const [goals,        setGoals]        = useState(saved?.goals         || []);
  const [theme,        setThemeState]   = useState(saved?.theme         || "dark");
  const [refreshing,   setRefreshing]   = useState(false);
  const [toasts,       setToasts]       = useState([]);
  const nextId  = useRef(saved?.nextId || 1);
  const toastId = useRef(0);

  // Persist to localStorage
  useEffect(() => {
    saveState({ transactions, budgets, goals, theme, nextId: nextId.current });
  }, [transactions, budgets, goals, theme]);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Toast system
  const addToast = useCallback((msg, type = "info") => {
    const id = toastId.current++;
    setToasts(prev => [...prev, { id, type, msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const toggleTheme = () => setThemeState(t => t === "dark" ? "light" : "dark");

  const key    = (y, m) => `${y}-${m}`;
  const curKey = key(curY, curM);
  const getTx  = (y = curY, m = curM) => transactions[key(y, m)] || [];

  const changeMonth = (d) => {
    let m = curM + d, y = curY;
    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }
    setCurM(m); setCurY(y);
  };

  const refresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); addToast("Dashboard refreshed!", "success"); }, 900);
  }, [addToast]);

  const checkBudgetAlerts = useCallback((txList, budgetMap) => {
    const cats = {};
    txList.filter(t => t.type === "expense").forEach(t => { cats[t.cat] = (cats[t.cat] || 0) + t.amt; });
    Object.entries(budgetMap).forEach(([cat, limit]) => {
      const pct = ((cats[cat] || 0) / limit) * 100;
      if (pct >= 100) addToast(`🚨 ${cat} budget exceeded!`, "danger");
      else if (pct >= 80) addToast(`⚠️ ${cat} at ${Math.round(pct)}% of budget`, "warn");
    });
  }, [addToast]);

  const addTransaction = (data) => {
    const { type = "expense", desc, amt, cat = "Food", date, recurring } = data;
    if (!desc?.trim() || !amt || !date) return false;
    const entry = { id: nextId.current++, type, desc: desc.trim(), amt: parseFloat(amt), cat: type === "income" ? "" : cat, date, recurring: !!recurring };
    setTransactions(prev => {
      const next = { ...prev, [curKey]: [...(prev[curKey] || []), entry] };
      if (type === "expense") setTimeout(() => checkBudgetAlerts(next[curKey] || [], budgets), 150);
      return next;
    });
    addToast(`${type === "income" ? "💰" : "💸"} ${entry.desc} added`, "success");
    return true;
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => ({ ...prev, [curKey]: (prev[curKey] || []).filter(t => t.id !== id) }));
    addToast("Transaction deleted", "info");
  };

  const setBudget = (cat, limit) => {
    if (!cat || !limit || isNaN(parseFloat(limit))) return false;
    setBudgetsState(prev => ({ ...prev, [cat]: parseFloat(limit) }));
    addToast(`📊 Budget set for ${cat}`, "success");
    return true;
  };

  const deleteBudget = (cat) => {
    setBudgetsState(prev => { const b = { ...prev }; delete b[cat]; return b; });
    addToast(`${cat} budget removed`, "info");
  };

  const addGoal = (data) => {
    const { name, target, saved } = data;
    if (!name?.trim() || !target || isNaN(parseFloat(target))) return false;
    const palette = ["#4f6ef7","#00c896","#9c6ffd","#00d4f5","#f9a825","#ff4d6d"];
    setGoals(prev => [...prev, { id: nextId.current++, name: name.trim(), target: parseFloat(target), saved: parseFloat(saved || 0), color: palette[prev.length % palette.length] }]);
    addToast(`🎯 Goal "${name}" added`, "success");
    return true;
  };

  const deleteGoal = (id) => { setGoals(prev => prev.filter(g => g.id !== id)); addToast("Goal removed", "info"); };

  const tx      = getTx();
  const income  = tx.filter(t => t.type === "income").reduce((s, t) => s + t.amt, 0);
  const expense = tx.filter(t => t.type === "expense").reduce((s, t) => s + t.amt, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.round((income - expense) / income * 100) : 0;

  const getCatTotals = (txList) => {
    const c = {};
    txList.filter(t => t.type === "expense").forEach(t => { c[t.cat] = (c[t.cat] || 0) + t.amt; });
    return c;
  };
  const cats = getCatTotals(tx);

  return (
    <BudgetContext.Provider value={{
      curY, curM, tx, income, expense, balance, savingsRate, cats,
      transactions, budgets, goals, refreshing, theme, toasts,
      changeMonth, refresh, getTx, getCatTotals, toggleTheme,
      addTransaction, deleteTransaction,
      setBudget, deleteBudget,
      addGoal, deleteGoal,
      addToast, dismissToast,
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudget = () => useContext(BudgetContext);
export const fmt    = (n) => "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 });
export const fmtK   = (n) => n >= 1000 ? "$" + (n/1000).toFixed(1)+"k" : "$"+Math.round(n);
export const MONTHS  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const FULLMON = ["January","February","March","April","May","June","July","August","September","October","November","December"];

