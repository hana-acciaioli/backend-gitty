const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('posts routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('GET /api/v1/posts should return a list all posts for all users', async () => {
    const resp = await request(app).get('/api/v1/posts');
    expect(resp.status).toBe(200);
  });
  afterAll(() => {
    pool.end();
  });
});
