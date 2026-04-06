export const validateSignup = ({ fullName, email, password }) => {
  if (!fullName || !email || !password) {
    return "Credentials are mandatory";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  return null;
};

export const ValidateLogin = ({ email, password }) => {
  if (!email || !password) return "Credentials are mandatory";

  return null;
};

export const ValidateFinanceUpdates = ({
  id,
  amount,
  type,
  category,
  date,
}) => {
  if (!id) return "Id for updation is mendatory.";
  if(!amount && !type && !date) return "To update one of entry is mendatory."
  return null;
};

export const validateUserUpdation = ({
  email,
  password,
  fullName,
  role,
  orgId,
}) => {
  if (!orgId) return "orgId is mendatory.";
  if (!email) return "email for updation is mendatory.";
  if (!password) return "Please enter password is mendatory.";
  if (password.length < 6) return "Password must be more then 6 characters.";
  if (!role) return "role is mendetory";
  if (!fullName) return "Name for user is mendatory";

  return null;
};

export const ValidateUpdateUserRole = ({ email, role }) => {
  if (!email || !role)
    return "emailId, role all are mendatory";
  return null;
};

export const ValidatetoggleUserStatus = ({ email, role }) => {
  if (!email || !role)
    return "email and role are all mandatory";
  return null;
};

export const ValidatefinanceCreate = ({
  amount,
  type,
  desc,
}) => {
  if (!amount || !type || !desc) {
    return "every input is mendatory";
  }
  return null;
};
