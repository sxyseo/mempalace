# MemPalace 可视化界面 - 快速开始

## 🎯 两种可视化方案

MemPalace 现在提供两种可视化界面：

1. **Web UI** - 独立的 Web 应用，类似 Obsidian 界面
2. **Obsidian 插件** - 在 Obsidian 中直接查看和管理记忆

---

## 🌐 Web UI - 立即开始

### 第一步：安装依赖

```bash
# 安装 Web UI 后端依赖
pip install -e ".[web]"

# 安装前端依赖（可选，用于开发）
cd web_ui/frontend
npm install
cd ../..
```

### 第二步：启动 Web UI

```bash
# 启动服务器（默认 http://localhost:5000）
mempalace web

# 或指定端口
mempalace web --port 8080

# 或指定主机（允许外部访问）
mempalace web --host 0.0.0.0 --port 8080
```

### 第三步：访问界面

在浏览器中打开：http://localhost:5000

### 功能特性

- ✅ **宫殿视图** - 浏览翼、厅、房间结构
- ✅ **搜索功能** - 语义搜索记忆
- ✅ **记忆详情** - 查看完整的记忆内容
- 🚧 **知识图谱** - 可视化实体关系
- 🚧 **统计数据** - 记忆数量和分布
- 🚧 **时间线** - 按时间浏览记忆

---

## 📔 Obsidian 插件 - 即将推出

### 当前状态

Obsidian 插件正在开发中。基础框架已创建，功能将逐步添加。

### 计划功能

- 导入 MemPalace 记忆到 Obsidian
- 双向同步（Obsidian ↔ MemPalace）
- Graph View 中显示记忆连接
- 在 Obsidian 中搜索记忆
- AAAK 压缩视图

### 期待

敬请期待！插件开发完成后，你将能够：
- 在 Obsidian 中查看所有记忆
- 使用 Obsidian 的强大编辑功能
- 通过 Graph View 可视化记忆关系
- 利用 Obsidian 的插件生态系统

---

## 🎨 界面对比

| 功能 | Web UI | Obsidian 插件 |
|------|--------|--------------|
| **浏览记忆** | ✅ 可用 | 🚧 开发中 |
| **搜索记忆** | ✅ 可用 | 🚧 开发中 |
| **编辑记忆** | 🚧 开发中 | 🚧 开发中 |
| **知识图谱** | 🚧 开发中 | ✅ Graph View |
| **统计仪表板** | 🚧 开发中 | ❌ 不适用 |
| **时间线** | 🚧 开发中 | 🚧 开发中 |
| **AAAK 视图** | 🚧 开发中 | 🚧 开发中 |
| **导出功能** | 🚧 开发中 | ✅ 原生导出 |
| **主题切换** | 🚧 开发中 | ✅ 丰富主题 |
| **插件生态** | ❌ 不适用 | ✅ 丰富插件 |

---

## 📚 相关文档

### Web UI
- [完整文档](../web_ui/README.md)
- [API 端点](../web_ui/README.md#api-端点)
- [开发指南](../web_ui/README.md#开发)

### Obsidian 插件
- [插件文档](../obsidian_plugin/README.md)
- [安装指南](../obsidian_plugin/README.md#安装)
- [配置说明](../obsidian_plugin/README.md#配置)

---

## 🚀 立即体验

### 快速启动 Web UI

```bash
# 1. 安装
pip install -e ".[web]"

# 2. 启动
mempalace web

# 3. 访问
# 打开浏览器访问 http://localhost:5000
```

### 如果没有记忆

```bash
# 初始化宫殿
mempalace init ~/projects/myapp

# 挖掘项目文件
mempalace mine ~/projects/myapp

# 然后启动 Web UI
mempalace web
```

---

## 💡 使用技巧

### Web UI

1. **宫殿导航** - 左侧边栏显示宫殿结构
2. **快速搜索** - 使用搜索功能找到相关记忆
3. **记忆详情** - 点击记忆查看完整内容
4. **响应式设计** - 支持桌面和移动设备

### Obsidian（未来）

1. **Graph View** - 可视化记忆关系
2. **标签过滤** - 按翼/房间标签过滤
3. **搜索集成** - 使用 Obsidian 原生搜索
4. **插件扩展** - 结合其他 Obsidian 插件

---

## 🎉 开始使用

选择你喜欢的界面：

**立即使用 Web UI：**
```bash
mempalace web
```

**等待 Obsidian 插件：**
- 关注项目更新
- 查看 [obsidian_plugin](../obsidian_plugin/) 目录
- 参与开发和测试

---

## 📞 获取帮助

- 📖 [完整文档](../README.zh-CN.md)
- 💬 [Discord 社区](https://discord.com/invite/ycTQQCu6kn)
- 🐛 [报告问题](https://github.com/milla-jovovich/mempalace/issues)

享受你的可视化 AI 记忆宫殿！🏰✨
