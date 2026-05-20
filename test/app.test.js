const request = require('supertest');
const app = require('../src/index');

describe('GET /', () => {
  it('returns the project metadata payload', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('github-actions-vs-gitlab-ci-demo');
    expect(res.body.message).toMatch(/Same pipeline/);
  });
});

describe('GET /health', () => {
  it('returns status ok with an uptime number', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
  });
});

describe('GET /api/platforms', () => {
  it('lists both CI platforms with their config files', async () => {
    const res = await request(app).get('/api/platforms');
    expect(res.statusCode).toBe(200);
    expect(res.body.platforms).toHaveLength(2);

    const ids = res.body.platforms.map((p) => p.id);
    expect(ids).toContain('github-actions');
    expect(ids).toContain('gitlab-ci');
  });

  it('points to the correct pipeline file for each platform', async () => {
    const res = await request(app).get('/api/platforms');
    const byId = Object.fromEntries(res.body.platforms.map((p) => [p.id, p.file]));
    expect(byId['github-actions']).toBe('.github/workflows/ci.yml');
    expect(byId['gitlab-ci']).toBe('.gitlab-ci.yml');
  });
});

describe('Unknown routes', () => {
  it('returns 404 for routes that do not exist', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.statusCode).toBe(404);
  });
});
