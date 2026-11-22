'use strict';

// Manual CLI argument parser.
// We avoid external dependencies to keep express-mvc-init lightweight and portable.

const HELP_TEXT = [
  'express-mvc-init - scaffold a clean MVC folder structure for Express.js projects',
  '',
  'Usage:',
  '  npx express-mvc-init <project-name>      Create a new Express.js MVC project in ./<project-name>',
  '  npx express-mvc-init .                   Scaffold an Express.js MVC structure into the current folder',
  '  npx express-mvc-init gen <resource>      Generate model, controller, route, and view for a resource',
  '  npx express-mvc-init --help              Show this help message',
  '  npx express-mvc-init --version           Show package version',
  '',
  'Flags:',
  '  --dry-run   Print what would be created without writing anything',
  '  --force     Allow writing into a non-empty folder / overwrite existing gen files',
  '  --help      Show help',
  '  --version   Show version'
].join('\n');

/**
 * Parse process.argv into a simple command object.
 * @param {string[]} argv - usually process.argv
 * @returns {{command:string, projectName?:string, resource?:string, dryRun:boolean, force:boolean, help:boolean, version:boolean, error?:string}}
 */
function parseArgs(argv) {
  // process.argv: [node, script, ...args]
  const rawArgs = Array.isArray(argv) ? argv.slice(2) : [];
  const result = {
    command: null,
    projectName: null,
    resource: null,
    dryRun: false,
    force: false,
    help: false,
    version: false,
    error: null
  };

  const positionals = [];

  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i];

    if (arg === '--help' || arg === '-h') {
      result.help = true;
      continue;
    }
    if (arg === '--version' || arg === '-v') {
      result.version = true;
      continue;
    }
    if (arg === '--dry-run') {
      result.dryRun = true;
      continue;
    }
    if (arg === '--force') {
      result.force = true;
      continue;
    }

    // Unknown flags are treated as errors for clarity.
    if (arg.startsWith('-')) {
      result.error = 'Unknown flag: ' + arg;
      result.command = 'error';
      return result;
    }

    positionals.push(arg);
  }

  // Help/version take precedence when explicitly requested.
  if (result.help) {
    result.command = 'help';
    return result;
  }
  if (result.version) {
    result.command = 'version';
    return result;
  }

  if (positionals.length === 0) {
    result.command = 'help';
    return result;
  }

  const [first, second, ...rest] = positionals;

  if (first === 'gen') {
    if (!second) {
      result.error = 'Missing resource name. Usage: express-mvc-init gen <resource>';
      result.command = 'error';
      return result;
    }
    if (rest.length > 0) {
      result.error = 'Too many arguments for gen. Usage: express-mvc-init gen <resource>';
      result.command = 'error';
      return result;
    }
    result.command = 'gen';
    result.resource = second;
    return result;
  }

  // Scaffold command: express-mvc-init <project-name> or express-mvc-init .
  if (rest.length > 0 || second) {
    // second exists and first wasn't gen -> too many positionals
    const extras = [second].concat(rest).filter(Boolean);
    if (extras.length > 0) {
      result.error = 'Too many arguments. Usage: express-mvc-init <project-name>';
      result.command = 'error';
      return result;
    }
  }

  result.command = 'scaffold';
  result.projectName = first;
  return result;
}

module.exports = {
  parseArgs,
  HELP_TEXT
};
