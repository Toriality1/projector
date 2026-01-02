import fs from "fs";
import { ProjectorOptions } from "../types";
import getFileList from "./getFileList";

function estimateTokens(text: string): number {
  try {
    const { encoding_for_model } = require("tiktoken");
    const encoding = encoding_for_model("gpt-4");
    const tokens = encoding.encode(text);
    const count = tokens.length;
    encoding.free();
    return count;
  } catch (error) {
    return 0;
  }
}

export async function scanAndEstimate(
  directory: string,
  options: ProjectorOptions,
): Promise<{ files: string[]; estimatedTokens: number }> {
  const files = getFileList(directory, options);

  let totalContent = "";
  for (const file of files) {
    try {
      totalContent += fs.readFileSync(file, "utf-8");
    } catch (e) {
      // Skip files that can't be read
    }
  }

  const estimatedTokens = estimateTokens(totalContent);

  return { files, estimatedTokens };
}
