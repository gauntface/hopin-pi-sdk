import {getRaspberryPiInfo} from '../pi-sdk';


async function run() {
  const device = await getRaspberryPiInfo();
  if (device) {
    console.log('Running on the pi.');
  } else {
    console.log('Running on a normal computer.');
  }
}

run();