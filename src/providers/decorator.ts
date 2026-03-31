import * as vscode from "vscode";
import * as toml from "@iarna/toml";
import { findRule, kebabToTitleCase } from "../utils";
import { getExplanation, getName, getLinter } from "../i18n/index";

let ruleDecorator: vscode.TextEditorDecorationType | undefined;

export function createRuleDecorator(): vscode.TextEditorDecorationType {
    if (ruleDecorator) {
        return ruleDecorator;
    }

    ruleDecorator = vscode.window.createTextEditorDecorationType({
        after: {
            margin: "0 0 0 3px",
            color: new vscode.ThemeColor("editorInlayHint.foreground"),
            fontStyle: "italic",
        },
        isWholeLine: false,
    });
    return ruleDecorator;
}

export function disposeRuleDecorator(): void {
    if (ruleDecorator && !ruleDecorator.dispose) {
        ruleDecorator.dispose();
        ruleDecorator = undefined;
    }
}

export function isRuffConfigFile(fileName: string): boolean {
    return (
        fileName.endsWith("pyproject.toml") || fileName.endsWith("ruff.toml")
    );
}

function extractRulesFromPerFileIgnores(
    perFileIgnores: Record<string, string[]>,
): string[] {
    const rules: string[] = [];
    for (const filePattern in perFileIgnores) {
        if (Array.isArray(perFileIgnores[filePattern])) {
            rules.push(...perFileIgnores[filePattern]);
        }
    }
    return rules;
}

function getAllRulesFromConfig(ruffConfig: any): Set<string> {
    const ruleArrays = [
        ruffConfig.ignore || [],
        ruffConfig.select || [],
        ruffConfig["extend-select"] || [],
        ruffConfig["extend-ignore"] || [],
        ruffConfig.fixable || [],
        ruffConfig.unfixable || [],
        ruffConfig.lint?.ignore || [],
        ruffConfig.lint?.select || [],
        ruffConfig.lint?.["extend-select"] || [],
        ruffConfig.lint?.["extend-ignore"] || [],
        ruffConfig.lint?.["extend-fixable"] || [],
        ruffConfig.lint?.["extend-unfixable"] || [],
        extractRulesFromPerFileIgnores(ruffConfig["per-file-ignores"] || {}),
        extractRulesFromPerFileIgnores(
            ruffConfig["extend-per-file-ignores"] || {},
        ),
        extractRulesFromPerFileIgnores(
            ruffConfig.lint?.["per-file-ignores"] || {},
        ),
        extractRulesFromPerFileIgnores(
            ruffConfig.lint?.["extend-per-file-ignores"] || {},
        ),
        ruffConfig.lint?.fixable || [],
        ruffConfig.lint?.unfixable || [],
    ];

    return new Set(ruleArrays.flat());
}

function createDecoration(
    position: vscode.Position,
    rule: string,
    isAfterComma: boolean,
    isAfterBracket: boolean,
): vscode.DecorationOptions {
    const ruleInfo = findRule(rule);
    let contentText = "";
    let hoverMessage: vscode.MarkdownString | undefined;

    if (ruleInfo) {
        const translatedName = getName(ruleInfo);
        const translatedLinter = getLinter(ruleInfo);
        contentText = ` ${kebabToTitleCase(translatedName)} (${translatedLinter})`;
        hoverMessage = new vscode.MarkdownString(getExplanation(ruleInfo));
    }

    if (isAfterBracket) {
        return {
            range: new vscode.Range(position, position),
            renderOptions: {
                before: { contentText },
            },
            hoverMessage,
        };
    }

    return {
        range: new vscode.Range(position, position),
        renderOptions: {
            after: { contentText },
        },
        hoverMessage,
    };
}

export function updateDecorations(editor: vscode.TextEditor): void {
    const fileName = editor.document.fileName;

    if (!isRuffConfigFile(fileName)) {
        return;
    }

    const showDecorations = vscode.workspace
        .getConfiguration("ruffHelper")
        .get<boolean>("showDecorations", true);

    if (!ruleDecorator) {
        return;
    }

    const text = editor.document.getText();
    const isRuffToml = fileName.endsWith("ruff.toml");

    try {
        const config = toml.parse(text) as any;
        let ruffConfig: any;

        if (isRuffToml) {
            ruffConfig = config;
        } else {
            if (!config.tool || !config.tool.ruff) {
                return;
            }
            ruffConfig = config.tool.ruff;
        }

        const allRules = getAllRulesFromConfig(ruffConfig);
        const decorations: vscode.DecorationOptions[] = [];

        for (const rule of allRules) {
            const rulePattern = new RegExp(`["']${rule}["']`, "g");

            for (let i = 0; i < editor.document.lineCount; i++) {
                const line = editor.document.lineAt(i);
                const lineText = line.text;
                const matches = [...lineText.matchAll(rulePattern)];

                for (const match of matches) {
                    if (match.index === undefined) {
                        continue;
                    }

                    const startPos = match.index + match[0].length;
                    const position = new vscode.Position(i, startPos);
                    const textAfterRule = lineText.slice(Math.max(0, startPos));
                    const commaMatch = textAfterRule.match(/^\s*,/);
                    const bracketMatch = textAfterRule.match(/^\s*\]/);

                    const isAfterComma = !!commaMatch;
                    const isAfterBracket = !!bracketMatch;

                    let decorationPosition = position;
                    if (isAfterComma && commaMatch) {
                        decorationPosition = new vscode.Position(
                            i,
                            startPos + commaMatch[0].length,
                        );
                    }

                    decorations.push(
                        createDecoration(
                            decorationPosition,
                            rule,
                            isAfterComma,
                            isAfterBracket,
                        ),
                    );
                }
            }
        }

        if (showDecorations) {
            editor.setDecorations(ruleDecorator, decorations);
        } else {
            editor.setDecorations(ruleDecorator, []);
        }
    } catch (error) {
        console.error("Error parsing TOML or applying decorations:", error);
    }
}
