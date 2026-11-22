'use strict';

// Simple console logger using plain ANSI escape codes.
// This keeps express-mvc-init dependency-free while still providing readable output.

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function colorize(color, text) {
  return COLORS[color] + text + COLORS.reset;
}

function info(message) {
  console.log(colorize('cyan', '[info]') + ' ' + message);
}

function success(message) {
  console.log(colorize('green', '[ok]') + ' ' + message);
}

function warn(message) {
  console.warn(colorize('yellow', '[warn]') + ' ' + message);
}

function error(message) {
  console.error(colorize('red', '[error]') + ' ' + message);
}

function dim(message) {
  console.log(colorize('gray', message));
}

module.exports = {
  info,
  success,
  warn,
  error,
  dim
};
