declare module "react" {
  // Minimal React typings to satisfy TypeScript generics and JSX in our codebase.
  // This is a lightweight shim and should be removed once @types/react is installed.

  export type ReactNode = any;

  export interface MutableRefObject<T> { current: T | null; }
  export type Ref<T> = ((instance: T | null) => void) | MutableRefObject<T> | null;

  export function createElement(type: any, props?: any, ...children: any[]): any;

  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  export function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useRef<T>(initialValue: T | null): MutableRefObject<T>;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[] | undefined): T;

  export const StrictMode: any;

  // default export shape used in imports: import React, { useMemo, ... } from "react";
  const ReactDefault: {
    createElement: typeof createElement;
    StrictMode: typeof StrictMode;
  };
  export default ReactDefault;
}

// Provide the JSX namespace so TSX elements are typed.
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      key?: any;
    }
    interface IntrinsicClassAttributes<T> {
      ref?: any;
    }
    // Accept any intrinsic HTML tag to keep shim minimal
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module "react-dom/client" {
  export function createRoot(container: Element | DocumentFragment): {
    render(children: any): void;
    unmount(): void;
  };
}
