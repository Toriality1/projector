# Projector CLI (Node.js)

**Projector** is a TypeScript-based command-line tool that concatenates the contents of files in a directory into a single document. It is designed to bridge the gap between your local codebase and Large Language Models (LLMs).

## Features

- **Fast Performance**: Rewritten in TypeScript for high-speed file crawling.
- **AI-Ready**: Formats output perfectly for ChatGPT, Claude, and Gemini context windows.
- **Smart Filtering**: Supports glob-style ignore patterns (e.g., `**/dist/**`, `*.log`).
- **Dry Run**: Preview which files will be processed without reading them.
- **Zero Configuration**: Sensible defaults (ignores `node_modules` and `.git` by default).

## AI Integration

Projector is a "Context-as-a-Service" tool for AI-assisted development. By feeding your entire codebase into an LLM via Projector, you enable:

- **Holistic Refactoring**: The AI sees the impact of a change across multiple files.
- **Bug Hunting**: Find logic errors that span across the relationship between modules.
- **Instant Documentation**: Generate a full `README.md` or API spec based on the actual source code.

## Installation

You can run Projector without installing it using `npx`:

```bash
npx projector-cli .

```

Or install it globally:

```bash
npm install -g projector-cli

```

## Usage

```bash
projector <directory> [options]

```

### Options

| Option         | Alias | Description                                           |
| -------------- | ----- | ----------------------------------------------------- |
| `--ignore`     | `-i`  | Patterns to exclude (default: `node_modules`, `.git`) |
| `--extensions` | `-e`  | Only include specific extensions (e.g., `.ts .js`)    |
| `--output`     | `-o`  | Save result to a specific file                        |
| `--verbose`    | `-v`  | Show detailed processing logs                         |
| `--dry-run`    |       | List files without concatenating                      |

## Examples

**Basic usage (current directory):**

```bash
projector .

```

**Filter for specific frontend files:**

```bash
projector src -e .ts .tsx .css

```

**Exclude specific folders and save to a prompt file:**

```bash
projector . -i dist build temp -o codebase_prompt.txt

```

## Output Format

Projector uses a clear delimiter system:

```text
<<path/to/file.ts>>
[File Content Here]
--------------

```

## License

MIT
