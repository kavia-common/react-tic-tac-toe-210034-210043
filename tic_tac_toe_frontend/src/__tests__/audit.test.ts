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

  test("logAction adds entry with sessionId and payload", () => {
    const before = { x: 1 };
    const after = { x: 2 };
    logAction({
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
    expect(entry.userId).toBe("X");
    expect(entry.action).toBe("PLAY");
    expect(entry.sessionId).toBeDefined();
    expect(entry.before).toEqual(before);
    expect(entry.after).toEqual(after);
    expect(entry.payload).toEqual({ index: 3 });
    expect(infoSpy).toHaveBeenCalledWith("[AUDIT]", expect.objectContaining({ action: "PLAY" }));
  });

  test("ERROR action includes message and leaves state unchanged", () => {
    const state = { foo: "bar" };
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
  });
});
