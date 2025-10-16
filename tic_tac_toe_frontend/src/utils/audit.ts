//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-002
// User Story: As a compliance-conscious developer, I need a lightweight audit trail to log key user actions.
// Acceptance Criteria:
//  - Log actions with user, timestamp, action type, before/after state, and optional payload
//  - Store an in-memory trail for the current session
//  - Expose functions to add and retrieve entries
// GxP Impact: NO - Demonstrative, frontend-only logging without persistence
// Risk Level: LOW
// Validation Protocol: N/A
// ============================================================================

export type AuditAction = "PLAY" | "RESET" | "UNDO" | "ERROR";

export interface AuditEntry<TState = unknown> {
  userId: string;
  action: AuditAction;
  timestamp: string; // ISO
  payload?: Record<string, unknown>;
  before?: TState;
  after?: TState;
  message?: string; // for error context or informational notes
}

const trail: AuditEntry[] = [];

// PUBLIC_INTERFACE
export function logAction<TState = unknown>(entry: AuditEntry<TState>): void {
  /** Log an action to console and keep in-memory record for the session. */
  trail.push(entry);
  // Console log in a structured way for easy inspection
  // eslint-disable-next-line no-console
  console.info("[AUDIT]", entry);
}

// PUBLIC_INTERFACE
export function getAuditTrail(): AuditEntry[] {
  /** Retrieve the current in-memory audit trail. */
  return [...trail];
}

// PUBLIC_INTERFACE
export function clearAuditTrail(): void {
  /** Clear the audit trail - useful for tests or resetting state. */
  trail.length = 0;
}
