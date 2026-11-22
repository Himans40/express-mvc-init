'use strict';

const path = require('path');
const logger = require('./logger');
const writer = require('./writer');
const resourceTemplates = require('./templates/resource');

const ROUTES_IMPORT_ANCHOR = '// [express-mvc-init:routes-import]';
const ROUTES_USE_ANCHOR = '// [express-mvc-init:routes-use]';

/**
 * Normalize a resource name for generation.
 * - lowercases
 * - strips invalid characters (keeps letters, numbers, hyphens, underscores)
 * @param {string} name
 * @returns {{valid:boolean, normalized?:string, error?:string}}
 */
function normalizeResourceName(name) {
  if (typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Resource name is required.' };
  }

  const normalized = name.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!normalized) {
    return {
      valid: false,
      error: 'Resource name "' + name + '" is invalid after normalization. Use letters, numbers, hyphens, or underscores.'
    };
  }

  return { valid: true, normalized: normalized };
}

/**
 * Insert a line after an anchor comment if it is not already present.
 * @param {string} content
 * @param {string} anchor
 * @param {string} line
 * @returns {{content:string, changed:boolean, error?:string}}
 */
function insertAfterAnchor(content, anchor, line) {
  if (content.indexOf(line) !== -1) {
    // Already registered; no change needed.
    return { content: content, changed: false };
  }

  const anchorIndex = content.indexOf(anchor);
  if (anchorIndex === -1) {
    return { content: content, changed: false, error: 'Missing anchor: ' + anchor };
  }

  const lineEnd = content.indexOf('\n', anchorIndex);
  if (lineEnd === -1) {
    // Anchor is on the last line; append a new line.
    return { content: content + '\n' + line + '\n', changed: true };
  }

  const before = content.slice(0, lineEnd + 1);
  const after = content.slice(lineEnd + 1);
  return { content: before + line + '\n' + after, changed: true };
}

/**
 * Update src/routes/index.js to register the generated resource route.
 * @param {string} routesIndexPath
 * @param {{camel:string, routeFile:string, resource:string}} names
 * @param {{dryRun:boolean, force:boolean}} options
 * @returns {{ok:boolean, message?:string}}
 */
function registerRoute(routesIndexPath, names, options) {
  if (!writer.pathExists(routesIndexPath)) {
    return {
      ok: false,
      message: 'Could not find routes index at ' + routesIndexPath + '. Run this command inside a scaffolded express-mvc-init project.'
    };
  }

  const routeVar = names.camel + 'Routes';
  const importLine = "const " + routeVar + " = require('./" + names.routeFile + "');";
  const useLine = "router.use('/" + names.resource + "', " + routeVar + ");";

  let content = writer.readFile(routesIndexPath);

  const importResult = insertAfterAnchor(content, ROUTES_IMPORT_ANCHOR, importLine);
  if (importResult.error) {
    return { ok: false, message: importResult.error + ' in ' + routesIndexPath };
  }
  content = importResult.content;

  const useResult = insertAfterAnchor(content, ROUTES_USE_ANCHOR, useLine);
  if (useResult.error) {
    return { ok: false, message: useResult.error + ' in ' + routesIndexPath };
  }
  content = useResult.content;

  const changed = importResult.changed || useResult.changed;
  if (!changed) {
    logger.info('Route already registered in ' + routesIndexPath);
    return { ok: true };
  }

  if (options.dryRun) {
    logger.dim('[dry-run] update file ' + routesIndexPath);
    return { ok: true };
  }

  // We intentionally write the updated routes index; this is an in-place managed update.
  const fs = require('fs');
  fs.writeFileSync(routesIndexPath, content, 'utf8');
  logger.info('update file ' + routesIndexPath);
  return { ok: true };
}

/**
 * Generate MVC files for a resource.
 * @param {{resource:string, dryRun:boolean, force:boolean, cwd?:string}} options
 * @returns {{ok:boolean, message?:string, files?:string[]}}
 */
function generateResource(options) {
  const opts = options || {};
  const cwd = opts.cwd || process.cwd();

  const validation = normalizeResourceName(opts.resource);
  if (!validation.valid) {
    return { ok: false, message: validation.error };
  }

  // Make sure we are inside a scaffolded project.
  const routesIndexPath = path.join(cwd, 'src', 'routes', 'index.js');
  if (!writer.pathExists(routesIndexPath)) {
    return {
      ok: false,
      message: 'Could not find src/routes/index.js. Run "express-mvc-init gen <resource>" inside a scaffolded project.'
    };
  }

  const { names, files } = resourceTemplates.getResourceFiles(validation.normalized);
  const created = [];

  logger.info((opts.dryRun ? '[dry-run] ' : '') + 'Generating resource "' + names.resource + '"');

  // Check for existing files first so we don't partially write on conflict.
  for (let i = 0; i < files.length; i += 1) {
    const relativeParts = files[i].relativePath.split('/').filter(Boolean);
    const filePath = path.join.apply(path, [cwd].concat(relativeParts));
    if (writer.pathExists(filePath) && !opts.force) {
      return {
        ok: false,
        message: 'File already exists: ' + filePath + '. Use --force to overwrite.'
      };
    }
  }

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const relativeParts = file.relativePath.split('/').filter(Boolean);
    const filePath = path.join.apply(path, [cwd].concat(relativeParts));
    const result = writer.writeFile(filePath, file.content, {
      dryRun: opts.dryRun,
      force: opts.force
    });
    if (result.reason === 'exists') {
      return {
        ok: false,
        message: 'File already exists: ' + filePath + '. Use --force to overwrite.'
      };
    }
    created.push(filePath);
  }

  const routeResult = registerRoute(routesIndexPath, names, {
    dryRun: opts.dryRun,
    force: opts.force
  });
  if (!routeResult.ok) {
    return routeResult;
  }

  logger.success((opts.dryRun ? 'Would generate' : 'Generated') + ' resource "' + names.resource + '" (' + created.length + ' files)');
  return { ok: true, files: created, resource: names.resource };
}

module.exports = {
  normalizeResourceName,
  generateResource,
  registerRoute,
  insertAfterAnchor
};
