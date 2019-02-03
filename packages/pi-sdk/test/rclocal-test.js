const path = require('path');
const fs = require('fs-extra');
const test = require('ava');

const {getRCLocal} = require('../build/index');

const staticDir = path.join(__dirname, 'static');

test('should parse an rc.local fle with no pi-sdk comments', async (t) => {
  const filePath = path.join(staticDir, 'rc-local-default.txt');
  const file = await getRCLocal(filePath);
  
  const got = file.generateContents();
  const wantBuffer = await fs.readFile(filePath);
  t.is(got, wantBuffer.toString());
});

test('should parse an rc.local fle with commands, no pi-sdk comments', async (t) => {
  const filePath = path.join(staticDir, 'rc-local-default-ip.txt');
  const file = await getRCLocal(filePath);
  
  const got = file.generateContents();
  const wantBuffer = await fs.readFile(filePath);
  t.is(got, wantBuffer.toString());
});

test('should parse an rc.local fle with pi-sdk comments and commands ', async (t) => {
  const filePath = path.join(staticDir, 'rc-local-with-comments.txt');
  const file = await getRCLocal(filePath);
  
  const got = file.generateContents();
  const wantBuffer = await fs.readFile(filePath);
  t.is(got, wantBuffer.toString());
});

test('should return an error rc.local with start only ', async (t) => {
  const filePath = path.join(staticDir, 'rc-local-start-only.txt');
  try {
    await getRCLocal(filePath);
    t.fail();
  } catch (err) {
    t.is(err.message, "Found one of the pi-sdk comments, but not the other. Start Index: 299 End Index: -1");
  }
});

test('should return an error rc.local with end only', async (t) => {
  const filePath = path.join(staticDir, 'rc-local-end-only.txt');
  try {
    await getRCLocal(filePath);
    t.fail();
  } catch (err) {
    t.is(err.message, "Found one of the pi-sdk comments, but not the other. Start Index: -1 End Index: 353");
  }
});

test('should return an error rc.local with multiple comments', async (t) => {
  const filePath = path.join(staticDir, 'rc-local-multi-comments.txt');
  try {
    await getRCLocal(filePath);
    t.fail();
  } catch (err) {
    t.is(err.message, `Please ensure only 1 "# @hopin/pi-sdk [START]" exists in rc.local`);
  }
});


test('should return an error rc.local with multiple end comments', async (t) => {
  const filePath = path.join(staticDir, 'rc-local-multi-end-comments.txt');
  try {
    await getRCLocal(filePath);
    t.fail();
  } catch (err) {
    t.is(err.message, `Please ensure only 1 "# @hopin/pi-sdk [END]" exists in rc.local`);
  }
});

test('should return an error rc.local with multiple start comments', async (t) => {
  const filePath = path.join(staticDir, 'rc-local-multi-start-comments.txt');
  try {
    await getRCLocal(filePath);
    t.fail();
  } catch (err) {
    t.is(err.message, `Please ensure only 1 "# @hopin/pi-sdk [START]" exists in rc.local`);
  }
});

test('should return an error rc.local for reversed comments', async (t) => {
  const filePath = path.join(staticDir, 'rc-local-reversed-order.txt');
  try {
    await getRCLocal(filePath);
    t.fail();
  } catch (err) {
    t.is(err.message, `Please ensure start and end comments are in the correct order`);
  }
});