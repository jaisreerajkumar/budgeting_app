export default function Header({ tabs, activeTab, setActiveTab, curM, curY }) {
  return <div>{tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>;
}