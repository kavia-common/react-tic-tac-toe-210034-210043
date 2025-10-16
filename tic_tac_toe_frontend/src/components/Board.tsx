import React, { useCallback, useMemo, useRef, useState } from "react";
import Square, { SquareValue } from "./Square";
import { cx, theme } from "../theme";

// PUBLIC_INTERFACE
export function Board({
  board,
  onPlay,
  disabled,
  winningLine,
  firstSquareRef,
}: {
  board: SquareValue[];
  onPlay: (index: number) => void;
  disabled?: boolean;
  winningLine?: number[] | null;
  firstSquareRef?: React.Ref<HTMLButtonElement>;
}) {
  /** Board renders a 3x3 grid of Square components with ARIA grid and keyboard navigation. */
  const winSet = new Set(winningLine || []);
  const hasWin = (winningLine && winningLine.length === 3) || false;

  // Roving tabindex: track focused cell index
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  // refs for all 9 squares to move focus programmatically
  const squareRefs = useRef<Array<HTMLButtonElement | null>>([]);
  if (squareRefs.current.length !== 9) {
    squareRefs.current = Array(9).fill(null);
  }

  // clamp focus to first enabled index if current is disabled due to game over (we still keep focus position but will not move into disabled squares)
  const isCellDisabled = useCallback(
    (idx: number) => !!disabled,
    [disabled]
  );

  const handleCellKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (disabled) {
        return;
      }
      const col = index % 3;
      const row = Math.floor(index / 3);

      let nextIndex = index;
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          nextIndex = row * 3 + ((col + 1) % 3);
          break;
        case "ArrowLeft":
          e.preventDefault();
          nextIndex = row * 3 + ((col + 2) % 3);
          break;
        case "ArrowDown":
          e.preventDefault();
          nextIndex = ((row + 1) % 3) * 3 + col;
          break;
        case "ArrowUp":
          e.preventDefault();
          nextIndex = ((row + 2) % 3) * 3 + col;
          break;
        case "Home":
          e.preventDefault();
          // Move to start of current row
          nextIndex = row * 3 + 0;
          break;
        case "End":
          e.preventDefault();
          // Move to end of current row
          nextIndex = row * 3 + 2;
          break;
        case "Enter":
        case " ":
          // Activate (play move) using Enter or Space
          e.preventDefault();
          onPlay(index);
          return;
        default:
          return;
      }

      // Respect disabled state: do not attempt to focus if board disabled. If not disabled, move focus.
      if (!isCellDisabled(nextIndex)) {
        setFocusedIndex(nextIndex);
        requestAnimationFrame(() => {
          squareRefs.current[nextIndex]?.focus();
        });
      }
    },
    [disabled, isCellDisabled, onPlay]
  );

  const gridProps = useMemo(
    () => ({
      role: "grid" as const,
      "aria-label": "Tic Tac Toe board",
      "aria-rowcount": 3,
      "aria-colcount": 3,
    }),
    []
  );

  return (
    <div className={cx("board-container")}>
      <div className="grid" {...gridProps}>
        {/* Offscreen description for winning line association */}
        {hasWin && (
          <p id="winning-line-desc" className="sr-only">
            Winning line highlighted on cells {String(winningLine!.map((n) => n + 1).join(", "))}
          </p>
        )}
        {[0, 1, 2].map((r) => (
          <div role="row" aria-rowindex={r + 1} key={`row-${r}`} className="row">
            {[0, 1, 2].map((c) => {
              const i = r * 3 + c;
              const value = board[i];
              const isWinning = hasWin && winSet.has(i);
              const describedBy = isWinning ? "winning-line-desc" : undefined;

              const tabIndex = i === focusedIndex ? 0 : -1;

              return (
                <div
                  role="gridcell"
                  aria-colindex={c + 1}
                  aria-selected={value !== ""}
                  key={i}
                  className="cell"
                >
                  <Square
                    // wire up ref for programmatic focus
                    refProp={(el) => {
                      squareRefs.current[i] = el;
                      // Also pass through the external firstSquareRef for i=0
                      if (i === 0 && typeof firstSquareRef === "function") {
                        firstSquareRef(el);
                      } else if (i === 0 && firstSquareRef && "current" in (firstSquareRef as any)) {
                        (firstSquareRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
                      }
                    }}
                    value={value}
                    index={i}
                    onClick={onPlay}
                    disabled={disabled}
                    isWinning={isWinning}
                    ariaDescribedBy={describedBy}
                    // Roving tabindex and keyboard navigation
                    tabIndexOverride={tabIndex}
                    onKeyDownOverride={(e) => handleCellKeyDown(e, i)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <style>{`
        .board-container {
          background: ${theme.colors.surface};
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px;
          padding: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }
        .grid {
          display: grid;
          grid-template-rows: repeat(3, auto);
          gap: 12px;
        }
        .row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .cell {
          /* container for gridcell role; visual gaps handled by .row */
        }
        @media (max-width: 480px) {
          .board-container {
            padding: 12px;
          }
          .grid {
            gap: 10px;
          }
          .row {
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default Board;
