import React from "react";
import block from "bem-cn-lite";

import "./Switch.scss";

const b = block("switch");

type Props = {
  checked: boolean;
  label?: string;
  disabled?: boolean;
  reversed?: boolean;
  fullWidth?: boolean;
  onChange?(value: boolean): void;
};

function Switch({
  checked,
  onChange,
  disabled = false,
  reversed,
  fullWidth,
  label
}: Props) {
  return (
    <label className={b({ reversed, "full-width": fullWidth })}>
      <input
        className={b("checkbox")}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <div className={b("switch")} />
      {label && <span className={b("label")}>{label}</span>}
    </label>
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange && onChange(e.target.checked);
  }
}

export { Switch };
