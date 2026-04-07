# MemPalace 文档

本目录包含 MemPalace 的集成和使用文档。

## 文档目录

### 快速开始
- **[OpenClaw 快速开始](./OPENCLAW_QUICKSTART.md)** - 5 分钟内让 OpenClaw 拥有长期记忆

### 集成指南
- **[OpenClaw 集成指南](./OPENCLAW_INTEGRATION.md)** - OpenClaw + MemPalace 完整集成手册
- **[MCP 配置示例](./openclaw_mcp_config.json)** - OpenClaw MCP 配置示例

### 核心文档
- **[项目 README](../README.zh-CN.md)** - MemPalace 完整文档
- **[CLAUDE.md](../CLAUDE.md)** - 架构和开发指南
- **[贡献指南](../CONTRIBUTING.md)** - 如何贡献代码

## 按工具分类

### OpenClaw
- [快速开始](./OPENCLAW_QUICKSTART.md)
- [集成指南](./OPENCLAW_INTEGRATION.md)

### Claude Code
参见主 README 中的 MCP 服务器部分

### 其他 MCP 兼容工具
大多数 MCP 兼容工具使用类似的配置格式。参考 OpenClaw 集成指南进行配置。

## 支持的平台

MemPalace MCP 服务器支持所有遵循 MCP 协议的 AI 工具：

- ✅ OpenClaw
- ✅ Claude Code
- ✅ Claude Desktop
- ✅ Cursor
- ✅ 其他 MCP 兼容工具

## 获取帮助

- 📖 查看 [完整文档](../README.zh-CN.md)
- 💬 加入 [Discord](https://discord.com/invite/ycTQQCu6kn)
- 🐛 报告 [问题](https://github.com/milla-jovovich/mempalace/issues)

## 配置文件说明

### MCP 服务器配置

不同的工具使用不同的配置文件位置：

| 工具 | 配置文件位置 |
|------|------------|
| OpenClaw | `~/.openclaw/mcp_config.json` 或类似 |
| Claude Code | `.claude/settings.json` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` |

### 启动脚本

项目根目录的 `mcp_server.sh` 是一个通用的 MCP 服务器启动脚本，可以用于任何 MCP 兼容工具。

## 环境变量

可以通过环境变量自定义 MemPalace 行为：

```bash
# 自定义宫殿路径
export MEMPALACE_PALACE_PATH="/custom/path/to/palace"

# 启用调试日志
export MEMPALACE_DEBUG="true"
```

## 开发者资源

- **MCP 协议**: [Model Context Protocol](https://modelcontextprotocol.io/)
- **AAAK 方言**: 参见主 README 的 AAAK 压缩部分
- **API 文档**: 运行 `pydoc mempalace` 查看完整 API
