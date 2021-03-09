/**
 * This script builds the environment.*.ts files used by Angular starting from
 * .env files in the project root. This allows you to keep secret values in .env
 * files and avoid committing them to the repository by adding them to .gitignore
 *
 * Options
 *
 * --env
 *   The environment name (and file suffix), ex.: 'prod', 'dev' or even ''
 *   Default: ''
 *
 * --transform
 *   Converts the flat snake_case env variables in a tree with camelCase keys
 *   Default: true
 *
 * --inputDir
 *   The input folder where to search for the .env.* file
 *   Default: process.cwd()
 *
 * --outputDir
 *   The output folder where to save the environment.*.ts files
 *   Default: path.join(process.cwd(), 'src', 'environments')
 */

// TODO: Convert strings to booleans
const fs = require('fs');
const path = require('path');
const { argv } = require('yargs');
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
const deflatten = require('./utils/deflatten');
const snakeToCamel = require('./utils/snake-to-camel');
const asBoolean = require('./utils/as-boolean');

const SEPARATOR = '__';

const defaultOptions = {
  env: '',
  transform: true,
  inputDir: process.cwd(),
  outputDir: path.join(process.cwd(), 'src', 'environments'),
};

const options = {
  env: argv['env'] ?? defaultOptions.env,
  transform: asBoolean(argv['transform']) ?? defaultOptions.transform,
  inputDir: argv['inputDir'] ?? defaultOptions.inputDir,
  outputDir: argv['outputDir'] ?? defaultOptions.outputDir,
};

const suffix = options.env ? `.${options.env}` : '';
const inputPath = path.resolve(options.inputDir, `.env${suffix}`);
const outputPath = path.resolve(options.outputDir, `environment${suffix}.ts`);

if (!fs.existsSync(inputPath)) {
  console.log(`No environment file found at\n${inputPath}`);
  process.exit(1);
}

const rawEnv = dotenv.config({ path: inputPath });

if (rawEnv.error) {
  throw env.error;
}

let data = dotenvParseVariables(rawEnv.parsed);

if (options.transform) {
  const transformed = {};
  for (const key in data) {
    const newKey = snakeToCamel(key, SEPARATOR);
    transformed[newKey] = data[key];
  }
  data = deflatten(transformed, SEPARATOR);
}

let output = JSON.stringify(data, null, 2);
output = output.replace(/"(.+?)":/g, '$1:');
output = `export const environment = ${output};`;

fs.writeFileSync(outputPath, output);

console.log(`Done! Output file built at\n${outputPath}`);
