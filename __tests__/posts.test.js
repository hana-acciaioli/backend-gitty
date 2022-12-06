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
    expect(resp.body).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "Im just a post. Yes Im only a post. And Im sitting here on backend-gitty. Well, its a long, long journety to the heroku deploy...",
          "id": "1",
        },
        Object {
          "description": "second post!",
          "id": "2",
        },
      ]
    `);
  });
  afterAll(() => {
    pool.end();
  });
});
