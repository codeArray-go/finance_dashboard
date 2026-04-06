import {
  validateSignup,
  ValidatetoggleUserStatus,
  validateUserUpdation,
  ValidateLogin,
  ValidateUpdateUserRole,
} from "../utils/validators.js";
import {
  checkExistingUserWithExistingRole,
  checkUserExists,
  createOrg,
  createOrgUserRepo,
  loggedInUser,
  signUpUser,
  toggleUserStatusRepo,
  updateUserRoleRepo,
} from "../repositories/auth.repository.js";
import { hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcrypt";
import redisClient from "../lib/redis.js";

export const signUpService = async (
  { orgName, role, fullName, email, password },
  res,
) => {
  const error = validateSignup({ fullName, email, password });
  if (error) throw new Error(error);

  const exists = await checkUserExists(email);
  if (exists) throw new Error("User already exists");

  const hashedPass = await hashPassword(password);
  let organization = await createOrg(orgName);

  let user = await signUpUser({
    orgId: organization.orgId,
    role,
    fullName,
    email,
    password: hashedPass,
  });
  generateToken(user.id, res);

  let mergedData = Object.assign(user, organization);

  await redisClient.set(
    `userId:${user.id}`,
    JSON.stringify(mergedData),
    "EX",
    7 * 24 * 60 * 60,
  );

  return user;
};

export const loginService = async ({ orgId, role, email, password }, res) => {
  const error = ValidateLogin({ email, password });
  if (error) throw new Error(error);

  let existingUserData = await loggedInUser({ role, email, orgId });
  if (!existingUserData) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, existingUserData.password);
  if (!isMatch) throw new Error("Invalid credentials");

  generateToken(existingUserData.id, res);

  let user = {
    id: existingUserData.id,
    role: existingUserData.role,
    email: existingUserData.email,
    orgId: existingUserData.orgId,
    orgName: existingUserData.orgName,
    fullName: existingUserData.fullName,
    profilePic: existingUserData.profilePic,
  };

  await redisClient.set(`userId:${existingUserData.id}`, JSON.stringify(user), {
    EX: 7 * 24 * 60 * 60,
  });

  return user;
};

export const createOrgUserService = async ({
  email,
  password,
  fullName,
  role,
  orgId,
}) => {
  const error = validateUserUpdation({
    email,
    password,
    fullName,
    role,
    orgId,
  });
  if (error) throw new Error(error);

  const check = await checkExistingUserWithExistingRole({ email, role, orgId });
  if (check.length > 0)
    return "user exist with this email and role already exists try assigning different role.";

  const hashedPass = await hashPassword(password);

  const response = await createOrgUserRepo({
    email,
    hashedPass,
    fullName,
    role,
    orgId,
  });

  return response;
};

export const updateUserRoleService = async ({ email, role }, orgId) => {
  const error = ValidateUpdateUserRole({ email, role });
  if (error) throw new Error(error);

  const response = await updateUserRoleRepo({ email, orgId, role });
  return response;
};

export const toggleUserStatusService = async (
  { email, role, isActive },
  orgId,
) => {
  const error = ValidatetoggleUserStatus({ email, role, isActive });
  if (error) throw new Error(error);

  const response = await toggleUserStatusRepo({ email, orgId, role, isActive });
  return response;
};
