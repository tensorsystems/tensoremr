/* eslint-disable @typescript-eslint/no-explicit-any */
export {}

declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare global {
  interface Window { LForms: any; }
}
