const https = require("https");
const fs = require("fs");

const SERVICE_ID = process.env.MICROCMS_SERVICE_ID;
const API_KEY = process.env.MICROCMS_API_KEY;

const url = `https://${SERVICE_ID}.microcms.io/api/v1/news?limit=100`;

https.get(url, { headers: { "X-MICROCMS-API-KEY": API_KEY } }, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    const json = JSON.parse(data);
    const contents = json.contents || []; // ← 空配列をデフォルトに

    fs.mkdirSync("dist", { recursive: true });
    fs.writeFileSync("dist/news.json", JSON.stringify(contents, null, 2));
    console.log("JSON generated!");
  });
});
