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

export function assertValidIndex(index: number): void {
  if (!Number.isInteger(index) || index < 0 || index > 8) {
    throw new Error(`Invalid index ${index}. Must be an integer in [0, 8].`);
  }
}

export function assertValidPlayer(player: string): asserts player is Player {
  if (player !== "X" && player !== "O") {
    throw new Error(`Invalid player "${player}". Must be "X" or "O".`);
  }
}

export function assertCellEmpty(value: string, index: number): void {
  if (value !== "") {
    throw new Error(`Cell at index ${index} is already occupied.`);
  }
}
