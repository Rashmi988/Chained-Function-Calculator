export const VALID_EQUATION_REGEX = /^[0-9x+\-*/^()\s]+$/;

export const DEFAULT_STATE = [
  { id: "1", equation: "x^2", nextFunctionId: "2" },
  { id: "2", equation: "2*x+4", nextFunctionId: "4" },
  { id: "3", equation: "x-2", nextFunctionId: null },
  { id: "4", equation: "x/2", nextFunctionId: "5" },
  { id: "5", equation: "x^2+20", nextFunctionId: "3" },
];

export const DROPDOWN_OPTIONS = [...DEFAULT_STATE, { id: "-1" }].map((n) => ({
  value: n.id,
  label: n.id !== "-1" ? `Function ${n.id}` : "None",
}));

export const cardRefsDefault = DEFAULT_STATE.map(() => ({
  inputLabel: null,
  outputLabel: null,
}));