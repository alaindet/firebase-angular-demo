const isNumericString = require('./is-numeric-string');

// https://gist.github.com/alaindet/a0c79ef833a6d6e231d39fcf024ccf24
const deflatten = (flat, separator = '.') => {

  const tree = {};

  for (const key in flat) {
    const value = flat[key];
    const subKeys = key.split(separator);
    let nested = tree;

    for (let i = 0, len = subKeys.length; i < len; i++) {
      const subKey = subKeys[i];
      const nextSubKey = subKeys[i + 1];
      const existing = nested[subKey];

      // Initialize next nesting level
      if (!existing) {
        nested[subKey] = isNumericString(nextSubKey) ? [] : {};
      }

      // Store value
      if (i === len - 1) {
        nested[subKey] = value;
      }

      // Go deeper
      else {
        nested = nested[subKey];
      }
    }
  }

  return tree;
};

module.exports = deflatten;
