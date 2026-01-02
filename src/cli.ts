import { program } from "commander";
import inquirer from "inquirer";
import ncp from "copy-paste";
import fs from "fs";
import chalk from "chalk";
import { getAllFileContents } from "./core";
import { ProjectorOptions } from "./types";

export async function run() {
  program
    .name("projector")
    .argument("[directory]", "The root directory to scan") // Made optional for wizard
    .option("-i, --ignore <patterns...>", "Patterns to ignore", [
      "node_modules",
      ".git",
      "dist",
    ])
    // ... keep other options same as before
    .action(async (directory, opts) => {
      let finalDir = directory;
      let finalOptions: ProjectorOptions = { ...opts };

      // Launch Wizard if no directory is provided
      if (!directory) {
        const answers = await launchWizard();
        finalDir = answers.directory;
        finalOptions = {
          ...finalOptions,
          ignore: [...finalOptions.ignore, ...answers.extraIgnore],
          extensions: answers.extensions,
          output: answers.outputFile, // will be undefined if clipboard
          toClipboard: answers.outputType === "clipboard",
        };
      }

      const result = getAllFileContents(finalDir, finalOptions);

      if (finalOptions.toClipboard) {
        ncp.copy(result, () => {
          console.log(chalk.green("✔ Codebase copied to clipboard!"));
        });
      } else if (finalOptions.output) {
        fs.writeFileSync(finalOptions.output, result);
        console.log(chalk.green(`✔ Saved to ${finalOptions.output}`));
      } else {
        console.log(result);
      }
    });

  await program.parseAsync(process.argv);
}

async function launchWizard() {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "directory",
        message: "Which directory should I scan?",
        default: ".",
      },
      {
        type: "list",
        name: "projectType",
        message: "What kind of project is this?",
        choices: [
          { name: "Node.js / TypeScript", value: "node" },
          { name: "Python", value: "python" },
          { name: "React / Next.js", value: "react" },
          { name: "Plain Text / Docs", value: "docs" },
        ],
      },
      {
        type: "list",
        name: "outputType",
        message: "Where should I send the output?",
        choices: [
          { name: "📋 Copy to Clipboard", value: "clipboard" },
          { name: "📄 Save to File", value: "file" },
        ],
      },
      {
        type: "input",
        name: "outputFile",
        message: "Enter output filename:",
        default: "context.txt",
        when: (answers) => answers.outputType === "file",
      },
    ])
    .then((answers) => {
      // Logic to map Project Type to Ignores/Extensions
      const preset = getPreset(answers.projectType);
      return { ...answers, ...preset };
    });
}

function getPreset(type: string) {
  const presets: Record<
    string,
    { extraIgnore: string[]; extensions: string[] }
  > = {
    node: {
      extraIgnore: ["package-lock.json", "dist", "out"],
      extensions: [".ts", ".js", ".json", ".md"],
    },
    python: {
      extraIgnore: ["__pycache__", ".venv", "*.pyc"],
      extensions: [".py", ".md", ".txt"],
    },
    react: {
      extraIgnore: [".next", "build", "coverage"],
      extensions: [".tsx", ".ts", ".jsx", ".js", ".css"],
    },
    docs: {
      extraIgnore: [],
      extensions: [".md", ".txt", ".pdf"],
    },
  };
  return presets[type];
}
