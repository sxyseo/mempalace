# MemPalace - 所有 AI 工具快速开始

5 分钟内让任何 MCP 兼容的 AI 工具拥有长期记忆。

## 支持的工具 ✅

- **Claude Code** - `claude mcp add mempalace -- python -m mempalace.mcp_server`
- **Claude Desktop** - 编辑配置文件添加 MCP 服务器
- **OpenClaw** - 编辑配置文件添加 MCP 服务器
- **Codex** - 编辑配置文件添加 MCP 服务器
- **Trae** - 编辑配置文件添加 MCP 服务器
- **Cursor** - 通过设置 UI 或配置文件
- **Cline** - VS Code 设置
- **其他 MCP 工具** - 使用类似的配置方式

## 🚀 超快速开始（3 步）

### 第一步：复制配置

```bash
# Claude Code（最简单）
claude mcp add mempalace -- python -m mempalace.mcp_server

# 或使用启动脚本
claude mcp add mempalace -- /Users/abel/dev/mempalace/mcp_server.sh
```

对于其他工具，复制对应的配置文件：

```bash
# Claude Desktop
cp docs/configs/claude-desktop.json ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Cursor
cp docs/configs/cursor.json ~/.cursor/mcp_config.json

# Codex
cp docs/configs/codex.json ~/.codex/mcp_config.json

# Trae
cp docs/configs/trae.json ~/.trae/mcp_config.json

# Cline
cat docs/configs/cline.json >> .vscode/settings.json
```

### 第二步：重启工具

重启你的 AI 工具以加载 MCP 服务器。

### 第三步：开始使用

```
> 检查 MemPalace 状态
> 搜索关于"数据库选择"的讨论
> 记录这个决策：我们选择 React
```

## 📋 各工具配置方式

### Claude Code（最简单）

```bash
# 方式 1：使用 Python 模块（推荐）
claude mcp add mempalace -- python -m mempalace.mcp_server

# 方式 2：使用启动脚本
claude mcp add mempalace -- /Users/abel/dev/mempalace/mcp_server.sh

# 验证
claude mcp list
```

### Claude Desktop

```bash
# macOS
open ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 添加以下内容：
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh"
    }
  }
}
```

### Cursor

1. 打开 Cursor Settings
2. 搜索 "MCP Servers"
3. 添加新服务器：
   - Name: `mempalace`
   - Command: `/Users/abel/dev/mempalace/mcp_server.sh`

或使用配置文件：
```bash
cp docs/configs/cursor.json ~/.cursor/mcp_config.json
```

### Codex

```bash
# 复制配置
cp docs/configs/codex.json ~/.codex/mcp_config.json

# 或手动编辑
vim ~/.codex/mcp_config.json
```

### Trae

```bash
# 复制配置
cp docs/configs/trae.json ~/.trae/mcp_config.json

# 或手动编辑
vim ~/.trae/mcp_config.json
```

### Cline (VS Code)

1. 打开 VS Code Settings
2. 搜索 `cline.mcp.servers`
3. 添加配置：

或使用命令：
```bash
cat docs/configs/cline.json >> .vscode/settings.json
```

## 🎯 首次使用

### 1. 初始化宫殿

```
> 帮我初始化 MemPalace，索引 ~/Documents/projects 目录
```

或使用 CLI：
```bash
mempalace init ~/Documents/projects
mempalace mine ~/Documents/projects
```

### 2. 验证连接

```
> 检查 MemPalace 状态
```

### 3. 开始使用

```
> 我之前关于数据库选择的讨论是什么？
> 记录这个决策：我们选择 React 而不是 Vue
> 显示所有项目的概览
```

## 💡 常用命令

| 功能 | 命令示例 |
|------|---------|
| 搜索记忆 | `搜索关于"架构设计"的所有讨论` |
| 记录决策 | `记录：我们决定使用 TypeScript` |
| 查看翼 | `列出所有翼（项目）` |
| 查看房间 | `显示"myapp"项目中的所有房间` |
| 宫殿状态 | `显示宫殿状态和统计信息` |
| 知识图谱 | `查询 Kai 的所有关系` |
| 时间线 | `显示"myapp"项目的时间线` |

## 🔧 19 个可用工具

### 读取（7 个）
- `mempalace_status` - 宫殿概述
- `mempalace_list_wings` - 列出翼
- `mempalace_list_rooms` - 列出房间
- `mempalace_search` - 搜索记忆
- `mempalace_get_taxonomy` - 完整分类
- `mempalace_check_duplicate` - 检查重复
- `mempalace_get_aaak_spec` - AAAK 规范

### 写入（2 个）
- `mempalace_add_drawer` - 添加记忆
- `mempalace_delete_drawer` - 删除记忆

### 知识图谱（5 个）
- `mempalace_kg_query` - 查询关系
- `mempalace_kg_add` - 添加事实
- `mempalace_kg_invalidate` - 使事实无效
- `mempalace_kg_timeline` - 时间线
- `mempalace_kg_stats` - 统计

### 导航（3 个）
- `mempalace_traverse` - 遍历图谱
- `mempalace_find_tunnels` - 查找连接
- `mempalace_graph_stats` - 图谱统计

### 代理日记（2 个）
- `mempalace_diary_write` - 写日记
- `mempalace_diary_read` - 读日记

## 🐛 故障排除

### MCP 服务器未启动

```bash
# 手动测试
./mcp_server.sh

# 应该看到：MemPalace MCP Server starting...
```

### 宫殿未初始化

```
> 在 AI 工具中运行：初始化 MemPalace 宫殿
```

或：
```bash
mempalace init ~/your-project
```

### 配置文件位置

不同工具的配置文件位置：

| 工具 | 配置文件位置 |
|------|-------------|
| Claude Code | `~/.claude/settings.json` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Cursor | `~/.cursor/mcp_config.json` |
| Codex | `~/.codex/mcp_config.json` |
| Trae | `~/.trae/mcp_config.json` |
| Cline | `.vscode/settings.json` |

### 详细调试

在配置中启用调试模式：

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh",
      "env": {
        "MEMPALACE_DEBUG": "true"
      }
    }
  }
}
```

## 📚 详细文档

- **[通用 MCP 集成指南](./UNIVERSAL_MCP_GUIDE.md)** - 完整的集成文档
- **[配置文件示例](./configs/README.md)** - 各种工具的配置文件
- **[OpenClaw 集成](./OPENCLAW_INTEGRATION.md)** - OpenClaw 专用指南
- **[主 README](../README.zh-CN.md)** - MemPalace 完整文档

## 🎉 开始使用

配置完成后，你的 AI 工具将拥有：

- ✅ 长期记忆 - 记住所有对话
- ✅ 语义搜索 - 快速找到相关信息
- ✅ 知识图谱 - 理解实体关系
- ✅ AAAK 压缩 - 30 倍压缩，零信息丢失
- ✅ 19 个工具 - 完整的记忆管理

## 📞 获取帮助

- 📖 查看 [完整文档](../README.zh-CN.md)
- 💬 加入 [Discord](https://discord.com/invite/ycTQQCu6kn)
- 🐛 报告 [问题](https://github.com/milla-jovovich/mempalace/issues)

## 🚀 下一步

1. ✅ 配置 MCP 服务器（上面已完成）
2. ✅ 初始化宫殿
3. ✅ 开始对话，让 AI 记住一切
4. ✅ 随时搜索历史记忆

享受你的 AI 长期记忆！🎊
