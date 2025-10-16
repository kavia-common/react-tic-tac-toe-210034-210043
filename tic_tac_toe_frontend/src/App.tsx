import React, { useMemo, useRef, useEffect, useState } from "react";
import { theme, cx } from "./theme";
import Board from "./components/Board";
import { createEmptyBoard, calculateWinner, getNextPlayer, isDraw, makeMove, GameState, getWinningLine } from "./game/logic";
import { logAction } from "./utils/audit";

//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-005
// User Story: As two local players, we want to play Tic Tac Toe with move history, undo, and reset, in a modern themed UI.
// Acceptance Criteria:
//  - Display game status: current player, winner, draw, move count
//  - Allow playing by clicking a square
//  - Prevent moves after game end
//  - Undo last move and reset game
//  - Toggle move history visibility
//  - Audit trail logs for PLAY, UNDO, RESET, and ERROR with timestamp and before/after state
// GxP Impact: NO - Frontend demo with lightweight logs, no persistence
// Risk Level: LOW
// Validation Protocol: Unit tests for logic in src/__tests__/logic.test.ts
// ============================================================================

type Toast = { type: "error" | "info"; message: string } | null;

function useGame(): {
  state: GameState;
  handlePlay: (index: number) => void;
  handleReset: () => void;
  handleUndo: () => void;
} {
  const [board, setBoard] = useState(createEmptyBoard());
  const [history, setHistory] = useState<number[]>([]);

  const currentPlayer = useMemo(() => getNextPlayer(history), [history]);
  const winner = useMemo(() => calculateWinner(board), [board]);
  const draw = useMemo(() => isDraw(board), [board]);

  const state: GameState = {
    board,
    history,
    currentPlayer,
    winner,
    isDraw: draw,
  };

  // PUBLIC_INTERFACE
  const handlePlay = (index: number) => {
    if (winner || draw) {
      const message = "Game over. Start a new game to continue.";
      logAction({
        userId: currentPlayer,
        action: "ERROR",
        timestamp: new Date().toISOString(),
        message,
        before: state,
        after: state,
        payload: { index },
      });
      throw new Error(message);
    }

    const before = state;
    const afterBoard = makeMove(board, index, currentPlayer);
    const afterHistory = [...history, index];

    setBoard(afterBoard);
    setHistory(afterHistory);

    logAction({
      userId: currentPlayer,
      action: "PLAY",
      timestamp: new Date().toISOString(),
      payload: { index },
      before,
      after: {
        board: afterBoard,
        history: afterHistory,
        currentPlayer: getNextPlayer(afterHistory),
        winner: calculateWinner(afterBoard),
        isDraw: isDraw(afterBoard),
      },
    });
  };

  // PUBLIC_INTERFACE
  const handleReset = (reason?: string) => {
    const before = state;
    const afterBoard = createEmptyBoard();
    const afterHistory: number[] = [];
    setBoard(afterBoard);
    setHistory(afterHistory);

    logAction({
      userId: currentPlayer,
      action: "RESET",
      timestamp: new Date().toISOString(),
      payload: reason ? { reason } : undefined,
      before,
      after: {
        board: afterBoard,
        history: afterHistory,
        currentPlayer: "X",
        winner: null,
        isDraw: false,
      },
    });
  };

  // PUBLIC_INTERFACE
  const handleUndo = () => {
    if (history.length === 0) {
      const message = "No moves to undo.";
      logAction({
        userId: currentPlayer,
        action: "ERROR",
        timestamp: new Date().toISOString(),
        message,
        before: state,
        after: state,
      });
      throw new Error(message);
    }
    const before = state;
    const lastIndex = history[history.length - 1];
    const newBoard = board.slice();
    newBoard[lastIndex] = "";
    const newHistory = history.slice(0, -1);
    setBoard(newBoard);
    setHistory(newHistory);

    logAction({
      userId: getNextPlayer(history), // the one who placed last
      action: "UNDO",
      timestamp: new Date().toISOString(),
      payload: { undoneIndex: lastIndex },
      before,
      after: {
        board: newBoard,
        history: newHistory,
        currentPlayer: getNextPlayer(newHistory),
        winner: calculateWinner(newBoard),
        isDraw: isDraw(newBoard),
      },
    });
  };

  return { state, handlePlay, handleReset, handleUndo };
}

function StatusBar({
  player,
  winner,
  draw,
  moveCount,
}: {
  player: "X" | "O";
  winner: "X" | "O" | null;
  draw: boolean;
  moveCount: number;
}) {
  const msg = winner
    ? `Winner: ${winner}`
    : draw
    ? "Draw"
    : `Current Player: ${player}`;

  const color = winner
    ? theme.colors.success
    : draw
    ? theme.colors.secondary
    : theme.colors.primary;

  return (
    <div className="status-wrap" aria-live="polite">
      <div className="status" style={{ color }}>
        {msg}
      </div>
      <div className="sub">
        Moves: <strong>{moveCount}</strong>
      </div>
      <style>{`
        .status-wrap {
          text-align: center;
          margin-bottom: 16px;
        }
        .status {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 4px;
          transition: color 160ms ease;
        }
        .sub {
          color: ${theme.colors.secondary};
          font-size: 0.95rem;
        }
        @media (prefers-reduced-motion: reduce) {
          .status {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

function Controls({
  onReset,
  onUndo,
  canUndo,
  onToggleHistory,
  historyVisible,
  newGameRef,
}: {
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onToggleHistory: () => void;
  historyVisible: boolean;
  newGameRef?: React.Ref<HTMLButtonElement>;
}) {
  const baseBtn = "ctrl-btn";
  return (
    <div className="controls">
      <button ref={newGameRef} className={baseBtn} onClick={onReset} aria-label="Start a new game">
        New Game
      </button>
      <button
        className={cx(baseBtn, !canUndo && "btn-disabled")}
        onClick={onUndo}
        aria-label="Undo last move"
        disabled={!canUndo}
      >
        Undo
      </button>
      <button
        className={baseBtn}
        onClick={onToggleHistory}
        aria-label="Toggle move history"
        aria-pressed={historyVisible}
      >
        {historyVisible ? "Hide History" : "Show History"}
      </button>
      <style>{`
        .controls {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        .ctrl-btn {
          background: linear-gradient(180deg, ${theme.colors.primary} 0%, #2563eb 100%);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
          box-shadow: 0 8px 20px rgba(59,130,246,0.25);
        }
        .ctrl-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(59,130,246,0.35);
        }
        .ctrl-btn:focus-visible {
          outline: ${theme.effects?.focusRing ?? "3px solid " + theme.colors.success};
          outline-offset: 3px;
          box-shadow: 0 0 0 3px rgba(6,182,212,0.25);
        }
        .btn-disabled, .ctrl-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .ctrl-btn {
            transition: none;
          }
          .ctrl-btn:hover {
            transform: none;
            box-shadow: 0 10px 20px rgba(59,130,246,0.2);
          }
        }
      `}</style>
    </div>
  );
}

function HistoryList({ history }: { history: number[] }) {
  return (
    <div className="history">
      <div className="title">Move History</div>
      {history.length === 0 ? (
        <div className="empty">No moves yet.</div>
      ) : (
        <ol>
          {history.map((h, i) => (
            <li key={`${h}-${i}`}>#{i + 1}: Cell {h + 1}</li>
          ))}
        </ol>
      )}
      <style>{`
        .history {
          margin-top: 12px;
          background: ${theme.colors.surface};
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          padding: 12px;
        }
        .history .title {
          font-weight: 700;
          margin-bottom: 8px;
          color: ${theme.colors.text};
        }
        .history .empty {
          color: ${theme.colors.secondary};
        }
        .history ol {
          margin: 0;
          padding-left: 20px;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const { state, handlePlay, handleReset, handleUndo } = useGame();
  const [historyVisible, setHistoryVisible] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const statusRef = useRef<HTMLDivElement | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const historyTitleRef = useRef<HTMLDivElement | null>(null);
  const newGameBtnRef = useRef<HTMLButtonElement | null>(null);
  const firstSquareRef = useRef<HTMLButtonElement | null>(null);

  const winningLine = useMemo(() => getWinningLine(state.board), [state.board]);
  const gameOver = !!state.winner || state.isDraw;

  const tryAction = (fn: () => void) => {
    try {
      fn();
      setToast(null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "An unexpected error occurred.";
      setToast({ type: "error", message });
      // move focus to toast region
      requestAnimationFrame(() => {
        toastRef.current?.focus();
      });
    }
  };

  // First-run hint banner (session)
  const [showHint, setShowHint] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("ttt_hint_dismissed") !== "1";
    } catch {
      return true;
    }
  });
  const dismissHint = () => {
    setShowHint(false);
    try {
      sessionStorage.setItem("ttt_hint_dismissed", "1");
    } catch {
      // ignore if not available
    }
  };

  // Move focus to status when game ends
  useEffect(() => {
    if (gameOver) {
      requestAnimationFrame(() => {
        statusRef.current?.focus();
      });
    }
  }, [gameOver]);

  // Focus management on history toggle
  useEffect(() => {
    if (historyVisible) {
      requestAnimationFrame(() => {
        historyTitleRef.current?.focus();
      });
    }
  }, [historyVisible]);

  const onResetWrapped = () =>
    tryAction(() => {
      // Optional reason hook; not prompting UI by default to keep UX simple,
      // but we support passing a reason if available (e.g., from future dialog).
      let reason: string | undefined = undefined;
      // Example stub: capture reason from a stored value (no-op by default)
      try {
        // reserved for potential future integration (e.g., sessionStorage flag)
        const planned = undefined as unknown as string | undefined;
        reason = planned && String(planned).trim() ? String(planned) : undefined;
      } catch (e) {
        // If future capture fails, record an ERROR with message (state unchanged)
        const message = "Failed to capture reset reason.";
        logAction({
          userId: state.currentPlayer,
          action: "ERROR",
          timestamp: new Date().toISOString(),
          message,
          before: state,
          after: state,
        });
      }

      handleReset(reason);
      // After reset, focus New Game button, else first square as fallback
      setTimeout(() => {
        if (!newGameBtnRef.current) {
          firstSquareRef.current?.focus();
        } else {
          newGameBtnRef.current.focus();
        }
      }, 0);
    });

  return (
    <div className="app-root">
      <main className="container">
        <header className="top">
          <h1 className="title">Tic Tac Toe</h1>
          <p className="subtitle">Local two-player • Ocean Professional</p>
        </header>

        {showHint && (
          <div className="hint" role="note" aria-live="polite">
            <div className="hint-content">
              Tip: Use keyboard to navigate squares and press Enter/Space to play. You can Undo or start a New Game anytime.
            </div>
            <button className="hint-dismiss" onClick={dismissHint} aria-label="Dismiss hint">
              Dismiss
            </button>
          </div>
        )}

        <div
          className="status-wrap"
          ref={statusRef}
          tabIndex={-1}
          aria-live="polite"
          aria-atomic="true"
          style={{ outline: "none" }}
        >
          <StatusBar
            player={state.currentPlayer}
            winner={state.winner}
            draw={state.isDraw}
            moveCount={state.history.length}
          />
        </div>

        <div className="board-wrap">
          <Board
            board={state.board}
            onPlay={(i) => tryAction(() => handlePlay(i))}
            disabled={gameOver}
            winningLine={winningLine}
            firstSquareRef={firstSquareRef}
          />
        </div>

        {toast && (
          <div
            ref={toastRef}
            role="alert"
            tabIndex={-1}
            className={cx("toast", toast.type === "error" && "toast-error")}
          >
            {toast.message}
          </div>
        )}

        <Controls
          onReset={onResetWrapped}
          onUndo={() => tryAction(handleUndo)}
          canUndo={state.history.length > 0}
          onToggleHistory={() => setHistoryVisible((v) => !v)}
          historyVisible={historyVisible}
          newGameRef={newGameBtnRef}
        />

        {historyVisible && (
          <div className="history" aria-live="polite">
            <div
              className="history-title"
              ref={historyTitleRef}
              tabIndex={-1}
              style={{ outline: "none", fontWeight: 700, marginTop: 12, marginBottom: 8 }}
            >
              Move History
            </div>
            <HistoryList history={state.history} />
          </div>
        )}
      </main>

      <style>{`
        .app-root {
          min-height: 100vh;
          background: linear-gradient(180deg, rgba(59,130,246,0.08) 0%, ${theme.colors.background} 100%);
          color: ${theme.colors.text};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .container {
          width: 100%;
          max-width: 480px;
        }
        .top {
          text-align: center;
          margin-bottom: 16px;
        }
        .title {
          margin: 0;
          font-size: 1.75rem;
          letter-spacing: 0.2px;
        }
        .subtitle {
          color: ${theme.colors.secondary};
          margin-top: 4px;
          margin-bottom: 0;
        }
        .hint {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          background: #ecfeff;
          color: #0e7490;
          border: 1px solid #a5f3fc;
          padding: 10px 12px;
          border-radius: 10px;
          margin: 8px 0 12px;
        }
        .hint .hint-dismiss {
          background: transparent;
          border: 1px solid #67e8f9;
          color: #0e7490;
          border-radius: 8px;
          padding: 6px 10px;
          cursor: pointer;
        }
        .hint .hint-dismiss:hover {
          background: #cffafe;
        }
        .board-wrap {
          display: flex;
          justify-content: center;
          margin: 12px 0;
        }
        .toast {
          margin: 12px auto 0;
          max-width: 480px;
          background: #fff7ed;
          color: #7c2d12;
          border: 1px solid #fed7aa;
          padding: 10px 12px;
          border-radius: 10px;
        }
        .toast-error {
          background: #fef2f2;
          color: ${theme.colors.error};
          border-color: #fecaca;
        }

        @media (max-width: 480px) {
          .container {
            max-width: 360px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hint, .toast {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
