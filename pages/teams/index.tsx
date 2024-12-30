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
import LoadingOverlay from "@components/LoadingOverlay";
import { showErrorToast, showSuccessToast } from "@libs/utils";
import { FaPlus } from "react-icons/fa6";
import InfiniteScroll from "react-infinite-scroll-component";

const PAGE_SIZE = 10; // Number of teams per page

export default function TeamsPage() {
  const { user, getCurrentUser } = useUser();
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // To track if more data is available

  const navigate = useRouter();

  const fetchTeams = async (page = 1) => {
    setIsLoading(true);
    try {
      const result = await getTeams({
        offset: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      setTeams((prevTeams) => [...prevTeams, ...result.data]);
      setFilteredTeams((prevTeams) => [...prevTeams, ...result.data]);

      if (result.data.length < PAGE_SIZE) {
        setHasMore(false); // No more data to load
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams(currentPage);
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
    setTeams([]);
    fetchTeams(1);
  };

  const loadMoreTeams = () => {
    setCurrentPage((prevPage) => prevPage + 1);
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
      showSuccessToast("Invitation sent successfully!");
      await getCurrentUser();
      setTeams([]); // Reset teams
      fetchTeams(1); // Reload teams
    } catch (error) {
      console.error(error);
      showErrorToast("Error to send invitation. Try again later.");
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
      <LoadingOverlay isLoading={isLoading} />

      <div className="fixed bottom-[6rem] right-4">
        <button
          onClick={() => navigate.push("/teams/new")}
          className="flex items-center gap-2 py-2 px-4 bg-blue-600 rounded-full text-gray-100 hover:bg-blue-500 cursor-pointer"
        >
          <FaPlus /> Team
        </button>
      </div>

      <input
        type="text"
        placeholder="Search teams..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 mb-6 text-gray-800 rounded-lg border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
      />

      <InfiniteScroll
        dataLength={filteredTeams.length}
        next={loadMoreTeams}
        hasMore={hasMore}
        loader={<h4>Loading more teams...</h4>}
        // endMessage={<p className="text-center">No more teams to show</p>}
      >
        <ul className="space-y-4">
          {filteredTeams.map((team) => {
            const teamStatus = getTeamStatus(team.id);

            return (
              <li
                key={team.id}
                className="p-4 bg-gray-800 rounded-lg flex justify-between gap-4 shadow-md"
              >
                <div
                  className="flex items-center gap-2 font-medium text-lg cursor-pointer hover:text-gray-300 transition duration-200"
                  onClick={() => goToTeamPage(team.pageName)}
                >
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_API_URL ||
                      "http://localhost:3000/api"
                    }/files/${team.photoUrl || "shield-default.jpeg"}`}
                    alt={`${team.name} logo`}
                    className="w-14 h-14 rounded-full border-2 border-yellow-500"
                  />
                  <span>{team.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {team.ownerId === user.id && (
                    <button
                      onClick={() => goToRequests(team.id)}
                      className="px-3 py-2 bg-blue-600 rounded-full text-gray-100 hover:bg-blue-500 cursor-pointer"
                      aria-label="View Invites"
                    >
                      <FontAwesomeIcon icon={faEnvelope as IconProp} />
                    </button>
                  )}
                  {teamStatus === "Join Team" && (
                    <button
                      onClick={() => handleJoinTeam(team.id)}
                      className="px-3 py-2 bg-green-600 rounded-full text-gray-100 hover:bg-green-500 cursor-pointer"
                      aria-label="Join Team"
                    >
                      <FontAwesomeIcon icon={faRightToBracket as IconProp} />
                    </button>
                  )}
                  {teamStatus === "Leave Team" && (
                    <button
                      onClick={() => handleLeaveTeam(team.id)}
                      className="px-3 py-2 bg-red-600 rounded-full text-gray-100 hover:bg-red-500 cursor-pointer"
                      aria-label="Leave Team"
                    >
                      <FontAwesomeIcon
                        icon={faArrowRightFromBracket as IconProp}
                      />
                    </button>
                  )}
                  {teamStatus === "Pending" && (
                    <span
                      className="px-3 py-2 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center"
                      aria-label="Pending Approval"
                    >
                      <FontAwesomeIcon icon={faCheckCircle as IconProp} />
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </InfiniteScroll>
    </main>
  );
}
