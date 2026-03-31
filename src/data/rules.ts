import enData from "../i18n/en-us.json";

interface RuleData {
    name: string;
    code: string;
    linter: string;
    summary: string;
    message_formats: string[];
    fix: string;
    explanation: string;
    preview: boolean;
}

const rulesArray: RuleData[] = [];
const linterMap: Record<string, string> = {};

for (const [code, rule] of Object.entries(enData)) {
    const r = rule as any;
    rulesArray.push({
        name: r.name,
        code,
        linter: r.linter,
        summary: r.summary,
        message_formats: r.message_formats,
        fix: r.fix,
        explanation: r.explanation,
        preview: r.preview,
    });

    const match = code.match(/^[A-Z]+/);
    if (match) {
        const prefix = match[0];
        if (!linterMap[prefix]) {
            linterMap[prefix] = r.linter;
        }
    }
}

export interface RuffRule {
    name: string;
    code: string;
    linter: string;
    summary: string;
    message_formats: string[];
    fix: string;
    explanation: string;
    preview: boolean;
}

export const rules: RuffRule[] = rulesArray;

export const prefixToLinterMap: Record<string, string> = linterMap;
