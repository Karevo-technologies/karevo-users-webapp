"use client";

import * as React from "react";

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  "aria-label"?: string;
};

export function Switch({
  checked,
  defaultChecked,
  disabled,
  onCheckedChange,
  "aria-label": ariaLabel,
}: SwitchProps) {
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isChecked = typeof checked === "boolean" ? checked : internal;

  return (
    <button
      type="button"
      role="switch"
      aria-label={ariaLabel}
      aria-checked={isChecked}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        const next = !isChecked;
        if (typeof checked !== "boolean") setInternal(next);
        onCheckedChange?.(next);
      }}
      className={
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 " +
        (isChecked
          ? "border-blue-600 bg-blue-600"
          : "border-border bg-paper/40") +
        (disabled ? " opacity-50 cursor-not-allowed" : " hover:bg-paper/60")
      }
    >
      <span
        className={
          "inline-block h-5 w-5 transform rounded-full shadow-sm transition-transform duration-200 " +
          (isChecked ? "translate-x-5 bg-white" : "translate-x-1 bg-ink")
        }
      />
    </button>
  );
}
