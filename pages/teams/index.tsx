// pages/teams.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { askForJoinTeam, getTeams } from "@services/teams";
import { useUser } from "@contexts/UserContext"; // Import UserContext
import {
  faEnvelope,
  faCheckCircle,
  faRightToBracket,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const PAGE_SIZE = 10; // Number of teams per page

export default function TeamsPage() {
  const { user, getCurrentUser } = useUser();
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTeams, setTotalTeams] = useState(0);

  const navigate = useRouter();

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const result = await getTeams({
        offset: (currentPage - 1) * PAGE_SIZE,
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
    setCurrentPage(1);
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
      await askForJoinTeam(teamId);
      alert("Solicitação enviada com sucesso!");
      await getCurrentUser();
      fetchTeams();
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar solicitação. Tente novamente mais tarde.");
    }
  };

  const handleLeaveTeam = (teamId) => {
    console.log({ teamId });
  };

  const goToRequests = (teamId) => {
    navigate.push(`/teams/${teamId}/requests`);
  };

  const goToTeamPage = (teamId) => {
    navigate.push(`/t/${teamId}`);
  };

  return (
    <main className="p-4 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Teams</h1>
      <input
        type="text"
        placeholder="Search teams..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 mb-6 text-gray-800 rounded-lg border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
      />

      {loading ? (
        <div className="flex justify-center mt-10">
          <span>Loading...</span>
        </div>
      ) : (
        <div>
          {filteredTeams.length > 0 ? (
            <ul className="space-y-4">
              {filteredTeams.map((team) => {
                const teamStatus = getTeamStatus(team.id);

                return (
                  <li
                    key={team.id}
                    className="p-4 bg-gray-800 rounded-lg flex items-center gap-4 shadow-md"
                  >
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_API_URL ||
                        "http://localhost:3000/api"
                      }/files/${team.photoUrl}`}
                      alt={`${team.name} logo`}
                      className="w-14 h-14 rounded-full border-2 border-yellow-500"
                    />
                    <span
                      className="flex-grow font-medium text-lg cursor"
                      onClick={() => goToTeamPage(team.pageName)}
                    >
                      {team.name}
                    </span>
                    {team.ownerId === user.id && (
                      <button
                        onClick={() => goToRequests(team.id)}
                        className="p-2 bg-blue-600 rounded-full text-gray-100 hover:bg-blue-500"
                        aria-label="View Invites"
                      >
                        <FontAwesomeIcon icon={faEnvelope as IconProp} />
                      </button>
                    )}
                    {teamStatus === "Join Team" && (
                      <button
                        onClick={() => handleJoinTeam(team.id)}
                        className="p-2 bg-green-600 rounded-full text-gray-100 hover:bg-green-500"
                        aria-label="Join Team"
                      >
                        <FontAwesomeIcon icon={faRightToBracket as IconProp} />
                      </button>
                    )}
                    {teamStatus === "Leave Team" && (
                      <button
                        onClick={() => handleLeaveTeam(team.id)}
                        className="p-2 bg-red-600 rounded-full text-gray-100 hover:bg-red-500"
                        aria-label="Leave Team"
                      >
                        <FontAwesomeIcon
                          icon={faArrowRightFromBracket as IconProp}
                        />
                      </button>
                    )}
                    {teamStatus === "Pending" && (
                      <span
                        className="p-2 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center"
                        aria-label="Pending Approval"
                      >
                        <FontAwesomeIcon icon={faCheckCircle as IconProp} />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center">No teams found.</div>
          )}
          <div className="mt-6 flex justify-between items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 bg-gray-700 rounded text-gray-100 disabled:opacity-50"
              aria-label="Previous Page"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 bg-gray-700 rounded text-gray-100 disabled:opacity-50"
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
