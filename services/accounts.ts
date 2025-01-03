import { User } from "@entities/User";
import api from "@libs/api";

const endpoint = "/accounts";

export const login = async (username: string, password: string) => {
  const response = await api.post(`${endpoint}/login`, {
    username,
    password,
  });
  return response.data;
};

export const getCurrent = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get(`${endpoint}/current`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateCurrent = async (params: Partial<User>) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(`${endpoint}/current`, params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const signup = async (
  name: string,
  username: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  const response = await api.post(`${endpoint}/signup`, {
    name,
    username,
    email,
    password,
    passwordConfirmation,
  });
  return response.data;
};

export const changePassword = async (
  username: string,
  currentPassword: string,
  newPassword: string,
  passwordConfirmation: string
) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    `${endpoint}/change-password`,
    {
      username,
      currentPassword,
      newPassword,
      passwordConfirmation,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updatePhoto = async (formData: FormData) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(`${endpoint}/change-photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
