import * as vscode from "vscode";
import { createRuleDecorator, disposeRuleDecorator, updateDecorations } from "./providers/decorator";
import { createHoverProvider } from "./providers/hover";
import { generateRuffToml, getConfigFromSettings, getTargetUri } from "./services/config";

const outputChannel = vscode.window.createOutputChannel("Ruff Ignore Helper");

export function activate(context: vscode.ExtensionContext): void {
    outputChannel.appendLine("Ruff Ignore Helper is now active.");

    const ruleDecorator = createRuleDecorator();
    const hoverProvider = createHoverProvider();

    const activeEditorListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            outputChannel.appendLine(`Active editor changed to ${editor.document.fileName}`);
            updateDecorations(editor);
        }
    });

    const documentChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document) {
            updateDecorations(editor);
        }
    });

    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        updateDecorations(activeEditor);
    }

    const generateConfigCommand = vscode.commands.registerCommand(
        "ruff-helper.generateConfig",
        async () => {
            await generateConfig();
        },
    );

    context.subscriptions.push(
        ruleDecorator,
        hoverProvider,
        activeEditorListener,
        documentChangeListener,
        generateConfigCommand,
    );
}

async function generateConfig(): Promise<void> {
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
        await vscode.workspace.fs.writeFile(ruffTomlUri, Buffer.from(ruffTomlContent, "utf-8"));
        outputChannel.appendLine(`Successfully wrote to: ${ruffTomlUri.fsPath}`);
    } catch (writeError) {
        vscode.window.showErrorMessage(`Error writing file: ${writeError}`);
        outputChannel.appendLine(`Error writing file: ${writeError}`);
        return;
    }

    try {
        const doc = await vscode.workspace.openTextDocument(ruffTomlUri);
        outputChannel.appendLine(`Opened document: ${doc.uri.fsPath}`);
        await vscode.window.showTextDocument(doc);
        outputChannel.appendLine(`Shown document: ${doc.uri.fsPath}`);
    } catch (openError) {
        vscode.window.showErrorMessage(`Error opening file: ${openError}`);
        outputChannel.appendLine(`Error opening file: ${openError}`);
        return;
    }

    outputChannel.appendLine(`Generated ruff.toml at ${ruffTomlUri.fsPath}`);
    vscode.window.showInformationMessage(`ruff.toml created at ${ruffTomlUri.fsPath}`);
}

export function deactivate(): void {
    disposeRuleDecorator();
}
