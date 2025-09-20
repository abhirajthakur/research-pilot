import { Router } from "express";
import { db } from "../db";
import { authMiddleware, type AuthRequest } from "../middleware/auth";
import { researchQueue } from "../queues/researchQueue";
import {
  createResearchRequest,
  getResearchRequestById,
} from "../services/research";

const router = Router();

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    const request = await createResearchRequest(topic, req.user?.id!);

    await researchQueue.add({
      requestId: request?.id,
      topic,
      userId: req.user!.id,
    });

    res.status(201).json({
      id: request?.id,
      topic: request?.topic,
      status: request?.status,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userRequests = await db.query.researchRequests.findMany({
      where: (requests, { eq }) => eq(requests.userId, req.user!.id),
    });
    res.json(userRequests);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const request = await getResearchRequestById(id as string);

    if (!request) {
      return res.status(404).json({ error: "Not found" });
    }

    if (request.userId !== req.user!.id) {
      return res.status(403).json({ error: "Not your request" });
    }

    res.json(request);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
