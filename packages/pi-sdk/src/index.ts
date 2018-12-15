import {promisify} from 'util';
import {exec} from 'child_process';

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

    return {
      ModelID: modelResp.stdout,
    };
  } catch (err) {
    // NOOP
  }
  return null
}