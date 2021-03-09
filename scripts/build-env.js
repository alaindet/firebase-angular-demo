const fs = require('fs');
const path = require('path');
const { argv } = require('yargs');
const deflatten = require('./utils/deflatten');
const snakeToCamel = require('./utils/snake-to-camel');

const PREFIX = 'ANGULAR_APP_';
const SEPARATOR = '__';
const env = argv['env'];
const envPath = path.resolve(process.cwd(), `.env.${env}`);

if (!fs.existsSync(envPath)) {
  console.log(`No environment file found at\n${envPath}`);
  process.exit(1);
}

require('dotenv').config({ path: envPath });

const data = {};

// Remove ANGULAR_APP_ prefix
for (const key in process.env) {
  if (!key.includes(PREFIX)) {
    continue;
  }
  const newKey = snakeToCamel(key.slice(PREFIX.length), SEPARATOR);
  data[newKey] = process.env[key];
}

// Build the tree
const tree = deflatten(data, SEPARATOR);

// TODO: Make environment file!
// TODO: Parse boolean and numeric values!
console.log(tree);
