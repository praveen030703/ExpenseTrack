import express from "express";
import { sql } from "../config/db.js";
import {
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", getTransactionByUserId);

router.get("/:userId", createTransaction);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getSummaryByUserId);

export default router;
