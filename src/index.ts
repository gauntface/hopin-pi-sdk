import {updatePi} from './devworkflow/index';
import {getRaspberryPiInfo} from './pi-sdk/index';

async function run() {
  await updatePi();
}

run();