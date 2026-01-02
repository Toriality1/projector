import fs from "fs";
import { program } from "commander";
import chalk from "chalk";
import { getAllFileContents } from "./core";
import { ProjectorOptions } from "./types";

export function run() {
  program
    .name("projector")
    .description("Concatenate file contents for AI context")
    .version("0.0.1")
    .argument("<directory>", "The root directory to scan")
    .option("-i, --ignore <patterns...>", "Patterns to ignore", [
      "node_modules",
      ".git",
      ".DS_Store",
      "dist",
    ])
    .option(
      "-e, --extensions <extensions...>",
      "File extensions to include (e.g. .py .ts)",
    )
    .option("-o, --output <file>", "Output file path")
    .option("-v, --verbose", "Enable verbose logging")
    .option("--dry-run", "List files without processing")
    .action((directory, opts) => {
      const options: ProjectorOptions = {
        ignore: opts.ignore,
        extensions: opts.extensions,
        output: opts.output,
        verbose: !!opts.verbose,
        dryRun: !!opts.dryRun,
      };

      const result = getAllFileContents(directory, options);

      if (options.output) {
        try {
          fs.writeFileSync(options.output, result, "utf-8");
          if (options.verbose)
            console.log(chalk.green(`\nSaved to ${options.output}`));
        } catch (err) {
          console.error(
            chalk.red(`Error writing file: ${(err as Error).message}`),
          );
          process.exit(1);
        }
      } else {
        console.log(result);
      }
    });

  program.parse(process.argv);
}
