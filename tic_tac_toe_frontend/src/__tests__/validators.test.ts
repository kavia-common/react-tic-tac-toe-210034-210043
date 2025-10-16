import { assertValidIndex, assertValidPlayer, assertCellEmpty } from "../utils/validators";

describe("validators", () => {
  test("assertValidIndex passes for 0..8", () => {
    for (let i = 0; i < 9; i++) {
      expect(() => assertValidIndex(i)).not.toThrow();
    }
  });

  test("assertValidIndex throws for out-of-range or non-integer", () => {
    expect(() => assertValidIndex(-1)).toThrow(/Invalid index/i);
    expect(() => assertValidIndex(9)).toThrow(/Invalid index/i);
    // @ts-expect-error testing runtime
    expect(() => assertValidIndex("3")).toThrow(/Invalid index/i);
    expect(() => assertValidIndex(3.14)).toThrow(/Invalid index/i);
  });

  test('assertValidPlayer accepts "X" and "O"', () => {
    expect(() => assertValidPlayer("X")).not.toThrow();
    expect(() => assertValidPlayer("O")).not.toThrow();
  });

  test("assertValidPlayer rejects others", () => {
    expect(() => assertValidPlayer("Z" as any)).toThrow(/Invalid player/i);
    expect(() => assertValidPlayer("" as any)).toThrow(/Invalid player/i);
  });

  test("assertCellEmpty passes for empty cell", () => {
    expect(() => assertCellEmpty("", 4)).not.toThrow();
  });

  test("assertCellEmpty throws for occupied cell", () => {
    expect(() => assertCellEmpty("X", 2)).toThrow(/already occupied/i);
  });
});
