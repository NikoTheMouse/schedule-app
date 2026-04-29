// Global declaration for CSS side-effect imports used in Next.js App Router layouts.
// TypeScript 6 (strict moduleResolution: bundler) requires explicit declarations
// for non-TS module imports. Next.js handles CSS at build time via its webpack/swc
// pipeline — this declaration tells tsc to accept the import without errors.
declare module "*.css" {
  const styles: Record<string, string>;
  export default styles;
}
