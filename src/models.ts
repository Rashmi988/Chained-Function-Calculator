export interface DropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  disabled?: boolean;
}

export interface FunctionNode {
  id: string;
  equation: string;
  nextFunctionId: string | null;
}

export interface InputProps {
  label: string;
  value: number | string;
  type: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
