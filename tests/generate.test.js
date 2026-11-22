'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { scaffoldProject } = require('../src/scaffold');
const { generateResource } = require('../src/generate');

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'express-mvc-init-test-'));
}

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

test('gen creates resource files and registers route', () => {
  const temp = makeTempDir();
  const cwd = path.join(temp, 'workspace');
  fs.mkdirSync(cwd);

  try {
    const scaffold = scaffoldProject({
      projectName: 'my-app',
      dryRun: false,
      force: false,
      cwd
    });
    assert.equal(scaffold.ok, true);

    const projectDir = path.join(cwd, 'my-app');
    const result = generateResource({
      resource: 'product',
      dryRun: false,
      force: false,
      cwd: projectDir
    });

    assert.equal(result.ok, true);

    const expected = [
      path.join('src', 'models', 'product.model.js'),
      path.join('src', 'controllers', 'product.controller.js'),
      path.join('src', 'routes', 'product.routes.js'),
      path.join('src', 'views', 'product.html')
    ];

    for (const rel of expected) {
      assert.equal(fs.existsSync(path.join(projectDir, rel)), true, 'Expected file: ' + rel);
    }

    const controller = fs.readFileSync(path.join(projectDir, 'src', 'controllers', 'product.controller.js'), 'utf8');
    assert.match(controller, /function list/);
    assert.match(controller, /function getById/);
    assert.match(controller, /function create/);
    assert.match(controller, /function update/);
    assert.match(controller, /function remove/);

    const routesIndex = fs.readFileSync(path.join(projectDir, 'src', 'routes', 'index.js'), 'utf8');
    assert.match(routesIndex, /require\('\.\/product\.routes\.js'\)/);
    assert.match(routesIndex, /router\.use\('\/product',\s*productRoutes\)/);
  } finally {
    cleanup(temp);
  }
});

test('gen refuses to overwrite existing files without --force', () => {
  const temp = makeTempDir();
  const cwd = path.join(temp, 'workspace');
  fs.mkdirSync(cwd);

  try {
    const scaffold = scaffoldProject({ projectName: 'my-app', dryRun: false, force: false, cwd });
    assert.equal(scaffold.ok, true);
    const projectDir = path.join(cwd, 'my-app');

    const first = generateResource({ resource: 'product', dryRun: false, force: false, cwd: projectDir });
    assert.equal(first.ok, true);

    const second = generateResource({ resource: 'product', dryRun: false, force: false, cwd: projectDir });
    assert.equal(second.ok, false);
    assert.match(second.message, /already exists/i);
  } finally {
    cleanup(temp);
  }
});
