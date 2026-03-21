import * as readline from 'readline/promises';

export interface Config {
  token: string;
  projectId: string;
  modelKeys: string[];
}

export async function promptConfig(): Promise<Config> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const token = await rl.question('MEMEX_TOKEN: ');
  const projectId = await rl.question('PROJECT_ID: ');
  const modelKeysRaw = await rl.question('MODEL_KEYS (쉼표로 구분): ');

  rl.close();

  const config: Config = {
    token: token.trim(),
    projectId: projectId.trim(),
    modelKeys: modelKeysRaw.split(',').map(k => k.trim()).filter(Boolean),
  };

  console.log('\n--- 입력 확인 ---');
  console.log(`TOKEN:      ${config.token}`);
  console.log(`PROJECT_ID: ${config.projectId}`);
  console.log(`MODEL_KEYS: ${config.modelKeys.join(', ')}`);
  console.log('-----------------\n');

  return config;
}
