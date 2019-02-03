import {getRaspberryPiInfo} from '@hopin/pi-sdk';
import {logger} from './utils/_logger';
import {postInstall as piPostInstall} from './pi/postinstall';

async function run() {
  const device = await getRaspberryPiInfo();
  if (device) {
    logger.log(`Starting Pi postinstall script.`);
    await piPostInstall();
  }
}

run();