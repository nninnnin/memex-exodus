import { Command } from 'commander';
import { pull } from './actions/pull';
import { upload } from './actions/upload';
import { push } from './actions/push';
import { dump } from './actions/dump';

const program = new Command();

program.name('memex-exodus');

program
  .command('pull')
  .description('Memex에서 데이터 수집')
  .action(pull);

program
  .command('upload')
  .description('로컬 파일 → S3 업로드, s3-map.json 생성')
  .action(upload);

program
  .command('push')
  .description('컬렉션 데이터 → Neon PostgreSQL INSERT')
  .action(push);

program
  .command('dump')
  .description('DB 백업')
  .action(dump);

program.parse(process.argv);
