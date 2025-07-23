const { Client } = require('pg');

(async () => {
  const client = new Client();
  await client.connect();

  const postId = '11111111-1111-1111-1111-111111111111';

  for (let i = 1; i <= 3; i++) {
    const { rows } = await client.query('SELECT title FROM posts WHERE id = $1', [postId]);
    console.log(`reader() ------ ${i}:`, rows[0]?.title);
    await new Promise((res) => setTimeout(res, 1000));
  }

  await client.end();
})();