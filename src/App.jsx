import { useState } from "react";
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
import { INIT_STATE } from "./constants/financeConstants";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [state] = useState(INIT_STATE);

  const tx = state.transactions["2026-3"] || [];

  const income = tx
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amt, 0);

  const expense = tx
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amt, 0);

  const balance = income - expense;

  const tabs = ["overview", "transactions", "budgets", "goals", "analytics"];

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "24px 16px",
        fontFamily: "system-ui, sans-serif",
        background: "#fafafa",
        minHeight: "100vh",
      }}
    >
      <Header
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <MonthNavigator />

      <MetricsCards
        income={income}
        expense={expense}
        balance={balance}
      />

      {activeTab === "overview" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginTop: 20,
            }}
          >
            <BudgetHealth budgets={state.budgets} />
            <SavingsGoals goals={state.goals} />
          </div>
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
    </div>
  );
}

