import inquirer from "inquirer";
import fs from "fs";
import { PRESETS } from "./const";

function getPreset(type: string) {
  const presets: Record<string, { extraIgnore: string[]; include: string }> =
    PRESETS;
  return presets[type] || presets.node;
}

function directoryExists(directory: string) {
  return (
    (fs.existsSync(directory) && fs.statSync(directory).isDirectory()) ||
    "Directory does not exist. Please enter a valid path."
  );
}

function validateRegEx(input: string) {
  try {
    new RegExp(input);
    return true;
  } catch (e) {
    return "Invalid regex. Please enter a valid regex.";
  }
}

function commaSeparatedList(input: string) {
  if (!input) return [];
  return input
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);
}

function validateForCustomMode(input: string | undefined | null) {
  if (!input) return "Please provide an include pattern for custom mode.";
  return validateRegEx(input);
}

export async function launchWizard() {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "directory",
        message: "Which directory should I scan?",
        default: ".",
        validate: directoryExists,
      },
      {
        type: "list",
        name: "projectType",
        message: "What kind of project is this?",
        choices: [
          { name: "Node.js / TypeScript", value: "node" },
          { name: "Python", value: "python" },
          { name: "React / Next.js", value: "react" },
          { name: "Vue / Nuxt", value: "vue" },
          { name: "Svelte / SvelteKit", value: "svelte" },
          { name: "Angular", value: "angular" },
          { name: "Go", value: "go" },
          { name: "Rust", value: "rust" },
          { name: "Java / Spring", value: "java" },
          { name: "Mobile (React Native / Flutter)", value: "mobile" },
          { name: "Plain Text / Docs", value: "docs" },
          { name: "Custom (I'll set my own patterns)", value: "custom" },
        ],
      },
      {
        type: "confirm",
        name: "includeHidden",
        message: "Include hidden files (dotfiles)?",
        default: false,
      },
      {
        type: "confirm",
        name: "excludeTests",
        message: "Exclude test files? (*.test.*, *.spec.*)",
        default: true,
        when: (answers) =>
          answers.projectType !== "custom" && answers.projectType !== "docs",
      },
      {
        type: "input",
        name: "additionalIgnore",
        message:
          "Additional patterns to ignore (comma-separated, e.g., *.backup,tmp):",
        filter: commaSeparatedList,
      },
      {
        type: "input",
        name: "include",
        message:
          "Regex pattern for files to INCLUDE (leave empty for preset defaults):",
        when: (answers) => answers.projectType !== "custom",
        validate: validateRegEx,
      },
      {
        type: "input",
        name: "include",
        message: "Regex pattern for files to INCLUDE (required for custom):",
        when: (answers) => answers.projectType === "custom",
        validate: validateForCustomMode,
      },
      {
        type: "confirm",
        name: "dryRun",
        message: "Run in dry-run mode (preview only)?",
        default: false,
      },
      {
        type: "confirm",
        name: "preview",
        message: "Preview file list before processing?",
        default: true,
        when: (answers) => !answers.dryRun,
      },
      {
        type: "list",
        name: "outputType",
        message: "Where should I send the output?",
        choices: [
          { name: "📋 Copy to Clipboard", value: "clipboard" },
          { name: "📄 Save to File", value: "file" },
        ],
        when: (answers) => !answers.dryRun,
      },
      {
        type: "input",
        name: "outputFile",
        message: "Enter output filename:",
        default: "context.txt",
        when: (answers) => answers.outputType === "file" && !answers.dryRun,
      },
    ])
    .then((answers) => {
      const preset = getPreset(answers.projectType);
      let extraIgnore = [...preset.extraIgnore];

      if (!answers.excludeTests) {
        extraIgnore = extraIgnore.filter(
          (pattern) => !pattern.includes("test") && !pattern.includes("spec"),
        );
      }

      if (answers.additionalIgnore) {
        extraIgnore.push(...answers.additionalIgnore);
      }

      const finalInclude = answers.include || preset.include;

      return {
        ...answers,
        extraIgnore,
        include: finalInclude,
      };
    });
}
