//@ts-ignore
export const PKG_NAME = __PKG_NAME__;
//@ts-ignore
export const PKG_VERSION = __PKG_VERSION__;
export const LLM_TOKENS_MAX = 200_000;
export const LLM_TOKENS_HIGH = 100_000;
export const DEFAULT_IGNORE = [
  "node_modules",
  ".git",
  ".vscode",
  "dist",
  "build",
  ".next",
  "coverage",
  ".DS_Store",
  "*.log",
  ".env",
  ".env.local",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "*.min.js",
  "*.min.css",
  "*.test.ts",
  "*.test.js",
  "*.spec.ts",
  "*.spec.js",
];
export const FILE_SEPARATOR = "\n\n------------------------\n";
export const PRESETS = {
  node: {
    extraIgnore: ["out"],
    include: "\\.(ts|js|tsx|jsx|json|md|mjs|cjs)$",
  },
  python: {
    extraIgnore: [
      "__pycache__",
      ".venv",
      "*.pyc",
      "venv",
      ".pytest_cache",
      "*.egg-info",
    ],
    include: "\\.(py|md|txt|toml|yml|yaml|cfg)$",
  },
  react: {
    extraIgnore: ["coverage", ".turbo", "storybook-static"],
    include: "\\.(tsx|ts|jsx|js|css|scss|less|md)$",
  },
  vue: {
    extraIgnore: [".nuxt", ".output", "coverage"],
    include: "\\.(vue|ts|js|css|scss|md|json)$",
  },
  svelte: {
    extraIgnore: [".svelte-kit", "coverage"],
    include: "\\.(svelte|ts|js|css|scss|md|json)$",
  },
  angular: {
    extraIgnore: [".angular", "coverage", "e2e"],
    include: "\\.(ts|html|css|scss|json|md)$",
  },
  go: {
    extraIgnore: ["vendor", "bin", "*.test"],
    include: "\\.(go|mod|sum|md|yaml|yml)$",
  },
  rust: {
    extraIgnore: ["target", "Cargo.lock"],
    include: "\\.(rs|toml|md)$",
  },
  java: {
    extraIgnore: ["target", ".gradle", "*.class", "*.jar"],
    include: "\\.(java|xml|properties|gradle|md)$",
  },
  mobile: {
    extraIgnore: ["android/build", "ios/Pods", ".expo", "coverage"],
    include: "\\.(tsx|ts|jsx|js|dart|json|md)$",
  },
  docs: {
    extraIgnore: [],
    include: "\\.(md|txt|rst|adoc)$",
  },
  custom: {
    extraIgnore: [],
    include: "",
  },
};
