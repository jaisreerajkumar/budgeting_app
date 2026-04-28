const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function MonthNavigator({ curM, curY, changeMonth, onAdd }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <button onClick={() => changeMonth(-1)}>‹</button>
        <span>{MONTHS[curM]} {curY}</span>
        <button onClick={() => changeMonth(1)}>›</button>
      </div>

      <button onClick={onAdd}>+ Add Transaction</button>
    </div>
  );
}