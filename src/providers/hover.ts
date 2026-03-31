import * as vscode from "vscode";
import { findRule } from "../utils";
import { prefixToLinterMap } from "../data/rules";
import { getExplanation, getLinterExplanation } from "../i18n/index";

export function createHoverProvider(): vscode.Disposable {
    return vscode.languages.registerHoverProvider(
        [
            { language: "toml", pattern: "**/pyproject.toml" },
            { language: "toml", pattern: "**/ruff.toml" },
        ],
        {
            provideHover(document, position) {
                const range = document.getWordRangeAtPosition(
                    position,
                    /["'][A-Z0-9]+["']/,
                );
                if (!range) {
                    return null;
                }

                const text = document.getText(range);
                const ruleCode = text.replaceAll(/["']/g, "");

                const rule = findRule(ruleCode);
                if (rule) {
                    return new vscode.Hover(
                        new vscode.MarkdownString(getExplanation(rule)),
                        range,
                    );
                }

                const linter = prefixToLinterMap.get(ruleCode);
                if (linter) {
                    return new vscode.Hover(
                        getLinterExplanation(linter),
                        range,
                    );
                }

                return null;
            },
        },
    );
}
