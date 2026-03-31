import type { Translations } from "../provider";

export const zhCNTranslations: Translations = {
    AIR001: {
        name: "airflow-variable-name-task-id-mismatch",
        linter: "Airflow",
        summary: "任务变量名应与 `task_id` 匹配",
        message_formats: ['任务变量名应与 `task_id`: "{task_id}" 匹配'],
        fix: "暂无修复方法",
    },
    AIR301: {
        name: "airflow-dag-no-schedule-argument",
        linter: "Airflow",
        summary: "DAG 应有明确的 `schedule` 参数",
        message_formats: ["DAG 应有明确的 `schedule` 参数"],
        fix: "暂无修复方法",
    },
    AIR302: {
        name: "airflow3-removal",
        linter: "Airflow",
        summary: "`{deprecated}` 在 Airflow 3.0 中已移除",
        message_formats: [
            "`{deprecated}` 在 Airflow 3.0 中已移除",
            "`{deprecated}` 在 Airflow 3.0 中已移除",
            "`{deprecated}` 在 Airflow 3.0 中已移除; {message}",
        ],
        fix: "有时可用",
    },
    E501: {
        name: "line-too-long",
        summary: "代码行过长",
        message_formats: [
            "行超过 {LINE_LENGTH} 个字符 ({_LINE} > {LINE_LENGTH})",
        ],
        fix: "可用（手动修复）",
        explanation:
            "## 规则说明\n检查代码行长度是否超过最大限制。\n\n## 为什么不好\n过长的代码行不利于阅读和维护，特别是在不同屏幕尺寸下。\n\n## 示例\n```python\n# 过长的代码行\nthis_is_a_very_long_line_of_code_that_exceeds_the_maximum_line_length_and_should_be_refactored()\n```\n\n请将代码行控制在 88 个字符以内，或通过配置调整限制。",
    },
    F401: {
        name: "unused-import",
        summary: "导入的模块未使用",
        message_formats: ["`{name}` 导入但未使用"],
        fix: "可用（移除未使用的导入）",
        explanation:
            '## 规则说明\n检查导入的模块是否被使用但未被引用。\n\n## 为什么不好\n未使用的导入会增加代码复杂度，造成混淆，且浪费资源。\n\n## 示例\n```python\nimport os  # 导入了但未使用\nimport sys\n\ndef main():\n    print("hello")\n```\n\n使用 instead:\n```python\nimport sys\n\ndef main():\n    print("hello")\n```',
    },
    F841: {
        name: "unused-variable",
        summary: "存在未使用的局部变量",
        message_formats: ["局部变量 `{name}` 未使用"],
        fix: "可用（移除未使用的变量）",
        explanation:
            "## 规则说明\n检查是否存在未使用的局部变量。\n\n## 为什么不好\n未使用的变量会增加代码复杂度，造成混淆。\n\n## 示例\n```python\ndef foo():\n    x = 1  # 变量 x 未被使用\n    return 2\n```\n\n使用 instead:\n```python\ndef foo():\n    return 2\n```",
    },
    B905: {
        name: "zip-tautological-comparison",
        summary: "zip() 缺少 strict 参数",
        message_formats: ["zip() 缺少 strict 参数比较"],
        fix: "暂无",
        explanation:
            "## 规则说明\n检查是否使用了未关闭的 zip() 函数（Python 3.10+）。\n\n## 为什么不好\n在 Python 3.10 及以上版本，zip() 默认启用 strict 模式，需要显式处理长度不一致的情况。\n\n## 示例\n```python\nlist(zip([1, 2, 3], [4, 5]))  # 会发出警告\n```\n\n使用 instead:\n```python\nlist(zip([1, 2, 3], [4, 5], strict=True))\n```",
    },
    E302: {
        name: "missing-blank-lines",
        summary: "代码块之间缺少空行",
        message_formats: ["代码块之间需要 {blank_lines} 个空行"],
        fix: "可用",
        explanation:
            "## 规则说明\n检查代码块之间是否有足够的空行。\n\n## 为什么不好\n保持一致的空行间距可以提高代码可读性。\n\n## 示例\n```python\ndef foo():\n    pass\ndef bar():  # 函数定义前需要两个空行\n    pass\n```",
    },
    E305: {
        name: "missing-blank-lines-after-class-or-function-definition",
        summary: "函数或类定义后缺少空行",
        message_formats: ["函数或类定义后需要 2 个空行"],
        fix: "可用",
        explanation:
            "## 规则说明\n检查函数或类定义后是否有正确的空行。\n\n## 为什么不好\n在函数或类定义后保持一致的空行有助于代码结构的清晰度。",
    },
    W503: {
        name: "line-break-before-binary-operator",
        summary: "运算符前换行（已弃用）",
        message_formats: ["行在运算符前断开"],
        fix: "暂无",
        explanation:
            "## 规则说明\n检查行中断是否在运算符之前（已弃用）。\n\n## 注意\n此规则在较新版本的 ruff 中已弃用，推荐使用 W504。",
    },
    W504: {
        name: "line-break-after-binary-operator",
        summary: "运算符后换行",
        message_formats: ["行在运算符后断开"],
        fix: "暂无",
        explanation:
            "## 规则说明\n检查行中断是否在运算符之后。\n\n## 为什么不好\n将运算符放在行首可能会导致意外的合并问题。",
    },
};
