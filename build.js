const https = require("https");
const fs = require("fs");

const SERVICE_ID = process.env.MICROCMS_SERVICE_ID;
const API_KEY = process.env.MICROCMS_API_KEY;

async function fetchAll() {
  let contents = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const url = `https://${SERVICE_ID}.microcms.io/api/v1/news?limit=${limit}&offset=${offset}`;
    const data = await new Promise((resolve, reject) => {
      https.get(url, { headers: { "X-MICROCMS-API-KEY": API_KEY } }, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => resolve(JSON.parse(body)));
      }).on("error", reject);
    });

    contents = contents.concat(data.contents);

    if (contents.length >= data.totalCount) break;
    offset += limit;
  }

  fs.mkdirSync("dist", { recursive: true });
  fs.writeFileSync("dist/news.json", JSON.stringify(contents, null, 2));
  console.log(`JSON generated! ${contents.length}件`);
}

fetchAll();
