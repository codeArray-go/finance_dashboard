import { pool } from "../lib/pool.js";

export const dashboardData = async ({ id, orgId, orgName }) => {
  const response = await pool.query(
    `SELECT 
        u."fullName", 
        u.email, 
        u."profilePic", 
        u."orgId", 
        o."orgName", 
        r.id AS "recordId",
        r.amount, 
        r.type, 
        r.category, 
        r.description, 
        r.date, 
        r."createdAt" AS "recordCreatedAt"
    FROM users u
    JOIN organization o ON u."orgId" = o."orgId" 
    LEFT JOIN records r ON u."orgId" = r."orgId" 
    WHERE u.id = $1 AND u."orgId" = $2 AND o."orgName"=$3;
    `,
    [id, orgId, orgName],
  );

  return response.rows;
};

export const summeryData = async (user) => {
  const response = await pool.query(
    `SELECT 
      COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) AS "totalIncome",
      COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS "totalExpense",
      
      (COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) - COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0)) AS "netBalance",
    
      COALESCE(SUM(amount) FILTER (WHERE type = 'expense' AND category = 'food'), 0) AS "totalFoodExpense",

      COALESCE(SUM(amount) FILTER (WHERE type = 'expense' AND category = 'tour'), 0) AS "totalTourExpense",
      
      COALESCE(SUM(amount) FILTER (WHERE type = 'expense' AND category = 'others'), 0) AS "totalOtherExpense"

    FROM records 
    WHERE "orgId" = $1;`,
    [user.orgId],
  );

  return response.rows;
};

export const recentActivity = async (user) => {
  const response = await pool.query(
    `
    SELECT 
      id AS "recordId", 
      amount, 
      type, 
      category, 
      description, 
      date 
    FROM records 
    WHERE "orgId" = $1
    ORDER BY "createdAt" DESC
    LIMIT 5;
  `,
    [user.orgId],
  );

  return response.rows;
};

export const updateFinances = async ({
  id,
  amount,
  type,
  category,
  date,
  description,
  orgId,
}) => {
  const data = await pool.query(
    `
  UPDATE records 
    SET amount=$1, type=$2, category=$3, date=$4, description=$5 
    WHERE "orgId"=$6 AND id=$7 
  RETURNING id, amount, type, category, date, description
  `,
    [amount, type, category, date, description, orgId, id],
  );

  return data.rows;
};

export const financeCreateRepo = async ({
  amount,
  type,
  category,
  desc,
  date,
  orgId,
  userId,
}) => {
  const response = await pool.query(
    `
    INSERT INTO 
      records("userId", "orgId", amount, type, category, description, date) 
      VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, amount, type, category, description, date
  `,
    [userId, orgId, amount, type, category, desc, date],
  );

  return response.rows;
};

export const financeDeleteRepo = async ({ userId, orgId, id }) => {
  await pool.query(
    `
    DELETE FROM records WHERE id=$1 AND "userId"=$2 AND "orgId"=$3;
  `,
    [id, userId, orgId],
  );

  return "record deleted successfully";
};

export const fetchFilteredRecords = async (user, filters) => {
  const { type, category, startDate, endDate } = filters;

  let query = `
    SELECT 
      id AS "recordId", 
      amount, 
      type, 
      category, 
      description, 
      date 
    FROM records 
    WHERE "orgId" = $1
  `;

  const values = [user.orgId];
  let paramIndex = 2;

  if (type) {
    query += ` AND type = $${paramIndex}`;
    values.push(type);
    paramIndex++;
  }

  if (category) {
    query += ` AND category = $${paramIndex}`;
    values.push(category);
    paramIndex++;
  }

  if (startDate) {
    query += ` AND date >= $${paramIndex}`;
    values.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    query += ` AND date <= $${paramIndex}`;
    values.push(endDate);
    paramIndex++;
  }

  query += ` ORDER BY date DESC;`;

  const response = await pool.query(query, values);
  return response.rows;
};

export const getMonthlyTrendsRepo = async (orgId) => {
  const response = await pool.query(
    `
    SELECT 
      DATE_TRUNC('month', date) AS "month",
      COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) AS income,
      COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS expense
    FROM records 
    WHERE "orgId" = $1
    GROUP BY DATE_TRUNC('month', date)
    ORDER BY "month" ASC;
    `,
    [orgId],
  );

  return response.rows;
};
