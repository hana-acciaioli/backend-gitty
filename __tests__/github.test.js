const pool = require('../lib/utils/pool');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app');
const { agent } = require('supertest');

jest.mock('../lib/services/githubService');

describe('github auth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('/api/v1/github/login should redirect to the github oauth page', async () => {
    const res = await request(app).get('/api/v1/github/login');
    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/callback/i
    );
  });
  it('/api/v1/github/callback should login users and redirect to dashboard', async () => {
    const resp = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    expect(resp.body).toEqual({
      id: expect.any(String),
      login: 'fake_github_user',
      email: 'not-real@example.com',
      avatar: 'https://www.placecage.com/gif',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });
  it('DELETE / deletes the user session', async () => {
    await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const deleteResp = await agent(app).delete('/api/v1/github');
    expect(deleteResp.status).toBe(204);
  });
});
