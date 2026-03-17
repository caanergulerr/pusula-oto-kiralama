const puppeteer = require('puppeteer-core');
const os = require('os');

async function testLiveSite() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Standard Windows Chrome path, will try edge if this fails
    headless: "new"
  }).catch(() => puppeteer.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: "new" }));
  
  const page = await browser.newPage();
  
  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED] ${request.url()} - ${request.failure()?.errorText}`);
  });
  page.on('console', msg => {
    console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`);
  });

  console.log('Navigating to live site...');
  await page.goto('https://www.elazigotokiralamapusula.com/cars/6cc2b808-f8ab-4ae6-ac89-7136e9df905c', { waitUntil: 'networkidle0' });
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Page Text snippet:');
  console.log(bodyText.substring(0, 300));
  
  await browser.close();
}
testLiveSite().catch(console.error);
