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
exports.readLine = void 0;
function readLine(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const readline = require('readline');
        const readLineAsync = () => {
            const rl = readline.createInterface({
                input: process.stdin,
            });
            return new Promise((resolve) => {
                rl.prompt();
                rl.on('line', (line) => {
                    rl.close();
                    resolve(line);
                });
            });
        };
        console.log(prompt);
        return readLineAsync();
    });
}
exports.readLine = readLine;
