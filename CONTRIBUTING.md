# Contributing to Opportunity Board

Thank you for helping grow the opportunity board.

## How to Contribute

### Adding a New Opportunity

1. Fork and clone the repository.
2. Run `npm run add:opportunity` and answer the prompts.
3. Validate your changes with `npm run validate`.
4. Create a pull request with a clear title and description.
5. Wait for review and approval.

### Recommended (Interactive)

```bash
npm run add:opportunity
```

This command asks for each field and appends a valid v2 opportunity entry to `jobs.json`.

Only these are required during prompt flow:

- Title
- Organization name
- Category
- Application URL (or `internal`)

All other fields (description, skills, deadline, location, compensation, duration, CGPA, year, degree, tags) are optional and get safe defaults if skipped.

### Manual (Advanced)

You can also edit `jobs.json` directly and add your item inside `opportunities`.

## jobs.json Schema (Current v2.0)

`jobs.json` is an object with top-level metadata and an `opportunities` array.

### Top-level shape

```json
{
  "version": "2.0",
  "lastUpdated": "2026-04-26T10:30:00Z",
  "metadata": {
    "totalCount": 5,
    "categories": ["Internship", "Research", "Job", "Project"],
    "lastExpiredCheck": "2026-04-26T10:30:00Z"
  },
  "opportunities": []
}
```

### Opportunity item shape

```json
{
  "id": "unique-id-slug",
  "title": "Software Engineering Intern",
  "organization": {
    "name": "Organization Name",
    "website": "https://example.com"
  },
  "category": "Internship",
  "description": "Short role summary.",
  "details": {
    "duration": { "value": 3, "unit": "months" },
    "location": { "city": "Bangalore", "country": "IN", "mode": "On-campus" },
    "compensation": { "type": "stipend", "amount": 80000, "currency": "INR", "period": "monthly" },
    "skills": ["Python", "DSA", "System Design"]
  },
  "requirements": {
    "minCGPA": 7.5,
    "yearOfStudy": ["3rd", "4th"],
    "preferredDegree": ["B.Tech CS", "B.Tech IT"]
  },
  "deadline": "2026-05-15T23:59:59Z",
  "applicationUrl": "https://example.com/apply",
  "metadata": { "tags": ["backend"] },
  "contributors": [],
  "createdAt": "2026-04-20T10:00:00Z",
  "updatedAt": "2026-04-26T10:30:00Z",
  "archived": false
}
```

## Example Contribution

Append a new object inside `opportunities`:

```json
{
  "id": "stripe-backend-intern-2026",
  "title": "Backend Engineer Intern",
  "organization": {
    "name": "Stripe",
    "website": "https://stripe.com"
  },
  "category": "Internship",
  "description": "Work on payment processing infrastructure at scale.",
  "details": {
    "duration": { "value": 3, "unit": "months" },
    "location": { "city": "San Francisco", "country": "US", "mode": "On-campus" },
    "compensation": { "type": "stipend", "amount": 8000, "currency": "USD", "period": "monthly" },
    "skills": ["Go", "PostgreSQL", "Kubernetes"]
  },
  "requirements": {
    "minCGPA": 7.0,
    "yearOfStudy": ["3rd", "4th"],
    "preferredDegree": ["B.Tech CS", "B.Tech IT"]
  },
  "deadline": "2026-06-15T23:59:59Z",
  "applicationUrl": "https://stripe.com/jobs/listing/backend-engineer-intern",
  "metadata": { "tags": ["backend", "infra"] },
  "contributors": [],
  "createdAt": "2026-04-26T10:30:00Z",
  "updatedAt": "2026-04-26T10:30:00Z",
  "archived": false
}
```

## Validation Checklist

Before submitting:

- Deadline is in the future.
- `applicationUrl` is valid or set to `internal`.
- `category` is valid: Internship, Job, Research, Project, Hackathon, Conference, Workshop, Scholarship, Fellowship, Freelance, OpenSource, Grant, Competition.
- `id` is unique in `opportunities`.
- `details.skills` is an array of relevant skills.
- `contributors` can be left as `[]` (workflow will append attribution).
- `archived` is `false` for active entries.
- JSON remains valid and passes `npm run validate`.

## Contributor Attribution (Hidden in UI)

Contributor metadata is tracked in each item and hidden in the UI. The workflow may append entries like:

```json
{
  "contributors": [
    {
      "username": "your-github-username",
      "pullRequest": "https://github.com/org/repo/pull/123",
      "addedAt": "2026-04-26T10:30:00Z"
    }
  ]
}
```

## Questions

- Open a GitHub issue for bugs or data problems.
- Use GitHub discussions for questions and suggestions.
- Contact maintainers for urgent corrections.
