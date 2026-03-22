// push 커맨드 진입점.
// data/*.json 컬렉션 데이터와 data/s3-map.json을 읽어
// URL을 S3 URL로 치환한 뒤 Neon PostgreSQL에 INSERT한다.

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';
import { promptPushConfig } from '../../config/push';
import { insertData } from './insertData/index';

const SKIP_FILES = new Set(['file-map.json', 's3-map.json', 'skipped-urls.json']);

export async function push() {
  const { projectName, dbUrl } = await promptPushConfig();
  const DATA_DIR = `./data/${projectName}`;

  if (!existsSync(DATA_DIR)) {
    throw new Error(`프로젝트 폴더가 없습니다: ${DATA_DIR}\npull을 먼저 실행하세요.`);
  }

  const s3Map: Record<string, string> = JSON.parse(
    readFileSync(join(DATA_DIR, 's3-map.json'), 'utf-8'),
  );

  const collectionFiles = readdirSync(DATA_DIR).filter(
    f => extname(f) === '.json' && !SKIP_FILES.has(f),
  );

  const collections = collectionFiles.map(f => ({
    modelKey: basename(f, '.json'),
    items: JSON.parse(readFileSync(join(DATA_DIR, f), 'utf-8')),
  }));

  console.log(`collections: ${collections.map(c => c.modelKey).join(', ')}`);

  await insertData(collections, s3Map, dbUrl);
  console.log('done.');
}
