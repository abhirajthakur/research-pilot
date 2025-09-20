import { db } from "../db";
import { researchRequests } from "../db/schema";

export async function createResearchRequest(topic: string, userId: string) {
  try {
    const [request] = await db
      .insert(researchRequests)
      .values({ topic, userId })
      .returning();

    return request;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating research request:", error.message);
    } else {
      console.error(
        "An unknown error occurred while creating research request.",
      );
    }

    throw new Error(
      "Failed to create research request. Please try again later.",
    );
  }
}

export async function getResearchRequestById(id: string) {
  try {
    const request = await db.query.researchRequests.findFirst({
      where: (requests, { eq }) => eq(requests.id, id as string),
      with: {
        logs: true,
        results: true,
      },
    });

    if (!request) {
      throw new Error(`Research request with ID ${id} not found.`);
    }

    return request;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching research request:", error.message);
    } else {
      console.error(
        "An unknown error occurred while fetching research request.",
      );
    }
    throw new Error(
      "Failed to retrieve research request. Please try again later.",
    );
  }
}
