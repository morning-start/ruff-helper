import * as vscode from "vscode";
import type { RuffRule } from "../data/rules";
import type { SupportedLanguage, TranslationField } from "./provider";
import { enTranslations, zhCNTranslations } from "./locales";

export type { SupportedLanguage, TranslationField };

function getCurrentLanguage(): SupportedLanguage {
    const vscodeLang = vscode.env.language;
    if (vscodeLang.startsWith("zh")) {
        return "zh-CN";
    }
    return "en";
}

export function t(rule: RuffRule, field: TranslationField): string | string[] {
    const lang = getCurrentLanguage();

    if (lang === "zh-CN") {
        const zhRule = zhCNTranslations[rule.code];
        if (zhRule) {
            const value = (zhRule as any)[field];
            if (value !== undefined) {
                return value;
            }
        }
    }

    const enRule = enTranslations[rule.code];
    if (enRule) {
        const value = (enRule as any)[field];
        if (value !== undefined) {
            return value;
        }
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

export function getLinterExplanation(linter: string): string {
    const lang = getCurrentLanguage();
    if (lang === "zh-CN") {
        return `${linter}（暂无详细解释）`;
    }
    return `${linter} (No detailed explanation available)`;
}
