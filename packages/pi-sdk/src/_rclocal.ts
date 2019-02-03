import * as fs from 'fs-extra';

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
    return `${this.start}${START_COMMENT}${this.commands.join('\n')}${END_COMMENT}${this.end}`
  }

  private async writeNewRCLocal() {
    // This will require sudo to overwrite the file, so fallback to a command using sudo
    const args = ["echo", "-e", "\"" + this.generateContents() + "\"", ">", "'/etc/rc.local'"];
    logger.warn("Write new rc.local args: ", args);
    const result = await spawn("sudo", args);
    logger.log("Output from command: ", result.stdout, result.stderr);
  }

  getCommands(): Array<string> {
    return this.commands;
  }

  async addCommand(cmd: string) {
    this.commands.push(cmd);
    await this.writeNewRCLocal();
  }
}