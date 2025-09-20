import Queue from "bull";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { researchRequests, users, workflowLogs } from "../../db/schema";
import { REDIS_URL } from "../queueConfig";
import { dataGatherQueue } from "./dataGatherQueue";

export const inputParseQueue = new Queue("input-parse", REDIS_URL);

inputParseQueue.process(async (job) => {
  const { requestId, topic, userId } = job.data;

  try {
    if (!topic || topic.trim().length < 3) {
      throw new Error("Topic must be at least 3 characters long");
    }
    if (topic.length > 200) {
      throw new Error("Topic too long (max 200 chars)");
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) {
      throw new Error(`User with ID ${userId} does not exist`);
    }

    await db.insert(workflowLogs).values({
      requestId,
      step: "Input Parsing",
      message: `Validated topic "${topic}" for user ${user.name}`,
    });

    await db
      .update(researchRequests)
      .set({ status: "processing" })
      .where(eq(researchRequests.id, requestId));

    await dataGatherQueue.add({ requestId, topic, userId });
  } catch (err: any) {
    await db.insert(workflowLogs).values({
      requestId,
      step: "Input Parsing",
      message: `Validation failed: ${err.message}`,
    });

    await db
      .update(researchRequests)
      .set({ status: "failed" })
      .where(eq(researchRequests.id, requestId));

    throw err;
  }
});
