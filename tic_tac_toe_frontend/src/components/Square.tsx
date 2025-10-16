import React from "react";
import { cx, theme } from "../theme";

export type SquareValue = "X" | "O" | "";

// PUBLIC_INTERFACE
export function Square({
  value,
  onClick,
  index,
  disabled,
}: {
  value: SquareValue;
  onClick: (index: number) => void;
  index: number;
  disabled?: boolean;
}) {
  /** Square button representing a single cell on the Tic Tac Toe board. */
  const label =
    value === ""
      ? `Place mark in cell ${index + 1}`
      : `Cell ${index + 1} contains ${value}`;

  const base =
    "square-btn";
  const classes = cx(
    base,
    value === "X" && "square-x",
    value === "O" && "square-o",
    disabled && "square-disabled"
  );

  return (
    <button
      type="button"
      className={classes}
      aria-label={label}
      aria-pressed={value !== ""}
      onClick={() => onClick(index)}
      disabled={disabled}
    >
      <span className="sr-only">{label}</span>
      <span className="square-value" aria-hidden="true">
        {value}
      </span>
      <style>{`
        .square-btn {
          width: 96px;
          height: 96px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: ${theme.colors.surface};
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          color: ${theme.colors.text};
          font-weight: 700;
          font-size: 2rem;
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease;
        }
        .square-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(59,130,246,0.18);
          border-color: ${theme.colors.primary};
        }
        .square-btn:focus-visible {
          outline: 3px solid ${theme.colors.primary};
          outline-offset: 2px;
        }
        .square-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .square-x {
          color: ${theme.colors.primary};
        }
        .square-o {
          color: #f59e0b; /* amber accent */
        }
        .square-value {
          line-height: 1;
        }

        @media (max-width: 480px) {
          .square-btn {
            width: 80px;
            height: 80px;
            font-size: 1.75rem;
          }
        }
      `}</style>
    </button>
  );
}

export default Square;
