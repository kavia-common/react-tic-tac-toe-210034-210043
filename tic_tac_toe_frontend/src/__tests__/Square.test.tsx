import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Square from "../components/Square";

describe("Square", () => {
  test("renders with correct aria-label for empty cell", () => {
    const onClick = jest.fn();
    render(<Square value="" index={0} onClick={onClick} />);
    const btn = screen.getByRole("button", { name: /place mark in cell 1/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  test("renders with correct aria-label for occupied cell", () => {
    const onClick = jest.fn();
    render(<Square value="X" index={2} onClick={onClick} />);
    const btn = screen.getByRole("button", { name: /cell 3 contains x/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  test("indicates winning cell with visual and aria-hidden elements", () => {
    const onClick = jest.fn();
    render(<Square value="O" index={4} onClick={onClick} isWinning />);
    // label includes winning line mention
    const btn = screen.getByRole("button", { name: /part of the winning line/i });
    expect(btn).toBeInTheDocument();
    // win icon exists but is aria-hidden
    expect(screen.getByTitle(/winning cell/i)).toBeInTheDocument();
  });

  test("click calls onClick with index when enabled", () => {
    const onClick = jest.fn();
    render(<Square value="" index={5} onClick={onClick} />);
    const btn = screen.getByRole("button", { name: /place mark in cell 6/i });
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledWith(5);
  });

  test("disabled prevents click", () => {
    const onClick = jest.fn();
    render(<Square value="" index={1} onClick={onClick} disabled />);
    const btn = screen.getByRole("button", { name: /place mark in cell 2/i });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});
