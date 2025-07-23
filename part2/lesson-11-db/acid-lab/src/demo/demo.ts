import { spawn } from 'child_process';
import * as path from 'path';

const run = (script: string) => {
  return spawn('npx', ['ts-node', path.join(__dirname, script)], {
    stdio: 'inherit',
    shell: true,
  });
};

console.log('Running writer.ts and reader.ts in parallel...\n');

run('writer.ts');
run('reader.ts');
