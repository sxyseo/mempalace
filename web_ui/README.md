# MemPalace Web UI

一个类似 Obsidian 的可视化界面，用于浏览和管理你的 AI 记忆宫殿。

## 功能特性

### 🏰 宫殿视图
- 可视化翼、厅、房间层级结构
- 类似 Obsidian 的文件树导航
- 点击房间查看内容

### 🔍 搜索与浏览
- 语义搜索界面
- 按翼/房间过滤
- 实时结果预览

### 📝 记忆管理
- 查看原始记忆内容
- 编辑记忆元数据
- 添加标签和注释
- 删除不需要的记忆

### 🕸️ 知识图谱
- 实体关系可视化
- 时间线视图
- 交互式图谱探索

### 📊 统计仪表板
- 记忆数量统计
- 翼/房间分布
- 时间趋势分析

### 🎯 AAAK 视图
- 压缩后的记忆预览
- AAAK 语法高亮
- 压缩比统计

## 快速开始

```bash
# 安装依赖
pip install -e ".[web]"

# 启动 Web UI
mempalace web

# 或指定端口
mempalace web --port 8080

# 或指定主机
mempalace web --host 0.0.0.0 --port 8080
```

然后访问 http://localhost:5000

## 界面预览

### 主界面
- 左侧：宫殿导航树（翼 → 厅 → 房间）
- 中间：内容预览区
- 右侧：知识图谱和统计

### 搜索界面
- 全文搜索框
- 结果列表
- 详情面板

### 记忆详情
- 原始内容
- AAAK 压缩版本
- 元数据（翼、厅、房间、时间戳）
- 相关推荐

## 技术栈

### 后端
- **Flask** - Web 框架
- **Flask-CORS** - 跨域支持
- **现有 MemPalace 模块** - 复用核心功能

### 前端
- **React** - UI 框架
- **TailwindCSS** - 样式
- **D3.js** - 数据可视化
- **Marked** - Markdown 渲染

### API 端点

```
GET  /api/status          # 宫殿状态
GET  /api/wings           # 所有翼
GET  /api/wings/<name>    # 翼详情
GET  /api/rooms           # 所有房间
GET  /api/search          # 搜索记忆
GET  /api/memories/<id>   # 记忆详情
PUT  /api/memories/<id>   # 更新记忆
DELETE /api/memories/<id> # 删除记忆
GET  /api/graph           # 知识图谱
GET  /api/timeline        # 时间线
GET  /api/stats           # 统计数据
```

## 配置

Web UI 配置文件：`~/.mempalace/web_config.json`

```json
{
  "host": "localhost",
  "port": 5000,
  "debug": false,
  "theme": "dark",
  "default_view": "palace",
  "items_per_page": 20
}
```

## 与 Obsidian 集成

详见 [Obsidian 插件文档](../obsidian_plugin/README.md)

## 开发

```bash
# 安装开发依赖
cd web_ui/frontend
npm install

# 开发模式（热重载）
npm run dev

# 生产构建
npm run build

# 启动后端
cd ../..
python -m mempalace.web_ui.app --debug
```

## 截图

TODO: 添加界面截图

## 路线图

- [ ] 基础 UI 框架
- [ ] 宫殿导航视图
- [ ] 搜索功能
- [ ] 记忆详情查看
- [ ] 编辑功能
- [ ] 知识图谱可视化
- [ ] AAAK 视图
- [ ] 统计仪表板
- [ ] 时间线视图
- [ ] 导出功能（Markdown, JSON）
- [ ] 主题切换（亮/暗）
- [ ] 移动端适配
