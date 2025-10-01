const { spawn } = require('child_process');
const fs = require('fs');

const config = require('./config.json');

// 1. 启动 Xray
const xray = spawn('./xray', ['-config', config.xrayConfigFile]);
xray.stdout.on('data', data => console.log(`[xray] ${data}`));
xray.stderr.on('data', data => console.error(`[xray] ${data}`));

// 2. 启动 cloudflared 隧道
const tunnel = spawn('./cloudflared', [
  'tunnel',
  'run',
  '--token', config.argoAuth.TunnelSecret
]);

tunnel.stdout.on('data', data => console.log(`[cloudflared] ${data}`));
tunnel.stderr.on('data', data => console.error(`[cloudflared] ${data}`));

// 3. 生成 vless 链接文件
const vlessLink = `vless://${config.uuid}@${config.hostname}:443?type=ws&security=tls&path=/&host=${config.hostname}#${config.hostname}`;
fs.writeFileSync(config.vlessOutput, vlessLink);
console.log(`✅ vless.txt 已生成`);
