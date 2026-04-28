export const INIT_STATE = {
  transactions: {
    "2026-3": [
      { id: 1, type: "income", desc: "Salary", amt: 5000 },
      { id: 2, type: "expense", desc: "Rent", amt: 1400 },
      { id: 3, type: "expense", desc: "Groceries", amt: 250 }
    ]
  },
  budgets: {
    Food: 400,
    Housing: 1500,
    Transport: 200
  },
  goals: [
    { id: 1, name: "Emergency Fund", target: 10000, saved: 4200 }
  ]
};
