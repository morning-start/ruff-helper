import type { RuffRule } from "./data/rules";
import { rules } from "./data/rules";

export function kebabToTitleCase(str: string): string {
    return str
        .replaceAll("-", " ")
        .toLowerCase()
        .replaceAll(/\b\w/g, (char) => char.toUpperCase());
}

export function findRule(ruleCode: string): RuffRule | undefined {
    return rules.find((r) => r.code === ruleCode);
}

export function getLinterForRule(ruleCode: string): string | undefined {
    const prefix = ruleCode.match(/^[A-Z]+/)?.[0];
    return prefix;
}

export function getLinters(): string[] {
    const linters = new Set<string>();
    rules.forEach((rule) => linters.add(rule.linter));
    return Array.from(linters).sort();
}

export function getRulesByLinter(linter: string): string[] {
    return rules
        .filter((rule) => rule.linter === linter)
        .map((rule) => rule.code)
        .sort();
}

export function getRulesByPrefix(prefix: string): string[] {
    return rules
        .filter((rule) => rule.code.startsWith(prefix))
        .map((rule) => rule.code)
        .sort();
}

export function getAllRuleCodes(): string[] {
    return rules.map((r) => r.code).sort();
}
