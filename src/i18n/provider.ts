export type SupportedLanguage = "en" | "zh-CN";

export type TranslationField =
    | "name"
    | "linter"
    | "summary"
    | "message_formats"
    | "fix"
    | "explanation";

export interface RuleTranslation {
    name?: string;
    linter?: string;
    summary?: string;
    message_formats?: string[];
    fix?: string;
    explanation?: string;
}

export type Translations = Record<string, RuleTranslation>;
