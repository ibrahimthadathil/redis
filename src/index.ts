import express from 'express'
import client from './redis/redisClent'

const app = express()
// this is how the redis works 
// const redisFUnction = async()=>{
//     await client.connect()
//     await client.set("test","passed")
//    const result = await client.get("test")
//     console.log("result :- " , result);
    
// }
// redisFUnction()

app.get('/',(req,res)=>{

     res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redis Test</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          button {
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <h1>Redis result</h1>
        <form action="/compare" method="get">
          <button type="submit">Compare Speeds</button>
        </form>
      </body>
    </html>
  `);

})
// the time diffreance of the normal method and 

app.get("/compare", async (req, res) => {
  const memoryStore: Record<string, string> = {};

  // Measure memory speed
  const memStart = performance.now();
  memoryStore["speed:test"] = "123";
  const memResult = memoryStore["speed:test"];
  const memEnd = performance.now();
  const memTime = memEnd - memStart;

  // Ensure Redis is connected
  if (!client.isOpen) {
    await client.connect();
  }

  // Measure Redis speed
  const redisStart = performance.now();
  await client.set("speed:test", "123");
  const redisResult = await client.get("speed:test");
  const redisEnd = performance.now();
  const redisTime = redisEnd - redisStart;

  res.send(`
    <h2>⏱️ Speed Comparison</h2>
    <p><strong>Memory Result:</strong> ${memResult}</p>
    <p><strong>Memory Time:</strong> ${memTime.toFixed(4)} ms</p>
    <hr>
    <p><strong>Redis Result:</strong> ${redisResult}</p>
    <p><strong>Redis Time:</strong> ${redisTime.toFixed(4)} ms</p>
    <br>
    <a href="/"><button>Back</button></a>
  `);
});


const start = async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log("✅ Redis connected");
  }

  app.listen(3000, () => {
    console.log("🚀 http://localhost:3000");
  });
};

start();
