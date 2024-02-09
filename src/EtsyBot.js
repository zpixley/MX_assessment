"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtsyBot = void 0;
class EtsyBot {
    constructor() {
    }
    initPup() {
        return __awaiter(this, void 0, void 0, function* () {
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
            this.browser = yield puppeteerExtra.launch({
                args: chromium.args.concat([
                    '--disable-accelerated-2d-canvas',
                    // '--single-process',
                    // '--disable-gpu'
                ]),
                defaultViewport: chromium.defaultViewport,
                executablePath: yield chromium.executablePath,
                headless: false
                // headless: chromium.headless
            });
            console.log('[initPup] Loading page...');
            this.page = yield this.browser.newPage();
        });
    }
    closePup() {
        return __awaiter(this, void 0, void 0, function* () {
            console.debug('[closePup] Cleaning up puppeteer...');
            yield this.browser.close();
        });
    }
    delay(time) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, time));
        });
    }
    getSearchResults(searchString) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('[getSearchResults] Start');
            let searchResults = [];
            yield this.initPup();
            yield this.page.goto(`https://www.etsy.com/`, { waitUntil: 'domcontentloaded', setTimeout: 120000 });
            yield this.page.waitForSelector('input[id=global-enhancements-search-query]');
            yield this.page.focus('input[id=global-enhancements-search-query]');
            yield this.page.keyboard.type(searchString + '\n');
            yield this.delay(3000);
            yield this.page.waitForSelector('ol[class="wt-grid wt-grid--block wt-pl-xs-0 tab-reorder-container"]', {
                setTimeout: 120000
            });
            searchResults = yield this.page.$eval('ol[class="wt-grid wt-grid--block wt-pl-xs-0 tab-reorder-container"]', (ol) => {
                let searchResults = [];
                ol.childNodes.forEach((cn) => {
                    let name, price, link;
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
            });
            yield this.closePup();
            return searchResults;
        });
    }
    // humanizes typing behavior
    sneakyType(input) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < input.length; i++) {
                yield this.delay(Math.floor(Math.random() * 401 + 100));
                yield this.page.keyboard.type(input[i]);
            }
        });
    }
    getOrderHistory(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initPup();
            yield this.page.goto(`https://www.etsy.com/`, { waitUntil: 'domcontentloaded' });
            yield this.page.waitForSelector('button[class="wt-btn wt-btn--small wt-btn--transparent wt-mr-xs-1 inline-overlay-trigger signin-header-action select-signin header-button"]', {
                setTimeout: 120000
            });
            yield this.page.$eval('button[class="wt-btn wt-btn--small wt-btn--transparent wt-mr-xs-1 inline-overlay-trigger signin-header-action select-signin header-button"]', (el) => el.click());
            yield this.page.waitForSelector('input[id="join_neu_email_field"]');
            yield this.page.focus('input[id="join_neu_email_field"]');
            yield this.sneakyType(username);
            yield this.delay(1000);
            yield this.page.waitForSelector('input[id="join_neu_password_field"]');
            yield this.page.focus('input[id="join_neu_password_field"]');
            yield this.sneakyType(password + '\n');
            yield this.delay(120000);
            yield this.closePup();
            return [];
        });
    }
}
exports.EtsyBot = EtsyBot;
