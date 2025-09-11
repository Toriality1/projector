#!/usr/bin/env python3
import os
import argparse
import fnmatch


def get_all_file_contents(root_dir, ignore_items=(), include_extensions=None, verbose=False, dry_run=False):
    contents = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Filter directories using ignore patterns
        dirnames[:] = [d for d in dirnames if not any(
            fnmatch.fnmatch(d, pattern) for pattern in ignore_items)]
        # Filter files using ignore patterns
        filenames = [f for f in filenames if not any(
            fnmatch.fnmatch(f, pattern) for pattern in ignore_items)]
        # Filter by extensions if specified
        if include_extensions:
            filenames = [f for f in filenames if os.path.splitext(
                f)[1].lower() in include_extensions]
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            file_path_normalized = os.path.normpath(
                file_path).replace(os.sep, '/')
            if verbose:
                print(f"Processing {file_path_normalized}")
            if dry_run:
                contents.append(
                    f"<<{file_path_normalized}>> (would be processed)")
                continue
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    file_content = f.read()
                    contents.append(
                        f"<<{file_path_normalized}>>\n{file_content}")
            except Exception as e:
                print(f"⚠️ Could not read {file_path_normalized}: {e}")
    return "\n\n--------------\n\n".join(contents)


def main():
    parser = argparse.ArgumentParser(
        description="Read contents of all files in a directory, excluding specified folders/files.")
    parser.add_argument("directory", help="The root directory to scan")
    parser.add_argument("-i", "--ignore", nargs="*", default=["node_modules"],
                        help="List of directories, files, or patterns to ignore (e.g., node_modules .git *.log)")
    parser.add_argument("-e", "--extensions", nargs="*",
                        help="List of file extensions to include (e.g., .py .txt .md)")
    parser.add_argument(
        "-o", "--output", help="Output file to save the contents")
    parser.add_argument("-v", "--verbose", action="store_true",
                        help="Enable verbose output")
    parser.add_argument("--dry-run", action="store_true",
                        help="List files that would be processed without reading them")

    args = parser.parse_args()

    # Convert extensions to lowercase and ensure they start with a dot
    extensions = None
    if args.extensions:
        extensions = tuple('.' + ext.lstrip('.').lower()
                           for ext in args.extensions)

    result = get_all_file_contents(args.directory, tuple(
        args.ignore), extensions, args.verbose, args.dry_run)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(result)
    else:
        print(result)


if __name__ == "__main__":
    main()
