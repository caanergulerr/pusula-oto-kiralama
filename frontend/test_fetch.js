const puppeteer = require('puppeteer-core');

async function testFetch() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new"
  });
  
  const page = await browser.newPage();
  
  await page.goto('https://www.elazigotokiralamapusula.com/', { waitUntil: 'networkidle0' });
  
  const fetchResult = await page.evaluate(async () => {
    try {
      const res = await fetch('/api/cars/6cc2b808-f8ab-4ae6-ac89-7136e9df905c');
      const text = await res.text();
      return { status: res.status, url: res.url, text: text.substring(0, 100) };
    } catch (e) {
      return { error: e.toString() };
    }
  });
  
  console.log('Fetch Result:', fetchResult);
  
  await browser.close();
}
testFetch().catch(console.error);
