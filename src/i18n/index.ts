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

interface TranslationResult {
    translation: Partial<RuffRule> | undefined;
    lang: SupportedLanguage;
}

function getTranslation(code: string): TranslationResult {
    const lang = getCurrentLanguage();

    if (lang === "zh-CN" && zhCNTranslations[code]) {
        return { translation: zhCNTranslations[code], lang };
    }

    if (enTranslations[code]) {
        return { translation: enTranslations[code], lang: "en" };
    }

    return { translation: undefined, lang };
}

function getFieldValue<T>(rule: RuffRule, field: TranslationField): T {
    const { translation } = getTranslation(rule.code);

    if (translation && (translation as any)[field] !== undefined) {
        return (translation as any)[field];
    }

    return (rule as any)[field];
}

export function t(rule: RuffRule, field: TranslationField): string | string[] {
    return getFieldValue<string | string[]>(rule, field);
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

function getLinterExplanationText(code: string): string | undefined {
    const { translation } = getTranslation(code);
    return translation?.explanation;
}

function getNoExplanationMessage(lang: SupportedLanguage): string {
    return lang === "zh-CN"
        ? "（暂无详细解释）"
        : " (No detailed explanation available)";
}

export function getLinterExplanation(linterCode: string): string {
    const lang = getCurrentLanguage();
    const explanation = getLinterExplanationText(linterCode);

    if (explanation) {
        return explanation;
    }

    return `${linterCode}${getNoExplanationMessage(lang)}`;
}
