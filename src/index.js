const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

const landingHtml = fs.readFileSync(path.join(__dirname, 'landing.html'), 'utf8');

app.get('/', (req, res) => {
  if (req.accepts(['json', 'html']) === 'html') {
    res.type('html').send(landingHtml);
    return;
  }
  res.json({
    name: 'github-actions-vs-gitlab-ci-demo',
    message: 'Same pipeline, two platforms.',
    docs: 'See README.md for the GitHub Actions and GitLab CI walkthrough.',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/platforms', (req, res) => {
  res.json({
    platforms: [
      { id: 'github-actions', file: '.github/workflows/ci.yml' },
      { id: 'gitlab-ci', file: '.gitlab-ci.yml' },
    ],
  });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app;
