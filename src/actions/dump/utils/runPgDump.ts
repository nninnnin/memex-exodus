import { mkdirSync } from 'fs';
import { spawn } from 'child_process';

const BACKUPS_DIR = './backups';

function getFilename(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  return `${date}.sql`;
}

export async function runPgDump(dbUrl: string): Promise<string> {
  mkdirSync(BACKUPS_DIR, { recursive: true });

  const outPath = `${BACKUPS_DIR}/${getFilename()}`;

  return new Promise((resolve, reject) => {
    const proc = spawn('pg_dump', [dbUrl, '-f', outPath]);

    proc.stderr.on('data', (data) => process.stderr.write(data));

    proc.on('close', (code) => {
      if (code === 0) resolve(outPath);
      else reject(new Error(`pg_dump exited with code ${code}`));
    });
  });
}
