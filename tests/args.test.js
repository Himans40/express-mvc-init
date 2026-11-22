'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseArgs } = require('../src/args');

test('parseArgs returns help when no args provided', () => {
  const result = parseArgs(['node', 'cli.js']);
  assert.equal(result.command, 'help');
});

test('parseArgs parses scaffold command with project name', () => {
  const result = parseArgs(['node', 'cli.js', 'my-app']);
  assert.equal(result.command, 'scaffold');
  assert.equal(result.projectName, 'my-app');
  assert.equal(result.dryRun, false);
  assert.equal(result.force, false);
});

test('parseArgs parses scaffold command for current directory', () => {
  const result = parseArgs(['node', 'cli.js', '.']);
  assert.equal(result.command, 'scaffold');
  assert.equal(result.projectName, '.');
});

test('parseArgs parses gen command', () => {
  const result = parseArgs(['node', 'cli.js', 'gen', 'product']);
  assert.equal(result.command, 'gen');
  assert.equal(result.resource, 'product');
});

test('parseArgs parses flags', () => {
  const result = parseArgs(['node', 'cli.js', 'my-app', '--dry-run', '--force']);
  assert.equal(result.command, 'scaffold');
  assert.equal(result.dryRun, true);
  assert.equal(result.force, true);
});

test('parseArgs supports --help and --version', () => {
  assert.equal(parseArgs(['node', 'cli.js', '--help']).command, 'help');
  assert.equal(parseArgs(['node', 'cli.js', '--version']).command, 'version');
});

test('parseArgs returns error for unknown flag', () => {
  const result = parseArgs(['node', 'cli.js', 'my-app', '--nope']);
  assert.equal(result.command, 'error');
  assert.match(result.error, /Unknown flag/);
});

test('parseArgs returns error when gen resource is missing', () => {
  const result = parseArgs(['node', 'cli.js', 'gen']);
  assert.equal(result.command, 'error');
  assert.match(result.error, /Missing resource name/);
});
