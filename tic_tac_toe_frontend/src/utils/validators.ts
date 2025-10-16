//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-003
// User Story: As a developer, I need reusable validators to ensure data integrity.
// Acceptance Criteria:
//  - Validate board indices and players
//  - Throw descriptive errors on invalid inputs
// GxP Impact: NO - Frontend-only validation helpers
// Risk Level: LOW
// Validation Protocol: N/A
// ============================================================================

export type Player = "X" | "O";

/**
 * PUBLIC_INTERFACE
 * Validate that the board index is an integer in [0,8].
 * ALCOA+ support: Accurate, Complete, Consistent — ensures data integrity at entry points.
 */
export function assertValidIndex(index: number): void {
  if (!Number.isInteger(index) || index < 0 || index > 8) {
    throw new Error(`Invalid index ${index}. Must be an integer in [0, 8].`);
  }
}

/**
 * PUBLIC_INTERFACE
 * Validate that the player is "X" or "O".
 * ALCOA+ support: Accurate and Consistent — guards against invalid identities.
 */
export function assertValidPlayer(player: string): asserts player is Player {
  if (player !== "X" && player !== "O") {
    throw new Error(`Invalid player "${player}". Must be "X" or "O".`);
  }
}

/**
 * PUBLIC_INTERFACE
 * Validate that the cell at index is empty before placing a move.
 * ALCOA+ support: Accurate and Complete — prevents overwriting existing data.
 */
export function assertCellEmpty(value: string, index: number): void {
  if (value !== "") {
    throw new Error(`Cell at index ${index} is already occupied.`);
  }
}
