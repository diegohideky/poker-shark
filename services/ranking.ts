import api from "@libs/api";

const endpoint = "/v2/ranking";

type PaginationParams = {
  offset?: number;
  limit?: number;
  orderField?: string;
  orderDirection?: string;
  search?: string;
};

type RankingParams = PaginationParams & {
  teamId: string;
  gameId: string;
  unit?: "week" | "month" | "year";
  amount?: number;
};

export const getRanking = async (params: RankingParams) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`${endpoint}`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
