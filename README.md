# Ruff Helper

<p align="center">
  <img src="logo.jpg" alt="Ruff Helper Logo" width="128">
</p>

<p align="center">
  <strong>VS Code 扩展，让 Ruff 配置更简单</strong>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=morning-start.ruff-helper">
    <img src="https://img.shields.io/visual-studio-marketplace/v/morning-start.ruff-helper" alt="Version">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=morning-start.ruff-helper">
    <img src="https://img.shields.io/visual-studio-marketplace/d/morning-start.ruff-helper" alt="Downloads">
  </a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

---

## 功能概览

| 功能               | 描述                                          |
| ------------------ | --------------------------------------------- |
| 🔍 **规则解释器**   | 悬停查看 Ruff 规则的详细说明和代码示例        |
| ⚙️ **可视化配置**   | 通过 VS Code 设置界面配置 Ruff，无需手写 TOML |
| 📝 **配置文件生成** | 一键生成 `ruff.toml` 配置文件                 |
| ✨ **内联提示**     | 在规则代码旁显示规则名称装饰                  |

---

## 快速开始

### 安装

1. 打开 VS Code
2. 进入扩展市场（`Ctrl+Shift+X`）
3. 搜索 "Ruff Helper"
4. 点击安装

### 基本使用

#### 1. 查看规则解释

在 `pyproject.toml` 或 `ruff.toml` 文件中，将鼠标悬停在规则代码上：

```toml
[lint]
select = ["E501", "F401"]  # ← 悬停查看解释
```

#### 2. 配置 Ruff 规则

打开 VS Code 设置（`Ctrl+,`），搜索 "Ruff Helper" 进行配置。

#### 3. 生成配置文件

按 `Ctrl+Shift+P` 打开命令面板，执行 **"Generate ruff.toml Configuration"**。

---

## 功能详解

### 规则解释器

集成 [jannchie/ruff-ignore-explainer](https://github.com/jannchie/ruff-ignore-explainer) 的规则数据库，提供：

- **规则说明**：解释规则检查的内容
- **代码示例**：错误示例和正确示例
- **修复建议**：是否支持自动修复

支持以下规则前缀：

| 前缀 | 说明 | 来源 |
|------|------|------|
| `E` / `W` | pycodestyle 规则 | [pycodestyle](https://pycodestyle.pycqa.org/) |
| `F` | pyflakes 规则 | [Pyflakes](https://github.com/PyCQA/pyflakes) |
| `I` | import 排序规则 | [isort](https://pycqa.github.io/isort/) |
| `B` | 潜在 bug 检测 | [flake8-bugbear](https://github.com/PyCQA/flake8-bugbear) |
| `RUF` | Ruff 专用规则 | Ruff |

### 可视化配置

通过 VS Code 设置界面配置所有 Ruff 选项：

#### Lint 配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `ruffHelper.select` | 数组 | `["E", "W", "F", "I", "B", "RUF"]` | 启用的规则 |
| `ruffHelper.ignore` | 数组 | `["E501", "F401", "F841", "B905"]` | 禁用的规则 |
| `ruffHelper.extendSelect` | 数组 | `[]` | 额外启用的规则 |
| `ruffHelper.extendIgnore` | 数组 | `[]` | 额外禁用的规则 |
| `ruffHelper.fixable` | 数组 | `["ALL"]` | 可自动修复的规则 |
| `ruffHelper.unfixable` | 数组 | `[]` | 不可自动修复的规则 |
| `ruffHelper.perFileIgnores` | 对象 | `{}` | 文件级别的忽略规则 |
| `ruffHelper.targetVersion` | 字符串 | `"py312"` | 目标 Python 版本 |

#### Format 配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `ruffHelper.lineLength` | 数字 | `88` | 最大行长度 |
| `ruffHelper.indentWidth` | 数字 | `4` | 缩进宽度 |
| `ruffHelper.quoteStyle` | 枚举 | `"double"` | 引号风格 |
| `ruffHelper.indentStyle` | 枚举 | `"space"` | 缩进风格 |

#### 高级选项

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `ruffHelper.fix` | 布尔 | `false` | 自动修复违规 |
| `ruffHelper.unsafeFixes` | 布尔 | `false` | 包含可能改变行为的修复 |
| `ruffHelper.exitZero` | 布尔 | `false` | 即使有违规也返回 0 |
| `ruffHelper.extendExclude` | 数组 | `[".*", "__pycache__", ...]` | 排除的文件和目录 |
| `ruffHelper.showDecorations` | 布尔 | `true` | 显示规则名称装饰 |

### 生成的配置文件示例

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

---

## 配置示例

### 严格模式

适合追求代码质量的项目：

```json
{
    "ruffHelper.select": ["E", "W", "F", "I", "B", "RUF", "UP", "N", "C90"],
    "ruffHelper.ignore": ["E501", "F401"],
    "ruffHelper.lineLength": 79,
    "ruffHelper.targetVersion": "py311"
}
```

### 宽松模式

适合快速开发的项目：

```json
{
    "ruffHelper.select": ["E", "W"],
    "ruffHelper.ignore": ["E501", "E302", "E305", "W503", "W504"],
    "ruffHelper.lineLength": 120
}
```

### 数据科学项目

适合 Jupyter Notebook 项目：

```json
{
    "ruffHelper.select": ["E", "W", "F", "I"],
    "ruffHelper.ignore": ["E501", "F401"],
    "ruffHelper.lineLength": 100,
    "ruffHelper.extendExclude": [".*", "__pycache__", "*.ipynb", ".venv"]
}
```

---

## 快捷键

| 快捷键 | 命令 |
|--------|------|
| `Ctrl+Shift+P` | 打开命令面板 |
| `Ctrl+,` | 打开设置 |

---

## 系统要求

- VS Code 1.89.0 或更高版本
- [Ruff](https://github.com/astral-sh/ruff)（用于实际运行 linting）

---

## 工作原理

本扩展通过以下方式工作：

1. **Hover Provider**：当用户在 TOML 文件中悬停规则代码时，显示规则解释
2. **Decorator**：在规则代码旁显示规则名称作为内联提示
3. **配置生成器**：读取 VS Code 设置，生成标准格式的 `ruff.toml`

---

## 贡献

欢迎提交 Issue 和 Pull Request！

[GitHub 仓库](https://github.com/morning-start/ruff-helper)

---

## 许可证

[MIT](LICENSE)

---

## 致谢

- 规则数据库来自 [jannchie/ruff-ignore-explainer](https://github.com/jannchie/ruff-ignore-explainer)
- [Ruff](https://github.com/astral-sh/ruff) - 极快的 Python 代码检查工具
