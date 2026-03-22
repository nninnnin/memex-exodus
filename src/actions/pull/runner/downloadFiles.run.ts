import 'dotenv/config';
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { downloadFiles } from '../utils/downloadFiles';

const dir = dirname(fileURLToPath(import.meta.url));
const resultsDir = join(dir, 'results');

rmSync(resultsDir, { recursive: true, force: true });
mkdirSync(resultsDir, { recursive: true });

const MODEL_KEYS = process.env.MEMEX_MODEL_KEYS!.split(',');
const fetchResultsDir = join(dir, 'results');

const items: unknown[] = [];
for (const modelKey of MODEL_KEYS) {
  const raw = readFileSync(join(fetchResultsDir, `${modelKey}.json`), 'utf-8');
  items.push(...JSON.parse(raw));
}

const fileMap = await downloadFiles(
  items,
  join(resultsDir, 'files'),
  join(resultsDir, 'skipped-urls.json'),
);

writeFileSync(join(resultsDir, 'file-map.json'), JSON.stringify(fileMap, null, 2));
console.log(`file-map saved: ${join(resultsDir, 'file-map.json')}`);
