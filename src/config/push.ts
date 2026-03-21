import { prompt, printSummary } from './utils';

export interface PushConfig {
  s3Bucket: string;
  s3Region: string;
  dbUrl: string;
}

export async function promptPushConfig(): Promise<PushConfig> {
  const answers = await prompt({
    s3Bucket: 'S3_BUCKET',
    s3Region: 'S3_REGION',
    dbUrl:    'DB_URL',
  });

  const config: PushConfig = {
    s3Bucket: answers.s3Bucket,
    s3Region: answers.s3Region,
    dbUrl:    answers.dbUrl,
  };

  printSummary('push config', {
    S3_BUCKET: config.s3Bucket,
    S3_REGION: config.s3Region,
    DB_URL:    config.dbUrl,
  });

  return config;
}
