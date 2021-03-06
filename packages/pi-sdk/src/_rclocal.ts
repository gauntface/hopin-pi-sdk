import * as fs from 'fs-extra';
const sudofs = require('@mh-cbon/sudo-fs');

import { spawn, logger } from './_utils';

const START_COMMENT = '# @hopin/pi-sdk [START]\n';
const END_COMMENT = '# @hopin/pi-sdk [END]\n';

export async function getRCLocal(filePath: string = '/etc/rc.local'): Promise<RCLocal> {
  const rcLocalBuffer = await fs.readFile(filePath);
  return parseRCLocal(rcLocalBuffer.toString());
}

function parseRCLocal(rcLocalFile: string): RCLocal {
  // Get Custom Comments
  const startCommentIndex = rcLocalFile.indexOf(START_COMMENT);
  const endCommentIndex = rcLocalFile.indexOf(END_COMMENT);
  if (startCommentIndex == -1 && endCommentIndex == -1) {
    // No pi-wsdk task includes
    return new RCLocal(rcLocalFile, '', []);
  } else if (startCommentIndex != -1 && endCommentIndex != -1) {
    // Both start and 
    const startPieces = rcLocalFile.split(START_COMMENT);
    if (startPieces.length != 2) {
      throw new Error(`Please ensure only 1 "${START_COMMENT.trim()}" exists in rc.local`)
    }
    const endPieces = rcLocalFile.split(END_COMMENT);
    if (endPieces.length != 2) {
      throw new Error(`Please ensure only 1 "${END_COMMENT.trim()}" exists in rc.local`)
    }

    if (rcLocalFile.indexOf(START_COMMENT) > rcLocalFile.indexOf(END_COMMENT)) {
      throw new Error(`Please ensure start and end comments are in the correct order`)
    }

    const startOfFile = startPieces[0];
    const commandsEndSplit = startPieces[1].split(END_COMMENT);
    const commands = commandsEndSplit[0].split('\n');
    const endOfFile = commandsEndSplit[1];
    return new RCLocal(startOfFile, endOfFile, commands);
  } else {
    throw new Error(`Found one of the pi-sdk comments, but not the other. Start Index: ${startCommentIndex} End Index: ${endCommentIndex}`)
  }
}

export class RCLocal {
  private start: string
  private end: string
  private commands: Array<string>

  constructor(start: string, end: string, commands: Array<string>) {
    this.start = start
    this.end = end
    this.commands = commands
  }

  private generateContents() {
    if (this.commands.length === 0) {
      return `${this.start}${this.end}`
    }
    return `${this.start}${START_COMMENT}${this.commands.join('\n')}\n${END_COMMENT}${this.end}`
  }

  private async writeNewRCLocal() {
    // This will require sudo to overwrite the file, so fallback to a command using sudo
    /* const newContents = this.generateContents();
    const echoCommand = `echo -e '${newContents.split("\n").join("\\n").split('"').join('\\"')}' > /etc/rc.local`
    // const argsCommand = echoCommand.split('"').join('\\"');
    const args = ["sh", "-c", "\"" + echoCommand + "\""];
    const result = await spawn("sudo", args, {
      stdio: 'inherit',
    });*/

    await new Promise((resolve, reject) => {
      sudofs.writeFile('/etc/rc.local', this.generateContents(), function(err: any, data: any) {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
    

    /* if (result.stdout.length > 0 || result.stderr.length > 0) {
      logger.log("Output from command: ", result.stdout, result.stderr);
    }*/
  }

  getCommands(): Array<string> {
    return this.commands;
  }

  async addCommand(cmd: string) {
    this.commands.push(cmd);
    await this.writeNewRCLocal();
  }
}