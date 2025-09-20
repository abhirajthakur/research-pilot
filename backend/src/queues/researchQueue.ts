import Queue from "bull";
import { REDIS_URL } from "./queueConfig";
import { inputParseQueue } from "./steps/inputParseQueue";

export const researchQueue = new Queue("research", REDIS_URL);

researchQueue.process(async (job) => {
  const { requestId, topic, userId } = job.data;
  console.log(
    `[researchQueue] Processing requestId=${requestId}, topic=${topic}`,
  );

  await inputParseQueue.add({ requestId, topic, userId });

  return { status: "started", requestId };
});
