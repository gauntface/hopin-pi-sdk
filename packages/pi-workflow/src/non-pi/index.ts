import * as Bonjour from 'bonjour';

import {logger} from '../utils/_logger'

// TODO: Trigger pi update from server
export async function updatePi() {
  logger.log('Update Pi....');
  logger.group('Find Pis....');
  const services = await findPis();
  for (const s of services) {
    logger.log(`Found '${s.name}'`);
  }
  logger.groupEnd();

  logger.group('    Request an update....');
  logger.groupEnd();
}

function findPis(): Promise<Array<Bonjour.Service>> {
  return new Promise((resolve, reject) => {
    const bonjour = Bonjour()
    const browser = bonjour.find({});
    const start = Date.now();
    browser.start();
    const retryCount = 5;
    let retryAttempts = 0;
    const intervalId = setInterval(function() {
      if (retryAttempts == retryCount) {
        logger.log('Stopping search...');
        bonjour.destroy();
        clearInterval(intervalId);
        resolve(browser.services);
        return
      }

      retryAttempts++;
      
      browser.update();
    }, 2000);
  });
}

// TODO: Perform update on client