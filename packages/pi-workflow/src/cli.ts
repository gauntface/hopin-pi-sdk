#!/usr/bin/env node

import {getRaspberryPiInfo} from '@hopin/pi-sdk';
import {logger} from './utils/_logger';
import {piCLI} from './controllers/_pi-cli';

async function run() {
  const device = await getRaspberryPiInfo();
  if (device) {
    logger.log(`Running on the pi: ${device.ModelID}`);
    await piCLI.run();
  } else {
    logger.log('Running on a normal computer - TODO: Offer options.');
  }
}

run();