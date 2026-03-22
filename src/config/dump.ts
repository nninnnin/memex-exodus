import { prompt, printSummary } from './utils';

export interface DumpConfig {
  dbUrl: string;
}

export async function promptDumpConfig(): Promise<DumpConfig> {
  const answers = await prompt({
    dbUrl: 'NEON_DB_URL',
  });

  const config: DumpConfig = {
    dbUrl: answers.dbUrl,
  };

  printSummary('dump config', {
    DB_URL: config.dbUrl,
  });

  return config;
}
