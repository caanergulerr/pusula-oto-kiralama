const puppeteer = require('puppeteer-core');
const fs = require('fs');
async function test() {
  const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: "new" });
  const page = await browser.newPage();
  const chunks = [];
  page.on('response', async res => {
    if (res.url().includes('.js')) {
      try { chunks.push(await res.text()); } catch {}
    }
  });
  await page.goto('https://www.elazigotokiralamapusula.com/cars/6cc2b808-f8ab-4ae6-ac89-7136e9df905c', { waitUntil: 'networkidle0' });
  fs.writeFileSync('all_chunks.js', chunks.join('\n'));
  console.log('Saved all chunks');
  await browser.close();
}
test().catch(console.error);
