# Projector CLI (Node.js)

**Projector** is a TypeScript-based command-line tool that concatenates the contents of files in a directory into a single document. It is designed to bridge the gap between your local codebase and Large Language Models (LLMs).

## Features

- **Fast Performance**: Rewritten in TypeScript for high-speed file crawling.
- **AI-Ready**: Formats output perfectly for ChatGPT, Claude, and Gemini context windows.
- **Smart Filtering**: Supports glob-style ignore patterns (e.g., `**/dist/**`, `*.log`) and regex include patterns.
- **Interactive Wizard**: Guided setup when run without arguments.
- **Token Estimation**: Previews estimated token count with warnings for LLM context limits.
- **File Preview**: See which files will be processed before committing.
- **Dry Run**: Preview which files will be processed without reading them.
- **Clipboard Support**: Copy output directly to clipboard for instant pasting.
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
projector [directory] [options]
```

If no directory is provided, Projector launches an interactive wizard to guide you through the options.

### Options

| Option              | Alias | Description                                              |
| ------------------- | ----- | -------------------------------------------------------- |
| `--ignore`          | `-i`  | Patterns to exclude (default: `node_modules`, `.git`)    |
| `--output`          | `-o`  | Save result to a specific file                           |
| `--clipboard`       | `-c`  | Copy result to clipboard                                 |
| `--include-hidden`  |       | Include hidden files (dotfiles)                          |
| `--preview`         |       | Preview file list before processing                      |
| `--include`         |       | Regex pattern for files to include                       |
| `--dry-run`         |       | Show what would be processed without actually doing it   |

## Examples

**Interactive mode (launches wizard):**
```bash
projector
```

**Basic usage (current directory):**
```bash
projector .
```

**Preview files before processing:**
```bash
projector src --preview
```

**Copy to clipboard for immediate pasting:**
```bash
projector . --clipboard
```

**Filter with regex pattern and save to file:**
```bash
projector . --include "\.(ts|tsx)$" -o codebase.txt
```

**Include hidden files and ignore additional patterns:**
```bash
projector . --include-hidden -i dist build temp
```

**Dry run to see what would be processed:**
```bash
projector . --dry-run
```

## Preview Mode

When using `--preview` or in interactive mode, Projector displays:

- List of files to be processed with relative paths
- Individual file sizes
- Total size of all files
- **Estimated token count** for LLM context
- Warnings if token count exceeds common LLM limits

This helps you avoid overwhelming LLM context windows before processing.

## Output Format

Projector uses a clear delimiter system:

```text
<<path/to/file.ts>>

[File Content Here]

--------------
```

## License

MIT
