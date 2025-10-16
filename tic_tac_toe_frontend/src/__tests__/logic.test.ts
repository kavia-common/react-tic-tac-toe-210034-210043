import { calculateWinner, createEmptyBoard, getNextPlayer, isDraw, makeMove } from "../game/logic";

describe("Tic Tac Toe logic", () => {
  test("createEmptyBoard returns 9 empty cells", () => {
    const b = createEmptyBoard();
    expect(b).toHaveLength(9);
    expect(b.every((c) => c === "")).toBe(true);
  });

  test("getNextPlayer alternates based on history length", () => {
    expect(getNextPlayer([])).toBe("X");
    expect(getNextPlayer([0])).toBe("O");
    expect(getNextPlayer([0, 1])).toBe("X");
  });

  test("calculateWinner detects rows", () => {
    const b = ["X","X","X","","","","","",""];
    expect(calculateWinner(b)).toBe("X");
  });

  test("calculateWinner detects columns", () => {
    const b = ["O","","","","O","","","","O"];
    expect(calculateWinner(b)).toBe("O");
  });

  test("calculateWinner detects diagonals", () => {
    const b = ["X","","","","X","","","","X"];
    expect(calculateWinner(b)).toBe("X");
  });

  test("isDraw detects full board without winner", () => {
    // X O X
    // X O O
    // O X X
    const b = ["X","O","X","X","O","O","O","X","X"];
    expect(calculateWinner(b)).toBeNull();
    expect(isDraw(b)).toBe(true);
  });

  test("makeMove validates index and empty cell", () => {
    const b = createEmptyBoard();
    const nb = makeMove(b, 0, "X");
    expect(nb[0]).toBe("X");
    expect(b[0]).toBe(""); // immutability
  });

  test("makeMove throws on occupied cell", () => {
    const b = createEmptyBoard();
    const nb = makeMove(b, 0, "X");
    expect(() => makeMove(nb, 0, "O")).toThrow(/already occupied/i);
  });

  test("makeMove throws on invalid index", () => {
    const b = createEmptyBoard();
    expect(() => makeMove(b, -1, "X")).toThrow(/Invalid index/i);
    expect(() => makeMove(b, 9, "X")).toThrow(/Invalid index/i);
  });

  test("makeMove throws on invalid player", () => {
    const b = createEmptyBoard();
    // @ts-expect-error intentional invalid player
    expect(() => makeMove(b, 0, "Z")).toThrow(/Invalid player/i);
  });
});
