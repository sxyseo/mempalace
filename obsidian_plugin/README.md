# MemPalace Obsidian Plugin

在 Obsidian 中直接查看和管理你的 MemPalace 记忆。

## 功能特性

### 📚 同步记忆到 Obsidian
- 将 MemPalace 记忆导入为 Obsidian 笔记
- 自动创建文件夹结构（翼 → 厅 → 房间）
- 保持元数据和标签

### 🔍 在 Obsidian 中搜索
- 使用 Obsidian 原生搜索功能
- 通过标签过滤记忆
- 快速定位相关内容

### 🏰 可视化宫殿
- Graph View 中显示记忆连接
- 依赖关系可视化
- 实体关系图谱

### ✏️ 双向编辑
- 在 Obsidian 中编辑记忆
- 自动同步回 MemPalace
- 支持元数据更新

## 安装

### 方法 1: 手动安装

1. 下载最新版本
2. 将文件复制到 Obsidian vault 的 `.obsidian/plugins/mempalace/` 目录
3. 在 Obsidian 中启用插件

### 方法 2: BRAT 安装（推荐）

1. 安装 [BRAT](https://github.com/TfTHacker/obsidian42-brat) 插件
2. 在 BRAT 中添加此插件：
   - Repository: `milla-jovovich/mempalace`
   - Plugin: `obsidian-plugin`

## 配置

### 插件设置

1. **Palace Path**: MemPalace 宫殿路径（默认: `~/.mempalace/palace`）
2. **Import Folder**: 笔记导入到的文件夹（默认: `MemPalace/`）
3. **Sync Interval**: 自动同步间隔（分钟）
4. **Enable Auto Sync**: 是否自动同步

### 数据映射

| MemPalace | Obsidian |
|-----------|----------|
| Wing | Folder (一级) |
| Hall | Folder (二级) |
| Room | Tag (#room/name) |
| Drawer | Markdown Note |
| Metadata | YAML frontmatter |

## 使用

### 导入记忆

1. 打开命令面板 (Cmd/Ctrl + P)
2. 选择 "MemPalace: Import all memories"
3. 等待导入完成

### 同步更改

- **手动同步**: "MemPalace: Sync changes"
- **自动同步**: 根据设置自动进行

### 搜索记忆

使用 Obsidian 的原生搜索：
- 搜索关键词
- 过滤标签
- 组合查询

## 笔记格式

导入的笔记格式：

```markdown
---
wing: wing_name
hall: hall_facts
room: auth-migration
created: 2026-01-15T10:30:00
id: drawer_uuid
tags: [wing/wing_name, room/auth-migration]
---

# 记忆标题

记忆内容...
```

## Graph View

在 Obsidian 的 Graph View 中：
- 节点 = 记忆笔记
- 连线 = 共同标签/元数据
- 颜色 = 不同翼

## 开发

```bash
cd obsidian_plugin
npm install
npm run build
```

## 路线图

- [ ] 基础插件框架
- [ ] 导入记忆功能
- [ ] 同步功能
- [ ] 设置面板
- [ ] Graph View 集成
- [ ] 搜索增强
- [ ] 实时同步
- [ ] AAAK 视图
- [ ] 导出功能

## 相关资源

- [Obsidian API 文档](https://github.com/obsidianmd/obsidian-api)
- [MemPalace 主文档](../README.zh-CN.md)
- [Web UI](../web_ui/)

## 贡献

欢迎提交 PR 和 Issue！

## 许可证

MIT
