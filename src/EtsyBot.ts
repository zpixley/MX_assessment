export interface ISearchResult {
  name: string | undefined,
  price: string | undefined,
  link: string | undefined
}

export class EtsyBot {
  browser: any;
  page: any;

  constructor () {
    
  }

  async initPup() {
    console.debug('[initPup] Start');
    let puppeteer = require('puppeteer-core');
    const { addExtra } = require('puppeteer-extra');
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');
    const chromium = require('@sparticuz/chromium');
    let puppeteerExtra = addExtra(puppeteer);
    puppeteerExtra.use(StealthPlugin());
    // const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
    // puppeteerExtra.use(
    //   RecaptchaPlugin({
    //     provider: {
    //       id: '2captcha',
    //       token: '' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
    //     },
    //     visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    //   })
    // );

    console.debug('[initPup] Launching...');
    this.browser = await puppeteerExtra.launch({
      args: chromium.args.concat([
        '--disable-accelerated-2d-canvas',
        // '--single-process',
        // '--disable-gpu'
      ]),
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: false
      // headless: chromium.headless
    });

    console.log('[initPup] Loading page...');
    this.page = await this.browser.newPage();
  }

  async closePup() {
    console.debug('[closePup] Cleaning up puppeteer...');
    await this.browser.close();
  }

  async delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  async getSearchResults(searchString: string): Promise<ISearchResult[]> {
    console.log('[getSearchResults] Start');
    let searchResults: ISearchResult[] = [];

    await this.initPup();

    await this.page.goto(`https://www.etsy.com/`, { waitUntil: 'domcontentloaded', setTimeout: 120000 });
    await this.page.waitForSelector('input[id=global-enhancements-search-query]');
    await this.page.focus('input[id=global-enhancements-search-query]');
    await this.page.keyboard.type(searchString + '\n');
    await this.delay(3000);

    await this.page.waitForSelector('ol[class="wt-grid wt-grid--block wt-pl-xs-0 tab-reorder-container"]', {
      setTimeout: 120000
    });

    searchResults = await this.page.$eval('ol[class="wt-grid wt-grid--block wt-pl-xs-0 tab-reorder-container"]',
      (ol: any) => {
        let searchResults: ISearchResult[] = [];

        ol.childNodes.forEach((cn: any) => {
          let name,
            price,
            link;

          let anchorTag = cn.childNodes[1].childNodes[1].childNodes[1];

          link = anchorTag.href;

          let item = anchorTag.childNodes[3];
          name = item.childNodes[1].textContent.trim();
          let priceBlock = item.childNodes[5].childNodes[1];
          // price can be in 2 locations depending on if item is on sale
          price = priceBlock.childNodes[2].textContent.trim() || priceBlock.childNodes[3].childNodes[2].textContent.trim();

          searchResults.push({ name, price, link });
        });

        return searchResults;
      }
    );

    await this.closePup();

    return searchResults;
  }

  // humanizes typing behavior
  async sneakyType(input: string) {
    for (let i = 0; i < input.length; i++) {
      await this.delay(Math.floor(Math.random() * 401 + 100));
      await this.page.keyboard.type(input[i]);
    }
  }

  async getOrderHistory(username: string, password: string): Promise<Array<any>> {
    await this.initPup();
    await this.page.goto(`https://www.etsy.com/`, { waitUntil: 'domcontentloaded' });

    await this.page.waitForSelector('button[class="wt-btn wt-btn--small wt-btn--transparent wt-mr-xs-1 inline-overlay-trigger signin-header-action select-signin header-button"]', {
      setTimeout: 120000
    });

    await this.page.$eval('button[class="wt-btn wt-btn--small wt-btn--transparent wt-mr-xs-1 inline-overlay-trigger signin-header-action select-signin header-button"]',
      (el: any) => el.click()  
    );

    await this.page.waitForSelector('input[id="join_neu_email_field"]');
    await this.page.focus('input[id="join_neu_email_field"]');
    await this.sneakyType(username);

    await this.delay(1000);

    await this.page.waitForSelector('input[id="join_neu_password_field"]');
    await this.page.focus('input[id="join_neu_password_field"]');
    await this.sneakyType(password + '\n');

    await this.delay(120000);

    await this.closePup();
    return [];
  }
}