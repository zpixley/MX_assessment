export async function readLine(prompt: string): Promise<string> {
  const readline = require('readline');

  const readLineAsync = (): Promise<string> => {
    const rl = readline.createInterface({
      input: process.stdin,
    });

    return new Promise((resolve) => {
      rl.prompt();
      rl.on('line', (line: any) => {
        rl.close();
        resolve(line);
      });
    });
  };

  console.log(prompt);
  return readLineAsync();
}