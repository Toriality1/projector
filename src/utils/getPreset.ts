export function getPreset(type: string) {
  const presets: Record<string, { extraIgnore: string[]; include: string }> = {
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
  return presets[type] || presets.node;
}
