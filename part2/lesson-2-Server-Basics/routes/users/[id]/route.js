import { getUserById, updateUser, deleteUser } from '../../../services/users.service.js';

export const GET = async(req, res) => {
  const userId = req.params.id;
  const user = await getUserById(userId);
  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'User not found' }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
};

export const PUT = async(req, res) => {
  const userId = req.params.id;
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  let updates;
  try {
    updates = JSON.parse(body);
  } catch (err) {
    console.error(err);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }
  if ('id' in updates) {
    delete updates.id;
  }
  if ('createdAt' in updates) {
    delete updates.createdAt;
  }
  if (!updates.name || typeof updates.name !== 'string') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Name is required to update' }));
    return;
  }

  const updatedUser = await updateUser(userId, updates);
  if (!updatedUser) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'User not found' }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(updatedUser));
};

export async function DELETE(req, res) {
  const userId = req.params.id;
  const deleted = await deleteUser(userId);
  if (!deleted) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'User not found' }));
    return;
  }
  res.writeHead(204);
  res.end();
}
