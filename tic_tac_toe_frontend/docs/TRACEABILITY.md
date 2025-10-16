# Traceability Matrix

## Overview
This traceability matrix maps the documented requirements to their concrete implementation locations and corresponding automated tests. It reflects the current, front-end only scope of the Tic Tac Toe application. The references point to files and observable behaviors that are validated by unit and integration tests.

## Requirements to Implementation and Tests

### REQ-TTT-001 — Theming and Utilities
- Description: Provide a centralized theme with color tokens and a classnames helper; apply consistently across the UI.
- Implementation:
  - src/theme.ts: theme export and cx utility.
  - Used in src/components/Square.tsx, src/components/Board.tsx, src/App.tsx styles.
- Tests:
  - src/__tests__/ui.placeholders.test.ts: confirms theme exposes new tokens (winAccent, focusRing, shadows).

### REQ-TTT-002 — Lightweight Audit Trail with Session ID
- Description: Log actions (PLAY, UNDO, RESET, ERROR) with userId, timestamp, payload, before/after state, and a stable sessionId for the session.
- Implementation:
  - src/utils/audit.ts: getSessionId(), logAction(), getAuditTrail(), clearAuditTrail().
  - src/App.tsx: handlePlay, handleUndo, handleReset invoke logAction with before/after snapshots and payloads.
- Tests:
  - src/__tests__/audit.test.ts: verifies sessionId stability and that entries include sessionId and payload; validates ERROR handling preserves state.
  - src/__tests__/App.integration.test.tsx: spies console.info("[AUDIT]", …) and asserts PLAY/UNDO/RESET/ERROR emissions during user flows.

### REQ-TTT-003 — Validation Utilities
- Description: Validate board indices, player values, and cell emptiness with descriptive errors to ensure accurate operations.
- Implementation:
  - src/utils/validators.ts: assertValidIndex, assertValidPlayer, assertCellEmpty.
  - src/game/logic.ts: makeMove uses validators; other functions rely on validated inputs.
- Tests:
  - src/__tests__/validators.test.ts: direct tests for all validators including error cases.
  - src/__tests__/logic.test.ts: ensures makeMove throws for invalid index/player and occupied cell.

### REQ-TTT-004 — Core Game Logic
- Description: Provide createEmptyBoard, makeMove, calculateWinner, getWinningLine, isDraw, getNextPlayer, and GameState, with immutability guarantees.
- Implementation:
  - src/game/logic.ts: full logic and types; pure functions.
- Tests:
  - src/__tests__/logic.test.ts: covers board creation, next player, winner detection (rows/cols/diagonals), draws, immutability, and invalid operations.
  - src/__tests__/ui.placeholders.test.ts: checks getWinningLine behavior.

### REQ-TTT-005 — Application UX: Play, Undo, Reset, History, Status
- Description: Allow placing marks, prevent moves after completion, provide undo and reset, show move history, and display status with move count; log audit entries.
- Implementation:
  - src/App.tsx: useGame hook and handlers handlePlay, handleUndo, handleReset; status, controls, move history toggle; live-regions and focus management.
  - src/components/Board.tsx & src/components/Square.tsx: interactive grid and squares wired to onPlay; disabled when game over.
- Tests:
  - src/__tests__/App.integration.test.tsx:
    - Initial render: status, grid, controls.
    - Play, Undo, Reset flows with focus assertions and audit emissions.
    - Winning scenario: winner visible, board disabled, toast on invalid further click, status or alert focus management.
    - Toggle Move History: aria-pressed and focus on history title.

### REQ-TTT-006 — Accessibility and Keyboard Navigation
- Description: Ensure keyboard navigation across the board; provide ARIA roles/labels; winner highlights include non-color cues and ARIA descriptions; use live regions for status and alerts.
- Implementation:
  - src/components/Board.tsx: role="grid", roles for rows and gridcells, roving tabindex, Arrow/Home/End/Enter/Space support, winning-line description id.
  - src/components/Square.tsx: descriptive aria-labels; aria-pressed; non-color winning icon; strong focus ring via theme.
  - src/App.tsx: aria-live status region, role="alert" toast with focus, focus shift to status on game end, focus to history title on toggle.
- Tests:
  - src/__tests__/Board.test.tsx: ARIA grid semantics, winning-line labeling and description, keyboard navigation, disabled behavior.
  - src/__tests__/Square.test.tsx: labels for empty/occupied and winning cells; disabled behavior.
  - src/__tests__/App.integration.test.tsx: keyboard navigation through the app, winning focus behavior, alerts, and toggles.

## Notes on Scope
- This is a front-end only implementation. There is no persistence, authentication, role-based access, or electronic signature support in this application. Audit data is stored in memory and emitted to the console for the current session only.

## Change Assurance
- Requirement markers appear as code comments near relevant modules and functions.
- Tests are kept in sync with the implementation; failing tests signal drift and require code or documentation updates.
