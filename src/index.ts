import { Command } from 'commander';

const program = new Command();

program.name('memex-exodus');

program
  .command('pull')
  .description('Memex에서 데이터 수집')
  .action((_, cmd) => {
    console.log(cmd.description());
  });

program
  .command('push')
  .description('PostgreSQL + S3에 이식')
  .action((_, cmd) => {
    console.log(cmd.description());
  });

program
  .command('dump')
  .description('DB 백업')
  .action((_, cmd) => {
    console.log(cmd.description());
  });

program.parse(process.argv);
