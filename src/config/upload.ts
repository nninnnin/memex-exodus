import { prompt, printSummary } from './utils';

export interface UploadConfig {
  projectName: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region: string;
  prefix: string;
}

export async function promptUploadConfig(): Promise<UploadConfig> {
  const answers = await prompt({
    projectName:     'PROJECT_NAME (data/{name}/ 폴더에서 읽습니다)',
    accessKeyId:     'AWS_ACCESS_KEY_ID',
    secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
    bucket:          'S3_BUCKET',
    region:          'S3_REGION',
    prefix:          'S3_PREFIX (예: glbs/)',
  });

  const config: UploadConfig = {
    projectName:     answers.projectName,
    accessKeyId:     answers.accessKeyId,
    secretAccessKey: answers.secretAccessKey,
    bucket:          answers.bucket,
    region:          answers.region,
    prefix:          answers.prefix,
  };

  printSummary('upload config', {
    PROJECT_NAME: config.projectName,
    S3_BUCKET:    config.bucket,
    S3_REGION:    config.region,
    S3_PREFIX:    config.prefix,
  });

  return config;
}
