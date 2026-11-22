#!/usr/bin/env node

'use strict';

// CLI entry point for express-mvc-init.
// This file parses command-line arguments and dispatches to the right command.

const fs = require('fs');
const path = require('path');
const logger = require('../src/logger');
const { parseArgs, HELP_TEXT } = require('../src/args');
const { scaffoldProject } = require('../src/scaffold');
const { generateResource } = require('../src/generate');

function getVersion() {
  try {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.version || '0.0.0';
  } catch (err) {
    return '0.0.0';
  }
}

function main() {
  const args = parseArgs(process.argv);

  if (args.command === 'help') {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  if (args.command === 'version') {
    console.log(getVersion());
    process.exit(0);
  }

  if (args.command === 'error') {
    logger.error(args.error);
    logger.dim('Run "npx express-mvc-init --help" for usage.');
    process.exit(1);
  }

  if (args.command === 'scaffold') {
    const result = scaffoldProject({
      projectName: args.projectName,
      dryRun: args.dryRun,
      force: args.force,
      cwd: process.cwd()
    });

    if (!result.ok) {
      logger.error(result.message);
      process.exit(1);
    }

    process.exit(0);
  }

  if (args.command === 'gen') {
    const result = generateResource({
      resource: args.resource,
      dryRun: args.dryRun,
      force: args.force,
      cwd: process.cwd()
    });

    if (!result.ok) {
      logger.error(result.message);
      process.exit(1);
    }

    process.exit(0);
  }

  // Fallback for unexpected command states.
  logger.error('Unknown command.');
  console.log(HELP_TEXT);
  process.exit(1);
}

main();
