// pages/teams.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { askForJoinTeam, getTeams } from "@services/teams";
import { useUser } from "@contexts/UserContext"; // Import UserContext

const PAGE_SIZE = 10; // Number of teams per page

export default function TeamsPage() {
  const { user, getCurrentUser } = useUser(); // Access the current user
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalTeams, setTotalTeams] = useState(0);

  const navigate = useRouter();

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const result = await getTeams({
        offset: currentPage,
        limit: PAGE_SIZE,
      });
      setTeams(result.data);
      setTotalTeams(result.total);
      setFilteredTeams(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [currentPage]);

  useEffect(() => {
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeams(filtered);
  }, [searchTerm, teams]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const totalPages = Math.ceil(totalTeams / PAGE_SIZE);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getTeamStatus = (teamId) => {
    const teamPlayer = user["teamPlayers"]?.find((tp) => tp.teamId === teamId);
    if (teamPlayer) {
      if (teamPlayer.status === "accepted") return "Leave Team";
      if (teamPlayer.status === "pending") return "Pending";
      if (teamPlayer.status === "declined") return "Join Team";
    }
    return "Join Team";
  };

  const handleJoinTeam = async (teamId: string): Promise<void> => {
    try {
      const result = await askForJoinTeam(teamId);
      console.log({ result });
      alert("Solicitação enviada com sucesso!");
      await getCurrentUser();
      fetchTeams();
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar solicitação. Tente novamente mais tarde.");
    }
  };

  const handleLeaveTeam = (teamId) => {
    // Leave team logic
    console.log({ teamId });
  };

  const goToRequests = (teamid) => {
    navigate.push(`/teams/${teamid}/requests`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Teams</h1>
      <input
        type="text"
        placeholder="Search teams..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mt-4 w-full h-10 px-3 border rounded-lg"
      />

      {loading ? (
        <div className="flex justify-center mt-10">
          <span>Loading...</span>
        </div>
      ) : (
        <div className="mt-4">
          {filteredTeams.length > 0 ? (
            <ul>
              {filteredTeams.map((team) => {
                const teamStatus = getTeamStatus(team.id);

                return (
                  <li key={team.id} className="p-2 border-b flex items-center">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_API_URL ||
                        "http://localhost:3000/api"
                      }/files/${team.photoUrl}`}
                      alt={`${team.name} logo`}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <span className="flex-grow">{team.name}</span>
                    {team.ownerId === user.id && (
                      <button
                        onClick={() => goToRequests(team.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Invites
                      </button>
                    )}
                    {teamStatus === "Join Team" && (
                      <button
                        onClick={() => handleJoinTeam(team.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Join Team
                      </button>
                    )}
                    {teamStatus === "Leave Team" && (
                      <button
                        onClick={() => handleLeaveTeam(team.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Leave Team
                      </button>
                    )}
                    {teamStatus === "Pending" && (
                      <span className="px-4 py-2 bg-yellow-500 text-black rounded">
                        Pending
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div>No teams found.</div>
          )}
          <div className="mt-4 flex justify-between">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2 border rounded"
            >
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
