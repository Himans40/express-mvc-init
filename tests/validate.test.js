'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validateProjectName } = require('../src/scaffold');
const { normalizeResourceName } = require('../src/generate');

test('validateProjectName accepts valid names', () => {
  assert.equal(validateProjectName('my-app').valid, true);
  assert.equal(validateProjectName('my_app').valid, true);
  assert.equal(validateProjectName('App123').valid, true);
  assert.equal(validateProjectName('.').valid, true);
});

test('validateProjectName rejects invalid names', () => {
  assert.equal(validateProjectName('').valid, false);
  assert.equal(validateProjectName('my app').valid, false);
  assert.equal(validateProjectName('my/app').valid, false);
  assert.equal(validateProjectName('my@app').valid, false);
});

test('normalizeResourceName lowercases and strips invalid chars', () => {
  const result = normalizeResourceName('Product');
  assert.equal(result.valid, true);
  assert.equal(result.normalized, 'product');

  const messy = normalizeResourceName('My-Product!');
  assert.equal(messy.valid, true);
  assert.equal(messy.normalized, 'my-product');
});

test('normalizeResourceName rejects empty/invalid names', () => {
  assert.equal(normalizeResourceName('').valid, false);
  assert.equal(normalizeResourceName('!!!').valid, false);
});
