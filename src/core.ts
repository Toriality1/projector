import fs from "fs";
import path from "path"
import chalk from "chalk";
import getFileList from "./utils/getFileList";
import { ProjectorOptions } from "./types";
import { FILE_SEPARATOR } from "./const";

export function getAllFileContents(
  rootDir: string,
  options: ProjectorOptions,
): string {
  const contents: string[] = [];
  const files = getFileList(rootDir, options);

  if (files.length === 0) {
    console.log(chalk.yellow("No files found matching criteria."));
    return "";
  }

  // Show token estimate before processing
  console.log(chalk.cyan(`\n📊 Processing ${files.length} file(s)...`));

  for (const filePath of files) {
    const filePathNormalized = path
      .relative(rootDir, filePath)
      .split(path.sep)
      .join("/");

    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      contents.push(`<<${filePathNormalized}>>\n\n${fileContent}`);
    } catch (e) {
      console.error(
        chalk.yellow(
          `⚠️ Could not read ${filePathNormalized}: ${(e as Error).message}`,
        ),
      );
    }
  }

  return contents.join(FILE_SEPARATOR);
}
