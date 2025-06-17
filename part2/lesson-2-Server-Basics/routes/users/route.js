import { listUsers, createUser } from '../../services/users.service.js';

export const GET = async(req, res) => {
  const users = await listUsers();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const  POST = async(req, res) => {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  let userData;
  try {
    userData = JSON.parse(body);
  } catch (error) {
    console.lerror(error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  if (!userData.name || typeof userData.name !== 'string') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Name is required' }));
    return;
  }

  const newUser = await createUser(userData);
  res.writeHead(201, {
    'Content-Type': 'application/json',
    'Location': `/users/${newUser.id}`
  });
  res.end(JSON.stringify(newUser));
};
