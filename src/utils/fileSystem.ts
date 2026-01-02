import fs from "fs";
import path from "path";
import { minimatch } from "minimatch";
import chalk from "chalk";

/**
 * Recursively walks a directory and returns a list of file paths.
 */
export function walk(dir: string, ignorePatterns: string[]): string[] {
  let results: string[] = [];

  try {
    const list = fs.readdirSync(dir);

    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      // Check ignore patterns against the filename
      const isIgnored = ignorePatterns.some((pattern) =>
        minimatch(file, pattern),
      );

      if (isIgnored) continue;

      if (stat.isDirectory()) {
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
