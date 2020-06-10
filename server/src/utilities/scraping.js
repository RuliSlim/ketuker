const puppeteer = require('puppeteer');
async function getTokoPedia (item) {
  let processedItem = item.split(' ').join('%20');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ] }); // for test disable the headlels mode,
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);

  await page.setViewport({ width: 1000, height: 926 });
  const data = await page.goto(`https://www.olx.co.id/items/q-${processedItem}?sorting=desc-relevance`, {
    waitUntil: 'networkidle2', timeout: 0
  });

  /** @type {string[]} */
  const productNames = await page.evaluate(() => {
    const div = document.querySelectorAll(
      ' div.IKo3_'
    );
    
    const productnames = [];
    div.forEach((element) => {
      const titleelem = element.querySelector('._2tW1I').textContent;
      const priceitem = element.querySelector('._89yzn').textContent;
      if (priceitem != null && titleelem != null) {
        productnames.push({
          title: titleelem,
          price: priceitem,
        });
      }
    });
    // titleelem != null &&
    return productnames;
  });
  browser.close();
  return productNames;
}

export default getTokoPedia;
