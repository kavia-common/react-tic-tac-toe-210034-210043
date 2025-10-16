//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-001
// User Story: As a player, I want a modern-styled, responsive Tic Tac Toe UI following the Ocean Professional theme.
// Acceptance Criteria:
//  - Provide a centralized theme with color constants
//  - Export utility for concatenating class names
//  - Theme is used consistently across components
// GxP Impact: NO - Frontend visual theming only
// Risk Level: LOW
// Validation Protocol: N/A
// ============================================================================
//
// ============================================================================
// IMPORTS AND DEPENDENCIES
// ============================================================================
// None
// ============================================================================

export type Theme = {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    error: string;
    background: string;
    surface: string;
    text: string;
    winAccent?: string;
  };
  shadows?: {
    lg?: string;
  };
  effects?: {
    focusRing?: string;
  };
};

// PUBLIC_INTERFACE
export const theme: Theme = {
  name: "Ocean Professional",
  description: "Blue & amber accents",
  colors: {
    primary: "#3b82f6",
    secondary: "#64748b",
    success: "#06b6d4",
    error: "#EF4444",
    background: "#f9fafb",
    surface: "#ffffff",
    text: "#111827",
    winAccent: "#16a34a", // green accent for winning line
  },
  shadows: {
    lg: "0 12px 28px rgba(0,0,0,0.16)",
  },
  effects: {
    focusRing: "3px solid #06b6d4", // cyan focus ring
  },
};

// PUBLIC_INTERFACE
export function cx(...classes: Array<string | false | undefined | null>): string {
  /** Concatenate class names conditionally; filters out falsy values. */
  return classes.filter(Boolean).join(" ");
}
