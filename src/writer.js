'use strict';

const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Check whether a path exists.
 * @param {string} targetPath
 * @returns {boolean}
 */
function pathExists(targetPath) {
  return fs.existsSync(targetPath);
}

/**
 * Check whether a directory is empty. Returns true for non-existent directories.
 * @param {string} dirPath
 * @returns {boolean}
 */
function dirIsEmpty(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return true;
  }
  const entries = fs.readdirSync(dirPath);
  return entries.length === 0;
}

/**
 * Ensure a directory exists. In dry-run mode, only log the action.
 * @param {string} dirPath
 * @param {{dryRun?: boolean}} options
 */
function ensureDir(dirPath, options) {
  const opts = options || {};
  if (fs.existsSync(dirPath)) {
    return;
  }
  if (opts.dryRun) {
    logger.dim('[dry-run] create dir  ' + dirPath);
    return;
  }
  fs.mkdirSync(dirPath, { recursive: true });
  logger.info('create dir  ' + dirPath);
}

/**
 * Write a file safely.
 * - Never overwrites existing files silently.
 * - In dry-run mode, logs what would happen.
 * - With force, overwrites existing files.
 *
 * @param {string} filePath
 * @param {string} content
 * @param {{dryRun?: boolean, force?: boolean}} options
 * @returns {{written:boolean, skipped:boolean, reason?:string}}
 */
function writeFile(filePath, content, options) {
  const opts = options || {};
  const exists = fs.existsSync(filePath);

  if (exists && !opts.force) {
    return { written: false, skipped: false, reason: 'exists' };
  }

  if (opts.dryRun) {
    const action = exists ? 'overwrite' : 'create';
    logger.dim('[dry-run] ' + action + ' file ' + filePath);
    return { written: true, skipped: false };
  }

  // Ensure parent directory exists before writing.
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  const verb = exists ? 'overwrite' : 'create';
  logger.info(verb + ' file ' + filePath);
  return { written: true, skipped: false };
}

/**
 * Read a UTF-8 text file.
 * @param {string} filePath
 * @returns {string}
 */
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

module.exports = {
  pathExists,
  dirIsEmpty,
  ensureDir,
  writeFile,
  readFile
};
