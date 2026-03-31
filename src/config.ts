import * as vscode from "vscode";

const CONFIG_KEY_MAP: Record<string, string> = {
    select: "select",
    ignore: "ignore",
    extendSelect: "extend-select",
    extendIgnore: "extend-ignore",
    fixable: "fixable",
    unfixable: "unfixable",
    extendFixable: "extend-fixable",
    extendUnfixable: "extend-unfixable",
    perFileIgnores: "per-file-ignores",
    extendPerFileIgnores: "extend-per-file-ignores",
    extendExclude: "extend-exclude",
    targetVersion: "target-version",
    lineLength: "line-length",
    indentWidth: "indent-width",
    fix: "fix",
    unsafeFixes: "unsafe-fixes",
    exitZero: "exit-zero",
    format: "format",
    quoteStyle: "quote-style",
    indentStyle: "indent-style",
    skipMagicTrailingComma: "skip-magic-trailing-comma",
};

const ARRAY_CONFIGS = [
    "select",
    "ignore",
    "extendSelect",
    "extendIgnore",
    "fixable",
    "unfixable",
    "extendFixable",
    "extendUnfixable",
    "extendExclude",
];

const SCALAR_CONFIGS = [
    "targetVersion",
    "lineLength",
    "indentWidth",
    "fix",
    "unsafeFixes",
    "exitZero",
    "format",
    "quoteStyle",
    "indentStyle",
    "skipMagicTrailingComma",
];

const OBJECT_CONFIGS = ["perFileIgnores", "extendPerFileIgnores"];

export function getConfigFromSettings(): Record<string, any> {
    const configuration = vscode.workspace.getConfiguration("ruffHelper");
    const config: Record<string, any> = {};

    for (const key of ARRAY_CONFIGS) {
        const value = configuration.get<string[]>(key, []);
        if (value && value.length > 0) {
            config[key] = value;
        }
    }

    for (const key of SCALAR_CONFIGS) {
        const value = configuration.get<string | number | boolean>(key);
        if (value !== undefined && value !== null && value !== "") {
            config[key] = value;
        }
    }

    for (const key of OBJECT_CONFIGS) {
        const value = configuration.get<Record<string, string[]>>(key, {});
        if (value && Object.keys(value).length > 0) {
            config[key] = value;
        }
    }

    return config;
}

function formatArrayValue(key: string, value: string[]): string {
    let output = `${key} = [\n`;
    for (const item of value) {
        output += `    "${item}",\n`;
    }
    output += "]\n";
    return output;
}

function formatPerFileIgnores(
    value: Record<string, string[]>,
    ruffKey: string,
): string {
    let output = `${ruffKey} = {\n`;
    for (const [pattern, rulesList] of Object.entries(value)) {
        output += `    "${pattern}" = [\n`;
        if (Array.isArray(rulesList)) {
            for (const rule of rulesList) {
                output += `        "${rule}",\n`;
            }
        }
        output += "    ],\n";
    }
    output += "}\n";
    return output;
}

export function generateRuffToml(config: Record<string, any>): string {
    let output = "";

    for (const [vscodeKey, ruffKey] of Object.entries(CONFIG_KEY_MAP)) {
        if (config[vscodeKey] === undefined) {
            continue;
        }

        const value = config[vscodeKey];

        if (typeof value === "boolean") {
            output += `${ruffKey} = ${value}\n`;
        } else if (typeof value === "number") {
            output += `${ruffKey} = ${value}\n`;
        } else if (Array.isArray(value) && value.length > 0) {
            output += formatArrayValue(ruffKey, value);
        } else if (typeof value === "string" && value) {
            output += `${ruffKey} = "${value}"\n`;
        }
    }

    if (config["perFileIgnores"]) {
        const value = config["perFileIgnores"];
        if (typeof value === "object" && Object.keys(value).length > 0) {
            output += formatPerFileIgnores(value, "per-file-ignores");
        }
    }

    if (config["extendPerFileIgnores"]) {
        const value = config["extendPerFileIgnores"];
        if (typeof value === "object" && Object.keys(value).length > 0) {
            output += formatPerFileIgnores(value, "extend-per-file-ignores");
        }
    }

    return output;
}

export async function getTargetUri(): Promise<vscode.Uri | undefined> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    // dirroot
    console.log(workspaceFolders);

    // 优先使用第一个工作区文件夹（当前工作目录/文件夹根目录）
    if (workspaceFolders && workspaceFolders.length > 0) {
        const rootUri = workspaceFolders[0].uri;
        console.log(
            `Using workspace folder (root directory): ${rootUri.fsPath}`,
        );
        return rootUri;
    }

    // 如果没有工作区文件夹，尝试使用当前打开文件所在的目录
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && activeEditor.document.fileName) {
        const currentFileUri = vscode.Uri.file(activeEditor.document.fileName);
        const currentDirUri = currentFileUri.with({
            path: currentFileUri.path.substring(
                0,
                currentFileUri.path.lastIndexOf("/"),
            ),
        });
        console.log(`Using current file directory: ${currentDirUri.fsPath}`);
        return currentDirUri;
    }

    // 弹出文件夹选择对话框
    console.log("No workspace folders or open files, showing open dialog");
    const selected = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        openLabel: "Select folder to save ruff.toml",
    });

    console.log(`Selected folder: ${selected?.[0]?.fsPath}`);
    return selected?.[0];
}
