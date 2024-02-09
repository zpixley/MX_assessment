import { readLine } from './src/utils';
import { EtsyBot } from './src/EtsyBot';

export async function main(): Promise<any> {
  let searchString = await readLine('What would you like to search for on Etsy?');
  let searchBot = new EtsyBot();

  let searchResults = await searchBot.getSearchResults(searchString);
  console.log(searchResults);

  // console.log('Please provide your Etsy login info so that we can fetch your recent purchases.');
  // let username = await readLine('Username:');
  // let password = await readLine('Password:');

  // let historyBot = new EtsyBot();

  // // let orderHistory = await historyBot.getOrderHistory('zacharypixley@gmail.com', 'MXAssessment2024');
  // let orderHistory = await historyBot.getOrderHistory(username, password);
  // console.log(orderHistory);
}

main();