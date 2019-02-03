import * as fs from 'fs-extra';
import {getRCLocal} from '@hopin/pi-sdk';

import {logger} from '../utils/_logger';

class PiCLI {
  async run() {
    // TODO: Add launch command to rc.local
    const rcLocal = await getRCLocal();
    
    logger.log(`/etc/rc.local file contents:\n\n${rcLocal.getCommands()}`)
  }
}

export const piCLI = new PiCLI();