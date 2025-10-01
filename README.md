# vless_node_argo_fixed

## 目录结构
vless_node_argo_fixed/  
│  
├─ config.json       # 所有配置集中  
├─ index.js          # Node.js 启动脚本  
├─ run.sh            # 启动脚本  
├─ downloader.js     # 下载xray和cloudflare  
├─ xray              # Xray 二进制  
├─ cloudflared       # cloudflared 二进制  

## 运行说明
上传 xray 与 cloudflared 到容器。  
上传 config.json、index.js 和 run.sh。  
确认 TunnelSecret 正确。  
执行：  
npm install unzipper ws  
node downloader.js  
bash run.sh  

由于部分容器不支持wget，增加了downloader.js  下载环境文件。
