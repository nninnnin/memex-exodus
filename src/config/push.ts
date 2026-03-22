import { prompt, printSummary } from './utils';

export interface PushConfig {
  projectName: string;
  dbUrl: string;
}

export async function promptPushConfig(): Promise<PushConfig> {
  const answers = await prompt({
    projectName: 'PROJECT_NAME (data/{name}/ 폴더에서 읽습니다)',
    dbUrl:       'NEON_DB_URL',
  });

  const config: PushConfig = {
    projectName: answers.projectName,
    dbUrl:       answers.dbUrl,
  };

  printSummary('push config', {
    PROJECT_NAME: config.projectName,
    DB_URL:       config.dbUrl,
  });

  return config;
}
