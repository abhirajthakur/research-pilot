import Queue from "bull";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { researchRequests, workflowLogs } from "../../db/schema";
import { fetchArticles } from "../../services/articleFetcher";
import { REDIS_URL } from "../queueConfig";
import { processQueue } from "./processQueue";

export const dataGatherQueue = new Queue("data-gather", REDIS_URL);

dataGatherQueue.process(async (job) => {
  const { requestId, topic, userId } = job.data;

  console.log(`[gatherQueue] Fetching articles for requestId=${requestId}`);

  const articles = await fetchArticles(topic);
  if (articles.length === 0) {
    await db
      .update(researchRequests)
      .set({ status: "failed" })
      .where(eq(researchRequests.id, requestId));

    throw new Error("No articles found for the topic");
  }

  await db.insert(workflowLogs).values({
    requestId,
    step: "Data Gathering",
    message: `Fetched ${articles.length} articles`,
  });

  await processQueue.add({ requestId, topic, articles, userId });
});
