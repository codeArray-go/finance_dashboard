import { pool } from "./pool.js";

export const createTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS organization(
      "orgId" BIGSERIAL PRIMARY KEY,
      "orgName" TEXT UNIQUE NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        "orgId" BIGINT REFERENCES organization("orgId") ON DELETE CASCADE,

        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        "fullName" TEXT NOT NULL,
        "profilePic" TEXT DEFAULT '',

        role TEXT CHECK(role IN('admin', 'analyst', 'viewer')) DEFAULT 'admin',
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS records (
        id BIGSERIAL PRIMARY KEY,
        "orgId" BIGINT REFERENCES organization("orgId") ON DELETE CASCADE,
        "userId" BIGINT REFERENCES users(id) ON DELETE SET NULL,

        amount BIGINT DEFAULT 0,
        type TEXT CHECK (type IN ('income', 'expense')) DEFAULT NULL,

        category TEXT CHECK(category IN('food', 'tour', 'others')),
        description TEXT DEFAULT '',
        date TIMESTAMP,

        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
  );
};
