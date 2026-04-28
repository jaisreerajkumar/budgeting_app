import { useState, useRef } from "react";
import Header from "./components/Header";
import MonthNavigator from "./components/MonthNavigator";
import MetricsCards from "./components/MetricsCards";
import BudgetHealth from "./components/Overview/BudgetHealth";
import SavingsGoals from "./components/Overview/SavingsGoals";
import AlertsInsights from "./components/Overview/AlertsInsights";
import TransactionsTable from "./components/Transactions/TransactionsTable";
import BudgetsList from "./components/Budgets/BudgetsList";
import GoalsList from "./components/Goals/GoalsList";
import AnalyticsCards from "./components/Analytics/AnalyticsCards";
import SpendingByCategory from "./components/Analytics/SpendingByCategory";
import FinanceModal from "./components/Modal/FinanceModal";
import { INIT_STATE } from "./constants/financeConstants";

export default function App() {
  const now = new Date();
  const [curY] = useState(now.getFullYear());
  const [curM] = useState(now.getMonth());
  const [activeTab, setActiveTab] = useState("overview");
  const [state, setState] = useState(INIT_STATE);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const nextId = useRef(100);

  const tabs = ["overview", "transactions", "budgets", "goals", "analytics"];

  const tx = state.transactions["2026-3"] || [];
  const income = tx.filter((t) => t.type === "income").reduce((a, b) => a + b.amt, 0);
  const expense = tx.filter((t) => t.type === "expense").reduce((a, b) => a + b.amt, 0);
  const balance = income - expense;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Header
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        curM={curM}
        curY={curY}
      />

      <MonthNavigator onAdd={() => setModal("tx")} />

      <MetricsCards
        income={income}
        expense={expense}
        balance={balance}
      />

      {activeTab === "overview" && (
        <>
          <BudgetHealth budgets={state.budgets} />
          <SavingsGoals goals={state.goals} />
          <AlertsInsights />
        </>
      )}

      {activeTab === "transactions" && (
        <TransactionsTable transactions={tx} />
      )}

      {activeTab === "budgets" && (
        <BudgetsList budgets={state.budgets} />
      )}

      {activeTab === "goals" && (
        <GoalsList goals={state.goals} />
      )}

      {activeTab === "analytics" && (
        <>
          <AnalyticsCards />
          <SpendingByCategory transactions={tx} />
        </>
      )}

      {modal && (
        <FinanceModal
          modal={modal}
          form={form}
          setForm={setForm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

