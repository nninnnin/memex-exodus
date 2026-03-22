// dump 커맨드 진입점.
// pg_dump를 실행해 backups/YYYYMMDD.sql 파일로 저장한다.

import { promptDumpConfig } from '../../config/dump';
import { runPgDump } from './utils/runPgDump';

export async function dump() {
  const { dbUrl } = await promptDumpConfig();

  console.log('dumping...');
  const outPath = await runPgDump(dbUrl);
  console.log(`saved: ${outPath}`);
}
