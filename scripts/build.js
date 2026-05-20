// Minimal build step: copies source into dist/ and writes a build manifest.
// In a real project this would be webpack, esbuild, tsc, etc. The point is to
// have a deterministic artifact that both pipelines can produce and upload.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy source files
const srcDir = path.join(root, 'src');
for (const file of fs.readdirSync(srcDir)) {
  fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
}

// Write a build manifest with metadata that's useful in deploy logs
const manifest = {
  name: 'github-actions-vs-gitlab-ci-demo',
  builtAt: new Date().toISOString(),
  nodeVersion: process.version,
  ci: {
    githubActions: !!process.env.GITHUB_ACTIONS,
    gitlabCi: !!process.env.GITLAB_CI,
  },
  commit:
    process.env.GITHUB_SHA ||
    process.env.CI_COMMIT_SHA ||
    'local',
};

fs.writeFileSync(
  path.join(distDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('Build complete.');
console.log(JSON.stringify(manifest, null, 2));
