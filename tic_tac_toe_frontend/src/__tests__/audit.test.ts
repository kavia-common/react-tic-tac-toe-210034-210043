import { clearAuditTrail, getAuditTrail, getSessionId, logAction } from "../utils/audit";

describe("audit", () => {
  const originalInfo = console.info;
  let infoSpy: jest.SpyInstance;

  beforeEach(() => {
    clearAuditTrail();
    infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    infoSpy.mockRestore();
    console.info = originalInfo;
  });

  test("getSessionId is stable within session and looks uuid-like", () => {
    const a = getSessionId();
    const b = getSessionId();
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  test("logAction adds entry with sessionId, unique id and payload", () => {
    const before = { x: 1 };
    const after = { x: 2 };
    const saved = logAction({
      userId: "X",
      action: "PLAY",
      timestamp: new Date().toISOString(),
      before,
      after,
      payload: { index: 3 },
    });
    const trail = getAuditTrail();
    expect(trail).toHaveLength(1);
    const entry = trail[0];
    // id and sessionId presence
    expect(entry.sessionId).toBeDefined();
    expect(entry.id).toBeDefined();
    expect(entry.id).toMatch(/^[0-9a-f-]{36}$/i);
    // fields integrity
    expect(entry.userId).toBe("X");
    expect(entry.action).toBe("PLAY");
    expect(entry.before).toEqual(before);
    expect(entry.after).toEqual(after);
    expect(entry.payload).toEqual({ index: 3 });
    // return value is the finalized entry
    expect(saved).toEqual(entry);
    expect(infoSpy).toHaveBeenCalledWith("[AUDIT]", expect.objectContaining({ action: "PLAY" }));
  });

  test("ERROR action requires a message (throws) and leaves state unchanged when properly provided", () => {
    const state = { foo: "bar" };
    // Enforcement: missing message should throw
    expect(() =>
      // @ts-expect-error intentional
      logAction({
        userId: "O",
        action: "ERROR",
        timestamp: new Date().toISOString(),
        before: state,
        after: state,
      })
    ).toThrow(/must include a "message"/i);

    // Proper ERROR with message
    logAction({
      userId: "O",
      action: "ERROR",
      timestamp: new Date().toISOString(),
      message: "No moves to undo.",
      before: state,
      after: state,
    });
    const [entry] = getAuditTrail();
    expect(entry.message).toMatch(/no moves/i);
    expect(entry.before).toEqual(state);
    expect(entry.after).toEqual(state);
    expect(entry.id).toBeTruthy();
    expect(entry.sessionId).toBeTruthy();
  });

  test("Snapshots: PLAY then UNDO then RESET include before/after states; RESET can include a reason", () => {
    const s0 = { board: Array(9).fill(""), history: [], currentPlayer: "X", winner: null, isDraw: false };
    const s1 = { ...s0, board: ["X", "", "", "", "", "", "", "", ""], history: [0], currentPlayer: "O" };
    // PLAY
    logAction({
      userId: "X",
      action: "PLAY",
      timestamp: new Date().toISOString(),
      before: s0,
      after: s1,
      payload: { index: 0 },
    });
    // UNDO
    const s2 = { ...s0 }; // back to initial
    logAction({
      userId: "X",
      action: "UNDO",
      timestamp: new Date().toISOString(),
      before: s1,
      after: s2,
      payload: { undoneIndex: 0 },
    });
    // RESET with reason
    const reason = "New round";
    const s3 = { ...s0 };
    logAction({
      userId: "X",
      action: "RESET",
      timestamp: new Date().toISOString(),
      before: s2,
      after: s3,
      payload: { reason },
    });

    const trail = getAuditTrail();
    expect(trail).toHaveLength(3);
    const [play, undo, reset] = trail;

    expect(play.action).toBe("PLAY");
    expect(play.before).toEqual(s0);
    expect(play.after).toEqual(s1);

    expect(undo.action).toBe("UNDO");
    expect(undo.before).toEqual(s1);
    expect(undo.after).toEqual(s2);

    expect(reset.action).toBe("RESET");
    expect(reset.before).toEqual(s2);
    expect(reset.after).toEqual(s3);
    expect(reset.payload).toEqual({ reason });
  });
});
