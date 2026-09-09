import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const cli = resolve('node_modules', 'vinext', 'dist', 'cli.js');
const result = spawnSync(process.execPath, [cli, 'build'], {
  cwd: process.cwd(),
  encoding: 'utf8',
  env: process.env,
});

process.stdout.write(result.stdout ?? '');
process.stderr.write(result.stderr ?? '');

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

if (result.status === 0) {
  process.exit(0);
}

const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
const completedWindowsBuild = process.platform === 'win32'
  && output.includes('Build complete.')
  && output.includes('UV_HANDLE_CLOSING')
  && existsSync(resolve('dist', 'client', 'index.html'))
  && existsSync(resolve('dist', 'server', 'index.js'));

if (completedWindowsBuild) {
  console.warn('Build completata: ignorata l’asserzione libuv emessa da Node dopo la chiusura di vinext.');
  process.exit(0);
}

process.exit(result.status ?? 1);
