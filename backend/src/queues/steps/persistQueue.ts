import Queue from "bull";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import {
  researchRequests,
  researchResults,
  workflowLogs,
} from "../../db/schema";
import { REDIS_URL } from "../queueConfig";

export const persistQueue = new Queue("persist", REDIS_URL);

persistQueue.process(async (job) => {
  const { requestId, articles, summaries, keywords } = job.data;
  console.log(`[persistQueue] Persisting results for requestId=${requestId}`);

  // Create a combined summary from all individual summaries
  const combinedSummary = summaries.join("\n\n");

  await db.insert(researchResults).values({
    requestId,
    summary: combinedSummary,
    keywords,
    articles, // This now contains { title, url, summary } for each article
  });

  await db.insert(workflowLogs).values({
    requestId,
    step: "Persistence",
    message: `Saved results to DB with ${articles.length} articles and ${keywords.length} keywords`,
  });

  await db
    .update(researchRequests)
    .set({ status: "completed" })
    .where(eq(researchRequests.id, requestId));
});
