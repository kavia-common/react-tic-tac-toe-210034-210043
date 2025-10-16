declare module "react" {
  // Minimal React typings to satisfy TypeScript generics and JSX in our codebase.
  // This is a lightweight shim and should be removed once @types/react is installed.
  // Note: When @types/react is present, Node/TS resolution prefers types from node_modules/@types.
  // These shims are minimal to avoid conflicts.
  
  export type ReactNode = any;

  export interface MutableRefObject<T> { current: T | null; }
  export type Ref<T> = ((instance: T | null) => void) | MutableRefObject<T> | null;

  export interface SyntheticEvent<T = Element, E = Event> {
    nativeEvent: E;
    currentTarget: T;
    target: T;
    preventDefault(): void;
    stopPropagation(): void;
  }
  export interface KeyboardEvent<T = Element> extends SyntheticEvent<T, any> {
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
    key: string;
  }

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

  // Also export a namespace-like object for React.* references in types (e.g., React.Ref)
  export as namespace React;
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

  // Provide a global React namespace type mapping for references like React.Ref<...>
  namespace React {
    type ReactNode = any;
    interface MutableRefObject<T> { current: T | null; }
    type Ref<T> = ((instance: T | null) => void) | MutableRefObject<T> | null;
    interface SyntheticEvent<T = Element, E = Event> {
      nativeEvent: E;
      currentTarget: T;
      target: T;
      preventDefault(): void;
      stopPropagation(): void;
    }
    interface KeyboardEvent<T = Element> extends SyntheticEvent<T, any> {
      altKey: boolean;
      ctrlKey: boolean;
      shiftKey: boolean;
      metaKey: boolean;
      key: string;
    }
  }
}

declare module "react-dom/client" {
  export function createRoot(container: Element | DocumentFragment): {
    render(children: any): void;
    unmount(): void;
  };
}
