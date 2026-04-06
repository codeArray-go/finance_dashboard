import { pool } from "../lib/pool.js";

export const checkUserExists = async (email) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  return result.rows.length > 0;
};

export const signUpUser = async ({
  orgId,
  role,
  fullName,
  email,
  password,
}) => {
  const result = await pool.query(
    `INSERT INTO users("orgId", role, "fullName", email, password)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, role, "fullName", email, "profilePic"`,
    [orgId, role, fullName, email, password],
  );

  return result.rows[0];
};

export const createOrg = async (orgName) => {
  const result = await pool.query(
    `INSERT INTO organization("orgName") VALUES ($1) RETURNING "orgId", "orgName"`,
    [orgName],
  );
  return result.rows[0];
};

export const loggedInUser = async ({ role, email, orgId }) => {
  const result = (
    await pool.query(
      `SELECT u.*, o."orgName" 
        FROM users u 
        JOIN organization o ON u."orgId" = o."orgId" 
        WHERE u.email=$1 AND u.role=$2 AND u."orgId"=$3`,
      [email, role, orgId],
    )
  ).rows[0];

  return result;
};

export const findUserById = async (userId) => {
  const user = await pool.query(
    `SELECT u.*, o."orgName" 
      FROM users u 
      JOIN organization o ON u."orgId" = o."orgId" WHERE id = $1`,
    [userId],
  );

  return user.rows[0];
};

export const checkExistingUserWithExistingRole = async ({
  email,
  role,
  orgId,
}) => {
  const existingUser = await pool.query(
    `SELECT * FROM users WHERE email=$1 AND role=$2 AND "orgId"=$3`,
    [email, role, orgId],
  );

  return existingUser.rows;
};

export const createOrgUserRepo = async ({
  email,
  hashedPass,
  fullName,
  role,
  orgId,
}) => {
  const response = await pool.query(
    `
    INSERT INTO 
      users(email, password, "fullName", role, "orgId") 
      VALUES($1, $2, $3, $4, $5) 
    RETURNING id, email, "fullName", role 
  `,
    [email, hashedPass, fullName, role, orgId],
  );

  return response.rows;
};

export const updateUserRoleRepo = async ({ email, orgId, role }) => {
  const response = await pool.query(
    `UPDATE users 
  SET role = $1 
  WHERE email = $2 AND "orgId" = $3 
  RETURNING id, email, "fullName", role, "orgId"`,
    [role, email, orgId],
  );

  return response.rows;
};

export const toggleUserStatusRepo = async ({
  email,
  orgId,
  role,
  isActive,
}) => {
  await pool.query(
    `UPDATE users SET "isActive"=$1 WHERE email=$2 AND "orgId"=$3 AND role=$4`,
    [isActive, email, orgId, role],
  );

  return "Updated users active status.";
};
