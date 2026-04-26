# Opportunity Board — CS Department

A scalable, collaborative platform for discovering internships, jobs, research opportunities, hackathons, and more in the computer science field.

![Status](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

- **12 Opportunity Categories** — Internships, jobs, research, hackathons, conferences, workshops, scholarships, fellowships, and more
- **Smart Filtering** — Filter by type, location, skills, and deadline urgency
- **Full-Text Search** — Instantly find opportunities by keywords
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Automatic Cleanup** — Expired opportunities are removed daily via GitHub Actions
- **Contributor Tracking** — PR submissions automatically tracked (hidden metadata)
- **JSON Validation** — Ensures data quality with pre-commit hooks and CI/CD checks
- **Browser Caching** — IndexedDB support for offline access and fast loading
- **Scalable Architecture** — Supports 100+ opportunities without performance degradation

---

## 📋 Categories Supported

| Category | Description | Use Case |
|----------|-------------|----------|
| **Internship** | Short-term (2-6 months) | Summer/semester placements |
| **Job** | Full-time/contract roles | Career opportunities |
| **Research** | Academic/industry research | Publications, learning |
| **Project** | Hands-on projects | Portfolio building |
| **Hackathon** | Competitive events | Innovation, prizes |
| **Conference** | Tech conferences | Networking, learning |
| **Workshop** | Training sessions | Skill development |
| **Scholarship** | Financial aid | Tuition support |
| **Fellowship** | Structured programs | Mentorship, growth |
| **Freelance** | Part-time/gig work | Flexible income |
| **OpenSource** | Open-source contributions | Community impact |
| **Grant** | Project funding | Ideas to reality |

---

## 🛠️ Tech Stack

### Frontend
- Vanilla HTML/CSS/JavaScript (zero dependencies for UI)
- IndexedDB for client-side caching
- Responsive grid layout
- Modal for detailed views

### Backend/Data
- `jobs.json` — Single source of truth
- JSON Schema for validation (`schema.json`)
- GitHub Actions for automation

### DevOps
- Pre-commit hooks (Husky)
- Automated workflows:
  - Daily expired item cleanup
  - PR contributor tracking
  - JSON validation on every commit

---

## 📦 Installation

### For Users

Simply visit the static page (no installation required).

### For Contributors

```bash
# Clone the repository
git clone https://github.com/your-org/opportunity-board.git
cd opportunity-board

# Install dependencies
npm install

# Setup git hooks
npx husky install

# Validate JSON before contributing
npm run validate
```

---

## 📝 How to Contribute

### Adding an Opportunity

1. **Edit `jobs.json`** directly or submit a PR
2. **Follow the schema** (see [CONTRIBUTING.md](CONTRIBUTING.md))
3. **Validate your changes**:
   ```bash
   npm run validate
   ```
4. **Submit PR** — Your contribution will be auto-tracked with metadata

### Example Addition

```json
{
  "title": "DevOps Engineer Intern",
  "org": "Vercel",
  "type": "Internship",
  "location": "Remote",
  "skills": "Docker, Kubernetes, CI/CD, Node.js",
  "stipend": "$7,500/mo",
  "deadline": "2026-07-01",
  "desc": "Help us scale our infrastructure and improve deployment systems.",
  "eligibility": "2nd+ year B.Tech students, Docker experience preferred.",
  "apply": "https://vercel.com/careers"
}
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines and schema reference.

---

## 📊 Data Structure

### Current Format (v1.0)

```json
[
  {
    "title": "Job Title",
    "org": "Organization",
    "type": "Internship | Job | Research | Project | ...",
    "location": "City, Country",
    "skills": "Skill1, Skill2, Skill3",
    "stipend": "Amount with currency",
    "deadline": "YYYY-MM-DD",
    "desc": "Brief description",
    "eligibility": "Who can apply",
    "apply": "URL or 'internal'"
  }
]
```

### Future Format (v2.0)

See [ARCHITECTURE.md](ARCHITECTURE.md) for the enhanced schema with:
- Unique IDs
- Structured location and compensation data
- Multi-faceted filtering
- Full contributor tracking

---

## ⚙️ GitHub Actions Workflows

### 1. Automatic Cleanup

**File**: `.github/workflows/cleanup-expired.yml`

Runs daily at **2:00 AM UTC**:
- Removes opportunities past their deadline
- Creates automated PR for review
- Maintains data freshness

**Customization**: Edit the cron schedule in `cleanup-expired.yml`

```yaml
schedule:
  - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

### 2. Contributor Tracking

**File**: `.github/workflows/add-contributor.yml`

Automatically triggered on PRs to `jobs.json`:
- Detects newly added opportunities
- Adds contributor metadata (hidden from UI)
- Comments on PR confirming attribution

Example metadata (stored but not shown):

```json
{
  "contributors": [
    {
      "username": "github-username",
      "pullRequest": "https://github.com/org/repo/pull/123",
      "addedAt": "2026-04-26T10:30:00Z"
    }
  ]
}
```

### 3. JSON Validation

**File**: `.github/workflows/validate.yml`

Runs on every push/PR:
- Validates JSON syntax
- Checks schema compliance
- Prevents invalid data merges

---

## 🚀 Performance Optimizations

### Current (v1.0)
- Direct DOM rendering
- In-memory filtering
- Modal details view

### Planned (v2.0)
- **IndexedDB Caching** — Cache data locally for offline access
- **Virtual Scrolling** — Render only visible items (supports 1000+ entries)
- **Service Worker** — Background updates and offline mode
- **Full-text Search** — Sub-100ms search latency (FlexSearch.js)

See [ARCHITECTURE.md](ARCHITECTURE.md) for implementation details.

---

## 📖 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — System design, scalability strategy, schema v2.0
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — Contribution guidelines and validation rules
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** — Step-by-step implementation guide for features
- **[schema.json](schema.json)** — JSON Schema for data validation

---

## 🔍 Validation & Quality

### Pre-commit Validation

Ensure JSON is valid before committing:

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

### Watch Mode

Auto-validate on file changes:

```bash
npm run validate:watch
```

---

## 📱 Browser Support

- **Chrome/Edge** — Latest 2 versions
- **Firefox** — Latest 2 versions
- **Safari** — Latest 2 versions
- **Mobile** — iOS 12+, Android 6+

---

## 🎯 Roadmap

### Phase 1 ✅ (Completed)
- Basic UI and filtering
- JSON data structure
- Contribution guidelines
- GitHub Actions for cleanup

### Phase 2 (In Progress)
- Data validation with pre-commit hooks
- Contributor tracking automation

### Phase 3 (Planned)
- IndexedDB caching
- Virtual scrolling for large datasets
- Service Worker support

### Phase 4 (Planned)
- Migration to schema v2.0
- Enhanced filtering and metadata
- Analytics dashboard

### Phase 5 (Planned)
- Notification system (email/Slack)
- User watchlists
- AI-powered recommendations

---

## 📊 Analytics

Track opportunities by:
- **Category** — Which types are most popular
- **Location** — Remote vs. on-campus distribution
- **Timeline** — Deadline clustering
- **Engagement** — Most viewed opportunities

*Coming in v2.0*

---

## 🤝 Contributing

We welcome contributions! Please:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Validate your JSON: `npm run validate`
3. Create a PR with a descriptive title
4. Your contributor name will be automatically tracked

---

## 📝 License

MIT © 2026 Department of Computer Science

---

## 📞 Support

- **Issues** — Report bugs or suggest features on GitHub
- **Discussions** — Ask questions or share ideas
- **Email** — Contact the maintainers

---

## ✨ Acknowledgments

- Built with ❤️ by the CS Department
- Contributors tracked automatically via GitHub Actions
- Inspired by job board and opportunity aggregator platforms

---

**Last Updated**: April 26, 2026  
**Version**: 1.0.0  
**Opportunities**: 5+ and growing!
