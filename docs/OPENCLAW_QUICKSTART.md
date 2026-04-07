# OpenClaw + MemPalace 快速开始

5 分钟内让 OpenClaw 拥有长期记忆。

## 第一步：确认 MemPalace 已安装

```bash
cd /Users/abel/dev/mempalace
source venv/bin/activate
mempalace --help
```

## 第二步：配置 OpenClaw

将以下配置添加到 OpenClaw 的 MCP 配置文件：

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh"
    }
  }
}
```

配置文件通常位于：
- `~/.openclaw/mcp_config.json`
- `~/.config/openclaw/mcp_servers.json`
- 或 OpenClaw 指定的其他位置

## 第三步：重启 OpenClaw

重启 OpenClaw 以加载 MCP 服务器。

## 第四步：验证连接

在 OpenClaw 中运行：

```
> 检查 MemPalace 状态
```

或

```
> 使用 mempalace_status 工具
```

## 第五步：初始化宫殿

首次使用需要初始化：

```
> 帮我初始化 MemPalace，索引 ~/Documents/projects 目录
```

## 开始使用

现在你可以：

### 搜索历史对话
```
> 我之前关于数据库选择的讨论是什么？
```

### 记录重要决策
```
> 记录这个决策：我们选择 React 而不是 Vue
```

### 查看项目概览
```
> 显示所有项目的概览
```

## 常用命令

| 功能 | 命令示例 |
|------|---------|
| 搜索记忆 | `搜索关于"架构设计"的所有讨论` |
| 记录决策 | `记录：我们决定使用 TypeScript` |
| 查看翼 | `列出所有翼（项目）` |
| 查看房间 | `显示"myapp"项目中的所有房间` |
| 宫殿状态 | `显示宫殿状态和统计信息` |

## 可用的 19 个工具

### 读取工具
- `mempalace_status` - 宫殿概述
- `mempalace_list_wings` - 列出所有翼
- `mempalace_list_rooms` - 列出房间
- `mempalace_search` - 搜索记忆
- `mempalace_get_taxonomy` - 完整分类
- `mempalace_check_duplicate` - 检查重复
- `mempalace_get_aaak_spec` - AAAK 参考

### 写入工具
- `mempalace_add_drawer` - 添加记忆
- `mempalace_delete_drawer` - 删除记忆

### 知识图谱
- `mempalace_kg_query` - 查询关系
- `mempalace_kg_add` - 添加事实
- `mempalace_kg_invalidate` - 使事实无效
- `mempalace_kg_timeline` - 时间线
- `mempalace_kg_stats` - 统计

### 导航
- `mempalace_traverse` - 遍历图谱
- `mempalace_find_tunnels` - 查找连接
- `mempalace_graph_stats` - 图谱统计

### 代理日记
- `mempalace_diary_write` - 写日记
- `mempalace_diary_read` - 读日记

## 详细文档

完整集成指南请参阅：[OPENCLAW_INTEGRATION.md](./OPENCLAW_INTEGRATION.md)

## 故障排除

### MCP 服务器未启动
```bash
# 手动测试
./mcp_server.sh
```

### 宫殿未初始化
```
> 在 OpenClaw 中运行：mempalace init ~/your-project
```

### 查看详细日志
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

## 下一步

- 📖 阅读 [完整集成指南](./OPENCLAW_INTEGRATION.md)
- 🏗️ 了解 [MemPalace 架构](../CLAUDE.md)
- 💬 加入 [Discord 社区](https://discord.com/invite/ycTQQCu6kn)
