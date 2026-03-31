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

const TOP_LEVEL_CONFIGS = ["lineLength", "targetVersion", "extendExclude"];

const LINT_CONFIGS = [
    "select",
    "ignore",
    "extendSelect",
    "extendIgnore",
    "fixable",
    "unfixable",
    "extendFixable",
    "extendUnfixable",
    "perFileIgnores",
    "extendPerFileIgnores",
];

const FORMAT_CONFIGS = ["quoteStyle", "indentStyle", "skipMagicTrailingComma"];

function formatConfigValue(
    key: string,
    value: any,
    ruffKey: string,
): string {
    if (typeof value === "boolean") {
        return `${ruffKey} = ${value}\n`;
    } else if (typeof value === "number") {
        return `${ruffKey} = ${value}\n`;
    } else if (Array.isArray(value) && value.length > 0) {
        return formatArrayValue(ruffKey, value);
    } else if (typeof value === "string" && value) {
        return `${ruffKey} = "${value}"\n`;
    }
    return "";
}

export function generateRuffToml(config: Record<string, any>): string {
    let output = "";

    for (const vscodeKey of TOP_LEVEL_CONFIGS) {
        const ruffKey = CONFIG_KEY_MAP[vscodeKey];
        if (config[vscodeKey] !== undefined && ruffKey) {
            const value = config[vscodeKey];
            if (
                vscodeKey === "extendExclude" &&
                Array.isArray(value) &&
                value.length > 0
            ) {
                output += formatArrayValue(ruffKey, value);
            } else if (
                vscodeKey === "lineLength" ||
                vscodeKey === "targetVersion"
            ) {
                output += formatConfigValue(vscodeKey, value, ruffKey);
            }
        }
    }

    const lintConfigs: string[] = [];
    for (const vscodeKey of LINT_CONFIGS) {
        const ruffKey = CONFIG_KEY_MAP[vscodeKey];
        if (config[vscodeKey] !== undefined && ruffKey) {
            const value = config[vscodeKey];
            if (
                vscodeKey === "perFileIgnores" ||
                vscodeKey === "extendPerFileIgnores"
            ) {
                if (
                    typeof value === "object" &&
                    Object.keys(value).length > 0
                ) {
                    lintConfigs.push(formatPerFileIgnores(value, ruffKey));
                }
            } else {
                const formatted = formatConfigValue(
                    vscodeKey,
                    value,
                    ruffKey,
                );
                if (formatted) {
                    lintConfigs.push(formatted);
                }
            }
        }
    }

    if (lintConfigs.length > 0) {
        output += "\n[lint]\n";
        output += lintConfigs.join("");
    }

    const formatConfigs: string[] = [];
    for (const vscodeKey of FORMAT_CONFIGS) {
        const ruffKey = CONFIG_KEY_MAP[vscodeKey];
        if (config[vscodeKey] !== undefined && ruffKey) {
            const value = config[vscodeKey];
            const formatted = formatConfigValue(vscodeKey, value, ruffKey);
            if (formatted) {
                formatConfigs.push(formatted);
            }
        }
    }

    if (formatConfigs.length > 0) {
        output += "\n[format]\n";
        output += formatConfigs.join("");
    }

    return output;
}

export async function getTargetUri(): Promise<vscode.Uri | undefined> {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders && workspaceFolders.length > 0) {
        const rootUri = workspaceFolders[0].uri;
        console.log(
            `Using workspace folder (root directory): ${rootUri.fsPath}`,
        );
        return rootUri;
    }

    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && activeEditor.document.fileName) {
        const currentFileUri = vscode.Uri.file(
            activeEditor.document.fileName,
        );
        const currentDirUri = currentFileUri.with({
            path: currentFileUri.path.substring(
                0,
                currentFileUri.path.lastIndexOf("/"),
            ),
        });
        console.log(`Using current file directory: ${currentDirUri.fsPath}`);
        return currentDirUri;
    }

    try {
        const currentWorkingDir = process.cwd();
        const currentDirUri = vscode.Uri.file(currentWorkingDir);
        console.log(
            `Using current working directory: ${currentDirUri.fsPath}`,
        );
        return currentDirUri;
    } catch (error) {
        console.log(`Error getting current working directory: ${error}`);
        return undefined;
    }
}
