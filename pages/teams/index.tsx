// pages/teams.tsx

import { useEffect, useState } from "react";
import { getTeams } from "@services/teams";

const PAGE_SIZE = 10; // Number of teams per page

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTeams, setTotalTeams] = useState(0);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const result = await getTeams({
          offset: currentPage - 1,
          limit: PAGE_SIZE,
        });
        setTeams(result.data);
        setTotalTeams(result.total); // Assuming the API returns total count
        setFilteredTeams(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

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
              {filteredTeams.map((team) => (
                <li
                  key={team.id}
                  className="p-2 border-b flex items-center space-x-4"
                >
                  <img
                    src={`${API_URL}/files/${team.photoUrl}`}
                    alt={`${team.name} photo`}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{team.name}</span>
                </li>
              ))}
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
