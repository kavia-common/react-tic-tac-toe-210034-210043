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
//  - Include a stable sessionId for the session in all entries
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
  sessionId?: string; // auto-populated stable id for the session
}

const trail: AuditEntry[] = [];

let memoSessionId: string | null = null;

// PUBLIC_INTERFACE
export function getSessionId(): string {
  /** Return a memoized UUID-like id unique to this browser session. */
  if (memoSessionId) return memoSessionId;
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  let bytes: Uint8Array | null = null;
  try {
    if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
      bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
    }
  } catch {
    // ignore
  }
  if (!bytes) {
    bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  // RFC4122 v4-like
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const b = Array.from(bytes).map(hex);
  memoSessionId = `${b[0]}${b[1]}${b[2]}${b[3]}-${b[4]}${b[5]}-${b[6]}${b[7]}-${b[8]}${b[9]}-${b[10]}${b[11]}${b[12]}${b[13]}${b[14]}${b[15]}`;
  return memoSessionId;
}

// PUBLIC_INTERFACE
export function logAction<TState = unknown>(entry: AuditEntry<TState>): void {
  /**
   * Log an action to console and keep in-memory record for the session.
   * Maintains the existing API for callers, automatically adds sessionId.
   */
  const withSession: AuditEntry<TState> = { ...entry, sessionId: getSessionId() };
  trail.push(withSession);
  // eslint-disable-next-line no-console
  console.info("[AUDIT]", withSession);
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
