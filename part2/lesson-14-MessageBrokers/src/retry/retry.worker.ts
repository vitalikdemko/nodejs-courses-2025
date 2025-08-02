import { createClient } from 'redis';

async function main() {
  const redis = createClient();
  await redis.connect();

  let lastId = '0';

  while (true) {
    const messages = await redis.xRead(
      { key: 'retries.notifications', id: lastId },
      { COUNT: 10, BLOCK: 5000 },
    );

    if (messages) {
      for (const stream of messages) {
        for (const message of stream.messages) {
          const id = message.id;
          lastId = id; 
          const data = JSON.parse(message.message.message);
          console.log('♻️ Retrying:', data);
        }
      }
    }
  }
}

main().catch(console.error);
