import { DropdownProps } from "../../models";
import "./index.css";

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  disabled,
}) => {
  return (
    <div className="dropdown-group">
      <label className="dropdown-label">{label}</label>
      <select value={value} disabled={disabled} className="dropdown">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
