declare module "react/jsx-runtime" {
  // Minimal React 17+ JSX runtime type shim to satisfy TS when @types/react isn't fully present.
  export const Fragment: any;
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
}
