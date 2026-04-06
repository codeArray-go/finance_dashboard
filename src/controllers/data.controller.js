import {
  dashboardData,
  fetchFilteredRecords,
  financeDeleteRepo,
  getMonthlyTrendsRepo,
  recentActivity,
  summeryData,
} from "../repositories/data.repository.js";
import {
  financeCreateService,
  financeUpdateService,
} from "../services/data.service.js";

export const getDashboardData = async (req, res) => {
  const { id, orgId, orgName } = req.user;
  try {
    const data = await dashboardData({ id, orgId, orgName });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getSummery = async (req, res) => {
  try {
    const response = await summeryData(req.user);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const response = await recentActivity(req.user);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const financeUpdateController = async (req, res) => {
  try {
    const response = await financeUpdateService(req.body, req.user);

    res.status(200).json(response);
  } catch (error) {
    console.error(error);

    const statusCode = error.message.includes("Validation") ? 400 : 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Internal server error." });
  }
};

export const financeCreateController = async (req, res) => {
  const user = req.user;
  try {
    const result = await financeCreateService(req.body, user.orgId, user.id);
    res
      .status(200)
      .json({ message: "finance created successfully", finance: result });
  } catch (error) {
    console.error("Error in Finance Creation: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const financeDeleteController = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  try {
    const responseMessage = await financeDeleteRepo({
      userId: user.id,
      orgId: user.orgId,
      id,
    });
    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFilteredRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    const records = await fetchFilteredRecords(req.user, {
      type,
      category,
      startDate,
      endDate,
    });

    res.status(200).json({
      message: "Records fetched successfully",
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching filtered records:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getTrendsController = async (req, res) => {
  try {
    const trends = await getMonthlyTrendsRepo(req.user.orgId);
    res.status(200).json(trends);
  } catch (error) {
    console.error("Error fetching trends:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
