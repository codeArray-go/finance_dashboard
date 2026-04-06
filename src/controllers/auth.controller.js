import {
  createOrgUserService,
  toggleUserStatusService,
  updateUserRoleService,
} from "../services/auth.service.js";
import { loginService, signUpService } from "../services/auth.service.js";

export const signUp = async (req, res) => {
  try {
    const user = await signUpService(req.body, res);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await loginService(req.body, res);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrgUser = async (req, res) => {
  try {
    const response = await createOrgUserService(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  const orgId = req.user.orgId;
  try {
    const response = await updateUserRoleService(req.body, orgId);
    res
      .status(200)
      .json({ message: "role updated successfully.", user: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  const orgId = req.user.orgId;
  try {
    const result = await toggleUserStatusService(req.body, orgId);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
