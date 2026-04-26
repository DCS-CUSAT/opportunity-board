# Quick Setup & Run Guide

## 📦 Installation

### Prerequisites
- Node.js 14+ (for validation scripts)
- Any modern web browser
- Git (optional, for version control)

### Step 1: Install Dependencies
```bash
npm install
```

This installs:
- `ajv` — JSON schema validation
- `husky` — Git hooks for quality checks

### Step 2: Setup Git Hooks (Optional but Recommended)
```bash
npx husky install
chmod +x .husky/pre-commit
```

This prevents invalid JSON from being committed.

---

## 🚀 Running the Application

### Local Development
Simply open `index.html` in your browser:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Or use VS Code:
- Right-click `index.html` → "Open with Live Server"

### Using a Local Server (Recommended)
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000
```

Then visit: `http://localhost:8000`

---

## ✅ Validating Data

Validate `jobs.json` before committing:
```bash
npm run validate
```

Output example:
```
✅ jobs.json is valid!

📊 Summary:
  - Total opportunities: 5
  - Last updated: 2026-04-26T10:30:00Z
```

Watch mode (auto-validate on changes):
```bash
npm run validate:watch
```

---

## 📝 Adding New Opportunities

### Recommended: Interactive Prompt

```bash
npm run add:opportunity
```

This asks contributors for each field and writes a valid v2 entry into `jobs.json`.

### Manual: Edit JSON Directly

1. **Open `jobs.json`**
2. **Add entry to `opportunities` array:**
```json
{
  "id": "unique-identifier-here",
  "title": "Job Title",
  "organization": {
    "name": "Company Name",
    "website": "https://company.com"
  },
  "category": "Internship",
  "description": "Brief description...",
  "details": {
    "location": { "city": "City", "country": "IN", "mode": "On-campus" },
    "compensation": { "type": "stipend", "amount": 50000, "currency": "INR", "period": "monthly" },
    "skills": ["Skill1", "Skill2"]
  },
  "requirements": {
    "yearOfStudy": ["3rd", "4th"],
    "preferredDegree": ["B.Tech CS"]
  },
  "deadline": "2026-06-15T23:59:59Z",
  "applicationUrl": "https://careers.company.com",
  "contributors": [],
  "createdAt": "2026-04-26T10:30:00Z",
  "updatedAt": "2026-04-26T10:30:00Z",
  "archived": false
}
```

3. **Validate:**
```bash
npm run validate
```

4. **Commit & push:**
```bash
git add jobs.json
git commit -m "feat: add new opportunity - [Title]"
git push origin main
```

---

## 🔄 GitHub Actions Setup (Optional)

### Enable Workflows
1. Go to your GitHub repo → **Settings** → **Actions** → **General**
2. Set permissions to **"Read and write permissions"**
3. Workflows in `.github/workflows/` will now run on push/PR

### Available Workflows

| Workflow | Trigger | Action |
|----------|---------|--------|
| `cleanup-expired.yml` | Daily 2 AM UTC | Auto-removes expired opportunities |
| `add-contributor.yml` | PR to jobs.json | Tracks contributor metadata |

---

## 🎯 What You Can Do

✅ **View opportunities** — Open `index.html` in browser  
✅ **Filter by type** — Click category pills (Internship, Job, etc.)  
✅ **Search** — Use search box for keywords/skills  
✅ **Sort** — By deadline, title, or stipend  
✅ **View details** — Click card to open modal  
✅ **Apply** — Click "Apply Now" to go to application URL  

---

## 📊 File Structure

```
opportunity-board/
├── index.html                    # Main UI (open in browser)
├── jobs.json                     # Data source (add opportunities here)
├── schema.json                   # JSON validation schema
├── validate.js                   # Validation utility
├── package.json                  # Dependencies
│
├── .github/workflows/
│   ├── cleanup-expired.yml       # Auto-cleanup expired items
│   └── add-contributor.yml       # Track PR contributors
│
├── .husky/
│   └── pre-commit                # Git hook: validates JSON before commit
│
├── README.md                     # Full documentation
├── CONTRIBUTING.md               # Contribution guidelines
└── .gitignore                    # Git ignore rules
```

---

## 🐛 Troubleshooting

### Page shows "Error loading data"
- Check that `jobs.json` exists in the same directory as `index.html`
- Validate JSON: `npm run validate`
- Check browser console (F12) for error messages

### Pre-commit hook not working
```bash
chmod +x .husky/pre-commit
npx husky install
```

### Validation fails
```bash
npm run validate
```
Check the error message and fix the JSON syntax.

### Can't open index.html locally
Use a local server instead:
```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

---

## 📚 Categories Available

- Internship
- Job
- Research
- Project
- Hackathon
- Conference
- Workshop
- Fellowship
- Scholarship
- Freelance
- OpenSource
- Grant
- Competition

---

## 🔐 Before Deploying

- [ ] `npm run validate` passes
- [ ] No expired opportunities in `jobs.json`
- [ ] All application URLs are accessible
- [ ] GitHub Actions enabled (optional)
- [ ] Pre-commit hooks installed (optional)

---

## 📞 Support

- **View full docs:** See [README.md](README.md)
- **Contribution guide:** See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Validate data:** Run `npm run validate`

---

**Last Updated**: April 26, 2026  
**Version**: 1.0.0
