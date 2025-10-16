# Tic Tac Toe — Ocean Professional

A modern, responsive, local two‑player Tic Tac Toe game built with React, themed using the “Ocean Professional” palette. Includes move history, undo, reset, and a lightweight audit trail (console + in‑memory).

## Features
- Ocean Professional theme (blue primary, subtle grays, amber accent)
- 3×3 grid with rounded squares, hover/focus states, and subtle shadows
- Status area: current player, winner, draw, and move count
- Controls: New Game (reset), Undo Last Move, toggle Move History
- Validation and user‑friendly error messages
- Lightweight audit trail: logs PLAY, UNDO, RESET, ERROR to console with timestamp and before/after state
- Minimal unit tests for core game logic using Jest + RTL environment

## Run
- Install and start with the standard CRA commands:
  - npm install
  - npm start
- App runs at http://localhost:3000

## Test
- npm test

## Structure (key files)
- src/theme.ts — theme constants and cx utility
- src/utils/audit.ts — lightweight audit trail utilities
- src/utils/validators.ts — reusable validation functions
- src/game/logic.ts — pure game logic and GameState
- src/components/Square.tsx — accessible square button
- src/components/Board.tsx — 3×3 board grid
- src/App.tsx — main app, state mgmt, handlers, UI
- src/__tests__/logic.test.ts — unit tests for core logic

## GxP‑Inspired Notes
- Data integrity: audit logs include user (Player X/O), ISO timestamps, action, before/after state, and payload where relevant.
- Contemporaneous logging: actions are logged immediately upon execution.
- Documentation: functions include comments; public functions are annotated as PUBLIC_INTERFACE.
- This demo is frontend‑only (no persistence, no auth), so audit logs are illustrative and scoped to the browser session.

## Accessibility
- Keyboard accessible buttons
- aria‑labels for squares and controls
- aria‑live regions for status and message updates

## Styling
- Modern minimalist UI with subtle gradient background and surface cards
- Smooth hover/focus transitions and consistent spacing
