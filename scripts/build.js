import { readFileSync } from "fs";
import { execSync } from "child_process";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

const cmd = `
esbuild src/index.ts \
  --bundle \
  --platform=node \
  --format=cjs \
  --target=node18 \
  --external:tiktoken \
  --define:__PKG_NAME__='"${pkg.name}"' \
  --define:__PKG_VERSION__='"${pkg.version}"' \
  --outfile=dist/index.cjs
`;

execSync(cmd, { stdio: "inherit" });
