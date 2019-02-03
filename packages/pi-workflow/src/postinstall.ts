import {getRaspberryPiInfo} from '@hopin/pi-sdk';
import {logger} from './utils/_logger';
import {postInstall as piPostInstall} from './pi/postinstall';

async function run() {
  try {
    const device = await getRaspberryPiInfo();
    if (device) {
      logger.log(`Starting Pi postinstall script.`);
      await piPostInstall();
    }
  } catch (err) {
    logger.error(`An error occured while running the postinstall script:`, err)
  }
}

run();