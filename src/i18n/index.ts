import * as vscode from "vscode";
import enData from "./en-us.json";
import zhCNData from "./zh-cn.json";

export type SupportedLanguage = "en" | "zh-CN";

export type TranslationField =
    | "name"
    | "linter"
    | "summary"
    | "message_formats"
    | "fix"
    | "explanation";

export interface RuffRule {
    code: string;
    name: string;
    linter: string;
    summary: string;
    message_formats: string[];
    fix: string;
    explanation: string;
    preview: boolean;
}

export type Translations = Record<string, Partial<RuffRule>>;

export const enTranslations: Translations = enData as Translations;
export const zhCNTranslations: Translations = zhCNData as Translations;

function getCurrentLanguage(): SupportedLanguage {
    const vscodeLang = vscode.env.language;
    if (vscodeLang.startsWith("zh")) {
        return "zh-CN";
    }
    return "en";
}

export function t(rule: RuffRule, field: TranslationField): string | string[] {
    const lang = getCurrentLanguage();

    const zhTranslation = zhCNTranslations[rule.code];
    if (zhTranslation && (zhTranslation as any)[field] !== undefined) {
        return (zhTranslation as any)[field];
    }

    const enTranslation = enTranslations[rule.code];
    if (enTranslation && (enTranslation as any)[field] !== undefined) {
        return (enTranslation as any)[field];
    }

    return (rule as any)[field] ?? "";
}

export function getExplanation(rule: RuffRule): string {
    return t(rule, "explanation") as string;
}

export function getName(rule: RuffRule): string {
    return t(rule, "name") as string;
}

export function getLinter(rule: RuffRule): string {
    return t(rule, "linter") as string;
}

export function getSummary(rule: RuffRule): string {
    return t(rule, "summary") as string;
}

export function getFix(rule: RuffRule): string {
    return t(rule, "fix") as string;
}

export function getLinterExplanation(linterCode: string): string {
    const lang = getCurrentLanguage();

    const zhTranslation = zhCNTranslations[linterCode];
    if (zhTranslation?.explanation) {
        return zhTranslation.explanation;
    }

    const enTranslation = enTranslations[linterCode];
    if (enTranslation?.explanation) {
        return enTranslation.explanation;
    }

    if (lang === "zh-CN") {
        return `${linterCode}（暂无详细解释）`;
    }
    return `${linterCode} (No detailed explanation available)`;
}
