import { prompt, printSummary } from './utils';

export interface PushConfig {
  dbUrl: string;
}

export async function promptPushConfig(): Promise<PushConfig> {
  const answers = await prompt({
    dbUrl: 'NEON_DB_URL',
  });

  const config: PushConfig = {
    dbUrl: answers.dbUrl,
  };

  printSummary('push config', {
    DB_URL: config.dbUrl,
  });

  return config;
}
