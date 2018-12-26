#!/usr/bin/env nodejs

'use strict';

const assert = require('assert');
const process = require('process');

const DocsWs = require('./docs-ws');
const Docs = require('./docs.js');

function usage() {
  console.error(`usage: ${process.argv[1]} PORT WS_BASE_URL`);
  process.exit(1);
}

function getPort(portArg) {
  let port = Number(portArg);
  if (!port) usage();
  return port;
}

const BASE = '/docs';

async function go(args) {
  try {
    const port = getPort(args[0]);
    const wsBaseUrl = args[1];
    const userWs = new DocsWs(wsBaseUrl);
    Docs(port, BASE, userWs);
  }
  catch (err) {
    console.error(err);
  }
}
    

if (process.argv.length != 4) usage();
go(process.argv.slice(2));

// go(["1236", "http://localhost:1235"]);//TODO: remove this before committing
