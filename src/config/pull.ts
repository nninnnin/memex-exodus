import { prompt, printSummary } from './utils';

export interface PullConfig {
  token: string;
  projectId: string;
  modelKeys: string[];
}

export async function promptPullConfig(): Promise<PullConfig> {
  const answers = await prompt({
    token:     'MEMEX_TOKEN',
    projectId: 'PROJECT_ID',
    modelKeys: 'MODEL_KEYS (쉼표로 구분)',
  });

  const config: PullConfig = {
    token:     answers.token,
    projectId: answers.projectId,
    modelKeys: answers.modelKeys.split(',').map(k => k.trim()).filter(Boolean),
  };

  printSummary('pull config', {
    TOKEN:      config.token,
    PROJECT_ID: config.projectId,
    MODEL_KEYS: config.modelKeys.join(', '),
  });

  return config;
}
