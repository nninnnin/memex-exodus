// pull 커맨드 진입점.
// fetchCollection → downloadFiles 순서로 실행한다.

import 'dotenv/config';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createMemexFetcher } from '@rebel9/memex-fetcher';
import { fetchCollection } from './pull/fetchCollection/index';
import { downloadFiles } from './pull/downloadFiles/index';

const OUT_DIR = './data';

export async function pull() {
  const token = process.env.MEMEX_TOKEN!;
  const projectId = process.env.MEMEX_PROJECT_ID!;
  const modelKeys = process.env.MEMEX_MODEL_KEYS!.split(',');

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
