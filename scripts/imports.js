import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const componentsDir = path.join(root, "components");
const stylesDir = path.join(root, "styles");

const stylesIndex = path.join(stylesDir, "index.css");

function getFiles(directory, extension) {
    if (!fs.existsSync(directory)) {
        return [];
    }

    const files = [];

    function walk(currentDirectory) {
        for (const entry of fs.readdirSync(currentDirectory, { withFileTypes: true })) {
            const fullPath = path.join(currentDirectory, entry.name);

            if (entry.isDirectory()) {
                walk(fullPath);
                continue;
            }

            if (entry.isFile() && path.extname(entry.name) === extension) {
                files.push(fullPath);
            }
        }
    }

    walk(directory);

    return files;
}

function normalizePath(filePath) {
    return filePath.split(path.sep).join("/");
}

function getRelativeImport(fromFile, targetFile) {
    let relativePath = path.relative(path.dirname(fromFile), targetFile);
    relativePath = normalizePath(relativePath);

    if (!relativePath.startsWith(".")) {
        relativePath = `./${relativePath}`;
    }

    return relativePath;
}

function updateCssIndex() {
    const files = [
        ...getFiles(componentsDir, ".css"),
        ...getFiles(stylesDir, ".css")
    ].filter(file => {
        return normalizePath(file) !== normalizePath(stylesIndex);
    });

    files.sort();

    let content = fs.existsSync(stylesIndex)
        ? fs.readFileSync(stylesIndex, "utf8")
        : "";

    const imports = [];

    for (const file of files) {
        const importPath = getRelativeImport(stylesIndex, file);
        const statement = `@import url("${importPath}");`;

        if (!content.includes(statement)) {
            imports.push(statement);
        }
    }

    if (imports.length > 0) {
        const prefix = content.trim().length > 0 ? "\n" : "";
        content = `${content.trimEnd()}${prefix}${imports.join("\n")}\n`;

        fs.writeFileSync(stylesIndex, content);
    }
}

updateCssIndex();

console.log("Imports CSS actualizados");