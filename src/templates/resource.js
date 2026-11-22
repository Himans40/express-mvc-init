'use strict';

// Template generators for `express-mvc-init gen <resource>`.
// These create basic CRUD files backed by an in-memory model.

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str) {
  // Convert hyphens/underscores to camelCase for variable names.
  return str.replace(/[-_]+(.)?/g, function (_, chr) {
    return chr ? chr.toUpperCase() : '';
  });
}

function getNames(resource) {
  const lower = resource.toLowerCase();
  const camel = toCamelCase(lower);
  const pascal = capitalize(camel);
  return {
    resource: lower,
    camel: camel,
    pascal: pascal,
    modelVar: camel,
    modelFile: lower + '.model.js',
    controllerFile: lower + '.controller.js',
    routeFile: lower + '.routes.js',
    viewFile: lower + '.html'
  };
}

function modelTemplate(names) {
  return [
    "'use strict';",
    '',
    '// In-memory ' + names.pascal + ' model.',
    '// Data resets when the server restarts.',
    '',
    'const ' + names.camel + 's = [];',
    'let nextId = 1;',
    '',
    'function getAll() {',
    '  return ' + names.camel + 's;',
    '}',
    '',
    'function getById(id) {',
    '  return ' + names.camel + 's.find((item) => item.id === Number(id)) || null;',
    '}',
    '',
    'function create(data) {',
    '  const item = {',
    '    id: nextId++,',
    '    ...data',
    '  };',
    '  ' + names.camel + 's.push(item);',
    '  return item;',
    '}',
    '',
    'function update(id, data) {',
    '  const item = getById(id);',
    '  if (!item) {',
    '    return null;',
    '  }',
    '  Object.keys(data || {}).forEach((key) => {',
    "    if (key === 'id') {",
    '      return;',
    '    }',
    '    item[key] = data[key];',
    '  });',
    '  return item;',
    '}',
    '',
    'function remove(id) {',
    '  const index = ' + names.camel + 's.findIndex((item) => item.id === Number(id));',
    '  if (index === -1) {',
    '    return false;',
    '  }',
    '  ' + names.camel + 's.splice(index, 1);',
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

function controllerTemplate(names) {
  return [
    "'use strict';",
    '',
    '// ' + names.pascal + ' controller.',
    '// Handles basic CRUD actions using the in-memory model.',
    '',
    "const " + names.camel + "Model = require('../models/" + names.modelFile + "');",
    '',
    'function list(req, res) {',
    '  const items = ' + names.camel + 'Model.getAll();',
    '  return res.json(items);',
    '}',
    '',
    'function getById(req, res) {',
    '  const item = ' + names.camel + 'Model.getById(req.params.id);',
    '  if (!item) {',
    "    return res.status(404).json({ error: '" + names.pascal + " not found' });",
    '  }',
    '  return res.json(item);',
    '}',
    '',
    'function create(req, res) {',
    '  const created = ' + names.camel + 'Model.create(req.body || {});',
    '  return res.status(201).json(created);',
    '}',
    '',
    'function update(req, res) {',
    '  const updated = ' + names.camel + 'Model.update(req.params.id, req.body || {});',
    '  if (!updated) {',
    "    return res.status(404).json({ error: '" + names.pascal + " not found' });",
    '  }',
    '  return res.json(updated);',
    '}',
    '',
    'function remove(req, res) {',
    '  const deleted = ' + names.camel + 'Model.remove(req.params.id);',
    '  if (!deleted) {',
    "    return res.status(404).json({ error: '" + names.pascal + " not found' });",
    '  }',
    '  return res.status(204).send();',
    '}',
    '',
    'module.exports = {',
    '  list,',
    '  getById,',
    '  create,',
    '  update,',
    '  remove',
    '};',
    ''
  ].join('\n');
}

function routeTemplate(names) {
  return [
    "'use strict';",
    '',
    '// ' + names.pascal + ' routes.',
    '',
    "const express = require('express');",
    "const " + names.camel + "Controller = require('../controllers/" + names.controllerFile + "');",
    '',
    'const router = express.Router();',
    '',
    "router.get('/', " + names.camel + "Controller.list);",
    "router.get('/:id', " + names.camel + "Controller.getById);",
    "router.post('/', " + names.camel + "Controller.create);",
    "router.put('/:id', " + names.camel + "Controller.update);",
    "router.delete('/:id', " + names.camel + "Controller.remove);",
    '',
    'module.exports = router;',
    ''
  ].join('\n');
}

function viewTemplate(names) {
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <title>' + names.pascal + '</title>',
    '  <style>',
    '    body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.5; }',
    '    .card { max-width: 700px; padding: 1.5rem; border: 1px solid #ddd; border-radius: 8px; }',
    '    code { background: #f4f4f4; padding: 0.1rem 0.3rem; border-radius: 4px; }',
    '  </style>',
    '</head>',
    '<body>',
    '  <div class="card">',
    '    <h1>' + names.pascal + '</h1>',
    '    <p>This view was generated for the <code>' + names.resource + '</code> resource.</p>',
    '    <p>API routes are available under <code>/' + names.resource + '</code>.</p>',
    '  </div>',
    '</body>',
    '</html>',
    ''
  ].join('\n');
}

/**
 * Build file definitions for a generated resource.
 * @param {string} resource - normalized resource name
 * @returns {{names:Object, files:Array<{relativePath:string, content:string}>}}
 */
function getResourceFiles(resource) {
  const names = getNames(resource);
  return {
    names,
    files: [
      { relativePath: 'src/models/' + names.modelFile, content: modelTemplate(names) },
      { relativePath: 'src/controllers/' + names.controllerFile, content: controllerTemplate(names) },
      { relativePath: 'src/routes/' + names.routeFile, content: routeTemplate(names) },
      { relativePath: 'src/views/' + names.viewFile, content: viewTemplate(names) }
    ]
  };
}

module.exports = {
  getNames,
  getResourceFiles
};
