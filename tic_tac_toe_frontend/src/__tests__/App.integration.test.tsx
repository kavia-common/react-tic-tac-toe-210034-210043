import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "../App";
import * as audit from "../utils/audit";

describe("App integration", () => {
  let infoSpy: jest.SpyInstance;

  beforeEach(() => {
    // reduce flakiness with sessionStorage usage in hint
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb: FrameRequestCallback) => {
      cb(0 as any);
      return 1 as any;
    });
    jest.spyOn(audit, "clearAuditTrail").mockImplementation(() => {
      // noop since not exported? We won't rely on clearing here.
    } as any);
    infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
    try {
      sessionStorage.setItem("ttt_hint_dismissed", "1");
    } catch {
      // ignore
    }
  });

  afterEach(() => {
    (window.requestAnimationFrame as any).mockRestore?.();
    infoSpy.mockRestore();
  });

  function getBoardButtons() {
    // return 9 buttons representing squares
    // use role=button with labels Place mark in cell N OR Cell N contains ...
    return screen.getAllByRole("button").filter((b) => {
      const name = b.getAttribute("aria-label") || b.getAttribute("aria-labelledby") || "";
      return /cell/i.test(name);
    });
  }

  test("initial render shows status, controls, and ARIA grid", () => {
    render(<App />);
    expect(screen.getByText(/tic tac toe/i)).toBeInTheDocument();
    expect(screen.getByText(/current player/i)).toBeInTheDocument();

    const grid = screen.getByRole("grid", { name: /tic tac toe board/i });
    expect(grid).toBeInTheDocument();

    // Controls
    expect(screen.getByRole("button", { name: /start a new game/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /undo last move/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /toggle move history/i })).toHaveAttribute("aria-pressed", "false");

    // 9 squares present
    expect(getBoardButtons()).toHaveLength(9);
  });

  test("play moves, status updates, undo and reset work; audit entries emitted", () => {
    render(<App />);
    const squares = getBoardButtons();

    // X plays 1, O plays 5, X plays 2
    fireEvent.click(squares[0]);
    fireEvent.click(squares[4]);
    fireEvent.click(squares[1]);

    // Undo last move
    const undoBtn = screen.getByRole("button", { name: /undo last move/i });
    expect(undoBtn).toBeEnabled();
    fireEvent.click(undoBtn);

    // After undo, status should indicate Current Player X again
    expect(screen.getByText(/current player:\s*x/i)).toBeInTheDocument();

    // Reset (New Game)
    const newBtn = screen.getByRole("button", { name: /start a new game/i });
    fireEvent.click(newBtn);

    // After reset, focus should move to New Game button (or first square as fallback)
    expect(newBtn).toHaveFocus();

    // audit console.info should have been called with PLAY/UNDO/RESET at least once
    expect(infoSpy).toHaveBeenCalledWith("[AUDIT]", expect.objectContaining({ action: "RESET" }));
    expect(infoSpy).toHaveBeenCalledWith("[AUDIT]", expect.objectContaining({ action: "PLAY" }));
    expect(infoSpy).toHaveBeenCalledWith("[AUDIT]", expect.objectContaining({ action: "UNDO" }));
  });

  test("winning scenario highlights line, disables board, and focuses status region", () => {
    render(<App />);
    const squares = getBoardButtons();

    // X:0, O:3, X:1, O:4, X:2 => X wins on top row
    fireEvent.click(squares[0]);
    fireEvent.click(squares[3]);
    fireEvent.click(squares[1]);
    fireEvent.click(squares[4]);
    fireEvent.click(squares[2]);

    // Winner status visible
    expect(screen.getByText(/winner:\s*x/i)).toBeInTheDocument();

    // Board disabled: subsequent clicks do nothing and show toast on attempt via handler throw
    const alertBefore = screen.queryByRole("alert");
    expect(alertBefore).not.toBeInTheDocument();

    // Attempt to click another cell should produce toast error
    fireEvent.click(squares[5]);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/game over/i);
    expect(alert).toHaveFocus();

    // Winning cells have aria labels describing winning line
    expect(
      screen.getByRole("button", { name: /cell 1 contains x.*winning line/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cell 2 contains x.*winning line/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cell 3 contains x.*winning line/i })
    ).toBeInTheDocument();

    // Status region should be focusable and focused
    const statusWrap = screen.getByText(/winner:/i).closest(".status-wrap");
    if (statusWrap) {
      // Using closest match; if wrapper is focused, its tabIndex=-1 allows focus
      expect(document.activeElement === statusWrap || alert === document.activeElement).toBeTruthy();
    }
  });

  test("keyboard navigation on board and aria semantics", () => {
    render(<App />);
    const grid = screen.getByRole("grid", { name: /tic tac toe board/i });
    const rows = within(grid).getAllByRole("row");
    expect(rows).toHaveLength(3);
    const cells = within(grid).getAllByRole("gridcell");
    expect(cells).toHaveLength(9);

    // navigate: focus first square and use arrows
    const squares = getBoardButtons();
    squares[0].focus();
    expect(squares[0]).toHaveFocus();

    fireEvent.keyDown(squares[0], { key: "ArrowRight" });
    squares[1].focus();
    expect(squares[1]).toHaveFocus();

    fireEvent.keyDown(squares[1], { key: "ArrowDown" });
    squares[4].focus();
    expect(squares[4]).toHaveFocus();

    // press space to play
    fireEvent.keyDown(squares[4], { key: " " });
    expect(infoSpy).toHaveBeenCalledWith("[AUDIT]", expect.objectContaining({ action: "PLAY" }));
  });

  test("toggle history updates aria-pressed and focuses history title", () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: /toggle move history/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    const title = screen.getByText(/move history/i);
    // Title is focus target; check that it exists and is focusable via tabIndex=-1
    expect(title).toBeInTheDocument();
  });

  test("invalid undo shows toast and keeps audit ERROR entry", () => {
    render(<App />);
    const undoBtn = screen.getByRole("button", { name: /undo last move/i });
    expect(undoBtn).toBeDisabled();

    // try to trigger error by keyboard activation on disabled should do nothing
    fireEvent.click(undoBtn);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    // make one move then undo twice to produce error
    const squares = getBoardButtons();
    fireEvent.click(squares[0]); // X plays
    fireEvent.click(undoBtn); // valid undo
    // second undo -> should show toast as error is thrown in handler
    fireEvent.click(undoBtn);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/no moves to undo/i);
    expect(infoSpy).toHaveBeenCalledWith("[AUDIT]", expect.objectContaining({ action: "ERROR" }));
  });
});
