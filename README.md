# ruff-helper

ruff-helper 是一个 VS Code 扩展，集成了 [jannchie.ruff-ignore-explainer](https://github.com/jannchie/ruff-ignore-explainer) 的规则解释功能，并提供可视化配置界面来生成 ruff 配置文件。

## 功能特性

### 1. 规则解释器

在 `pyproject.toml` 或 `ruff.toml` 文件中，悬停在规则代码上即可显示详细的规则解释：

- **规则说明**：解释规则检查的内容
- **代码示例**：提供错误示例和正确示例
- **修复建议**：说明是否支持自动修复

支持的规则前缀：

- `E` / `W` - pycodestyle 规则
- `F` - pyflakes 规则
- `I` - isort 规则
- `B` - flake8-bugbear 规则
- `RUF` - ruff 专用规则

**装饰提示**：在规则代码（如 `"E501"`）旁边显示规则名称作为内联提示，可通过 `showDecorations` 配置开关

### 2. 可视化配置

通过 VS Code 设置页面配置 ruff 规则，无需手写 TOML：

#### Lint 配置

| 配置项             | 说明                 | 默认值                         |
| ------------------ | -------------------- | ------------------------------ |
| `select`           | 启用的规则           | `E`, `W`, `F`, `I`, `B`, `RUF` |
| `ignore`           | 禁用的规则           | `E501`, `F401`, `F841`, `B905` |
| `extend-select`    | 额外启用的规则       | -                              |
| `extend-ignore`    | 额外禁用的规则       | -                              |
| `fixable`          | 只包含可修复的规则   | `ALL`                          |
| `unfixable`        | 只包含不可修复的规则 | -                              |
| `per-file-ignores` | 文件级别忽略规则     | `{}`                           |
| `target-version`   | 目标 Python 版本     | `py312`                        |

#### 格式配置

| 配置项         | 说明       | 默认值   |
| -------------- | ---------- | -------- |
| `line-length`  | 最大行长度 | `88`     |
| `indent-width` | 缩进宽度   | `4`      |
| `quote-style`  | 引号风格   | `double` |
| `indent-style` | 缩进风格   | `space`  |

#### 高级选项

| 配置项            | 说明                     | 默认值                                          |
| ----------------- | ------------------------ | ----------------------------------------------- |
| `fix`             | 自动修复违规             | `false`                                         |
| `unsafe-fixes`    | 包含可能改变行为的修复   | `false`                                         |
| `exit-zero`       | 即使有违规也返回 0       | `false`                                         |
| `extend-exclude`  | 排除的文件和目录         | `.*`, `__pycache__`, `build`, `dist`, `*.ipynb` |
| `showDecorations` | 在规则代码旁显示装饰提示 | `true`                                          |

### 3. 生成配置文件

使用命令面板（`Ctrl+Shift+P`）执行 **Generate ruff.toml Configuration**，可以将配置写入工作目录的 `ruff.toml` 文件。

生成的配置文件结构：

```toml
line-length = 88
target-version = "py312"
extend-exclude = [".*", "__pycache__", "build", "dist", "*.ipynb"]

[lint]
select = ["E", "W", "F", "I", "B", "RUF"]
ignore = ["E501", "F401", "F841", "B905"]

[format]
quote-style = "double"
indent-style = "space"
```

## 安装要求

- VS Code 1.107.0 或更高版本
- ruff（用于实际运行 linting）

## 使用示例

### 配置规则

1. 打开 VS Code 设置（`Ctrl+,`）
2. 搜索 "Ruff Helper"
3. 根据需要调整配置项

### 生成配置文件

1. 打开你的 Python 项目
2. 按 `Ctrl+Shift+P` 打开命令面板
3. 输入 "Generate ruff.toml Configuration"
4. 选择命令执行
5. `ruff.toml` 将生成到工作区根目录

### 查看规则解释

1. 打开 `pyproject.toml` 或 `ruff.toml` 文件
2. 将鼠标悬停在规则代码上（如 `"E501"`）
3. 查看规则说明和示例

## 配置示例

### 严格模式

```json
{
    "ruffHelper.select": ["E", "W", "F", "I", "B", "RUF", "UP", "N", "C90"],
    "ruffHelper.ignore": ["E501", "F401"],
    "ruffHelper.lineLength": 79,
    "ruffHelper.targetVersion": "py311"
}
```

### 宽松模式

```json
{
    "ruffHelper.select": ["E", "W"],
    "ruffHelper.ignore": ["E501", "E302", "E305", "W503", "W504"],
    "ruffHelper.lineLength": 120
}
```

## 工作原理

本扩展集成了 [jannchie/ruff-ignore-explainer](https://github.com/jannchie/ruff-ignore-explainer) 的规则数据库，提供：

1. **Hover Provider**：当用户在 TOML 文件中悬停规则代码时，显示规则解释
2. **Decorator**：在规则代码旁显示规则名称作为内联提示
3. **配置生成器**：读取 VS Code 设置，生成标准格式的 `ruff.toml`

## 许可证

MIT
