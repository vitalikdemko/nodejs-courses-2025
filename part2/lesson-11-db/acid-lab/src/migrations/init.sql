DROP TABLE IF EXISTS movements;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS posts;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  balance NUMERIC NOT NULL CHECK (balance >= 0)
);

CREATE TABLE movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "fromId" UUID NOT NULL,
  "toId" UUID NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_from FOREIGN KEY ("fromId") REFERENCES accounts(id),
  CONSTRAINT fk_to FOREIGN KEY ("toId") REFERENCES accounts(id)
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  draft BOOLEAN DEFAULT true
);

INSERT INTO accounts (id, balance)
VALUES 
  ('4f93929c-db17-4a61-8826-f68fdd74c620', 1000),
  ('d20fa3b6-9b0b-4192-9774-06d1a62d4d2a', 2000);

INSERT INTO posts (id, title, draft)
VALUES ('11111111-1111-1111-1111-111111111111', 'Hello world', true);
