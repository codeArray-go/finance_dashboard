import {
  financeCreateRepo,
  updateFinances,
} from "../repositories/data.repository.js";
import {
  ValidatefinanceCreate,
  ValidateFinanceUpdates,
} from "../utils/validators.js";

export const financeUpdateService = async (
  { id, amount, type, category, date, description },
  user,
) => {
  const error = ValidateFinanceUpdates({ id, amount, type, category, date });
  if (error) throw new Error(error);

  const orgId = user.orgId;
  const response = await updateFinances({
    id,
    amount,
    type,
    category,
    date,
    description,
    orgId,
  });

  return response;
};

export const financeCreateService = async (
  { amount, type, category, desc, date },
  orgId,
  userId,
) => {
  const error = ValidatefinanceCreate({ amount, type, desc});
  if (error) throw new Error(error);

  const response = await financeCreateRepo({
    amount,
    type,
    category,
    desc,
    date,
    orgId,
    userId,
  });
  return response;
};
