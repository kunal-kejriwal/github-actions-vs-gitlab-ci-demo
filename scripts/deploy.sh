#!/usr/bin/env bash
# Deploy script — dry-run by default.
#
# This is intentionally a dry-run. The blog post and repo are about
# comparing CI/CD platforms, not about depending on a specific deploy target
# (which would break six months from now when some free-tier policy changes).
#
# To wire this to a real deploy:
#   1. Replace the echo statements below with the real deploy command.
#   2. Add the required secrets in the platform UI:
#        - GitHub Actions:  repo Settings → Secrets and variables → Actions
#        - GitLab CI/CD:    project Settings → CI/CD → Variables
#   3. For keyless deploys, configure OIDC trust with your cloud provider
#      (recommended over long-lived service account keys).

set -euo pipefail

echo "=== Deploy (dry-run) ==="
echo "Commit:    ${GITHUB_SHA:-${CI_COMMIT_SHA:-local}}"
echo "Branch:    ${GITHUB_REF_NAME:-${CI_COMMIT_BRANCH:-local}}"
echo "Runner:    ${RUNNER_OS:-${CI_RUNNER_DESCRIPTION:-local}}"

if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
  echo "Platform:  GitHub Actions"
elif [[ -n "${GITLAB_CI:-}" ]]; then
  echo "Platform:  GitLab CI/CD"
else
  echo "Platform:  local"
fi

echo ""
echo "Verifying build artifact..."
if [[ ! -f "dist/manifest.json" ]]; then
  echo "ERROR: dist/manifest.json not found. Did the build job run?" >&2
  exit 1
fi

cat dist/manifest.json
echo ""
echo "Deploy would happen here. Replace this script's body with your real"
echo "deploy command (kubectl apply, gcloud run deploy, vercel deploy, etc.)."
echo ""
echo "=== Deploy (dry-run) complete ==="
