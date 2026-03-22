import 'dotenv/config';
import { writeFileSync, rmSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createMemexFetcher } from '@rebel9/memex-fetcher';
import { fetchCollection } from '../utils/fetchCollection';

const TOKEN = process.env.MEMEX_TOKEN!;
const PROJECT_ID = process.env.MEMEX_PROJECT_ID!;
const MODEL_KEYS = process.env.MEMEX_MODEL_KEYS!.split(',');

const fetcher = createMemexFetcher(TOKEN);
const dir = dirname(fileURLToPath(import.meta.url));

rmSync(join(dir, 'results'), { recursive: true, force: true });
mkdirSync(join(dir, 'results'), { recursive: true });

for (const modelKey of MODEL_KEYS) {
  const result = await fetchCollection(fetcher, PROJECT_ID, modelKey);
  const outPath = join(dir, 'results', `${modelKey}.json`);
  writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`saved: ${outPath}`);
}
