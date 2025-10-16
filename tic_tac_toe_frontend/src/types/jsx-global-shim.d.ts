declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      key?: any;
    }
    interface IntrinsicClassAttributes<T> {
      ref?: any;
    }
    // Minimal catch-all mapping so any HTML tag is accepted by the compiler
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
// Ensure this file is treated as a module to avoid global re-merge issues in some setups
export {};
