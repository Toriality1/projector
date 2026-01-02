import fs from "fs";
import path from "path";
import chalk from "chalk";
import { walk } from "./utils/fileSystem";
import { ProjectorOptions } from "./types";

export function getAllFileContents(
  rootDir: string,
  options: ProjectorOptions,
): string {
  const contents: string[] = [];

  // 1. Get all files recursively
  let allFiles = walk(rootDir, options.ignore);

  // 2. Filter by extension
  if (options.extensions && options.extensions.length > 0) {
    allFiles = allFiles.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      const formattedExts = options.extensions!.map((e) =>
        e.startsWith(".") ? e : `.${e}`,
      );
      return formattedExts.includes(ext);
    });
  }

  // 3. Process files
  for (const filePath of allFiles) {
    const filePathNormalized = path
      .relative(rootDir, filePath)
      .split(path.sep)
      .join("/");

    if (options.verbose) {
      console.log(chalk.blue(`Processing ${filePathNormalized}`));
    }

    if (options.dryRun) {
      // CHANGED: Just add the raw path, no fancy formatting
      contents.push(filePathNormalized);
      continue;
    }

    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      contents.push(`<<${filePathNormalized}>>\n${fileContent}`);
    } catch (e) {
      console.error(
        chalk.yellow(
          `⚠️ Could not read ${filePathNormalized}: ${(e as Error).message}`,
        ),
      );
    }
  }

  // CHANGED: If dry-run, return a simple list. Otherwise, return the formatted block.
  if (options.dryRun) {
    return contents.join("\n");
  }

  return contents.join("\n\n--------------\n\n");
}
