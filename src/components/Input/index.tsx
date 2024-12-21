import React, { forwardRef } from "react";
import { InputProps } from "../../models";
import "./index.css";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, value, onChange, type, placeholder, className }, ref) => {
    return (
      <div className="input-group">
        <label className="input-label">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input-group-input ${className}`}
          ref={ref}
        />
      </div>
    );
  }
);

export default Input;
