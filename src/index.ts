#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { program } from "commander";
import { minimatch } from "minimatch";
import chalk from "chalk";

// Interface for our CLI options
interface Options {
  directory: string;
  ignore: string[];
  extensions?: string[];
  output?: string;
  verbose?: boolean;
  dryRun?: boolean;
}

/**
 * Recursively walks a directory and returns a list of file paths
 * adhering to the ignore patterns.
 */
function walk(dir: string, ignorePatterns: string[]): string[] {
  let results: string[] = [];

  try {
    const list = fs.readdirSync(dir);

    // Iterate over items in the directory
    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      const relativePath = path.relative(process.cwd(), filePath);

      // Check ignore patterns (mimicking fnmatch behavior on the filename/dirname)
      // We check against the file name specifically to match the Python script's logic
      const isIgnored = ignorePatterns.some((pattern) =>
        minimatch(file, pattern),
      );

      if (isIgnored) continue;

      if (stat && stat.isDirectory()) {
        // Recurse into subdirectory
        results = results.concat(walk(filePath, ignorePatterns));
      } else {
        results.push(filePath);
      }
    }
  } catch (err) {
    console.error(
      chalk.red(`⚠️ Error accessing ${dir}: ${(err as Error).message}`),
    );
  }

  return results;
}

function getAllFileContents(
  rootDir: string,
  ignoreItems: string[],
  includeExtensions: string[] | undefined,
  verbose: boolean,
  dryRun: boolean,
): string {
  const contents: string[] = [];

  // 1. Get all files recursively (filtering out ignored folders/files)
  let allFiles = walk(rootDir, ignoreItems);

  // 2. Filter by extension if specified
  if (includeExtensions && includeExtensions.length > 0) {
    allFiles = allFiles.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return includeExtensions.includes(ext);
    });
  }

  // 3. Process files
  for (const filePath of allFiles) {
    // Normalize path to use forward slashes (Unix style)
    const filePathNormalized = path
      .relative(rootDir, filePath)
      .split(path.sep)
      .join("/");

    if (verbose) {
      console.log(chalk.blue(`Processing ${filePathNormalized}`));
    }

    if (dryRun) {
      contents.push(`<<${filePathNormalized}>> (would be processed)`);
      continue;
    }

    try {
      // Read file content
      const fileContent = fs.readFileSync(filePath, "utf-8");
      contents.push(`<<${filePathNormalized}>>\n${fileContent}`);
    } catch (e) {
      // Mimicking Python's error handling
      console.error(
        chalk.yellow(
          `⚠️ Could not read ${filePathNormalized}: ${(e as Error).message}`,
        ),
      );
    }
  }

  return contents.join("\n\n--------------\n\n");
}

// CLI Setup
program
  .name("projector")
  .description(
    "Read contents of all files in a directory, excluding specified folders/files.",
  )
  .argument("<directory>", "The root directory to scan")
  .option("-i, --ignore <patterns...>", "List of patterns to ignore", [
    "node_modules",
    ".git",
    ".DS_Store",
  ])
  .option(
    "-e, --extensions <extensions...>",
    "List of file extensions to include (e.g. .py .txt .md)",
  )
  .option("-o, --output <file>", "Output file to save the contents")
  .option("-v, --verbose", "Enable verbose output")
  .option(
    "--dry-run",
    "List files that would be processed without reading them",
  )
  .action((directory, options: Options) => {
    // Normalize extensions (ensure they start with .)
    let formattedExtensions: string[] | undefined;
    if (options.extensions) {
      formattedExtensions = options.extensions.map((ext) =>
        ext.startsWith(".") ? ext.toLowerCase() : "." + ext.toLowerCase(),
      );
    }

    const result = getAllFileContents(
      directory,
      options.ignore,
      formattedExtensions,
      !!options.verbose,
      !!options.dryRun,
    );

    if (options.output) {
      try {
        fs.writeFileSync(options.output, result, "utf-8");
        if (options.verbose) {
          console.log(chalk.green(`\nSuccessfully wrote to ${options.output}`));
        }
      } catch (err) {
        console.error(
          chalk.red(`Error writing output file: ${(err as Error).message}`),
        );
        process.exit(1);
      }
    } else {
      console.log(result);
    }
  });

program.parse(process.argv);
