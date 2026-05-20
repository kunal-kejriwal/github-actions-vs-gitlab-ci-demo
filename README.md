# github-actions-vs-gitlab-ci-demo

Same Node.js pipeline implemented in both **GitHub Actions** and **GitLab CI/CD**, side by side. Companion repo for the blog post [*GitLab CI/CD vs. GitHub Actions: A Production-Grade Comparison for Teams Working Across Both Platforms*](https://getint.io/blog/).

The point of this repo isn't the app — the app is a deliberately small Express service with three routes. The point is to show the **same build → test → deploy pipeline** expressed in both platforms, so you can compare the YAML, the runtime behaviour, and the pipeline UI side by side.

## What's in here

```
├── .github/workflows/ci.yml   ← GitHub Actions pipeline
├── .gitlab-ci.yml             ← GitLab CI/CD pipeline
├── src/index.js               ← Express app (3 routes)
├── test/app.test.js           ← Jest + Supertest test suite
├── scripts/
│   ├── build.js               ← Produces dist/ + manifest.json
│   └── deploy.sh              ← Dry-run deploy with annotations
└── package.json
```

Both pipelines run the same three stages:

1. **test** — `npm install` then `npm test` (Jest with coverage)
2. **build** — `npm run build` produces a `dist/` artifact
3. **deploy** — runs `scripts/deploy.sh` (dry-run) on `main` only

## Run it locally

Requires Node.js 20 or newer.

```bash
git clone https://github.com/kunal-kejriwal/github-actions-vs-gitlab-ci-demo.git
cd github-actions-vs-gitlab-ci-demo
npm install
npm test          # runs the test suite
npm run build     # produces dist/ with a manifest
npm start         # starts the server on http://localhost:3000
```

Then hit the routes:

```bash
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/api/platforms
```

## See it run on GitHub Actions

Fork this repo. On your first push to `main` (or your first pull request), the workflow in `.github/workflows/ci.yml` runs automatically. Open the **Actions** tab on your fork to watch the pipeline.

## See it run on GitLab CI/CD

GitLab's pull mirroring makes this easy — you don't need to maintain two copies of the code.

1. Sign in to [gitlab.com](https://gitlab.com) (the free tier is enough).
2. Click **New project → Import project → Repository by URL**.
3. Paste the HTTPS URL of your GitHub fork, leave credentials blank for a public repo, and create the project.
4. After import, go to **Settings → Repository → Mirroring repositories** and enable **Pull mirror** so changes on GitHub flow to GitLab automatically.
5. Push something to `main` on GitHub. Within a minute or two, the mirror picks it up and `.gitlab-ci.yml` runs.

Open the **Build → Pipelines** view on GitLab to watch it execute. You'll see the same three stages, expressed differently.

## What to compare

When both pipelines are running, look at:

- **The YAML shapes** — `.github/workflows/ci.yml` (composes pre-built actions) vs. `.gitlab-ci.yml` (script-driven, with `stages` and `image` as first-class concepts).
- **The pipeline UI** — GitHub Actions renders a job summary with collapsible step logs; GitLab renders a directed graph of stages and jobs.
- **Artifact passing** — explicit (`actions/upload-artifact` / `actions/download-artifact`) on GitHub; implicit (declared on the job, picked up by later stages) on GitLab.
- **Conditional deploys** — `if: github.ref == 'refs/heads/main'` vs. `rules: - if: $CI_COMMIT_BRANCH == "main"`.

## Wiring this to a real deploy

`scripts/deploy.sh` is a dry-run on purpose. To make it real:

1. Replace the body of `scripts/deploy.sh` with your actual deploy command (`kubectl apply`, `gcloud run deploy`, `vercel deploy`, etc.).
2. Add the secrets the deploy needs:
   - **GitHub Actions:** repo Settings → Secrets and variables → Actions
   - **GitLab CI/CD:** project Settings → CI/CD → Variables (mark protected + masked where appropriate)
3. For cloud deploys, prefer OIDC over long-lived service account keys. Both platforms support it.

## License

MIT — see [LICENSE](LICENSE).

## About

Built by [Kunal Kejriwal](https://kunalkejriwal.com) for the Getint blog. Issues and pull requests welcome.
# github-actions-vs-gitlab-ci-demo
