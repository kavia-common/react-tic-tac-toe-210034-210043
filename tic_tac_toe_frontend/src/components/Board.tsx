import React from "react";
import Square, { SquareValue } from "./Square";
import { cx, theme } from "../theme";

// PUBLIC_INTERFACE
export function Board({
  board,
  onPlay,
  disabled,
}: {
  board: SquareValue[];
  onPlay: (index: number) => void;
  disabled?: boolean;
}) {
  /** Board renders a 3x3 grid of Square components. */
  return (
    <div className={cx("board-container")}>
      <div className="grid" role="grid" aria-label="Tic Tac Toe board">
        {board.map((value, i) => (
          <div role="gridcell" key={i}>
            <Square value={value} index={i} onClick={onPlay} disabled={disabled} />
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
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        @media (max-width: 480px) {
          .board-container {
            padding: 12px;
          }
          .grid {
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default Board;
