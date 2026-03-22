// pull 커맨드 진입점.
// fetchCollection → downloadFiles 순서로 실행한다.

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createMemexFetcher } from '@rebel9/memex-fetcher';
import { promptPullConfig } from '../../config/pull';
import { fetchCollection } from './fetchCollection/index';
import { downloadFiles } from './downloadFiles/index';

export async function pull() {
  const { token, projectId, projectName, modelKeys } = await promptPullConfig();
  const OUT_DIR = `./data/${projectName}`;

  const fetcher = createMemexFetcher(token);

  mkdirSync(OUT_DIR, { recursive: true });

  const items: unknown[] = [];
  for (const modelKey of modelKeys) {
    console.log(`fetching: ${modelKey}`);
    const result = await fetchCollection(fetcher, projectId, modelKey);
    writeFileSync(join(OUT_DIR, `${modelKey}.json`), JSON.stringify(result, null, 2));
    items.push(...result);
  }

  const fileMap = await downloadFiles(
    items,
    join(OUT_DIR, 'files'),
    join(OUT_DIR, 'skipped-urls.json'),
  );

  writeFileSync(join(OUT_DIR, 'file-map.json'), JSON.stringify(fileMap, null, 2));
  console.log('done.');
}
