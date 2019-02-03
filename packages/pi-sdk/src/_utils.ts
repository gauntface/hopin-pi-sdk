import * as path from 'path';
import {spawn as origSpawn} from 'child_process';
import {Logger} from '@hopin/logger';

export const logger = new Logger({
  prefix: '@hopin/pi-sdk',
});

type OutputResult = {
  stdout: string,
  stderr: string,
  code: number,
}

export async function spawn(cmd: string, args: Array<string>, opts?: object): Promise<OutputResult> {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const process = origSpawn(cmd, args, opts);
    
    process.on('error', (err) => {
      reject(err);
    });

    if (process.stdout != null) {
      process.stdout.on('data', (data) => {
        stdout += data;
      });
    }
    
    if (process.stderr != null) {
      process.stderr.on('data', (data) => {
        stderr += data;
      });
    }
    
    process.on('close', (code) => {
      if (code !== 0) {
        logger.error(`Output of '${cmd}' process:`);
        logger.error(stdout);
        logger.error(stderr);
        reject(new Error(`command exited with bad code ${code}`));
        return;
      }

      resolve({
        stdout,
        stderr,
        code,
      });
    });
  });
}