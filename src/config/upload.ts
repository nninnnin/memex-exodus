import { prompt, printSummary } from './utils';

export interface UploadConfig {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region: string;
  prefix: string;
}

export async function promptUploadConfig(): Promise<UploadConfig> {
  const answers = await prompt({
    accessKeyId:     'AWS_ACCESS_KEY_ID',
    secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
    bucket:          'S3_BUCKET',
    region:          'S3_REGION',
    prefix:          'S3_PREFIX (예: assets/)',
  });

  const config: UploadConfig = {
    accessKeyId:     answers.accessKeyId,
    secretAccessKey: answers.secretAccessKey,
    bucket:          answers.bucket,
    region:          answers.region,
    prefix:          answers.prefix,
  };

  printSummary('upload config', {
    S3_BUCKET: config.bucket,
    S3_REGION: config.region,
    S3_PREFIX: config.prefix,
  });

  return config;
}
