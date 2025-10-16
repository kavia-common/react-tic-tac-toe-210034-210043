import { getWinningLine } from "../game/logic";
import { theme } from "../theme";

test("getWinningLine returns indices for a winning board", () => {
  const b = ["X","X","X","","","","","",""];
  expect(getWinningLine(b)).toEqual([0,1,2]);
});

test("theme exposes new tokens", () => {
  expect(theme.colors.winAccent).toBeTruthy();
  expect(theme.effects?.focusRing).toBeTruthy();
  expect(theme.shadows?.lg).toBeTruthy();
});
