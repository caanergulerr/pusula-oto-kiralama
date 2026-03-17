const puppeteer = require('puppeteer-core');
const fs = require('fs');
async function test() {
  const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: "new" });
  const page = await browser.newPage();
  const chunks = [];
  page.on('response', async res => {
    if (res.url().includes('_next/static/chunks/app/cars/%5Bid%5D/page')) {
      chunks.push(await res.text());
    }
  });
  await page.goto('https://www.elazigotokiralamapusula.com/cars/6cc2b808-f8ab-4ae6-ac89-7136e9df905c', { waitUntil: 'networkidle0' });
  fs.writeFileSync('page_bundle.js', chunks.join('\n'));
  console.log('Saved page bundle');
  await browser.close();
}
test().catch(console.error);
