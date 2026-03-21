import { Command } from 'commander';
import { pull } from './actions/pull';
import { push } from './actions/push';
import { dump } from './actions/dump';

const program = new Command();

program.name('memex-exodus');

program
  .command('pull')
  .description('Memex에서 데이터 수집')
  .action(pull);

program
  .command('push')
  .description('PostgreSQL + S3에 이식')
  .action(push);

program
  .command('dump')
  .description('DB 백업')
  .action(dump);

program.parse(process.argv);
