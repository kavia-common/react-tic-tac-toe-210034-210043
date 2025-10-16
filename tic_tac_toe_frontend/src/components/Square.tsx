import React from "react";
import { cx, theme } from "../theme";

export type SquareValue = "X" | "O" | "";

// PUBLIC_INTERFACE
export function Square({
  value,
  onClick,
  index,
  disabled,
  isWinning,
  ariaDescribedBy,
  refProp,
  // a11y enhancements
  tabIndexOverride,
  onKeyDownOverride,
}: {
  value: SquareValue;
  onClick: (index: number) => void;
  index: number;
  disabled?: boolean;
  isWinning?: boolean;
  ariaDescribedBy?: string;
  refProp?: React.Ref<HTMLButtonElement>;
  // Roving tabindex and keyboard handling (controlled by Board)
  tabIndexOverride?: number;
  onKeyDownOverride?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}) {
  /** Square button representing a single cell on the Tic Tac Toe board. */
  const label =
    value === ""
      ? `Place mark in cell ${index + 1}`
      : `Cell ${index + 1} contains ${value}${isWinning ? ", part of the winning line" : ""}`;

  const base = "square-btn";
  const classes = cx(
    base,
    value === "X" && "square-x",
    value === "O" && "square-o",
    disabled && "square-disabled",
    isWinning && "square-winning"
  );

  return (
    <button
      ref={refProp}
      type="button"
      className={classes}
      aria-label={label}
      aria-pressed={value !== ""}
      aria-describedby={ariaDescribedBy}
      onClick={() => onClick(index)}
      onKeyDown={onKeyDownOverride}
      tabIndex={typeof tabIndexOverride === "number" ? tabIndexOverride : 0}
      disabled={disabled}
    >
      <span className="sr-only">{label}</span>
      <span className="square-value" aria-hidden="true">
        {value}
      </span>
      {/* Non-color winning indicator: trophy icon emoji for additional cue */}
      {isWinning && (
        <span className="win-icon" aria-hidden="true" title="Winning cell">🏆</span>
      )}
      <style>{`
        .square-btn {
          position: relative;
          width: 96px;
          height: 96px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: ${theme.colors.surface};
          border: 2px solid rgba(0,0,0,0.06);
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
          /* stronger, higher-contrast focus ring using theme token */
          outline: ${theme.effects?.focusRing ?? "3px solid " + theme.colors.success};
          outline-offset: 3px;
          box-shadow: 0 0 0 3px rgba(6,182,212,0.25);
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
        .square-winning {
          border-color: ${theme.colors.winAccent ?? "#16a34a"};
          box-shadow: 0 0 0 3px rgba(22,163,74,0.15), ${theme.shadows?.lg ?? "0 12px 28px rgba(0,0,0,0.16)"};
        }
        .square-winning .square-value {
          text-shadow: 0 1px 0 rgba(0,0,0,0.08);
        }
        .win-icon {
          position: absolute;
          top: 6px;
          right: 8px;
          font-size: 0.9rem;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,0.25));
        }

        @media (max-width: 480px) {
          .square-btn {
            width: 80px;
            height: 80px;
            font-size: 1.75rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .square-btn {
            transition: none;
          }
          .square-btn:hover:not(:disabled) {
            transform: none;
            box-shadow: 0 10px 20px rgba(59,130,246,0.12);
          }
        }
      `}</style>
    </button>
  );
}

export default Square;
