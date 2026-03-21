import * as readline from 'readline/promises';

export async function prompt(questions: Record<string, string>): Promise<Record<string, string>> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answers: Record<string, string> = {};

  for (const [key, label] of Object.entries(questions)) {
    answers[key] = (await rl.question(`${label}: `)).trim();
  }

  rl.close();
  return answers;
}

export function printSummary(label: string, values: Record<string, string>) {
  const width = Math.max(...Object.keys(values).map(k => k.length));
  console.log(`\n--- ${label} ---`);
  for (const [key, val] of Object.entries(values)) {
    console.log(`${key.padEnd(width)}  ${val}`);
  }
  console.log('-'.repeat(width + 4) + '\n');
}
