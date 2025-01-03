import { Match } from "@entities/Match";
import api from "@libs/api";

const endpoint = "/matches";

type PaginationParams = {
  offset?: number;
  limit?: number;
  orderField?: string;
  orderDirection?: string;
  search?: string;
  teamId?: string;
  gameId?: string;
};

type CreateMatchParams = {
  gameId: string;
  teamId: string;
  datetime: Date;
  name: string;
};

export const createMatch = async (params: CreateMatchParams) => {
  const token = localStorage.getItem("token");
  const response = await api.post(`${endpoint}`, params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMatchPlayers = async (
  matchId: string,
  params: PaginationParams
) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`${endpoint}/${matchId}/players`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createMatchPlayer = async (
  playerId: string,
  matchId: string,
  score: number
) => {
  const token = localStorage.getItem("token");
  const response = await api.post(
    `${endpoint}/${matchId}/players/`,
    {
      userId: playerId,
      status: "enrolled",
      score,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateMatchPlayer = async (
  playerId: string,
  matchId: string,
  score: number
) => {
  const token = localStorage.getItem("token");
  const response = await api.put(
    `${endpoint}/${matchId}/players/${playerId}`,
    {
      status: "enrolled",
      score,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getMatchById = async (matchId: string): Promise<Match> => {
  const token = localStorage.getItem("token");
  const response = await api.get(`${endpoint}/${matchId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getMatches = async (params: PaginationParams) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`${endpoint}`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
