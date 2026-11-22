'use strict';

// Template generators for the base MVC project scaffold.
// Each function returns the file content as a string.
// The {{projectName}} placeholder is replaced where needed.

function replacePlaceholders(content, values) {
  let result = content;
  const keys = Object.keys(values || {});
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    // Replace all occurrences of {{key}} with the provided value.
    result = result.split('{{' + key + '}}').join(String(values[key]));
  }
  return result;
}

function packageJson(projectName) {
  const content = {
    name: projectName,
    version: '1.0.0',
    description: 'An Express.js MVC project scaffolded by express-mvc-init',
    main: 'server.js',
    scripts: {
      start: 'node server.js',
      dev: 'node --watch server.js'
    },
    keywords: [],
    author: '',
    license: 'ISC',
    dependencies: {
      express: '^4.21.2'
    }
  };
  return JSON.stringify(content, null, 2) + '\n';
}

function gitignore() {
  return [
    'node_modules',
    '.env',
    ''
  ].join('\n');
}

function envExample() {
  return [
    '# Application port',
    'PORT=3000',
    ''
  ].join('\n');
}

function readme(projectName) {
  return replacePlaceholders([
    '# {{projectName}}',
    '',
    'This project was scaffolded with `express-mvc-init`. It uses Express.js and a simple MVC structure.',
    '',
    '## Getting started',
    '',
    '```bash',
    'npm install',
    'npm start',
    '```',
    '',
    'For development with auto-restart (Node 18+):',
    '',
    '```bash',
    'npm run dev',
    '```',
    '',
    'The app starts on `http://localhost:3000` by default.',
    '',
    '## Project structure',
    '',
    '```text',
    '.',
    '├── src/',
    '│   ├── controllers/      # Request handlers / business logic',
    '│   ├── models/           # Simple in-memory data models',
    '│   ├── views/            # HTML view files',
    '│   ├── routes/           # Express route definitions',
    '│   ├── middlewares/      # Express middlewares',
    '│   ├── config/           # App configuration',
    '│   ├── utils/            # Helper utilities',
    '│   └── app.js            # Express app setup',
    '├── server.js             # Server entry point',
    '├── package.json',
    '├── .gitignore',
    '├── .env.example',
    '└── README.md',
    '```',
    '',
    '## Adding a resource',
    '',
    'If you have `express-mvc-init` installed, you can generate a new resource:',
    '',
    '```bash',
    'npx express-mvc-init gen <resource>',
    '```',
    '',
    'This creates model, controller, route, and view files and registers the route automatically.',
    ''
  ].join('\n'), { projectName: projectName });
}

function serverJs() {
  return [
    "'use strict';",
    '',
    "// Server entry point.",
    "// It loads the configured Express app and starts listening for requests.",
    '',
    "const app = require('./src/app');",
    "const config = require('./src/config');",
    '',
    'const PORT = config.port;',
    '',
    'app.listen(PORT, () => {',
    "  console.log('Server is running on http://localhost:' + PORT);",
    '});',
    ''
  ].join('\n');
}

function appJs() {
  return [
    "'use strict';",
    '',
    '// Express app setup.',
    '// This file creates the app, registers middleware/routes, and exports it.',
    '',
    "const express = require('express');",
    "const routes = require('./routes');",
    "const errorMiddleware = require('./middlewares/error.middleware');",
    '',
    'const app = express();',
    '',
    '// Parse JSON and form request bodies.',
    'app.use(express.json());',
    'app.use(express.urlencoded({ extended: true }));',
    '',
    '// Register application routes.',
    "app.use('/', routes);",
    '',
    '// 404 and error handlers should be last.',
    'app.use(errorMiddleware.notFound);',
    'app.use(errorMiddleware.errorHandler);',
    '',
    'module.exports = app;',
    ''
  ].join('\n');
}

function configIndexJs() {
  return [
    "'use strict';",
    '',
    '// Central configuration for the application.',
    '// Reads values from environment variables with sensible defaults.',
    '',
    'const config = {',
    "  port: process.env.PORT || 3000",
    '};',
    '',
    'module.exports = config;',
    ''
  ].join('\n');
}

function renderUtilJs() {
  return [
    "'use strict';",
    '',
    '// Tiny HTML render helper.',
    '// It reads an HTML file from src/views and replaces {{placeholders}} with values.',
    '',
    "const fs = require('fs');",
    "const path = require('path');",
    '',
    "const viewsDir = path.join(__dirname, '..', 'views');",
    '',
    '/**',
    ' * Render a view file with simple {{key}} placeholder replacement.',
    ' * @param {import("express").Response} res - Express response object',
    ' * @param {string} viewName - file name inside src/views, e.g. "index.html"',
    ' * @param {Object} data - key/value pairs for placeholders',
    ' */',
    'function render(res, viewName, data) {',
    '  const filePath = path.join(viewsDir, viewName);',
    "  let html = fs.readFileSync(filePath, 'utf8');",
    '  const values = data || {};',
    '',
    '  Object.keys(values).forEach((key) => {',
    "    const placeholder = '{{' + key + '}}';",
    '    html = html.split(placeholder).join(String(values[key]));',
    '  });',
    '',
    "  res.type('html').send(html);",
    '}',
    '',
    'module.exports = { render };',
    ''
  ].join('\n');
}

function homeControllerJs() {
  return [
    "'use strict';",
    '',
    '// Home controller.',
    '// Controllers handle incoming requests and send responses.',
    '',
    "const { render } = require('../utils/render');",
    '',
    'function index(req, res) {',
    "  return render(res, 'index.html', {",
    "    title: 'MVC App',",
    "    message: 'Your Express MVC project is running.'",
    '  });',
    '}',
    '',
    'module.exports = {',
    '  index',
    '};',
    ''
  ].join('\n');
}

function userModelJs() {
  return [
    "'use strict';",
    '',
    '// Simple in-memory User model.',
    '// This is intentionally basic: data resets when the server restarts.',
    '',
    'const users = [',
    "  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },",
    "  { id: 2, name: 'Grace Hopper', email: 'grace@example.com' }",
    '];',
    '',
    'let nextId = 3;',
    '',
    'function getAll() {',
    '  return users;',
    '}',
    '',
    'function getById(id) {',
    '  return users.find((user) => user.id === Number(id)) || null;',
    '}',
    '',
    'function create(data) {',
    '  const user = {',
    '    id: nextId++,',
    '    name: data.name,',
    '    email: data.email',
    '  };',
    '  users.push(user);',
    '  return user;',
    '}',
    '',
    'function update(id, data) {',
    '  const user = getById(id);',
    '  if (!user) {',
    '    return null;',
    '  }',
    "  if (Object.prototype.hasOwnProperty.call(data, 'name')) {",
    '    user.name = data.name;',
    '  }',
    "  if (Object.prototype.hasOwnProperty.call(data, 'email')) {",
    '    user.email = data.email;',
    '  }',
    '  return user;',
    '}',
    '',
    'function remove(id) {',
    '  const index = users.findIndex((user) => user.id === Number(id));',
    '  if (index === -1) {',
    '    return false;',
    '  }',
    '  users.splice(index, 1);',
    '  return true;',
    '}',
    '',
    'module.exports = {',
    '  getAll,',
    '  getById,',
    '  create,',
    '  update,',
    '  remove',
    '};',
    ''
  ].join('\n');
}

function homeRoutesJs() {
  return [
    "'use strict';",
    '',
    '// Home routes.',
    '',
    "const express = require('express');",
    "const homeController = require('../controllers/home.controller');",
    '',
    'const router = express.Router();',
    '',
    "router.get('/', homeController.index);",
    '',
    'module.exports = router;',
    ''
  ].join('\n');
}

function routesIndexJs() {
  return [
    "'use strict';",
    '',
    '// Route combiner.',
    '// All resource routes are registered here.',
    '',
    "const express = require('express');",
    '',
    '// [express-mvc-init:routes-import]',
    "const homeRoutes = require('./home.routes');",
    '',
    'const router = express.Router();',
    '',
    '// [express-mvc-init:routes-use]',
    "router.use('/', homeRoutes);",
    '',
    'module.exports = router;',
    ''
  ].join('\n');
}

function errorMiddlewareJs() {
  return [
    "'use strict';",
    '',
    '// Error and 404 middleware.',
    '',
    "const path = require('path');",
    "const { render } = require('../utils/render');",
    '',
    'function notFound(req, res, next) {',
    '  res.status(404);',
    '',
    "  // Respond with HTML for browser requests, JSON for API-style requests.",
    "  if (req.accepts('html')) {",
    "    return render(res, '404.html', {",
    "      title: '404 - Not Found',",
    "      message: 'The page you requested could not be found.'",
    '    });',
    '  }',
    '',
    "  return res.json({ error: 'Not Found' });",
    '}',
    '',
    '// Express error handlers have four arguments.',
    'function errorHandler(err, req, res, next) {',
    '  console.error(err);',
    '  const status = err.status || 500;',
    '  res.status(status);',
    '',
    "  if (req.accepts('html')) {",
    "    return res.type('html').send('<h1>' + status + ' Error</h1><p>Something went wrong.</p>');",
    '  }',
    '',
    '  return res.json({',
    '    error: err.message || \'Internal Server Error\'',
    '  });',
    '}',
    '',
    'module.exports = {',
    '  notFound,',
    '  errorHandler',
    '};',
    ''
  ].join('\n');
}

function indexHtml() {
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <title>{{title}}</title>',
    '  <style>',
    '    body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.5; }',
    '    .card { max-width: 700px; padding: 1.5rem; border: 1px solid #ddd; border-radius: 8px; }',
    '    code { background: #f4f4f4; padding: 0.1rem 0.3rem; border-radius: 4px; }',
    '  </style>',
    '</head>',
    '<body>',
    '  <div class="card">',
    '    <h1>{{title}}</h1>',
    '    <p>{{message}}</p>',
    '    <p>Edit <code>src/controllers/home.controller.js</code> and <code>src/views/index.html</code> to get started.</p>',
    '  </div>',
    '</body>',
    '</html>',
    ''
  ].join('\n');
}

function notFoundHtml() {
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <title>{{title}}</title>',
    '  <style>',
    '    body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.5; }',
    '    .card { max-width: 700px; padding: 1.5rem; border: 1px solid #ddd; border-radius: 8px; }',
    '  </style>',
    '</head>',
    '<body>',
    '  <div class="card">',
    '    <h1>{{title}}</h1>',
    '    <p>{{message}}</p>',
    '    <p><a href="/">Go home</a></p>',
    '  </div>',
    '</body>',
    '</html>',
    ''
  ].join('\n');
}

/**
 * Get the list of files to create for a scaffolded project.
 * @param {string} projectName - project name for package.json/README
 * @returns {Array<{relativePath:string, content:string}>}
 */
function getProjectFiles(projectName) {
  return [
    { relativePath: 'package.json', content: packageJson(projectName) },
    { relativePath: '.gitignore', content: gitignore() },
    { relativePath: '.env.example', content: envExample() },
    { relativePath: 'README.md', content: readme(projectName) },
    { relativePath: 'server.js', content: serverJs() },
    { relativePath: pathJoin('src', 'app.js'), content: appJs() },
    { relativePath: pathJoin('src', 'config', 'index.js'), content: configIndexJs() },
    { relativePath: pathJoin('src', 'utils', 'render.js'), content: renderUtilJs() },
    { relativePath: pathJoin('src', 'controllers', 'home.controller.js'), content: homeControllerJs() },
    { relativePath: pathJoin('src', 'models', 'user.model.js'), content: userModelJs() },
    { relativePath: pathJoin('src', 'routes', 'home.routes.js'), content: homeRoutesJs() },
    { relativePath: pathJoin('src', 'routes', 'index.js'), content: routesIndexJs() },
    { relativePath: pathJoin('src', 'middlewares', 'error.middleware.js'), content: errorMiddlewareJs() },
    { relativePath: pathJoin('src', 'views', 'index.html'), content: indexHtml() },
    { relativePath: pathJoin('src', 'views', '404.html'), content: notFoundHtml() }
  ];
}

// Small helper to keep template paths readable; avoids requiring path in many places.
function pathJoin() {
  return Array.prototype.slice.call(arguments).join('/');
}

module.exports = {
  getProjectFiles,
  replacePlaceholders
};
