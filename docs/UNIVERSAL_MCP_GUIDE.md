# MemPalace 通用 MCP 集成指南

本指南适用于所有支持 MCP 协议的 AI 工具。

## 支持的工具

- ✅ **Claude Code** - Anthropic 官方 CLI 工具
- ✅ **Claude Desktop** - Anthropic 桌面应用
- ✅ **OpenClaw** - 通用 AI 助手
- ✅ **Codex** - OpenAI CLI 工具
- ✅ **Trae** - AI 开发助手
- ✅ **Cursor** - AI 代码编辑器
- ✅ **Cline** - VS Code AI 扩展
- ✅ 其他 MCP 兼容工具

## 前置要求

1. MemPalace 已安装（开发模式或全局安装）
2. Python 3.9+
3. MCP 工具已安装并配置

## 通用配置步骤

### 第一步：准备 MCP 服务器

确保 MemPalace MCP 服务器可以启动：

```bash
cd /Users/abel/dev/mempalace
./mcp_server.sh
```

如果看到 `MemPalace MCP Server starting...`，说明服务器正常。

### 第二步：配置 MCP 工具

根据你使用的工具，选择对应的配置方式：

---

## Claude Code

### 配置方式 1：命令行（推荐）

```bash
claude mcp add mempalace -- python -m mempalace.mcp_server
```

### 配置方式 2：使用启动脚本

```bash
claude mcp add mempalace -- /Users/abel/dev/mempalace/mcp_server.sh
```

### 配置文件位置

`~/.claude/settings.json` 或 `~/.claude/settings.local.json`

### 验证

```bash
claude mcp list
```

应该看到 `mempalace` 在列表中。

### 使用

```
> 检查 MemPalace 状态
> 搜索关于"架构设计"的讨论
> 记录这个决策：我们使用 PostgreSQL
```

---

## Claude Desktop

### 配置文件

`~/Library/Application Support/Claude/claude_desktop_config.json`

### 配置内容

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh"
    }
  }
}
```

### 或者使用 Python 路径

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/venv/bin/python",
      "args": ["-m", "mempalace.mcp_server"],
      "env": {
        "PYTHONPATH": "/Users/abel/dev/mempalace"
      }
    }
  }
}
```

### 验证

重启 Claude Desktop，然后在对话中：

```
> 你有哪些 MCP 工具可用？
```

---

## OpenClaw

### 配置文件

`~/.openclaw/mcp_config.json` 或 `~/.config/openclaw/mcp_servers.json`

### 配置内容

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh"
    }
  }
}
```

详细指南请参考：[OpenClaw 集成指南](./OPENCLAW_INTEGRATION.md)

---

## Codex (OpenAI CLI)

### 配置文件

`~/.codex/mcp_config.json` 或 `~/.codex/config.json`

### 配置内容

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh",
      "timeout": 30
    }
  }
}
```

### 钩子配置（可选）

`~/.codex/hooks.json`：

```json
{
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
```

### 验证

```bash
codex mcp list
```

---

## Trae

### 配置文件

`~/.trae/mcp_config.json` 或 `~/.config/trae/config.json`

### 配置内容

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh",
      "description": "AI 记忆系统 - 长期记忆和知识管理"
    }
  }
}
```

### 环境变量（如果需要）

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh",
      "env": {
        "MEMPALACE_PALACE_PATH": "~/.mempalace/palace",
        "MEMPALACE_DEBUG": "false"
      }
    }
  }
}
```

---

## Cursor

### 配置文件

`~/.cursor/mcp_config.json` 或在 Cursor 设置中配置

### 配置内容

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh",
      "disabled": false
    }
  }
}
```

### 或者通过 Cursor UI 设置

1. 打开 Cursor Settings
2. 找到 MCP Servers 部分
3. 添加新服务器：
   - Name: `mempalace`
   - Command: `/Users/abel/dev/mempalace/mcp_server.sh`

---

## Cline (VS Code)

### 配置文件

VS Code Settings 中搜索 `cline.mcp.servers`

### 配置内容

```json
{
  "cline.mcp.servers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh"
    }
  }
}
```

### 或使用 `.vscode/settings.json`

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh"
    }
  }
}
```

---

## 自动保存钩子

Claude Code 和 Codex 支持自动保存钩子，让 AI 自动保存重要对话。

### 配置钩子

编辑工具的钩子配置文件：

**Claude Code** - `~/.claude/settings.local.json`：

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "/Users/abel/dev/mempalace/hooks/mempal_save_hook.sh",
        "timeout": 30
      }]
    }],
    "PreCompact": [{
      "hooks": [{
        "type": "command",
        "command": "/Users/abel/dev/mempalace/hooks/mempal_precompact_hook.sh",
        "timeout": 30
      }]
    }]
  }
}
```

**Codex** - `~/.codex/hooks.json`：

```json
{
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
```

### 钩子说明

- **Save Hook** - 每 15 条消息触发一次，提醒 AI 保存重要内容
- **PreCompact Hook** - 上下文压缩前触发，紧急保存所有内容

详见：[钩子文档](../hooks/README.md)

---

## 首次使用

### 1. 初始化宫殿

在任何工具中：

```
> 帮我初始化 MemPalace，索引 ~/projects/myapp 目录
```

或使用 CLI：

```bash
mempalace init ~/projects/myapp
mempalace mine ~/projects/myapp
```

### 2. 验证连接

```
> 检查 MemPalace 状态
```

或使用工具：

```
> 使用 mempalace_status 工具
```

### 3. 开始使用

```
> 搜索关于"数据库选择"的所有讨论
> 记录这个决策：我们选择 React 而不是 Vue
> 显示所有项目的概览
```

---

## 可用的 19 个工具

配置成功后，你的 AI 工具将可以访问：

### 读取工具（7 个）
- `mempalace_status` - 宫殿概述和统计
- `mempalace_list_wings` - 列出所有翼（项目）
- `mempalace_list_rooms` - 列出房间
- `mempalace_search` - 语义搜索
- `mempalace_get_taxonomy` - 完整分类树
- `mempalace_check_duplicate` - 检查重复
- `mempalace_get_aaak_spec` - AAAK 压缩规范

### 写入工具（2 个）
- `mempalace_add_drawer` - 添加记忆
- `mempalace_delete_drawer` - 删除记忆

### 知识图谱（5 个）
- `mempalace_kg_query` - 查询实体关系
- `mempalace_kg_add` - 添加事实
- `mempalace_kg_invalidate` - 使事实无效
- `mempalace_kg_timeline` - 实体时间线
- `mempalace_kg_stats` - 图谱统计

### 导航（3 个）
- `mempalace_traverse` - 遍历图谱
- `mempalace_find_tunnels` - 查找跨翼连接
- `mempalace_graph_stats` - 图谱统计

### 代理日记（2 个）
- `mempalace_diary_write` - 写 AAAK 日记
- `mempalace_diary_read` - 读日记

---

## 故障排除

### MCP 服务器无法启动

**症状**: 工具显示无法连接到 MCP 服务器

**解决方案**:

1. 手动测试服务器：
   ```bash
   ./mcp_server.sh
   ```

2. 检查虚拟环境：
   ```bash
   source venv/bin/activate
   python -m mempalace.mcp_server
   ```

3. 检查 Python 路径是否正确

4. 查看工具日志获取详细错误

### 宫殿未初始化

**症状**: 工具返回 "No palace found" 错误

**解决方案**:

```
> 初始化 MemPalace 宫殿
```

或：

```bash
mempalace init ~/your-project
mempalace mine ~/your-project
```

### 权限问题

**症状**: 无法写入 ~/.mempalace 目录

**解决方案**:

```bash
mkdir -p ~/.mempalace
chmod 755 ~/.mempalace
```

### 工具特定的 MCP 配置位置

不同工具可能使用不同的配置文件位置：

- **Claude Code**: `~/.claude/settings.json`
- **Claude Desktop**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Cursor**: `~/.cursor/mcp_config.json`
- **Cline**: VS Code settings
- **Codex**: `~/.codex/mcp_config.json`
- **OpenClaw**: `~/.openclaw/mcp_config.json`
- **Trae**: `~/.trae/mcp_config.json`

---

## 高级配置

### 自定义宫殿路径

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh",
      "env": {
        "MEMPALACE_PALACE_PATH": "/custom/path/to/palace"
      }
    }
  }
}
```

### 启用调试模式

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

### 设置超时

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh",
      "timeout": 60
    }
  }
}
```

---

## 配置文件示例

### 完整配置示例（Claude Code）

`~/.claude/settings.local.json`：

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh"
    }
  },
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "/Users/abel/dev/mempalace/hooks/mempal_save_hook.sh",
        "timeout": 30
      }]
    }],
    "PreCompact": [{
      "hooks": [{
        "type": "command",
        "command": "/Users/abel/dev/mempalace/hooks/mempal_precompact_hook.sh",
        "timeout": 30
      }]
    }]
  }
}
```

---

## 测试连接

配置完成后，测试 MCP 服务器是否正常工作：

```bash
# 手动测试
./mcp_server.sh

# 或使用 Python
source venv/bin/activate
python -m mempalace.mcp_server
```

如果看到 `MemPalace MCP Server starting...`，说明服务器正常。

---

## 相关资源

- [主 README](../README.zh-CN.md)
- [CLAUDE.md](../CLAUDE.md) - 架构和开发
- [OpenClaw 集成](./OPENCLAW_INTEGRATION.md)
- [钩子文档](../hooks/README.md)
- [MCP 协议](https://modelcontextprotocol.io/)

---

## 支持

- 📖 查看完整文档
- 💬 加入 Discord: https://discord.com/invite/ycTQQCu6kn
- 🐛 报告问题: https://github.com/milla-jovovich/mempalace/issues
