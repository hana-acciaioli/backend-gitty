const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const { agent } = require('supertest');
const UserService = require('../lib/services/UserService');

jest.mock('../lib/services/githubService');

const mockUser = {
  firstName: 'Test',
  lastName: 'Testy',
  email: 'test@example.com',
  password: '12345',
};
const registerAndLogin = async () => {
  const agent = request.agent(app);
  const user = await UserService.create(mockUser);
  await agent
    .post('/api/v1/users/sessions')
    .send({ email: mockUser.email, password: mockUser.password });
  return [agent, user];
};

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
  it('POST /api/v1/posts should create a new post for a signed in regular user', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent
      .post('/api/v1/posts')
      .send({ description: 'Im number 3! But alas, temporary' });
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Object {
        "description": "Im number 3! But alas, temporary",
        "id": "3",
      }
    `);
  });
  //   it('POST /api/v1/posts should create a new post for a signed an oauth user', async () => {
  //     await request
  //       .agent(app)
  //       .get('/api/v1/github/callback?code=42')
  //       .redirects(1);
  //     const postResp = await agent(app)
  //       .post('/api/v1/posts')
  //       .send({ description: 'Im number 3! But alas, temporary' });
  //     expect(postResp.status).toBe(200);
  //     expect(postResp.body).toMatchInlineSnapshot(`
  //       Object {
  //         "description": "Im number 3! But alas, temporary",
  //         "id": "3",
  //       }
  //     `);
  //   });
  it('POST /api/v1/posts should NOT create a new post when NOT authorized ', async () => {
    const agent = await request.agent(app);
    const resp = await agent
      .post('/api/v1/posts')
      .send({ description: 'Im number 3! But alas, temporary' });
    expect(resp.status).toBe(401);
  });

  afterAll(() => {
    pool.end();
  });
});
