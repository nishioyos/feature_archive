const https = require("https");
const fs = require("fs");

const SERVICE_ID = process.env.MICROCMS_SERVICE_ID;
const API_KEY = process.env.MICROCMS_API_KEY;

const url = `https://${SERVICE_ID}.microcms.io/api/v1/news?limit=100`;

https.get(url, { headers: { "X-MICROCMS-API-KEY": API_KEY } }, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    console.log("Response:", data); // ← レスポンス内容を確認
    const json = JSON.parse(data);
    console.log("Keys:", Object.keys(json)); // ← キーを確認

    fs.mkdirSync("dist", { recursive: true });
    fs.writeFileSync("dist/news.json", JSON.stringify(json.contents, null, 2));
    console.log("JSON generated!");
  });
});
