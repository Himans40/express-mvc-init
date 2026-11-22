'use strict';

const path = require('path');
const logger = require('./logger');
const writer = require('./writer');
const projectTemplates = require('./templates/project');

/**
 * Validate a project name for scaffold creation.
 * Allowed: letters, numbers, hyphens, underscores.
 * "." is allowed as a special target meaning "current directory".
 * @param {string} name
 * @returns {{valid:boolean, error?:string, normalized?:string}}
 */
function validateProjectName(name) {
  if (typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Project name is required.' };
  }

  const trimmed = name.trim();

  // Special case: scaffold into current folder.
  if (trimmed === '.') {
    return { valid: true, normalized: '.' };
  }

  // Only allow letters, numbers, hyphens, underscores.
  const validPattern = /^[A-Za-z0-9_-]+$/;
  if (!validPattern.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid project name "' + trimmed + '". Use only letters, numbers, hyphens, and underscores.'
    };
  }

  return { valid: true, normalized: trimmed };
}

/**
 * Resolve the target directory and package name for scaffolding.
 * @param {string} projectName
 * @param {string} cwd
 * @returns {{targetDir:string, packageName:string, isCurrentDir:boolean}}
 */
function resolveTarget(projectName, cwd) {
  if (projectName === '.') {
    const targetDir = cwd;
    // Use the current folder name as the package name; sanitize to npm-friendly-ish simple form.
    const base = path.basename(targetDir);
    const packageName = base.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '') || 'mvc-app';
    return { targetDir, packageName, isCurrentDir: true };
  }

  return {
    targetDir: path.join(cwd, projectName),
    packageName: projectName,
    isCurrentDir: false
  };
}

/**
 * Scaffold a new Express.js MVC project.
 * @param {{projectName:string, dryRun:boolean, force:boolean, cwd?:string}} options
 * @returns {{ok:boolean, message?:string, targetDir?:string, files?:string[]}}
 */
function scaffoldProject(options) {
  const opts = options || {};
  const cwd = opts.cwd || process.cwd();

  const validation = validateProjectName(opts.projectName);
  if (!validation.valid) {
    return { ok: false, message: validation.error };
  }

  const { targetDir, packageName, isCurrentDir } = resolveTarget(validation.normalized, cwd);

  // If scaffolding into an existing non-empty directory, require --force.
  if (writer.pathExists(targetDir) && !writer.dirIsEmpty(targetDir) && !opts.force) {
    return {
      ok: false,
      message: 'Target directory "' + targetDir + '" is not empty. Use --force to allow writing into it.'
    };
  }

  const files = projectTemplates.getProjectFiles(packageName);
  const created = [];

  logger.info((opts.dryRun ? '[dry-run] ' : '') + 'Scaffolding Express.js MVC project in ' + targetDir);

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    // Normalize relative paths for cross-platform file writing.
    const relativeParts = file.relativePath.split('/').filter(Boolean);
    const filePath = path.join.apply(path, [targetDir].concat(relativeParts));

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

  const verb = opts.dryRun ? 'Would create' : 'Created';
  logger.success(verb + ' ' + created.length + ' files in ' + targetDir);

  if (!opts.dryRun) {
    logger.info('Next steps:');
    if (!isCurrentDir) {
      logger.dim('  cd ' + opts.projectName);
    }
    logger.dim('  npm install');
    logger.dim('  npm start');
  }

  return { ok: true, targetDir: targetDir, files: created };
}

module.exports = {
  validateProjectName,
  scaffoldProject,
  resolveTarget
};
