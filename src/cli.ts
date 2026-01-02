import { program } from "commander";
import inquirer from "inquirer";
import ncp from "copy-paste";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { DEFAULT_IGNORE, LLM_TOKENS_MAX, LLM_TOKENS_HIGH } from "./const";
import { launchWizard } from "./wizard";
import { getAllFileContents } from "./core";
import { ProjectorOptions } from "./types";
import { formatBytes } from "./utils/formatBytes";
import { scanAndEstimate } from "./utils/scanAndEstimate";

export async function run() {
  program
    .name("projector")
    .argument("[directory]", "The root directory to scan")
    .option(
      "-i, --ignore <patterns...>",
      "Patterns to ignore (supports wildcards)",
      DEFAULT_IGNORE,
    )
    .option("-o, --output <file>", "Output file")
    .option("-c, --clipboard", "Copy to clipboard")
    .option("--include-hidden", "Include hidden files (dotfiles)")
    .option("--preview", "Preview file list before processing")
    .option("--include <pattern>", "Regex pattern for files to include")
    .option(
      "--dry-run",
      "Show what would be processed without actually doing it",
    )
    .action(async (directory, opts) => {
      let finalDir = directory;
      let finalOptions: ProjectorOptions = { ...opts };

      // Launch Wizard if no directory is provided
      if (!directory) {
        const answers = await launchWizard();
        finalDir = answers.directory;
        finalOptions = {
          ...finalOptions,
          ignore: [...DEFAULT_IGNORE, ...answers.extraIgnore],
          output: answers.outputFile,
          toClipboard: answers.outputType === "clipboard",
          includeHidden: answers.includeHidden,
          include: answers.include,
          dryRun: answers.dryRun,
        };

        // Preview files if requested
        if (answers.preview) {
          const shouldContinue = await previewFiles(finalDir, finalOptions);
          if (!shouldContinue) {
            console.log(chalk.yellow("Operation cancelled."));
            return;
          }
        }
      } else if (opts.preview) {
        // Preview for CLI mode
        const shouldContinue = await previewFiles(finalDir, finalOptions);
        if (!shouldContinue) {
          console.log(chalk.yellow("Operation cancelled."));
          return;
        }
      }

      // Validate directory exists
      if (!fs.existsSync(finalDir)) {
        console.log(
          chalk.red(`Error: Directory "${finalDir}" does not exist.`),
        );
        process.exit(1);
      }

      if (!fs.statSync(finalDir).isDirectory()) {
        console.log(chalk.red(`Error: "${finalDir}" is not a directory.`));
        process.exit(1);
      }

      // Dry run mode
      if (finalOptions.dryRun) {
        console.log(
          chalk.cyan("\n🔍 DRY RUN MODE - No files will be processed\n"),
        );
        await previewFiles(finalDir, finalOptions, true);
        console.log(
          chalk.yellow(
            "\n✓ Dry run complete. Use without --dry-run to process files.",
          ),
        );
        return;
      }

      const result = getAllFileContents(finalDir, finalOptions);

      if (finalOptions.toClipboard) {
        ncp.copy(result, () => {
          console.log(chalk.green("✔  Codebase copied to clipboard!"));
        });
      } else if (finalOptions.output) {
        fs.writeFileSync(finalOptions.output, result);
        console.log(chalk.green(`✔  Saved to ${finalOptions.output}`));
      } else {
        console.log(result);
      }
    });

  await program.parseAsync(process.argv);
}

async function previewFiles(
  directory: string,
  options: ProjectorOptions,
  isDryRun: boolean = false,
): Promise<boolean> {
  console.log(chalk.cyan("\n📂 Scanning directory...\n"));

  const { files, estimatedTokens } = await scanAndEstimate(directory, options);

  if (files.length === 0) {
    console.log(chalk.yellow("No files found matching criteria."));
    console.log(
      chalk.dim("\nTip: Check your --include pattern and --ignore patterns."),
    );
    return false;
  }

  console.log(chalk.bold(`Found ${files.length} file(s):\n`));

  const totalSize = files.reduce((acc, file) => {
    return acc + fs.statSync(file).size;
  }, 0);

  files.forEach((file, index) => {
    const relativePath = path.relative(directory, file);
    const stats = fs.statSync(file);
    const size = formatBytes(stats.size);
    console.log(
      chalk.gray(`${index + 1}.`) +
        ` ${relativePath} ${chalk.dim(`(${size})`)}`,
    );
  });

  console.log(chalk.cyan(`\nTotal size: ${formatBytes(totalSize)}`));
  console.log(
    chalk.cyan(`Estimated tokens: ${estimatedTokens.toLocaleString()}`),
  );

  if (estimatedTokens > LLM_TOKENS_MAX) {
    console.log(
      chalk.red(`⚠️ WARNING: Token count exceeds most LLM context windows.`),
    );
  } else if (estimatedTokens > LLM_TOKENS_HIGH) {
    console.log(
      chalk.yellow(
        `⚠️ NOTE: Token count is high. Some LLMs may have smaller limits.`,
      ),
    );
  }

  if (isDryRun) {
    return true;
  }

  const { proceed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "proceed",
      message: "Proceed with these files?",
      default: true,
    },
  ]);

  return proceed;
}
