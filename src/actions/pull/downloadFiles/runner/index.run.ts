import 'dotenv/config';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { downloadFiles } from '../index';

const dir = dirname(fileURLToPath(import.meta.url));
const resultsDir = join(dir, 'results');

const MODEL_KEYS = process.env.MEMEX_MODEL_KEYS!.split(',');
const fetchResultsDir = join(dir, '../../fetchCollection/runner/results');

const items: unknown[] = [];
for (const modelKey of MODEL_KEYS) {
  const raw = readFileSync(join(fetchResultsDir, `${modelKey}.json`), 'utf-8');
  items.push(...JSON.parse(raw));
}

await downloadFiles(
  items,
  join(resultsDir, 'files'),
  join(resultsDir, 'skipped-urls.json'),
);
