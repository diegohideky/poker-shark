import { GetServerSideProps } from "next";
import { getTeamsByPageName } from "@services/teams";
import { getGames } from "@services/games";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Game } from "@entities/Game";
import { FaPlus, FaEye, FaTrophy } from "react-icons/fa"; // Import icons

interface TeamProps {
  team: {
    id: string;
    name: string;
    photoUrl?: string;
    description?: string;
    pageName: string;
  } | null;
}

const TeamPage: React.FC<TeamProps> = ({ team }) => {
  const navigate = useRouter();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data } = await getGames({});
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, [team]);

  if (!team) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-red-500">Team not found</h1>
      </main>
    );
  }

  const goTo = (path: string) => {
    navigate.push(path);
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-900 sm:mx-auto text-gray-50 p-2">
      <Head>
        <title>{team.name} - Team Details</title>
        <meta name="description" content={`Details about ${team.name}`} />
      </Head>
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-md p-6">
        {/* Team Header */}
        <div className="flex items-center gap-6 mb-6">
          {team.photoUrl && (
            <img
              src={`${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
              }/files/${team.photoUrl || "shield-default.jpeg"}`}
              alt={`${team.name} logo`}
              className="rounded-full w-24 h-24 object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{team.name}</h1>
            {team.description && (
              <p className="text-gray-400 mt-2">{team.description}</p>
            )}
          </div>
        </div>

        {/* List of Games */}
        <div>
          {games.length > 0 ? (
            <ul className="space-y-4">
              {games.map((game) => (
                <li
                  key={game.id}
                  className="bg-gray-700 p-4 rounded-lg flex flex-col gap-3"
                >
                  {/* Game Details */}
                  <div className="flex items-center justify-between md:justify-start md:gap-5">
                    <p className="text-lg font-medium">{game.nickname}</p>
                    <p className="text-gray-400 text-sm italic">{game.type}</p>
                  </div>

                  {/* Options with Icons */}
                  <div className="flex justify-end space-x-4">
                    {/* New Matches */}
                    <button
                      onClick={() =>
                        goTo(`/t/${team.pageName}/g/${game.id}/matches/new`)
                      }
                      className="flex items-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-full"
                    >
                      <FaPlus className="mr-1" />
                    </button>

                    {/* View Matches */}
                    <button
                      onClick={() =>
                        goTo(`/t/${team.pageName}/g/${game.id}/matches`)
                      }
                      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-full"
                    >
                      <FaEye className="mr-1" />
                    </button>

                    {/* Ranking */}
                    <button
                      onClick={() =>
                        goTo(`/t/${team.pageName}/g/${game.id}/ranking`)
                      }
                      className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-full"
                    >
                      <FaTrophy className="mr-1" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No games available for this team.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageName } = context.params as { pageName: string };

  try {
    const team = await getTeamsByPageName(pageName);

    if (!team) {
      return {
        props: {
          team: null,
        },
      };
    }

    return {
      props: {
        team,
      },
    };
  } catch (error) {
    console.error("Error fetching team data or games:", error);
    return {
      props: {
        team: null,
      },
    };
  }
};

export default TeamPage;
