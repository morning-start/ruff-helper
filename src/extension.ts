import * as vscode from "vscode";
import {
    createRuleDecorator,
    disposeRuleDecorator,
    updateDecorations,
} from "./decorator";
import {
    generateRuffToml,
    getConfigFromSettings,
    getTargetUri,
} from "./config";
import { findRule } from "./utils";
import { rules, prefixToLinterMap, getExplanation, getLinterExplanation } from "./i18n";

const outputChannel = vscode.window.createOutputChannel("Ruff Ignore Helper");

export function activate(context: vscode.ExtensionContext): void {
    outputChannel.appendLine("Ruff Ignore Helper is now active.");

    const ruleDecorator = createRuleDecorator();

    const hoverProvider = vscode.languages.registerHoverProvider(
        [
            { language: "toml", pattern: "**/pyproject.toml" },
            { language: "toml", pattern: "**/ruff.toml" },
        ],
        {
            provideHover(document, position, _token) {
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

                const linter = prefixToLinterMap[ruleCode];
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

    const activeEditorListener = vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
            if (editor) {
                outputChannel.appendLine(
                    `Active editor changed to ${editor.document.fileName}`,
                );
                updateDecorations(editor);
            }
        },
    );

    const documentChangeListener = vscode.workspace.onDidChangeTextDocument(
        (event) => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                updateDecorations(editor);
            }
        },
    );

    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        updateDecorations(activeEditor);
    }

    const generateConfigCommand = vscode.commands.registerCommand(
        "ruff-helper.generateConfig",
        async () => {
            try {
                const config = getConfigFromSettings();
                const ruffTomlContent = generateRuffToml(config);

                if (!ruffTomlContent.trim()) {
                    vscode.window.showInformationMessage(
                        "No configuration options are set. Please configure Ruff Helper in VS Code settings first.",
                    );
                    return;
                }

                const targetUri = await getTargetUri();
                if (!targetUri) {
                    vscode.window.showInformationMessage("No folder selected.");
                    return;
                }

                const ruffTomlUri = vscode.Uri.joinPath(targetUri, "ruff.toml");
                outputChannel.appendLine(`Writing to: ${ruffTomlUri.fsPath}`);

                try {
                    await vscode.workspace.fs.writeFile(
                        ruffTomlUri,
                        Buffer.from(ruffTomlContent, "utf-8"),
                    );
                    outputChannel.appendLine(
                        `Successfully wrote to: ${ruffTomlUri.fsPath}`,
                    );
                } catch (writeError) {
                    vscode.window.showErrorMessage(
                        `Error writing file: ${writeError}`,
                    );
                    outputChannel.appendLine(
                        `Error writing file: ${writeError}`,
                    );
                    return;
                }

                try {
                    const doc =
                        await vscode.workspace.openTextDocument(ruffTomlUri);
                    outputChannel.appendLine(
                        `Opened document: ${doc.uri.fsPath}`,
                    );
                    await vscode.window.showTextDocument(doc);
                    outputChannel.appendLine(
                        `Shown document: ${doc.uri.fsPath}`,
                    );
                } catch (openError) {
                    vscode.window.showErrorMessage(
                        `Error opening file: ${openError}`,
                    );
                    outputChannel.appendLine(
                        `Error opening file: ${openError}`,
                    );
                }

                outputChannel.appendLine(
                    `Generated ruff.toml at ${ruffTomlUri.fsPath}`,
                );
                vscode.window.showInformationMessage(
                    `ruff.toml created at ${ruffTomlUri.fsPath}`,
                );
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Error generating config: ${error}`,
                );
                outputChannel.appendLine(`Error generating config: ${error}`);
            }
        },
    );

    context.subscriptions.push(
        ruleDecorator,
        activeEditorListener,
        documentChangeListener,
        hoverProvider,
        generateConfigCommand,
    );
}

export function deactivate(): void {
    disposeRuleDecorator();
}
