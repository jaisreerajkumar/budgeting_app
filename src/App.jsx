import { useState } from "react";
import "./App.css";
import { BudgetProvider } from "./context/BudgetContext";
import Header           from "./components/Header";
import TabBar           from "./components/TabBar";
import MetricsBar       from "./components/MetricsBar";
import Modal            from "./components/Modal";
import OverviewTab      from "./components/OverviewTab";
import TransactionsTab  from "./components/TransactionsTab";
import BudgetsTab       from "./components/BudgetsTab";
import GoalsTab         from "./components/GoalsTab";
import AnalyticsTab     from "./components/AnalyticsTab";

function Dashboard() {
  const [tab,   setTab]   = useState("overview");
  const [modal, setModal] = useState(null);

  return (
    <div className="app-root">
      <Header />
      <MetricsBar />
      <TabBar active={tab} onChange={setTab} />

      {tab === "overview"      && <OverviewTab />}
      {tab === "transactions"  && <TransactionsTab onAdd={() => setModal("tx")} />}
      {tab === "budgets"       && <BudgetsTab      onAdd={() => setModal("budget")} />}
      {tab === "goals"         && <GoalsTab        onAdd={() => setModal("goal")} />}
      {tab === "analytics"     && <AnalyticsTab />}

      <Modal type={modal} onClose={() => setModal(null)} />
    </div>
  );
}

export default function App() {
  return (
    <BudgetProvider>
      <Dashboard />
    </BudgetProvider>
  );
}

