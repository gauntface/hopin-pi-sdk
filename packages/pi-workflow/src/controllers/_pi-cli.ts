import * as fs from 'fs-extra';

import {logger} from '../utils/_logger';

class PiCLI {
  async run() {
    // TODO: Add launch command to rc.local
    const rcLocalBuffer = await fs.readFile('/etc/rc.local');
    const rcLocalFile = rcLocalBuffer.toString();
    logger.log(`/etc/rc.local file contents:\n\n${rcLocalFile}`)
  }
}

export const piCLI = new PiCLI();