const https = require("https");
const fs = require("fs");
const unzipper = require("unzipper");

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const follow = (url) => {
      https.get(url, (res) => {
        if ([301, 302, 307, 308].includes(res.statusCode)) {
          return follow(res.headers.location);
        }
        if (res.statusCode !== 200) return reject(new Error("下载失败: " + res.statusCode));
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      }).on("error", reject);
    };
    follow(url);
  });
}

async function main() {
  const arch = process.arch;
  let cfUrl, xrayUrl;

  if (arch === "x64") {
    cfUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64";
    xrayUrl = "https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip";
  } else if (arch === "arm64") {
    cfUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64";
    xrayUrl = "https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-arm64-v8a.zip";
  } else {
    console.error("❌ 不支持的架构: " + arch);
    process.exit(1);
  }

  if (!fs.existsSync("cloudflared")) {
    console.log("⬇️ 下载 cloudflared...");
    await download(cfUrl, "cloudflared");
    fs.chmodSync("cloudflared", 0o755);
  }

  if (!fs.existsSync("xray")) {
    const xrayZip = "xray.zip";
    console.log("⬇️ 下载 xray-core...");
    await download(xrayUrl, xrayZip);
    await fs.createReadStream(xrayZip)
      .pipe(unzipper.Extract({ path: __dirname }))
      .promise();
    if (fs.existsSync("Xray")) fs.renameSync("Xray", "xray");
    fs.chmodSync("xray", 0o755);
    fs.unlinkSync(xrayZip);
  }
}

main().catch(e => console.error("❌ 出错:", e));
