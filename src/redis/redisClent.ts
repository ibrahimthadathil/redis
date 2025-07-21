import {createClient} from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",

})

client.on("error", (err) => console.error("❌ Redis error:", err));

export default client;