// pages/teams/[id]/requests.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getTeamRequests,
  approveRequest,
  declineRequest,
} from "@services/teams";
import { TeamPlayer } from "@entities/TeamPlayer";

export default function TeamRequestsPage() {
  const [requests, setRequests] = useState<TeamPlayer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id: teamId } = router.query;

  console.log({ total });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const result = await getTeamRequests(teamId as string);
      setRequests(result.requests);
      setTotal(result.total);
    } catch (error) {
      console.error("Error fetching team requests:", error);
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!teamId) return;
    fetchRequests();
  }, [teamId]);

  const handleApprove = async (teamId: string, userId: string) => {
    try {
      await approveRequest(teamId, userId);

      fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      setError("Failed to approve request.");
    }
  };

  const handleDecline = async (teamId: string, userId: string) => {
    try {
      await declineRequest(teamId, userId);
      fetchRequests();
    } catch (error) {
      console.error("Error declining request:", error);
      setError("Failed to decline request.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Team Membership Requests</h1>

      {loading ? (
        <div className="flex justify-center mt-10">
          <span>Loading...</span>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="mt-4">
          {requests.length > 0 ? (
            <ul>
              {requests.map((request) => (
                <li key={request.id} className="p-2 border-b flex items-center">
                  <span className="flex-grow">
                    {request.user.name} -{" "}
                    <span
                      className={`${
                        request.status === "pending"
                          ? "text-yellow-500"
                          : request.status === "accepted"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </span>
                  <div className="flex gap-2">
                    {["pending", "declined"].includes(request.status) && (
                      <button
                        onClick={() =>
                          handleApprove(request.teamId, request.userId)
                        }
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Approve
                      </button>
                    )}
                    {["pending", "accepted"].includes(request.status) && (
                      <button
                        onClick={() =>
                          handleDecline(request.teamId, request.userId)
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div>No membership requests found.</div>
          )}
        </div>
      )}
    </div>
  );
}
