/**
 * True only in the static GitHub Pages build (`npm run build:demo`), where there is
 * no server, no database, and no admin portal. Use it to hide anything that needs
 * a backend rather than letting it fail at runtime.
 */
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO === "1";
