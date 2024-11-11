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
