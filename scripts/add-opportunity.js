#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { spawnSync } from 'node:child_process';

const CATEGORIES = [
  'Internship',
  'Job',
  'Research',
  'Project',
  'Hackathon',
  'Conference',
  'Workshop',
  'Scholarship',
  'Fellowship',
  'Freelance',
  'OpenSource',
  'Grant',
  'Competition'
];

const LOCATION_MODES = ['On-campus', 'Remote', 'Hybrid'];
const COMP_TYPES = ['stipend', 'salary', 'certificate'];
const COMP_PERIODS = ['monthly', 'yearly', 'one-time'];
const DURATION_UNITS = ['weeks', 'months', 'years', 'permanent'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const jobsPath = path.join(repoRoot, 'jobs.json');

function toSlug(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function parseList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function pickWithIndex(rawValue, options) {
  const idx = Number.parseInt(rawValue, 10);
  if (!Number.isNaN(idx) && idx >= 1 && idx <= options.length) {
    return options[idx - 1];
  }
  return rawValue;
}

async function askRequired(rl, promptText, validate) {
  while (true) {
    const value = (await rl.question(promptText)).trim();
    if (!value) {
      console.log('This field is required.');
      continue;
    }
    if (validate && !validate(value)) {
      continue;
    }
    return value;
  }
}

async function main() {
  if (!fs.existsSync(jobsPath)) {
    console.error('jobs.json not found in repository root.');
    process.exit(1);
  }

  const fileData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));
  if (!Array.isArray(fileData.opportunities)) {
    console.error('jobs.json format is invalid: opportunities must be an array.');
    process.exit(1);
  }

  const rl = readline.createInterface({ input, output });

  try {
    console.log('Add a new opportunity (v2 schema).');
    console.log('Press Ctrl+C to cancel.\n');

    const title = await askRequired(rl, 'Title: ');
    const organizationName = await askRequired(rl, 'Organization name: ');
    console.log(`\nCategories: ${CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join(' | ')}`);
    const categoryRaw = await askRequired(rl, 'Category (name or number): ', (value) => {
      const picked = pickWithIndex(value, CATEGORIES);
      if (!CATEGORIES.includes(picked)) {
        console.log('Invalid category. Pick a listed category.');
        return false;
      }
      return true;
    });
    const category = pickWithIndex(categoryRaw, CATEGORIES);

    const applicationUrl = await askRequired(rl, 'Application URL (or internal): ');

    console.log('\nOptional details (press Enter to keep defaults).');
    const descriptionRaw = (await rl.question('Description [default: Not provided yet]: ')).trim();
    const description = descriptionRaw || 'Not provided yet';

    const skillsRaw = (await rl.question('Skills (comma-separated) [default: none]: ')).trim();
    const skills = skillsRaw ? parseList(skillsRaw) : [];

    const defaultDeadlineDate = new Date();
    defaultDeadlineDate.setDate(defaultDeadlineDate.getDate() + 30);
    const defaultDeadlineDateStr = defaultDeadlineDate.toISOString().split('T')[0];
    const deadlineDate = (await rl.question(`Deadline date (YYYY-MM-DD) [default: ${defaultDeadlineDateStr}]: `)).trim() || defaultDeadlineDateStr;

    const websiteInput = (await rl.question(`Organization website [default: ${applicationUrl}]: `)).trim();
    const city = (await rl.question('Location city [default: Unknown]: ')).trim() || 'Unknown';
    const country = (await rl.question('Location country code [default: IN]: ')).trim() || 'IN';
    const modeRaw = (await rl.question('Location mode (On-campus/Remote/Hybrid) [default: On-campus]: ')).trim() || 'On-campus';
    const modeCandidate = pickWithIndex(modeRaw, LOCATION_MODES);
    const mode = LOCATION_MODES.includes(modeCandidate) ? modeCandidate : 'On-campus';

    const compTypeRaw = (await rl.question('Compensation type (stipend/salary/certificate) [default: stipend]: ')).trim() || 'stipend';
    const compTypeCandidate = pickWithIndex(compTypeRaw, COMP_TYPES);
    const compType = COMP_TYPES.includes(compTypeCandidate) ? compTypeCandidate : 'stipend';
    const amountRaw = (await rl.question('Compensation amount [default: unknown]: ')).trim();
    const amount = amountRaw && !Number.isNaN(Number(amountRaw)) ? Number(amountRaw) : 'unknown';
    const currency = (await rl.question('Currency [default: INR]: ')).trim() || 'INR';
    const periodRaw = (await rl.question('Compensation period (monthly/yearly/one-time) [default: monthly]: ')).trim() || 'monthly';
    const periodCandidate = pickWithIndex(periodRaw, COMP_PERIODS);
    const period = COMP_PERIODS.includes(periodCandidate) ? periodCandidate : 'monthly';

    const durationValueRaw = (await rl.question('Duration value [default: null]: ')).trim();
    const durationUnitRaw = (await rl.question('Duration unit (weeks/months/years/permanent) [default: months]: ')).trim() || 'months';
    const durationUnitCandidate = pickWithIndex(durationUnitRaw, DURATION_UNITS);
    const durationUnit = DURATION_UNITS.includes(durationUnitCandidate) ? durationUnitCandidate : 'months';
    const durationValue = durationValueRaw && !Number.isNaN(Number(durationValueRaw)) ? Number(durationValueRaw) : null;

    const minCGPARaw = (await rl.question('Minimum CGPA (optional): ')).trim();
    const minCGPA = minCGPARaw && !Number.isNaN(Number(minCGPARaw)) ? Number(minCGPARaw) : undefined;
    const yearOfStudyRaw = (await rl.question('Year of study (comma-separated, optional): ')).trim();
    const yearOfStudy = yearOfStudyRaw ? parseList(yearOfStudyRaw) : undefined;
    const degreeRaw = (await rl.question('Preferred degree (comma-separated, optional): ')).trim();
    const preferredDegree = degreeRaw ? parseList(degreeRaw) : undefined;
    const tagsRaw = (await rl.question('Tags (comma-separated, optional): ')).trim();
    const tags = tagsRaw ? parseList(tagsRaw) : [];

    const idBase = `${toSlug(organizationName)}-${toSlug(title)}`;
    let id = idBase;
    let suffix = 2;
    const existingIds = new Set(fileData.opportunities.map((o) => o.id));
    while (existingIds.has(id)) {
      id = `${idBase}-${suffix}`;
      suffix += 1;
    }

    const nowIso = new Date().toISOString();
    const deadlineIso = `${deadlineDate}T23:59:59Z`;

    const requirements = {};
    if (!Number.isNaN(minCGPA) && minCGPA !== undefined) requirements.minCGPA = minCGPA;
    if (yearOfStudy && yearOfStudy.length) requirements.yearOfStudy = yearOfStudy;
    if (preferredDegree && preferredDegree.length) requirements.preferredDegree = preferredDegree;

    const newOpportunity = {
      id,
      title,
      organization: {
        name: organizationName,
        website: websiteInput || applicationUrl
      },
      category,
      description,
      details: {
        duration: {
          value: Number.isNaN(durationValue) ? null : durationValue,
          unit: durationUnit
        },
        location: {
          city,
          country,
          mode
        },
        compensation: {
          type: compType,
          amount,
          currency,
          period
        },
        skills
      },
      requirements,
      deadline: deadlineIso,
      applicationUrl,
      metadata: {
        tags
      },
      contributors: [],
      createdAt: nowIso,
      updatedAt: nowIso,
      archived: false
    };

    fileData.opportunities.push(newOpportunity);
    fileData.lastUpdated = nowIso;

    const categoriesSet = new Set(fileData.opportunities.map((item) => item.category));
    fileData.metadata = fileData.metadata || {};
    fileData.metadata.totalCount = fileData.opportunities.length;
    fileData.metadata.categories = Array.from(categoriesSet).sort();
    if (!fileData.metadata.lastExpiredCheck) {
      fileData.metadata.lastExpiredCheck = nowIso;
    }

    fs.writeFileSync(jobsPath, `${JSON.stringify(fileData, null, 2)}\n`, 'utf8');

    const validateResult = spawnSync('node', ['validate.js'], {
      cwd: repoRoot,
      stdio: 'inherit'
    });

    if (validateResult.status !== 0) {
      console.error('\nValidation failed after write. Please review jobs.json changes.');
      process.exit(validateResult.status || 1);
    }

    console.log(`\nAdded opportunity successfully with id: ${id}`);
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
