<div align="center">

<img src="assets/mempalace_logo.png" alt="MemPalace" width="280">

# MemPalace

**[🇺🇸 English](README.md) | [🇨🇳 中文](README.zh-CN.md)**

### 史上得分最高的 AI 记忆系统。而且它是免费的。

<br>

每一次你与 AI 的对话——每一个决策、每一次调试、每一次架构讨论——都会在会话结束时消失。六个月的工作，全部化为乌有。每次都要重新开始。

其他记忆系统试图通过让 AI 决定什么值得记住来解决这个问题。它提取出"用户偏好 Postgres"，然后丢弃了你解释"为什么"的整个对话。MemPalace 采用不同的方法：**存储一切，然后让它变得可搜索。**

**宫殿（The Palace）** — 古希腊演说家通过将想法放置在假想建筑物的房间里来记忆整篇演讲。穿过建筑，找到想法。MemPalace 将同样的原则应用于 AI 记忆：你的对话被组织成翼（人员和项目）、厅（记忆类型）和房间（具体想法）。没有 AI 决定什么重要——你保留每一个字，而结构使其可搜索。仅凭这个结构就提高了 34% 的检索率。

**AAAK** — 一种专为 AI 代理设计的无损速记方言。不是供人类阅读——而是供你的 AI 快速阅读。30 倍压缩，零信息丢失。你的 AI 在约 120 个 token 内加载数月的上下文。因为 AAAK 只是带有通用语法的结构化文本，所以它适用于**任何读取文本的模型**——Claude、GPT、Gemini、Llama、Mistral。无需解码器，无需微调，无需云 API。针对本地模型运行，你的整个记忆堆栈保持离线。没有其他类似的东西存在。

**本地、开放、可适应** — MemPalace 完全在你的机器上运行，适用于你拥有的任何本地数据，不使用任何外部 API 或服务。它已在对话上进行了测试——但可以适用于不同类型的数据存储。这就是我们开源它的原因。

<br>

[![][version-shield]][release-link]
[![][python-shield]][python-link]
[![][license-shield]][license-link]
[![][discord-shield]][discord-link]

<br>

[快速开始](#快速开始) · [宫殿](#宫殿) · [AAAK 方言](#aaak-压缩) · [基准测试](#基准测试) · [MCP 工具](#mcp-服务器)

<br>

### 史上最高的 LongMemEval 得分——免费或付费。

<table>
<tr>
<td align="center"><strong>96.6%</strong><br><sub>LongMemEval R@5<br>零 API 调用</sub></td>
<td align="center"><strong>100%</strong><br><sub>LongMemEval R@5<br>使用 Haiku 重排序</sub></td>
<td align="center"><strong>+34%</strong><br><sub>宫殿结构带来的<br>检索提升</sub></td>
<td align="center"><strong>$0</strong><br><sub>无订阅<br>无云。仅本地。</sub></td>
</tr>
</table>

<sub>可复现 — 运行器位于 <a href="benchmarks/">benchmarks/</a>。 <a href="benchmarks/BENCHMARKS.md">完整结果</a>。</sub>

</div>

---

## 快速开始

```bash
pip install mempalace

# 设置你的世界——你和谁一起工作，你的项目是什么
mempalace init ~/projects/myapp

# 挖掘你的数据
mempalace mine ~/projects/myapp                    # 项目 — 代码、文档、笔记
mempalace mine ~/chats/ --mode convos              # 对话 — Claude、ChatGPT、Slack 导出
mempalace mine ~/chats/ --mode convos --extract general  # 通用 — 自动分类为决策、里程碑、问题

# 搜索你曾经讨论过的任何内容
mempalace search "为什么我们要切换到 GraphQL"

# 你的 AI 记住了
mempalace status
```

三种挖掘模式：**项目**（代码和文档）、**对话**（对话导出）和**通用**（自动分类为决策、偏好、里程碑、问题和情感上下文）。一切都保持在你的机器上。

---

## 如何实际使用它

一次性设置（安装 → 初始化 → 挖掘）后，你不再手动运行 MemPalace 命令。你的 AI 会为你使用它。有两种方式，取决于你使用的 AI。

### 与 Claude、ChatGPT、Cursor 一起使用（兼容 MCP 工具）

```bash
# 一次性连接 MemPalace
claude mcp add mempalace -- python -m mempalace.mcp_server
```

现在你的 AI 有 19 个可通过 MCP 使用的工具。问它任何问题：

> *"上个月我们在 auth 方面做了什么决定？"*

Claude 自动调用 `mempalace_search`，获取逐字结果，并回答你。你再也不用输入 `mempalace search` 了。AI 会处理它。

### 与本地模型一起使用（Llama、Mistral 或任何离线 LLM）

本地模型通常还不说 MCP。两种方法：

**1. 唤醒命令** — 将你的世界加载到模型的上下文中：

```bash
mempalace wake-up > context.txt
# 将 context.txt 粘贴到本地模型的系统提示中
```

这会在你问单个问题之前给你的本地模型约 170 个 token 的关键事实（如果愿意，可以使用 AAAK）。

**2. CLI 搜索** — 按需查询，将结果输入到提示中：

```bash
mempalace search "auth 决策" > results.txt
# 在你的提示中包含 results.txt
```

或使用 Python API：

```python
from mempalace.searcher import search_memories
results = search_memories("auth decisions", palace_path="~/.mempalace/palace")
# 注入到本地模型的上下文中
```

无论哪种方式——你的整个记忆堆栈都在离线运行。你的机器上的 ChromaDB，你的机器上的 Llama，AAAK 用于压缩，零云调用。

---

## 问题

决策现在发生在对话中。不在文档中。不在 Jira 中。在与 Claude、ChatGPT、Copilot 的对话中。推理、权衡、"我们尝试了 X，但因为 Y 失败了"——所有这些都被困在会话结束时消失的聊天窗口中。

**每天使用 AI 六个月 = 1950 万个 token。**这是每个决策、每次调试、每次架构讨论。全部消失。

| 方法 | 加载的 token | 年成本 |
|----------|--------------|-------------|
| 粘贴所有内容 | 19.5M — 不适合任何上下文窗口 | 不可能 |
| LLM 摘要 | ~650K | ~$507/年 |
| **MemPalace wake-up** | **~170 tokens** | **~$0.70/年** |
| **MemPalace + 5 次搜索** | **~13,500 tokens** | **~$10/年** |

MemPalace 在唤醒时加载 170 个 token 的关键事实——你的团队、你的项目、你的偏好。然后只在需要时搜索。$10/年记住所有内容，而 $507/年用于丢失上下文的摘要。

---

## 工作原理

### 宫殿

布局相当简单，尽管我们花了很长时间才到达那里。

它从一个**翼（wing）**开始。你归档的每个项目、人员或主题都在宫殿中获得自己的翼。

每个翼都有连接到它的**房间（rooms）**，信息在其中划分为与该翼相关的主题——所以每个房间都是项目包含的不同元素。项目想法可能是一个房间，员工可能是另一个房间，财务报表是另一个。可以有无限数量的房间将翼划分成部分。MemPalace 安装会自动为你检测这些，当然你可以以任何你觉得合适的方式个性化它。

每个房间都有连接到它的**壁橱（closet）**，这里变得有趣了。我们开发了一种名为 **AAAK** 的 AI 语言。别问——这本身就是一整故事。你的代理每次唤醒时都会学习 AAAK 速记。因为 AAAK 本质上是英语，但是是一个非常截断的版本，你的代理在几秒钟内就知道如何使用它。它作为安装的一部分内置于 MemPalace 代码中。在我们的下一次更新中，我们将直接把 AAAK 添加到壁橱中，这将是一个真正的游戏规则改变者——壁橱中的信息量会大得多，但它占用的空间少得多，你的代理阅读时间也少得多。但是，即使现在，壁橱方法在所有基准测试中显示了 **96.6% 的召回率**。一旦壁橱使用 AAAK，搜索将更快，同时保持每个字完全相同。但即使现在，壁橱方法对于在如此小的空间中存储如此多的信息是一个巨大的好处——它很容易指向你的 AI 代理到原始文件所在的抽屉。你永远不会丢失任何东西，所有这一切都在几秒钟内发生。

在这些壁橱里面是**抽屉（drawers）**，那些抽屉是你的原始文件所在的地方。在这个第一版中，我们没有将 AAAK 用作壁橱工具，但即便如此，摘要在我们在多个基准测试平台上进行的所有基准测试中都显示了 **96.6% 的召回率**。一旦壁橱使用 AAAK，搜索将更快，同时保持每个字完全相同。但即使现在，壁橱方法对于在如此小的空间中存储如此多的信息是一个巨大的好处——它用来容易地指向你的 AI 代理到原始文件所在的抽屉。你永远不会丢失任何东西，所有这一切都在几秒钟内发生。

还有**厅（halls）**，它们连接同一个翼内的房间，以及**隧道（tunnels）**，它们将不同翼的房间连接到另一个房间。所以寻找东西真正变得毫不费力——我们给了 AI 一个干净和有组织的方式来知道从哪里开始搜索，而不必查看巨大文件夹中的每个关键词。

你说你在找什么，砰，它已经知道要搜索哪个翼。仅仅*这本身*就会产生很大的不同。但这很美丽、优雅、有机，最重要的是，高效。

```
  ┌─────────────────────────────────────────────────────────────┐
  │  翼: 人物                                                    │
  │                                                            │
  │    ┌──────────┐  ──厅──  ┌──────────┐                      │
  │    │  房间 A  │            │  房间 B  │                      │
  │    └────┬─────┘            └──────────┘                      │
  │         │                                                  │
  │         ▼                                                  │
  │    ┌──────────┐      ┌──────────┐                          │
  │    │  壁橱    │ ───▶ │  抽屉    │                          │
  │    └──────────┘      └──────────┘                          │
  └─────────┼──────────────────────────────────────────────────┘
            │
          隧道
            │
  ┌─────────┼──────────────────────────────────────────────────┐
  │  翼: 项目                                                    │
  │         │                                                  │
  │    ┌────┴─────┐  ──厅──  ┌──────────┐                      │
  │    │  房间 A  │            │  房间 C  │                      │
  │    └────┬─────┘            └──────────┘                      │
  │         │                                                  │
  │         ▼                                                  │
  │    ┌──────────┐      ┌──────────┐                          │
  │    │  壁橱    │ ───▶ │  抽屉    │                          │
  │    └──────────┘      └──────────┘                          │
  └─────────────────────────────────────────────────────────────┘
```

**翼** — 一个人或项目。根据你的需要尽可能多。
**房间** — 翼内的特定主题。Auth、计费、部署——无限的房间。
**厅** — 连接*同一个*翼内相关房间的走廊。如果房间 A（auth）和房间 B（security）相关，厅就会连接它们。
**隧道** — 连接*不同*翼之间的房间。当人 A 和项目都有关于"auth"的房间时，隧道会自动交叉引用它们。
**壁橱** — 指向原始内容的压缩摘要。AI 读取速度快。
**抽屉** — 原始逐字文件。确切的字，从未总结。

**厅是记忆类型** — 在每个翼中都相同，充当走廊：
- `hall_facts` — 做出的决策，锁定的选择
- `hall_events` — 会话、里程碑、调试
- `hall_discoveries` — 突破、新见解
- `hall_preferences` — 习惯、喜好、意见
- `hall_advice` — 建议和解决方案

**房间是命名的想法** — `auth-migration`、`graphql-switch`、`ci-pipeline`。当同一个房间出现在不同的翼中时，它会创建一个**隧道**——跨域连接同一主题：

```
wing_kai       / hall_events / auth-migration  → "Kai 调试了 OAuth token 刷新"
wing_driftwood / hall_facts  / auth-migration  → "团队决定将 auth 迁移到 Clerk"
wing_priya     / hall_advice / auth-migration  → "Priya 批准 Clerk 而不是 Auth0"
```

同一个房间。三个翼。隧道连接它们。

### 为什么结构很重要

在 22,000+ 个真实对话记忆上测试：

```
搜索所有壁橱：          60.9%  R@10
在翼内搜索：            73.1%  (+12%)
搜索 翼 + 厅：          84.8%  (+24%)
搜索 翼 + 房间：        94.8%  (+34%)
```

翼和房间不是装饰性的。它们是 **34% 的检索改进**。宫殿结构就是产品。

### 记忆堆栈

| 层 | 什么 | 大小 | 何时 |
|-------|------|------|------|
| **L0** | 身份 — 这个 AI 是谁？ | ~50 tokens | 始终加载 |
| **L1** | 关键事实 — 团队、项目、偏好 | ~120 tokens (AAAK) | 始终加载 |
| **L2** | 房间回忆 — 最近的会话、当前项目 | 按需 | 当话题出现时 |
| **L3** | 深度搜索 — 跨所有壁橱的语义查询 | 按需 | 明确询问时 |

你的 AI 使用 L0 + L1（约 170 tokens）唤醒并知道你的世界。搜索只在需要时触发。

### AAAK 压缩

AAAK 是一种无损方言——30 倍压缩，任何 LLM 无需解码器即可读取。它适用于**Claude、GPT、Gemini、Llama、Mistral**——任何读取文本的模型。针对本地 Llama 模型运行，你的整个记忆堆栈保持离线。

**英语（~1000 tokens）：**
```
Priya 管理 Driftwood 团队：Kai（后端，3 年）、Soren（前端）、
Maya（基础设施）和 Leo（初级，上个月开始）。他们正在构建
SaaS 分析平台。当前冲刺：auth 迁移到 Clerk。
Kai 根据定价和 DX 推荐 Clerk 而不是 Auth0。
```

**AAAK（~120 tokens）：**
```
TEAM: PRI(lead) | KAI(backend,3yr) SOR(frontend) MAY(infra) LEO(junior,new)
PROJ: DRIFTWOOD(saas.analytics) | SPRINT: auth.migration→clerk
DECISION: KAI.rec:clerk>auth0(pricing+dx) | ★★★★
```

相同的信息。8 倍的 token。你的 AI 自动从 MCP 服务器学习 AAAK——无需手动设置。

### 矛盾检测

MemPalace 在错误到达你之前捕捉它们：

```
输入:  "Soren 完成了 auth 迁移"
输出: 🔴 AUTH-MIGRATION: 归属冲突 — Maya 被分配，不是 Soren

输入:  "Kai 在这里 2 年了"
输出: 🟡 KAI: wrong_tenure — 记录显示 3 年（始于 2023-04）

输入:  "冲刺周五结束"
输出: 🟡 SPRINT: stale_date — 当前冲刺周四结束（2 天前更新）
```

根据知识图检查事实。年龄、日期和任期动态计算——不是硬编码的。

---

## 真实示例

### 跨多个项目的独立开发者

```bash
# 挖掘每个项目的对话
mempalace mine ~/chats/orion/  --mode convos --wing orion
mempalace mine ~/chats/nova/   --mode convos --wing nova
mempalace mine ~/chats/helios/ --mode convos --wing helios

# 六个月后："为什么我在这里使用 Postgres？"
mempalace search "数据库决策" --wing orion
# → "选择 Postgres 而不是 SQLite，因为 Orion 需要并发写入
#    并且数据集将超过 10GB。决定于 2025-11-03。"

# 跨项目搜索
mempalace search "限流方法"
# → 在 Orion 和 Nova 中找到你的方法，显示差异
```

### 管理产品的团队负责人

```bash
# 挖掘 Slack 导出和 AI 对话
mempalace mine ~/exports/slack/ --mode convos --wing driftwood
mempalace mine ~/.claude/projects/ --mode convos

# "Soren 上个冲刺做了什么？"
mempalace search "Soren sprint" --wing driftwood
# → 14 个壁橱：OAuth 重构、暗模式、组件库迁移

# "谁决定使用 Clerk？"
mempalace search "Clerk 决策" --wing driftwood
# → "Kai 根据定价 + 开发体验推荐 Clerk 而不是 Auth0。
#    团队同意 2026-01-15。Maya 正在处理迁移。"
```

### 挖掘前：分割大文件

一些转录导出将多个会话连接到一个巨大文件中：

```bash
mempalace split ~/chats/                      # 分割为每个会话的文件
mempalace split ~/chats/ --dry-run            # 预览
mempalace split ~/chats/ --min-sessions 3     # 只分割有 3+ 个会话的文件
```

---

## 知识图谱

时间实体关系三元组——像 Zep 的 Graphiti，但是 SQLite 而不是 Neo4j。本地和免费。

```python
from mempalace.knowledge_graph import KnowledgeGraph

kg = KnowledgeGraph()
kg.add_triple("Kai", "works_on", "Orion", valid_from="2025-06-01")
kg.add_triple("Maya", "assigned_to", "auth-migration", valid_from="2026-01-15")
kg.add_triple("Maya", "completed", "auth-migration", valid_from="2026-02-01")

# Kai 在做什么？
kg.query_entity("Kai")
# → [Kai → works_on → Orion (current), Kai → recommended → Clerk (2026-01)]

# 一月份什么是真的？
kg.query_entity("Maya", as_of="2026-01-20")
# → [Maya → assigned_to → auth-migration (active)]

# 时间线
kg.timeline("Orion")
# → 项目的按时间顺序的故事
```

事实具有有效性窗口。当事情停止真实时，使其无效：

```python
kg.invalidate("Kai", "works_on", "Orion", ended="2026-03-01")
```

现在对 Kai 当前工作的查询不会返回 Orion。历史查询仍然会。

| 功能 | MemPalace | Zep (Graphiti) |
|---------|-----------|----------------|
| 存储 | SQLite（本地） | Neo4j（云） |
| 成本 | 免费 | $25/月+ |
| 时间有效性 | 是 | 是 |
| 自托管 | 始终 | 仅企业版 |
| 隐私 | 一切本地 | SOC 2、HIPAA |

---

## 专家代理

创建专注于特定领域的代理。每个代理都在宫殿中获得自己的翼和日记——不在你的 CLAUDE.md 中。添加 50 个代理，你的配置保持相同的大小。

```
~/.mempalace/agents/
  ├── reviewer.json       # 代码质量、模式、错误
  ├── architect.json      # 设计决策、权衡
  └── ops.json            # 部署、事件、基础设施
```

你的 CLAUDE.md 只需要一行：

```
你有 MemPalace 代理。运行 mempalace_list_agents 查看它们。
```

AI 在运行时从宫殿中发现其代理。每个代理：

- **有一个焦点** — 它关注什么
- **保持日记** — 用 AAAK 写成，跨会话持久化
- **建立专业知识** — 阅读自己的历史以在其领域保持敏锐

```
# 代理在代码审查后写入日记
mempalace_diary_write("reviewer",
    "PR#42|auth.bypass.found|missing.middleware.check|pattern:3rd.time.this.quarter|★★★★")

# 代理读回历史
mempalace_diary_read("reviewer", last_n=10)
# → 最后 10 个发现，用 AAAK 压缩
```

每个代理都是你数据的专家镜头。审查者记住它见过的每个错误模式。架构师记住每个设计决策。运维代理记住每个事件。它们不共享草稿纸——每个都维护自己的记忆。

Letta 收费 $20-200/月用于代理管理的记忆。MemPalace 用一个翼做到这一点。

---

## MCP 服务器

```bash
claude mcp add mempalace -- python -m mempalace.mcp_server
```

### 19 个工具

**宫殿（读取）**

| 工具 | 什么 |
|------|------|
| `mempalace_status` | 宫殿概述 + AAAK 规范 + 记忆协议 |
| `mempalace_list_wings` | 带计数的翼 |
| `mempalace_list_rooms` | 翼内的房间 |
| `mempalace_get_taxonomy` | 完整的 翼 → 房间 → 计数树 |
| `mempalace_search` | 带翼/房间过滤器的语义搜索 |
| `mempalace_check_duplicate` | 归档前检查 |
| `mempalace_get_aaak_spec` | AAAK 方言参考 |

**宫殿（写入）**

| 工具 | 什么 |
|------|------|
| `mempalace_add_drawer` | 文件逐字内容 |
| `mempalace_delete_drawer` | 按 ID 删除 |

**知识图谱**

| 工具 | 什么 |
|------|------|
| `mempalace_kg_query` | 带时间过滤的实体关系 |
| `mempalace_kg_add` | 添加事实 |
| `mempalace_kg_invalidate` | 将事实标记为结束 |
| `mempalace_kg_timeline` | 按时间顺序的实体故事 |
| `mempalace_kg_stats` | 图谱概述 |

**导航**

| 工具 | 什么 |
|------|------|
| `mempalace_traverse` | 从房间跨翼行走图谱 |
| `mempalace_find_tunnels` | 查找连接两个翼的房间 |
| `mempalace_graph_stats` | 图谱连接概述 |

**代理日记**

| 工具 | 什么 |
|------|------|
| `mempalace_diary_write` | 写 AAAK 日记条目 |
| `mempalace_diary_read` | 阅读最近的日记条目 |

AI 自动从 `mempalace_status` 响应中学习 AAAK 和记忆协议。无需手动配置。

### 支持的 AI 工具

MemPalace MCP 服务器支持所有遵循 MCP 协议的 AI 工具：

| 工具 | 配置方式 | 快速开始 |
|------|---------|---------|
| **Claude Code** | `claude mcp add` | [一键配置](docs/ALL_TOOLS_QUICKSTART.md) |
| **Claude Desktop** | 配置文件 | [配置指南](docs/configs/claude-desktop.json) |
| **Cursor** | 设置 UI 或配置 | [配置指南](docs/configs/cursor.json) |
| **Codex** | 配置文件 | [配置指南](docs/configs/codex.json) |
| **Trae** | 配置文件 | [配置指南](docs/configs/trae.json) |
| **Cline** | VS Code 设置 | [配置指南](docs/configs/cline.json) |
| **OpenClaw** | 配置文件 | [完整指南](docs/OPENCLAW_INTEGRATION.md) |

**📖 完整集成指南：** [docs/UNIVERSAL_MCP_GUIDE.md](docs/UNIVERSAL_MCP_GUIDE.md)
**🚀 所有工具快速开始：** [docs/ALL_TOOLS_QUICKSTART.md](docs/ALL_TOOLS_QUICKSTART.md)

---

## 自动保存钩子

Claude Code 的两个钩子，在工作期间自动保存记忆：

**保存钩子** — 每 15 条消息，触发结构化保存。主题、决策、引用、代码更改。还要重新生成关键事实层。

**PreCompact 钩子** — 在上下文压缩之前触发。紧急保存，在窗口缩小之前。

```json
{
  "hooks": {
    "Stop": [{"matcher": "", "hooks": [{"type": "command", "command": "/path/to/mempalace/hooks/mempal_save_hook.sh"}]}],
    "PreCompact": [{"matcher": "", "hooks": [{"type": "command", "command": "/path/to/mempalace/hooks/mempal_precompact_hook.sh"}]}]
  }
}
```

---

## 基准测试

在标准学术基准上测试——可复现、已发布的数据集。

| 基准 | 模式 | 得分 | API 调用 |
|-----------|------|-------|-----------|
| **LongMemEval R@5** | 原始（仅 ChromaDB） | **96.6%** | 零 |
| **LongMemEval R@5** | 混合 + Haiku 重排序 | **100%** (500/500) | ~500 |
| **LoCoMo R@10** | 原始，会话级别 | **60.3%** | 零 |
| **个人宫殿 R@10** | 启发式基准 | **85%** | 零 |
| **宫殿结构影响** | 翼+房间过滤 | **+34%** R@10 | 零 |

96.6% 的原始得分是要求无 API 密钥、无云和无 LLM 的任何阶段发布的最高 LongMemEval 结果。

### vs 已发布系统

| 系统 | LongMemEval R@5 | 需要 API | 成本 |
|--------|----------------|--------------|------|
| **MemPalace（混合）** | **100%** | 可选 | 免费 |
| Supermemory ASMR | ~99% | 是 | — |
| **MemPalace（原始）** | **96.6%** | **无** | **免费** |
| Mastra | 94.87% | 是（GPT） | API 成本 |
| Mem0 | ~85% | 是 | $19–249/月 |
| Zep | ~85% | 是 | $25/月+ |

---

## 所有命令

```bash
# 设置
mempalace init <dir>                              # 引导入门 + AAAK 引导

# 挖掘
mempalace mine <dir>                              # 挖掘项目文件
mempalace mine <dir> --mode convos                # 挖掘对话导出
mempalace mine <dir> --mode convos --wing myapp   # 用翼名称标记

# 分割
mempalace split <dir>                             # 分割连接的转录
mempalace split <dir> --dry-run                   # 预览

# 搜索
mempalace search "查询"                          # 搜索所有内容
mempalace search "查询" --wing myapp             # 在翼内
mempalace search "查询" --room auth-migration    # 在房间内

# 记忆堆栈
mempalace wake-up                                 # 加载 L0 + L1 上下文
mempalace wake-up --wing driftwood                # 项目特定

# 压缩
mempalace compress --wing myapp                   # AAAK 压缩

# 状态
mempalace status                                  # 宫殿概述
```

所有命令接受 `--palace <path>` 以覆盖默认位置。

---

## 配置

### 全局（`~/.mempalace/config.json`）

```json
{
  "palace_path": "/custom/path/to/palace",
  "collection_name": "mempalace_drawers",
  "people_map": {"Kai": "KAI", "Priya": "PRI"}
}
```

### 翼配置（`~/.mempalace/wing_config.json`）

由 `mempalace init` 生成。将你的人员和项目映射到翼：

```json
{
  "default_wing": "wing_general",
  "wings": {
    "wing_kai": {"type": "person", "keywords": ["kai", "kai's"]},
    "wing_driftwood": {"type": "project", "keywords": ["driftwood", "analytics", "saas"]}
  }
}
```

### 身份（`~/.mempalace/identity.txt`）

纯文本。成为第 0 层——每次会话都加载。

---

## 文件参考

| 文件 | 什么 |
|------|------|
| `cli.py` | CLI 入口点 |
| `config.py` | 配置加载和默认值 |
| `normalize.py` | 将 5 种聊天格式转换为标准转录 |
| `mcp_server.py` | MCP 服务器 — 19 个工具，AAAK 自动教学，记忆协议 |
| `miner.py` | 项目文件导入 |
| `convo_miner.py` | 对话导入 — 按交换对分块 |
| `searcher.py` | 通过 ChromaDB 进行语义搜索 |
| `layers.py` | 4 层记忆堆栈 |
| `dialect.py` | AAAK 压缩 — 30 倍无损 |
| `knowledge_graph.py` | 时间实体关系图（SQLite） |
| `palace_graph.py` | 基于房间的导航图 |
| `onboarding.py` | 引导式设置 — 生成 AAAK 引导 + 翼配置 |
| `entity_registry.py` | 实体代码注册表 |
| `entity_detector.py` | 从内容自动检测人员和项目 |
| `split_mega_files.py` | 将连接的转录文件分割为每个会话的文件 |
| `hooks/mempal_save_hook.sh` | 每 N 条消息自动保存 |
| `hooks/mempal_precompact_hook.sh` | 压缩前的紧急保存 |

---

## 项目结构

```
mempalace/
├── README.md                  ← 你在这里
├── mempalace/                 ← 核心包（README）
│   ├── cli.py                 ← CLI 入口点
│   ├── mcp_server.py          ← MCP 服务器（19 个工具）
│   ├── knowledge_graph.py     ← 时间实体图
│   ├── palace_graph.py        ← 房间导航图
│   ├── dialect.py             ← AAAK 压缩
│   ├── miner.py               ← 项目文件导入
│   ├── convo_miner.py         ← 对话导入
│   ├── searcher.py            ← 语义搜索
│   ├── onboarding.py          ← 引导式设置
│   └── ...                    ← 见 mempalace/README.md
├── benchmarks/                ← 可复现的基准运行器
│   ├── README.md              ← 复制指南
│   ├── BENCHMARKS.md          ← 完整结果 + 方法论
│   ├── longmemeval_bench.py   ← LongMemEval 运行器
│   ├── locomo_bench.py        ← LoCoMo 运行器
│   └── membench_bench.py      ← MemBench 运行器
├── hooks/                     ← Claude Code 自动保存钩子
│   ├── README.md              ← 钩子设置指南
│   ├── mempal_save_hook.sh    ← 每 N 条消息保存
│   └── mempal_precompact_hook.sh ← 紧急保存
├── examples/                  ← 使用示例
│   ├── basic_mining.py
│   ├── convo_import.py
│   └── mcp_setup.md
├── tests/                     ← 测试套件（README）
├── assets/                    ← logo + 品牌资产
└── pyproject.toml             ← 包配置（v3.0.0）
```

---

## 要求

- Python 3.9+
- `chromadb>=0.4.0`
- `pyyaml>=6.0`

无 API 密钥。安装后无互联网。一切都在本地。

```bash
pip install mempalace
```

---

## 语言 / Language

**[🇺🇸 English](README.md)** | **[🇨🇳 中文](README.zh-CN.md)**

---

## 贡献

欢迎 PR。参见 [CONTRIBUTING.md](CONTRIBUTING.md) 了解设置和指南。

## 许可证

MIT — 参见 [LICENSE](LICENSE)。

<!-- 链接定义 -->
[version-shield]: https://img.shields.io/badge/version-3.0.0-4dc9f6?style=flat-square&labelColor=0a0e14
[release-link]: https://github.com/milla-jovovich/mempalace/releases
[python-shield]: https://img.shields.io/badge/python-3.9+-7dd8f8?style=flat-square&labelColor=0a0e14&logo=python&logoColor=7dd8f8
[python-link]: https://www.python.org/
[license-shield]: https://img.shields.io/badge/license-MIT-b0e8ff?style=flat-square&labelColor=0a0e14
[license-link]: https://github.com/milla-jovovich/mempalace/blob/main/LICENSE
[discord-shield]: https://img.shields.io/badge/discord-加入-5865F2?style=flat-square&labelColor=0a0e14&logo=discord&logoColor=5865F2
[discord-link]: https://discord.com/invite/ycTQQCu6kn
