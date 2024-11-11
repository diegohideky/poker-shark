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
    return <div>Team not found</div>;
  }

  const newMatch = () => {
    navigate.push(`/t/${team.pageName}/matches/new`);
  };

  return (
    <>
      <Head>
        <title>{team.name} - Team Details</title>
        <meta name="description" content={`Details about ${team.name}`} />
      </Head>
      <div className="p-4">
        <h1 className="text-2xl font-bold">{team.name}</h1>
        {team.photoUrl && (
          <img
            src={`${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
            }/files/${team.photoUrl}`}
            alt={`${team.name} logo`}
            className="rounded-full w-32 h-32 mt-4 object-cover"
          />
        )}
        {team.description && <p className="mt-4">{team.description}</p>}
      </div>
      <div>
        {/* create a button to create new game */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => newMatch()}
        >
          Create New Match
        </button>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageName } = context.params as { pageName: string };
  console.log({ pageName });

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
