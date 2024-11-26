// pages/t/[pageName].tsx
import { GetServerSideProps } from "next";
import { getTeamsByPageName } from "@services/teams";
import Head from "next/head";
import { useRouter } from "next/router";

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
    <main className="min-h-screen flex flex-col items-center bg-gray-900 text-gray-50 p-6">
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
              }/files/${team.photoUrl}`}
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

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32"
            onClick={() => goTo(`/t/${team.pageName}/players`)}
          >
            Players
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-32"
            onClick={() => goTo(`/t/${team.pageName}/ranking`)}
          >
            Ranking
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-32"
            onClick={() => goTo(`/t/${team.pageName}/matches`)}
          >
            Matches
          </button>
        </div>

        {/* Create New Match */}
        <div className="flex justify-center">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-whte-900 font-bold py-3 px-6 rounded-lg w-48 shadow-lg"
            onClick={() => goTo(`/t/${team.pageName}/matches/new`)}
          >
            Create New Match
          </button>
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageName } = context.params as { pageName: string };

  try {
    const team = await getTeamsByPageName(pageName);

    return {
      props: {
        team,
      },
    };
  } catch (error) {
    console.error("Error fetching team data:", error);
    return {
      props: {
        team: null,
      },
    };
  }
};

export default TeamPage;
