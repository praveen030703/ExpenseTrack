import { sql } from "../config/db.js";

export async function getTransactionByUserId(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount == undefined) {
      return res.status(400).json({ message: "All Field are required" });
    }

    const transactions =
      await sql`INSERT INTO transactions(user_id,title,amount,category)
            VALUES(${user_id},${title},${amount},${category})
            RETURNING *`;

    res.status(200).json(transactions[0]);
  } catch (error) {
    console.log("Error creating transactions", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

export async function createTransaction(req, res) {
  try {
    const { userId } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error Getting transactions", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *
            `;

    if (result.length === 0) {
      return res.status(400).json({ message: "transaction not found" });
    }
    res.status(200).json({ message: "transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting transactions", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;
    const balanceResult = await sql`
                SELECT COALESCE(SUM(amount),0) as balance FROM transactions
                 WHERE user_id = ${userId}
            `;

    const incomeResult = await sql`
                SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE 
                user_id = ${userId} AND amount > 0
            `;

    const expenseResult = await sql`
            SELECT COALESCE(SUM(amount),0) as expense FROM transactions WHERE 
            user_id = ${userId} AND amount < 0
        `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expenseResult[0].expense, // ✅ match frontend
    });
  } catch (error) {
    console.log("Error Getting summary", error);
    res.status(500).json({ message: "internal server error" });
  }
}
