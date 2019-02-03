#!/usr/bin/env node

import {getRaspberryPiInfo} from '@hopin/pi-sdk';
import {logger} from './utils/_logger';
import {piCLI} from './pi/controllers/_pi-cli';

async function run() {
  const device = await getRaspberryPiInfo();
  if (device) {
    logger.log(`Running on the pi: ${device.ModelID}`);
    await piCLI.run();
  } else {
    logger.log('Running on a non-pi device.');
  }
}

run();