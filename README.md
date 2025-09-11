# Projector CLI

**Projector** is a Python-based command-line tool that reads and concatenates the contents of files in a specified directory, with options to filter by file extensions, ignore specific files or directories, and output to a file.

It supports glob-style ignore patterns, verbose output, and a dry-run mode for previewing processed files.

## Features

- **Recursive File Reading**: Reads all files in a directory and its subdirectories.
- **File Extension Filtering**: Include only specific file types (e.g., `.py`, `.md`).
- **Ignore Patterns**: Exclude files or directories using names or glob patterns (e.g., `node_modules`, `*.log`).
- **Output to File**: Save concatenated output to a specified file.
- **Verbose Mode**: Display processing details for each file.
- **Dry Run Mode**: List files that would be processed without reading their contents.
- **Cross-Platform**: Normalizes file paths with forward slashes for consistency across operating systems.

## AI Integration

Projector is particularly valuable for AI-assisted development workflows. When working with AI chatbots or code assistants, Projector enables you to efficiently share your entire project structure and codebase in a single, well-formatted document. This allows AI systems to:

- **Understand Project Architecture**: By providing a comprehensive view of your codebase, Projector helps AI tools grasp the overall structure, relationships between components, and design patterns used in your project.
- **Contextual Code Analysis**: AI assistants can provide more accurate suggestions, identify potential improvements, and detect inconsistencies when they have access to the complete project context rather than isolated code snippets.
- **Efficient Code Reviews**: When seeking AI assistance for code reviews, Projector's output allows the AI to analyze the entire codebase cohesively, leading to more holistic feedback on design patterns, potential bugs, and optimization opportunities.
- **Documentation Generation**: AI tools can generate comprehensive documentation when provided with the complete project context through Projector's output.
- **Onboarding and Explanation**: When explaining your project to an AI for educational purposes or to generate explanations for new team members, Projector ensures the AI has all necessary context to provide accurate and complete information.

The tool's ability to filter by file extensions and ignore irrelevant files (like dependencies or build artifacts) ensures that only meaningful code is shared, making AI interactions more focused and productive.

## Installation

### Prerequisites

- Python **3.6+**
- **pipx** (recommended for isolated installation) or `pip`

### Using pipx (Recommended)

1. Install pipx:

```bash
   sudo apt update
   sudo apt install pipx
   pipx ensurepath
```

2. Source your shell configuration:

```bash
source ~/.bashrc  # or ~/.zshrc
```

3. Install projector from the project directory:

```bash
pipx install .
```

4. Verify installation:

```bash
projector --help
```

### Using a Virtual Environment

1. Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install projector:

```bash
pip install .
```

3. Link the command globally:

```bash
ln -s $(pwd)/venv/bin/projector ~/.local/bin/projector
```

4. Ensure `~/.local/bin` is in your PATH:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

5. Verify installation:

```bash
projector --help
```

## Usage

Run projector with the following syntax:

```bash
projector <directory> [-i IGNORE [IGNORE ...]] [-e EXTENSIONS [EXTENSIONS ...]] [-o OUTPUT] [-v] [--dry-run]
```

### Options

* `directory`: The root directory to scan (**required**).
* `-i, --ignore`: Files, directories, or glob patterns to ignore (default: `node_modules`).
* `-e, --extensions`: File extensions to include (e.g., `.py`, `.txt`, `.md`).
* `-o, --output`: File to save the output to (instead of printing to console).
* `-v, --verbose`: Enable verbose output, showing each file being processed.
* `--dry-run`: List files that would be processed without reading their contents.

## Examples

Read all files in the current directory, excluding `node_modules` and `.git`:

```bash
projector . -i node_modules .git
```

Include only Python and Markdown files:

```bash
projector /path/to/folder -i node_modules -e .py .md
```

Save output to a file with verbose mode:

```bash
projector . -i node_modules *.log -o output.txt -v
```

Dry-run to preview processed files:

```bash
projector . -i node_modules --dry-run
```

Combine multiple options:

```bash
projector . -i node_modules .git *.log -e .py -o output.txt -v --dry-run
```

## Output Format

Each file's content is preceded by its path in the format:

```
<<path/to/file>>
```

Files are separated by:

```
--------------
```

## Uninstallation

* With **pipx**:

```bash
pipx uninstall projector
```

* With a **virtual environment**:
  Remove the virtual environment directory and the symlink:

```bash
rm -rf venv
rm ~/.local/bin/projector
```

## Development

To contribute or modify projector:

1. Clone the repository or copy the project files.
2. Edit `projector/projector.py` as needed.
3. Reinstall with:

```bash
pipx install . --force
```

   or, if using a virtual environment:

```bash
pip install .
```

## License

MIT
