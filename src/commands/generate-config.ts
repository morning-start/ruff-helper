export interface RuffConfigOption {
    name: string;
    type: "array" | "string" | "boolean" | "nest";
    description: string;
    values?: string[];
    nestedConfig?: RuffConfigOption[];
}

export const ruffConfigOptions: RuffConfigOption[] = [
    {
        name: "select",
        type: "array",
        description: "Select specific rules to enable",
    },
    {
        name: "ignore",
        type: "array",
        description: "Select specific rules to disable",
    },
    {
        name: "extend-select",
        type: "array",
        description: "Extend the default selection with additional rules",
    },
    {
        name: "extend-ignore",
        type: "array",
        description: "Extend the default ignore list with additional rules",
    },
    {
        name: "fixable",
        type: "array",
        description: "Restrict fixable rules",
    },
    {
        name: "unfixable",
        type: "array",
        description: "Restrict unfixable rules",
    },
    {
        name: "extend-fixable",
        type: "array",
        description: "Extend fixable rules",
    },
    {
        name: "extend-unfixable",
        type: "array",
        description: "Extend unfixable rules",
    },
    {
        name: "per-file-ignores",
        type: "nest",
        description: "Ignore specific rules for specific files",
        nestedConfig: [
            {
                name: "file-pattern",
                type: "string",
                description: "File pattern (e.g., **/migrations/**/*.py)",
            },
            {
                name: "rules",
                type: "array",
                description: "Rules to ignore for this pattern",
            },
        ],
    },
    {
        name: "extend-per-file-ignores",
        type: "nest",
        description: "Extend per-file ignores",
        nestedConfig: [
            {
                name: "file-pattern",
                type: "string",
                description: "File pattern",
            },
            {
                name: "rules",
                type: "array",
                description: "Rules to ignore for this pattern",
            },
        ],
    },
    {
        name: "target-version",
        type: "string",
        description: "Target Python version",
        values: ["py38", "py39", "py310", "py311", "py312", "py313", "py314"],
    },
    {
        name: "line-length",
        type: "string",
        description: "Maximum line length",
        values: ["80", "100", "120", "150", "200"],
    },
    {
        name: "indent-width",
        type: "string",
        description: "Indentation width",
        values: ["2", "4", "8"],
    },
    {
        name: "fix",
        type: "boolean",
        description: "Attempt to fix rule violations",
    },
    {
        name: "unsafe-fixes",
        type: "boolean",
        description: "Include fixes that may change runtime behavior",
    },
    {
        name: "exit-zero",
        type: "boolean",
        description: "Exit with status code 0 even with violations",
    },
    {
        name: "format",
        type: "string",
        description: "Output format",
        values: ["json", "text", "sarif", "grouped", "json-lines"],
    },
];

export const lintSectionOptions: RuffConfigOption[] = [
    {
        name: "select",
        type: "array",
        description: "Select specific lint rules to enable",
    },
    {
        name: "ignore",
        type: "array",
        description: "Select specific lint rules to disable",
    },
    {
        name: "extend-select",
        type: "array",
        description: "Extend the default lint selection",
    },
    {
        name: "extend-ignore",
        type: "array",
        description: "Extend the default lint ignore list",
    },
    {
        name: "fixable",
        type: "array",
        description: "Restrict fixable lint rules",
    },
    {
        name: "unfixable",
        type: "array",
        description: "Restrict unfixable lint rules",
    },
    {
        name: "extend-fixable",
        type: "array",
        description: "Extend fixable lint rules",
    },
    {
        name: "extend-unfixable",
        type: "array",
        description: "Extend unfixable lint rules",
    },
    {
        name: "per-file-ignores",
        type: "nest",
        description: "Ignore specific lint rules for specific files",
        nestedConfig: [
            {
                name: "file-pattern",
                type: "string",
                description: "File pattern",
            },
            {
                name: "rules",
                type: "array",
                description: "Rules to ignore",
            },
        ],
    },
    {
        name: "extend-per-file-ignores",
        type: "nest",
        description: "Extend lint per-file ignores",
        nestedConfig: [
            {
                name: "file-pattern",
                type: "string",
                description: "File pattern",
            },
            {
                name: "rules",
                type: "array",
                description: "Rules to ignore",
            },
        ],
    },
];
