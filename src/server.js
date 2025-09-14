import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionRoute from "./routes/transactionRoute.js";
("./config/db");
dotenv.config();

const app = express();

app.use(rateLimiter);

app.use(express.json());

const PORT = process.env.PORT || 5001;

app.use("/api/transactions", transactionRoute);

initDB().then(() =>
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  })
);
