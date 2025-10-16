# Tic Tac Toe — Ocean Professional

A modern, responsive, local two‑player Tic Tac Toe game built with React, themed using the “Ocean Professional” palette. The app includes move history, undo, reset, an accessible keyboard-first interaction model, a winning-line highlight, and a lightweight audit trail (console + in‑memory with a stable sessionId).

## Features
- Ocean Professional theme (blue primary, subtle grays, amber accent)
- 3×3 grid with rounded squares, strong focus states, and subtle shadows
- Status area: current player, winner, draw, and move count
- Controls: New Game (reset), Undo Last Move, toggle Move History
- Validation and user‑friendly messages with an alert toast region for errors
- Lightweight audit trail: logs PLAY, UNDO, RESET, ERROR to console with ISO timestamps, sessionId, before/after state, and optional payload
- Unit and integration tests using Jest and React Testing Library
- Winning-line highlight with non-color cues and ARIA description

## Run
- Install and start with the standard Create React App commands:
  - npm install
  - npm start
- App runs at http://localhost:3000

## Test
- Run watch mode: npm test
- Run coverage (CI mode): npm run test:coverage

## Usage
- Click or keyboard-activate a square to place the current player’s mark.
- Use arrow keys (Left/Right/Up/Down), Home, and End to move focus across the grid; press Enter or Space to play.
- Undo Last Move removes the most recent move if available.
- New Game resets the board and history, and focuses the New Game button for quick replays.
- Toggle Move History to show/hide a list of past move indices. When opened, focus shifts to the section title for screen reader context.

## Architecture Overview
This app is deliberately simple and front-end only. The code is split into small, purpose-specific modules:
- src/theme.ts: Centralized tokens for colors, shadows, and focus ring, plus a cx function for class concatenation. Used across components for consistent styling and accessibility.
- src/utils/validators.ts: Pure validation helpers enforcing correct indices, player values, and empty-cell checks. These functions throw descriptive errors and are used by game logic to ensure accuracy.
- src/utils/audit.ts: In-memory audit trail with:
  - AuditEntry structure capturing userId (Player X/O), action, timestamp, optional payload, before/after state, and a stable sessionId.
  - getSessionId() memoizes a UUID-like value for the browser session.
  - logAction() pushes entries to an in-memory array and emits console.info("[AUDIT]", entry).
  - getAuditTrail()/clearAuditTrail() expose retrieval and reset for tests and diagnostics.
- src/game/logic.ts: Pure, deterministic logic:
  - createEmptyBoard(), makeMove(), calculateWinner(), getWinningLine(), isDraw(), getNextPlayer() plus GameState type.
  - No side effects; validates with validators.ts; returns new immutable arrays.
- src/components/Square.tsx: An accessible square button with:
  - Clear aria-labels reflecting empty/occupied state and whether it is part of a winning line.
  - aria-pressed to indicate occupancy and a visual non-color winning icon (🏆) marked aria-hidden.
  - Strong focus indicators using the theme effects.
- src/components/Board.tsx: A 3×3 ARIA grid with:
  - role="grid", row and gridcell semantics, and roving tabindex keyboard navigation.
  - Arrow/Home/End key support and programmatic focus management for predictable keyboard UX.
  - Winning-line description via offscreen text and aria-describedby on winning cells.
- src/App.tsx: State orchestration with a useGame hook:
  - Manages board and history, derives current player, winner, and draw states.
  - Wraps actions with try/catch to present toast errors and to shift focus appropriately.
  - Emits audit entries for PLAY/UNDO/RESET/ERROR with before/after snapshots.
  - Manages accessibility affordances such as status region focus on game end and focus after reset.

## Accessibility
The UI is built with accessible-by-default patterns and additional enhancements:
- Semantics: The game board is an ARIA grid with explicit rows and gridcells. Squares are native buttons for keyboard and screen reader interoperability.
- Keyboard navigation: Roving tabindex is implemented on the Board, supporting Arrow keys, Home, End, Enter, and Space. Disabled state prevents input and focus movement when the game is over.
- Clear labels: Squares use descriptive aria-labels. Occupied cells state their value, and winning cells append “part of the winning line”. Controls include descriptive aria-labels and aria-pressed for toggle state.
- Live regions and focus management: Status updates are contained within an aria-live region and are focused when the game completes to announce the winner or draw. Error toasts use role="alert" and receive focus automatically when displayed. History visibility toggling moves focus to the history title for immediate context.
- Non-color cues: Winning cells include an additional icon, improving perception for users with color vision deficiencies.

## Testing Strategy
The test suite is designed to verify both pure logic and UI behavior, including accessibility-related interactions:
- Unit tests (src/__tests__/logic.test.ts): Cover createEmptyBoard, getNextPlayer, calculateWinner (rows/columns/diagonals), isDraw, makeMove happy paths and validation errors. These tests validate immutability and error conditions.
- Component tests:
  - src/__tests__/Board.test.tsx verifies ARIA grid semantics, winning-line labeling and description, keyboard navigation, and disabled behavior.
  - src/__tests__/Square.test.tsx checks aria-labels for empty and occupied states, winning indicators, click handling, and disabled behavior.
- Integration tests (src/__tests__/App.integration.test.tsx): Validate end-to-end flows:
  - Playing moves, undo, and reset interactions including focus behavior after reset.
  - Winning scenario highlighting and board disablement, with toast error upon further input attempts, and focus movement to the status or alert region.
  - Keyboard navigation across the board and activation via keyboard.
  - Toggle history aria-pressed behavior and focus on the history title.
  - Audit log emissions for PLAY/UNDO/RESET/ERROR actions using console.info("[AUDIT]", …).
- Utility tests (src/__tests__/audit.test.ts): Ensure sessionId stability within a session and that audit entries capture sessionId and payload; verify ERROR entries include message and unchanged state.

## Structure (key files)
- src/theme.ts — theme constants and cx utility
- src/utils/audit.ts — lightweight audit trail utilities with sessionId
- src/utils/validators.ts — reusable validation functions
- src/game/logic.ts — pure game logic and GameState
- src/components/Square.tsx — accessible square button with winning indicator
- src/components/Board.tsx — 3×3 ARIA grid with roving tabindex and keyboard navigation
- src/App.tsx — main app, state, handlers, accessibility, and audit integration
- src/__tests__ — unit and integration tests for logic, components, utilities, and full flows

## GxP-Inspired Notes and Scope
- Data integrity: Audit logs include user (Player X/O), ISO timestamps, action, sessionId, before/after state, and payloads where relevant. Logs are contemporaneous and emitted at the time of action.
- Documentation: Public interfaces are annotated with PUBLIC_INTERFACE comments; code is structured and commented for legibility.
- Scope and limitations: This is a front-end only demo with no authentication, persistence, or role-based access control. As such, audit logs are illustrative and scoped to the browser session memory and console output. There is no electronic signature feature, durable storage, or server-side access controls in this application.

## Styling
- Modern minimalist UI with a subtle gradient background and surface cards
- Smooth hover/focus transitions and consistent spacing
- A high-contrast focus ring ensures clarity for keyboard users
