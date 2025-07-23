const { Client } = require('pg');

(async () => {
  const client = new Client();
  await client.connect();

  const postId = '11111111-1111-1111-1111-111111111111';
  console.log('writer()', '----- BEGIN');
  await client.query('BEGIN');

  console.log('writer()', '----- UPDATE title=Temp');
  await client.query(`UPDATE posts SET title='Temp' WHERE id=$1`, [postId]);

  console.log('writer()', '----- SLEEP...');
  await client.query(`SELECT pg_sleep(5)`);

  console.log('writer()', '----- COMMIT');
  await client.query('COMMIT');

  await client.end();
})();
