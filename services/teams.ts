import api from "@libs/api";

const endpoint = "/teams";

type PaginationParams = {
  offset?: number;
  limit?: number;
  orderField?: string;
  orderDirection?: string;
  search?: string;
};

export const getTeams = async (params: PaginationParams) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`${endpoint}`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const askForJoinTeam = async (teamId: string) => {
  const token = localStorage.getItem("token");
  const response = await api.post(
    `${endpoint}/${teamId}/requests`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getTeamRequests = async (teamId) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`${endpoint}/${teamId}/requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const approveRequest = async (teamId, userId) => {
  const token = localStorage.getItem("token");
  const response = await api.put(
    `${endpoint}/${teamId}/requests/${userId}`,
    {
      accept: true,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const declineRequest = async (teamId, userId) => {
  const token = localStorage.getItem("token");
  const response = await api.put(
    `${endpoint}/${teamId}/requests/${userId}`,
    {
      accept: false,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getTeamsByPageName = async (pageName) => {
  const response = await api.get(`${endpoint}/page-name/${pageName}`);
  return response.data;
};

export const createTeam = async (formData: FormData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const response = await api.post(endpoint, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
