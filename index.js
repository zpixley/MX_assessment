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
exports.main = void 0;
const utils_1 = require("./src/utils");
const EtsyBot_1 = require("./src/EtsyBot");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let searchString = yield (0, utils_1.readLine)('What would you like to search for on Etsy?');
        let searchBot = new EtsyBot_1.EtsyBot();
        let searchResults = yield searchBot.getSearchResults(searchString);
        console.log(searchResults);
        // console.log('Please provide your Etsy login info so that we can fetch your recent purchases.');
        // let username = await readLine('Username:');
        // let password = await readLine('Password:');
        // let historyBot = new EtsyBot();
        // // let orderHistory = await historyBot.getOrderHistory('zacharypixley@gmail.com', 'MXAssessment2024');
        // let orderHistory = await historyBot.getOrderHistory(username, password);
        // console.log(orderHistory);
    });
}
exports.main = main;
main();
