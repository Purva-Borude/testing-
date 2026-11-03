"use strict";

function generateUniqueUsername(prefix = "testuser") {
  const suffix = Date.now().toString().slice(-8);
  return `${prefix}${suffix}`;
}

module.exports = { generateUniqueUsername };
