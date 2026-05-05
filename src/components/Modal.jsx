import { useState } from "react";
import { useBudget, CAT_LIST } from "../context/BudgetContext";

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:12 }}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function TxForm({ onClose }) {
  const { addTransaction } = useBudget();
  const [form, setForm] = useState({ type:"expense", date: new Date().toISOString().slice(0,10) });
  const set = (k, v) => setForm(f => ({ ...f, [k]:v }));

  const handleSave = () => {
    if (addTransaction(form)) onClose();
  };

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <Field label="Type">
          <select className="form-input" value={form.type||"expense"} onChange={e=>set("type",e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </Field>
        <Field label="Amount ($)">
          <input className="form-input" type="number" placeholder="0.00" min="0" step="0.01"
            value={form.amt||""} onChange={e=>set("amt",e.target.value)} />
        </Field>
      </div>
      <Field label="Description">
        <input className="form-input" placeholder="What was this for?" value={form.desc||""}
          onChange={e=>set("desc",e.target.value)} />
      </Field>
      {(form.type||"expense")==="expense" && (
        <Field label="Category">
          <select className="form-input" value={form.cat||"Food"} onChange={e=>set("cat",e.target.value)}>
            {CAT_LIST.map(c=><option key={c}>{c}</option>)}
          </select>
        </Field>
      )}
      <Field label="Date">
        <input className="form-input" type="date" value={form.date||""} onChange={e=>set("date",e.target.value)} />
      </Field>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <input id="rec" type="checkbox" checked={!!form.recurring} onChange={e=>set("recurring",e.target.checked)}
          style={{ accentColor:"var(--accent)", width:15, height:15 }} />
        <label htmlFor="rec" style={{ fontSize:13, color:"var(--text2)", cursor:"pointer" }}>Mark as recurring</label>
      </div>
      <ModalActions onClose={onClose} onSave={handleSave} />
    </>
  );
}

function BudgetForm({ onClose }) {
  const { setBudget } = useBudget();
  const [form, setForm] = useState({ cat:"Food" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <>
      <Field label="Category">
        <select className="form-input" value={form.cat||"Food"} onChange={e=>set("cat",e.target.value)}>
          {CAT_LIST.map(c=><option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Monthly limit ($)">
        <input className="form-input" type="number" placeholder="e.g. 500" min="1"
          value={form.limit||""} onChange={e=>set("limit",e.target.value)} />
      </Field>
      <ModalActions onClose={onClose} onSave={()=>{ if(setBudget(form.cat,form.limit)) onClose(); }} />
    </>
  );
}

function GoalForm({ onClose }) {
  const { addGoal } = useBudget();
  const [form, setForm] = useState({});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <>
      <Field label="Goal name">
        <input className="form-input" placeholder="e.g. Emergency fund" value={form.name||""} onChange={e=>set("name",e.target.value)} />
      </Field>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <Field label="Target amount ($)">
          <input className="form-input" type="number" placeholder="5000" min="1"
            value={form.target||""} onChange={e=>set("target",e.target.value)} />
        </Field>
        <Field label="Already saved ($)">
          <input className="form-input" type="number" placeholder="0" min="0"
            value={form.saved||""} onChange={e=>set("saved",e.target.value)} />
        </Field>
      </div>
      <ModalActions onClose={onClose} onSave={()=>{ if(addGoal(form)) onClose(); }} />
    </>
  );
}

function ModalActions({ onClose, onSave }) {
  return (
    <div style={{ display:"flex", gap:8, marginTop:4 }}>
      <button onClick={onClose} className="btn-ghost" style={{ flex:1 }}>Cancel</button>
      <button onClick={onSave} className="btn-primary" style={{ flex:1, justifyContent:"center" }}>Save</button>
    </div>
  );
}

const CONFIGS = {
  tx:     { title:"Add Transaction",  Form:TxForm },
  budget: { title:"Set Budget Limit", Form:BudgetForm },
  goal:   { title:"New Savings Goal", Form:GoalForm },
};

export default function Modal({ type, onClose }) {
  if (!type) return null;
  const { title, Form } = CONFIGS[type] || {};
  if (!Form) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed", inset:0,
        background:"rgba(8,12,20,.7)",
        backdropFilter:"blur(8px)",
        zIndex:50,
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:20,
      }}
    >
      <div style={{
        background:"var(--bg2)",
        border:"1px solid var(--border2)",
        borderRadius:"var(--radius)",
        padding:24, width:"100%", maxWidth:360,
        boxShadow:"0 24px 64px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04)",
        animation:"fadeUp .25s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{
          fontFamily:"'Space Grotesk',sans-serif",
          fontSize:17, fontWeight:700,
          color:"var(--text)", marginBottom:20,
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          {title}
          <button onClick={onClose} className="del-btn" style={{ fontSize:18 }}>×</button>
        </div>
        <Form onClose={onClose} />
      </div>
    </div>
  );
}