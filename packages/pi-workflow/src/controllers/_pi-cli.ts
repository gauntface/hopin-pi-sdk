import * as fs from 'fs-extra';
import {getRCLocal, writeRCLocal} from '@hopin/pi-sdk';

import {logger} from '../utils/_logger';

class PiCLI {
  async run() {
    const rcLocal = await getRCLocal();
    rcLocal.addCommand('pi-workflow start-pi');
    writeRCLocal(rcLocal);
    
    // logger.log(`/etc/rc.local file contents:\n\n${rcLocalFile}`)
  }
}

export const piCLI = new PiCLI();