-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS github_users;
DROP TABLE IF EXISTS posts;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL
);

CREATE TABLE github_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  login TEXT NOT NULL,
  email TEXT,
  avatar TEXT
);

CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  description VARCHAR(255) NOT NULL
)

insert into posts (
  description
) VALUES
('Im just a post. Yes Im only a post. And Im sitting here on backend-gitty. Well, its a long, long journety to the heroku deploy...')