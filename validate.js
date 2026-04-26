#!/usr/bin/env node

/**
 * Opportunity Board JSON Validator
 * 
 * Usage:
 *   node validate.js [file.json]
 *   node validate.js                    (validates jobs.json by default)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const FILE_TO_VALIDATE = process.argv[2] || 'jobs.json';
const SCHEMA_FILE = 'schema.json';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Read schema
  const schemaPath = path.join(__dirname, SCHEMA_FILE);
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

  // Read data to validate
  const dataPath = path.join(__dirname, FILE_TO_VALIDATE);
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // Initialize AJV validator with formats support
  const ajv = new Ajv({ allErrors: true, verbose: true, allowUnionTypes: true });
  addFormats(ajv);

  // Validate
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  if (isValid) {
    console.log(`${FILE_TO_VALIDATE} is valid.\n`);
    console.log(`Summary:`);
    const opportunities = Array.isArray(data.opportunities) ? data.opportunities : [];
    const active = opportunities.filter(item => !item.archived);
    console.log(`  - Total opportunities: ${opportunities.length}`);
    console.log(`  - Active opportunities: ${active.length}`);
    console.log(`  - Last updated in data: ${data.lastUpdated || 'n/a'}`);

    // Additional checks
    const now = new Date();
    const expired = active.filter(item => new Date(item.deadline) <= now);
    const upcoming = active.filter(item => {
      const daysUntilDeadline = (new Date(item.deadline) - now) / (1000 * 60 * 60 * 24);
      return daysUntilDeadline < 7 && daysUntilDeadline > 0;
    });

    if (expired.length > 0) {
      console.log(`\n${expired.length} expired opportunity(ies):`);
      expired.forEach(item => {
        console.log(`  - ${item.title} (deadline: ${item.deadline})`);
      });
    }

    if (upcoming.length > 0) {
      console.log(`\n${upcoming.length} opportunity(ies) with deadlines in next 7 days:`);
      upcoming.forEach(item => {
        const daysLeft = Math.ceil((new Date(item.deadline) - now) / (1000 * 60 * 60 * 24));
        console.log(`  - ${item.title} (${daysLeft} days left)`);
      });
    }

    process.exit(0);
  } else {
    console.error(`Validation failed.\n`);
    console.error(`Errors:`);
    validate.errors.forEach((error, index) => {
      console.error(`\n  ${index + 1}. ${error.message}`);
      if (error.instancePath) {
        console.error(`     Path: ${error.instancePath}`);
      }
      if (error.data) {
        console.error(`     Value: ${JSON.stringify(error.data)}`);
      }
    });

    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  if (error.code === 'ENOENT') {
    console.error(`\n   Make sure ${FILE_TO_VALIDATE} and ${SCHEMA_FILE} exist.`);
  }
  process.exit(1);
}
