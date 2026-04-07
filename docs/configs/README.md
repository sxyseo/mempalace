# MCP 配置文件示例

本目录包含各种 AI 工具的 MCP 配置文件示例。

## 配置文件列表

### 主流 AI 工具

| 配置文件 | 工具 | 配置位置 |
|---------|------|---------|
| [claude-code.json](./claude-code.json) | Claude Code | `~/.claude/settings.local.json` |
| [claude-desktop.json](./claude-desktop.json) | Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| [codex.json](./codex.json) | OpenAI Codex | `~/.codex/mcp_config.json` |
| [trae.json](./trae.json) | Trae | `~/.trae/mcp_config.json` |
| [cursor.json](./cursor.json) | Cursor | `~/.cursor/mcp_config.json` |
| [cline.json](./clique.json) | Cline (VS Code) | `.vscode/settings.json` |

## 快速开始

### 第一步：选择配置文件

根据你使用的工具，选择对应的配置文件。

### 第二步：复制到目标位置

```bash
# 例如，为 Claude Code 配置
cp docs/configs/claude-code.json ~/.claude/settings.local.json

# 或为 Claude Desktop 配置
cp docs/configs/claude-desktop.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### 第三步：重启工具

重启你的 AI 工具以加载新配置。

### 第四步：验证

在工具中运行：

```
> 检查 MemPalace 状态
```

## 手动配置

如果自动复制不适用，可以手动配置：

### Claude Code

```bash
# 使用命令行配置（推荐）
claude mcp add mempalace -- python -m mempalace.mcp_server

# 或使用启动脚本
claude mcp add mempalace -- /Users/abel/dev/mempalace/mcp_server.sh
```

### Claude Desktop

编辑配置文件：
```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

添加：
```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh"
    }
  }
}
```

### 其他工具

参考具体配置文件中的 `_notes` 字段，了解确切的配置位置。

## 配置文件说明

### 基本结构

所有配置文件都遵循基本结构：

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh",
      "description": "可选的描述",
      "env": {
        "可选的环境变量": "值"
      },
      "timeout": 30,
      "enabled": true
    }
  }
}
```

### 字段说明

- `command` - MCP 服务器启动命令（必填）
- `description` - 服务器描述（可选）
- `env` - 环境变量（可选）
- `timeout` - 超时时间，单位秒（可选，默认 30）
- `enabled` - 是否启用（可选，默认 true）
- `disabled` - 是否禁用（某些工具使用此字段）

### 钩子配置（可选）

某些工具（如 Claude Code、Codex）支持钩子：

```json
{
  "hooks": {
    "Stop": [{
      "type": "command",
      "command": "/Users/abel/dev/mempalace/hooks/mempal_save_hook.sh",
      "timeout": 30
    }],
    "PreCompact": [{
      "type": "command",
      "command": "/Users/abel/dev/mempalace/hooks/mempal_precompact_hook.sh",
      "timeout": 30
    }]
  }
}
```

## 路径自定义

如果你的项目路径不同，需要修改配置文件中的路径：

### 原始路径
```json
"command": "/Users/abel/dev/mempalace/mcp_server.sh"
```

### 替换为你的路径
```json
"command": "/your/path/to/mempalace/mcp_server.sh"
```

或使用 Python 模块方式：
```json
{
  "command": "/path/to/your/venv/bin/python",
  "args": ["-m", "mempalace.mcp_server"],
  "env": {
    "PYTHONPATH": "/path/to/mempalace"
  }
}
```

## 环境变量

可以通过环境变量自定义 MemPalace 行为：

### 宫殿路径
```json
"env": {
  "MEMPALACE_PALACE_PATH": "/custom/path/to/palace"
}
```

### 调试模式
```json
"env": {
  "MEMPALACE_DEBUG": "true"
}
```

### 集合名称
```json
"env": {
  "MEMPALACE_COLLECTION_NAME": "my_collection"
}
```

## 多个 MCP 服务器

如果你的工具配置了多个 MCP 服务器，确保它们都有唯一的名称：

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh"
    },
    "another-server": {
      "command": "/path/to/another/server"
    }
  }
}
```

## 平台差异

### macOS
- Claude Desktop: `~/Library/Application Support/Claude/`
- 配置文件使用 Unix 路径

### Windows
- Claude Desktop: `%APPDATA%\Claude\`
- 配置文件路径需要使用反斜杠或正斜杠
- 示例：`C:\\Users\\YourName\\mempalace\\mcp_server.sh`

### Linux
- Claude Desktop: `~/.config/Claude/`
- 配置文件使用 Unix 路径

## 故障排除

### 配置文件不生效

1. 确认配置文件位置正确
2. 检查 JSON 格式是否有效
3. 重启工具以加载新配置
4. 查看工具日志获取错误信息

### MCP 服务器无法启动

1. 手动测试脚本：
   ```bash
   /Users/abel/dev/mempalace/mcp_server.sh
   ```

2. 检查虚拟环境是否存在

3. 验证 Python 路径是否正确

4. 确认 MemPalace 已安装：
   ```bash
   cd /Users/abel/dev/mempalace
   source venv/bin/activate
   python -m mempalace.mcp_server
   ```

### 权限问题

确保脚本有执行权限：
```bash
chmod +x /Users/abel/dev/mempalace/mcp_server.sh
```

## 验证配置

配置完成后，验证 MCP 服务器是否正常工作：

```bash
# 手动测试
./mcp_server.sh

# 应该看到：MemPalace MCP Server starting...
```

然后在工具中测试：

```
> 使用 mempalace_status 工具
```

## 相关文档

- [通用 MCP 集成指南](../UNIVERSAL_MCP_GUIDE.md)
- [OpenClaw 集成指南](../OPENCLAW_INTEGRATION.md)
- [主 README](../../README.zh-CN.md)
- [钩子文档](../../hooks/README.md)

## 支持

如遇问题：
1. 查看工具日志
2. 检查配置文件格式
3. 手动测试 MCP 服务器
4. 参考[通用集成指南](../UNIVERSAL_MCP_GUIDE.md)
5. 提交 Issue: https://github.com/milla-jovovich/mempalace/issues
