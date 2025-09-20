import Queue from "bull";
import { db } from "../../db";
import { workflowLogs } from "../../db/schema";
import { extractKeywords } from "../../services/keywordExtractor";
import { summarizeText } from "../../services/summarizer";
import { REDIS_URL } from "../queueConfig";
import { persistQueue } from "./persistQueue";

export const processQueue = new Queue("process", REDIS_URL);

processQueue.process(async (job) => {
  const { requestId, articles, userId } = job.data;
  console.log(
    `[processQueue] Processing ${articles.length} articles for requestId=${requestId}`,
  );

  const summaries: string[] = [];
  const articlesWithSummaries: {
    title: string;
    url: string;
    summary: string;
  }[] = [];

  let processedCount = 0;
  let failedCount = 0;

  // Extract all articles in a single batch operation
  console.log(`Extracting content from ${articles.length} articles...`);
  for (const [index, article] of articles.entries()) {
    try {
      console.log(
        `Processing article ${index + 1}/${articles.length}: ${article.title}`,
      );

      if (!article.content || article.content.trim().length === 0) {
        console.warn(
          `No content available in article: ${article.url || "unknown url"}`,
        );
        summaries.push("No content available for summarization.");
        failedCount++;
        continue;
      }

      const generatedSummary = await summarizeText(article.content);
      summaries.push(generatedSummary ?? "Summary generation failed.");
      processedCount++;

      articlesWithSummaries.push({
        title: article.title,
        url: article.url,
        summary: generatedSummary,
      });

      console.log(`Processed article ${index + 1}/${articles.length}`);

      if (index < articles.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(
        `Failed to process article ${index + 1} (${article.url}):`,
        error,
      );
      const failedSummary = `Failed to process article: ${article.title}`;
      summaries.push(failedSummary);
      articlesWithSummaries.push({
        title: articles[index].title,
        url: articles[index].url,
        summary: failedSummary,
      });
      failedCount++;
    }
  }

  // Extract top 5 keywords from all summaries combined
  const allSummariesText = summaries.join(" ");
  const topKeywords = extractKeywords(allSummariesText, 5);

  console.log(
    `Extracted top 5 keywords from all summaries: ${topKeywords.join(", ")}`,
  );

  const message = `Processed ${processedCount}/${articles.length} articles successfully (${failedCount} failed)`;
  console.log(`[processQueue] ${message}`);

  await db.insert(workflowLogs).values({
    requestId,
    step: "Processing",
    message,
  });

  await persistQueue.add({
    requestId,
    articles: articlesWithSummaries,
    summaries,
    keywords: topKeywords,
    userId,
  });
});
