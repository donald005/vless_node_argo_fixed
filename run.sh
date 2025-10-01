#!/bin/bash
echo "🚀 启动 Node.js VLESS WS 服务 + Cloudflare Argo 隧道"
nohup node index.js > node.log 2>&1 &
echo "日志输出到 node.log"
