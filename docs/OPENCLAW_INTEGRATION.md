# OpenClaw + MemPalace 集成指南

本指南说明如何在 OpenClaw 中配置和使用 MemPalace MCP 服务器。

## 前置要求

1. 已安装 MemPalace（在开发模式下）
2. OpenClaw 支持 MCP 协议
3. Python 虚拟环境已激活

## MCP 服务器配置

### 方法 1: 使用虚拟环境中的 Python

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

### 方法 2: 使用绝对路径（推荐用于生产环境）

首先确保 MemPalace 已全局安装或使用正确的 Python 路径：

```bash
# 安装到系统或使用虚拟环境绝对路径
pip install -e /Users/abel/dev/mempalace
```

然后配置：

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/venv/bin/python",
      "args": ["-m", "mempalace.mcp_server"]
    }
  }
}
```

### 方法 3: 创建启动脚本（推荐）

创建一个启动脚本以确保环境正确：

```bash
#!/bin/bash
# /Users/abel/dev/mempalace/mcp_server.sh

cd /Users/abel/dev/mempalace
source venv/bin/activate
python -m mempalace.mcp_server
```

使其可执行：

```bash
chmod +x /Users/abel/dev/mempalace/mcp_server.sh
```

然后配置：

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/mcp_server.sh"
    }
  }
}
```

## OpenClaw 配置位置

将上述配置添加到 OpenClaw 的 MCP 配置文件中。根据 OpenClaw 的具体实现，配置文件可能位于：

- `~/.openclaw/mcp_config.json`
- `~/.config/openclaw/mcp_servers.json`
- 或 OpenClaw 指定的其他位置

请参考 OpenClaw 文档确认准确的配置文件路径。

## 验证安装

配置完成后，重启 OpenClaw 并验证 MemPalace 工具是否可用：

1. **检查连接状态**

```
> 你有哪些 MCP 工具可用？
```

应该看到 MemPalace 的 19 个工具。

2. **测试基本功能**

```
> 检查 MemPalace 的状态
```

或

```
> 使用 mempalace_status 查看当前宫殿状态
```

3. **初始化宫殿（首次使用）**

```
> 帮我初始化 MemPalace，我想索引 ~/projects/myapp 目录
```

## 可用的 MCP 工具

配置成功后，OpenClaw 将可以访问以下 19 个工具：

### 宫殿读取
- `mempalace_status` - 宫殿概述
- `mempalace_list_wings` - 列出所有翼
- `mempalace_list_rooms` - 列出翼中的房间
- `mempalace_get_taxonomy` - 完整的分类树
- `mempalace_search` - 语义搜索
- `mempalace_check_duplicate` - 检查重复
- `mempalace_get_aaak_spec` - AAAK 规范

### 宫殿写入
- `mempalace_add_drawer` - 添加内容
- `mempalace_delete_drawer` - 删除内容

### 知识图谱
- `mempalace_kg_query` - 查询实体关系
- `mempalace_kg_add` - 添加事实
- `mempalace_kg_invalidate` - 使事实无效
- `mempalace_kg_timeline` - 实体时间线
- `mempalace_kg_stats` - 图谱统计

### 导航
- `mempalace_traverse` - 遍历图谱
- `mempalace_find_tunnels` - 查找隧道
- `mempalace_graph_stats` - 图谱统计

### 代理日记
- `mempalace_diary_write` - 写日记
- `mempalace_diary_read` - 读日记

## 使用示例

### 搜索历史对话

```
> 我上周关于数据库选择的讨论有什么内容？
```

OpenClaw 将自动调用 `mempalace_search` 并返回相关结果。

### 记录重要决策

```
> 请记录这个决策：我们选择 PostgreSQL 而不是 MongoDB
```

OpenClaw 将调用 `mempalace_add_drawer` 存储这个决策。

### 查看项目概览

```
> 显示 mempalace-project 翼的概览
```

OpenClaw 将调用 `mempalace_list_rooms` 显示该项目的所有房间。

## 故障排除

### MCP 服务器无法启动

**问题**: OpenClaw 无法连接到 MCP 服务器

**解决方案**:
1. 确认虚拟环境已激活：`source venv/bin/activate`
2. 手动测试 MCP 服务器：
   ```bash
   python -m mempalace.mcp_server
   ```
3. 检查 Python 路径是否正确
4. 查看 OpenClaw 日志获取详细错误信息

### 宫殿未初始化

**问题**: 工具返回 "No palace found" 错误

**解决方案**:
```
> 帮我初始化 MemPalace 宫殿，设置路径为 ~/my_project
```

或使用 CLI：
```bash
mempalace init ~/my_project
mempalace mine ~/my_project
```

### 权限问题

**问题**: 无法写入 ~/.mempalace 目录

**解决方案**:
```bash
mkdir -p ~/.mempalace
chmod 755 ~/.mempalace
```

## 高级配置

### 自定义宫殿路径

如果需要使用自定义宫殿路径，可以通过环境变量配置：

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/venv/bin/python",
      "args": ["-m", "mempalace.mcp_server"],
      "env": {
        "MEMPALACE_PALACE_PATH": "/custom/path/to/palace"
      }
    }
  }
}
```

### 调试模式

启用详细日志以调试问题：

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "/Users/abel/dev/mempalace/venv/bin/python",
      "args": ["-m", "mempalace.mcp_server"],
      "env": {
        "PYTHONPATH": "/Users/abel/dev/mempalace",
        "MEMPALACE_DEBUG": "true"
      }
    }
  }
}
```

## 相关资源

- [MemPalace README](../../README.zh-CN.md)
- [MCP 服务器文档](../../examples/mcp_setup.md)
- [CLAUDE.md](../../CLAUDE.md) - 架构和开发指南

## 支持

如遇问题，请：
1. 检查 OpenClaw 日志
2. 手动测试 MCP 服务器
3. 查看 MemPalace GitHub Issues
4. 加入 Discord 社区：https://discord.com/invite/ycTQQCu6kn
