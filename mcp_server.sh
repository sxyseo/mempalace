#!/bin/bash
# MemPalace MCP Server 启动脚本
# 用于 OpenClaw 和其他 MCP 兼容工具

set -e

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 激活虚拟环境
if [ -f "$SCRIPT_DIR/venv/bin/activate" ]; then
    source "$SCRIPT_DIR/venv/bin/activate"
else
    echo "错误: 虚拟环境不存在，请先运行: python3 -m venv venv && pip install -e \".[dev]\"" >&2
    exit 1
fi

# 启动 MCP 服务器
cd "$SCRIPT_DIR"
exec python -m mempalace.mcp_server
