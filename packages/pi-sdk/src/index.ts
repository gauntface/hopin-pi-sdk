import {promisify} from 'util';
import {exec} from 'child_process';

export * from './_rclocal';

const execPromise = promisify(exec);

type DeviceInfo = {
  ModelID: string
}

export async function getRaspberryPiInfo(): Promise<DeviceInfo|null> {
  try {
    const modelResp = await execPromise(`cat /proc/device-tree/model`);
    if (modelResp.stderr != null && modelResp.stderr.length > 0) {
      return null
    }

    if (modelResp.stdout.indexOf('Raspberry Pi') == 0) {
      return {
        ModelID: modelResp.stdout,
      };
    }
  } catch (err) {
    // NOOP
  }
  return null
}