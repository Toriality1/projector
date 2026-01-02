import fs from "fs";
import path from "path";
import chalk from "chalk";
import { ProjectorOptions } from "../types";

export default function getFileList(
  directory: string,
  options: ProjectorOptions,
): string[] {
  const files: string[] = [];
  const regexInclude = options.include ? new RegExp(options.include) : null;

  function traverse(dir: string) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        // Skip hidden files if not included
        if (!options.includeHidden && entry.name.startsWith(".")) {
          continue;
        }

        // Check ignore patterns (applies to both files and directories)
        if (shouldIgnore(fullPath, options.ignore)) {
          continue;
        }

        if (entry.isDirectory()) {
          traverse(fullPath);
        } else if (entry.isFile()) {
          // Check regex include (must match if specified)
          if (regexInclude && regexInclude.test(fullPath)) {
            files.push(fullPath);
          }
        }
      }
    } catch (err) {
      console.error(
        chalk.red(`⚠️  Error accessing ${dir}: ${(err as Error).message}`),
      );
    }
  }

  traverse(directory);
  return files.sort();
}

function shouldIgnore(filePath: string, ignorePatterns: string[]): boolean {
  const pathParts = filePath.split(path.sep);
  const fileName = path.basename(filePath);

  for (const pattern of ignorePatterns) {
    // Check exact match against any path segment
    if (pathParts.some((part) => part === pattern)) {
      return true;
    }

    // Wildcard matching for patterns like *.log, *.test.ts
    if (pattern.includes("*")) {
      const regex = new RegExp(
        "^" + pattern.replace(/\*/g, ".*").replace(/\./g, "\\.") + "$",
      );

      // Check against filename
      if (regex.test(fileName)) {
        return true;
      }

      // Also check against path segments
      if (pathParts.some((part) => regex.test(part))) {
        return true;
      }
    }
  }

  return false;
}
