//
/*
===============================================================================
REQUIREMENT TRACEABILITY
===============================================================================
Requirement ID: REQ-TTT-002
User Story: As a compliance-conscious developer, I need a lightweight audit trail to log key user actions.
Acceptance Criteria:
 - Log actions with user, timestamp, action type, before/after state, and optional payload
 - Store an in-memory trail for the current session
 - Expose functions to add and retrieve entries
 - Include a stable sessionId for the session in all entries
 - Ensure ERROR entries include a message
 - Include unique id per entry, guarantee sessionId on all entries
 - Export RBAC and e-signature stubs
GxP Impact: NO - Demonstrative, frontend-only logging without persistence
Risk Level: LOW
Validation Protocol: N/A
===============================================================================
*/

export type AuditAction = "PLAY" | "RESET" | "UNDO" | "ERROR";

export interface AuditEntry<TState = unknown> {
  userId: string;
  action: AuditAction;
  timestamp: string; // ISO
  payload?: Record<string, unknown>;
  before?: TState;
  after?: TState;
  message?: string; // for error context or informational notes
  sessionId: string; // stable id for the session (guaranteed by logAction)
  id: string; // unique id for this entry
}

type PartialAuditEntry<TState> = Omit<AuditEntry<TState>, "sessionId" | "id">;

const trail: AuditEntry[] = [];

let memoSessionId: string | null = null;

/**
 * Generate a cryptographically-random v4 UUID-like string.
 * Fallbacks to Math.random if crypto is unavailable.
 */
function _uuidV4(): string {
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
  return `${b[0]}${b[1]}${b[2]}${b[3]}-${b[4]}${b[5]}-${b[6]}${b[7]}-${b[8]}${b[9]}-${b[10]}${b[11]}${b[12]}${b[13]}${b[14]}${b[15]}`;
}

// PUBLIC_INTERFACE
export function generateId(): string {
  /** This is a public function. Return a UUID-like identifier for audit entries and correlation. */
  return _uuidV4();
}

// PUBLIC_INTERFACE
export function getSessionId(): string {
  /** This is a public function. Return a memoized UUID-like id unique to this browser session. */
  if (memoSessionId) return memoSessionId;
  memoSessionId = _uuidV4();
  return memoSessionId;
}

// PUBLIC_INTERFACE
export function logAction<TState = unknown>(entry: PartialAuditEntry<TState>): AuditEntry<TState> {
  /**
   * This is a public function.
   * Log an action to console and keep in-memory record for the session.
   * Automatically adds sessionId and unique id to the entry.
   * Enforces ERROR entries to include a non-empty message.
   */
  if (entry.action === "ERROR" && (!entry.message || String(entry.message).trim() === "")) {
    throw new Error('Audit ERROR entries must include a "message".');
  }
  const finalized: AuditEntry<TState> = {
    ...entry,
    sessionId: getSessionId(),
    id: generateId(),
  } as AuditEntry<TState>;
  trail.push(finalized);
  // eslint-disable-next-line no-console
  console.info("[AUDIT]", finalized);
  return finalized;
}

// PUBLIC_INTERFACE
export function getAuditTrail(): AuditEntry[] {
  /** This is a public function. Retrieve the current in-memory audit trail (copy). */
  return [...trail];
}

// PUBLIC_INTERFACE
export function clearAuditTrail(): void {
  /** This is a public function. Clear the audit trail - useful for tests or resetting state. */
  trail.length = 0;
}

/**
 * PUBLIC_INTERFACE
 * RBAC stub for future role-based access control checks.
 * Returns true for all checks in this demo.
 */
export function hasPermission(_userId: string, _action: AuditAction): boolean {
  /** This is a public function. RBAC stub — always returns true in this demo. */
  return true;
}

/**
 * PUBLIC_INTERFACE
 * Electronic signature stub for critical operations.
 * No-op that returns a pseudo-signature reference in this demo.
 */
export async function captureESignature(_userId: string, _reason: string): Promise<{ signatureId: string }> {
  /** This is a public function. E-signature stub — returns a generated id without user interaction. */
  return { signatureId: generateId() };
}
