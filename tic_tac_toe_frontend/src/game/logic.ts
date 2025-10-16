//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-004
// User Story: As a player, I want to play Tic Tac Toe with correct rules and reliable state updates.
// Acceptance Criteria:
//  - Provide createEmptyBoard, calculateWinner, isDraw, makeMove, getNextPlayer
//  - Validate inputs and ensure immutability
//  - Provide GameState type
// GxP Impact: NO - Frontend-only game logic
// Risk Level: LOW
// Validation Protocol: Unit tests in src/__tests__/logic.test.ts
// ============================================================================
//
// ============================================================================
/* IMPORTS AND DEPENDENCIES */
// ============================================================================

import { assertCellEmpty, assertValidIndex, assertValidPlayer, Player } from "../utils/validators";

// ============================================================================
// FEATURE IMPLEMENTATION
// ============================================================================

export type Board = string[]; // 9 cells, "" | "X" | "O"

// PUBLIC_INTERFACE
export function createEmptyBoard(): Board {
  /** Create an empty 3x3 board as a flat array of 9 empty strings. */
  return Array.from({ length: 9 }, () => "");
}

// PUBLIC_INTERFACE
export function calculateWinner(board: Board): Player | null {
  /**
   * Determine the winner of the current board.
   * GxP Critical: No
   * Parameters:
   *  - board: Board (length 9)
   * Returns:
   *  - "X" | "O" if a winner exists; otherwise null
   */
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a] as Player;
    }
  }
  return null;
}

// PUBLIC_INTERFACE
export function isDraw(board: Board): boolean {
  /** True if all cells are filled and there is no winner. */
  return board.every((c) => c !== "") && calculateWinner(board) === null;
}

// PUBLIC_INTERFACE
export function makeMove(board: Board, index: number, player: Player): Board {
  /**
   * Place the player's mark at the specified index and return a new board.
   * Validates index bounds, cell emptiness, and player value.
   * Throws Error on invalid operations.
   * Immutable: does not mutate input board.
   */
  assertValidIndex(index);
  assertValidPlayer(player);
  const current = board[index];
  assertCellEmpty(current, index);

  const newBoard = board.slice();
  newBoard[index] = player;
  return newBoard;
}

// PUBLIC_INTERFACE
export function getNextPlayer(history: number[]): Player {
  /**
   * Determine next player from move history length.
   * Even length -> "X", Odd length -> "O"
   */
  return history.length % 2 === 0 ? "X" : "O";
}

export type GameState = {
  board: Board;
  history: number[]; // indices placed in order
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
};
