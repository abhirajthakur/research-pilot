import "dotenv/config";
import { researchQueue } from "./queues/researchQueue";
import { dataGatherQueue } from "./queues/steps/dataGatherQueue";
import { inputParseQueue } from "./queues/steps/inputParseQueue";
import { persistQueue } from "./queues/steps/persistQueue";
import { processQueue } from "./queues/steps/processQueue";

console.log("Starting Bull.js worker process...");

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, closing queues...");
  await Promise.all([
    researchQueue.close(),
    inputParseQueue.close(),
    dataGatherQueue.close(),
    processQueue.close(),
    persistQueue.close(),
  ]);
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT, closing queues...");
  await Promise.all([
    researchQueue.close(),
    inputParseQueue.close(),
    dataGatherQueue.close(),
    processQueue.close(),
    persistQueue.close(),
  ]);
  process.exit(0);
});

console.log("Worker process started and listening for jobs");
