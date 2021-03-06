import * as path from 'path';
import {getRCLocal} from '@hopin/pi-sdk';
import * as fs from 'fs-extra';

import {logger} from '../utils/_logger';

export async function postInstall() {
  const pkgPath = path.join(__dirname, '..', '..', 'package.json')
  const pkg = await fs.readJSON(pkgPath);

  const commandsToRun = [
    `echo "@hopin/pi-workflow ${pkg.version} installed."`,
    `npm install -g @hopin/pi-workflow`,
    // TODO: Add a script that starts @hopin/pi-workflow to listen for requests
  ];

  const rcLocal = await getRCLocal();
  const commands = rcLocal.getCommands();
  logger.log(`rc.local currently has ${commands.length} command(s)`);

  for (const c of commandsToRun) {
    if (commands.indexOf(c) == -1) {
      logger.log(`Adding '${c}' to rc.local...`);
      await rcLocal.addCommand(c);
    }
  }
}