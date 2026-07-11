import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = createClient({ url: redisUrl });
client.on('error', err => console.log('Redis Client Error', err));


client.on('error', (err) => {
    console.error('Redis error:', err);
});
client.on('connect', () => {
    console.log('Connected to Redis');
});
client.on('ready', () => {
    console.log('Redis client is ready');
});
client.on('end', () => {
    console.log('Redis client disconnected');
});

await client.connect();


export default client;