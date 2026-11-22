'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { scaffoldProject } = require('../src/scaffold');

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'express-mvc-init-test-'));
}

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

const EXPECTED_FILES = [
  'package.json',
  '.gitignore',
  '.env.example',
  'README.md',
  'server.js',
  path.join('src', 'app.js'),
  path.join('src', 'config', 'index.js'),
  path.join('src', 'utils', 'render.js'),
  path.join('src', 'controllers', 'home.controller.js'),
  path.join('src', 'models', 'user.model.js'),
  path.join('src', 'routes', 'home.routes.js'),
  path.join('src', 'routes', 'index.js'),
  path.join('src', 'middlewares', 'error.middleware.js'),
  path.join('src', 'views', 'index.html'),
  path.join('src', 'views', '404.html')
];

test('dry-run creates nothing on disk', () => {
  const temp = makeTempDir();
  const cwd = path.join(temp, 'workspace');
  fs.mkdirSync(cwd);

  try {
    const result = scaffoldProject({
      projectName: 'my-app',
      dryRun: true,
      force: false,
      cwd
    });

    assert.equal(result.ok, true);
    const target = path.join(cwd, 'my-app');
    assert.equal(fs.existsSync(target), false);
  } finally {
    cleanup(temp);
  }
});

test('scaffold creates all expected files', () => {
  const temp = makeTempDir();
  const cwd = path.join(temp, 'workspace');
  fs.mkdirSync(cwd);

  try {
    const result = scaffoldProject({
      projectName: 'my-app',
      dryRun: false,
      force: false,
      cwd
    });

    assert.equal(result.ok, true);
    const target = path.join(cwd, 'my-app');

    for (const rel of EXPECTED_FILES) {
      const full = path.join(target, rel);
      assert.equal(fs.existsSync(full), true, 'Expected file to exist: ' + rel);
    }

    // The home route should render index.html through the render helper.
    const homeController = fs.readFileSync(path.join(target, 'src', 'controllers', 'home.controller.js'), 'utf8');
    assert.match(homeController, /render\(res,\s*'index.html'/);

    const routesIndex = fs.readFileSync(path.join(target, 'src', 'routes', 'index.js'), 'utf8');
    assert.match(routesIndex, /\[express-mvc-init:routes-import\]/);
    assert.match(routesIndex, /\[express-mvc-init:routes-use\]/);
  } finally {
    cleanup(temp);
  }
});

test('scaffold refuses non-empty directory without --force', () => {
  const temp = makeTempDir();
  const cwd = path.join(temp, 'workspace');
  const target = path.join(cwd, 'my-app');
  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(path.join(target, 'existing.txt'), 'hello');

  try {
    const result = scaffoldProject({
      projectName: 'my-app',
      dryRun: false,
      force: false,
      cwd
    });

    assert.equal(result.ok, false);
    assert.match(result.message, /not empty/i);
  } finally {
    cleanup(temp);
  }
});
