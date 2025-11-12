// Fails the build if any .ts or .tsx files exist under apps/web
const { execSync } = require("node:child_process");
try {
  const out = execSync(
    'git ls-files "apps/web/**" | egrep "\\.tsx?$" || true',
    { stdio: ["ignore", "pipe", "pipe"] }
  )
    .toString()
    .trim();
  if (out) {
    console.error("\n\x1b[31mTypeScript files detected in JS-only app:\x1b[0m");
    console.error(
      out
        .split("\n")
        .map((l) => " - " + l)
        .join("\n")
    );
    console.error("\nPlease rename to .jsx/.js (e.g., index.tsx → index.jsx).");
    process.exit(1);
  }
} catch (e) {
  // If git isn't available (e.g., zip), fall back to find
  const { execSync: ex2 } = require("node:child_process");
  const out = ex2(
    'find apps/web -type f \\( -name "*.ts" -o -name "*.tsx" \\) | cat',
    { stdio: ["ignore", "pipe", "pipe"] }
  )
    .toString()
    .trim();
  if (out) {
    console.error("\nTypeScript files detected in JS-only app:");
    console.error(
      out
        .split("\n")
        .map((l) => " - " + l)
        .join("\n")
    );
    process.exit(1);
  }
}
