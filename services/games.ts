import api from "@libs/api";

const endpoint = "/games";

type PaginationParams = {
  offset?: number;
  limit?: number;
  orderField?: string;
  orderDirection?: string;
  search?: string;
};

export const getGames = async (params: PaginationParams) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`${endpoint}`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
