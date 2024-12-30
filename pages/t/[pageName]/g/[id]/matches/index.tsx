import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { getMatches } from "@services/matches"; // Replace with your service function
import { showErrorToast } from "@libs/utils";
import LoadingOverlay from "@components/LoadingOverlay";
import { GetServerSideProps } from "next";
import { getTeamsByPageName } from "@services/teams";

const LIMIT = 5;

const TeamMatches = ({ team }) => {
  const router = useRouter();
  const { id: queryGameId } = router.query;

  const [matches, setMatches] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchMatches = useCallback(async () => {
    if (!team || !queryGameId || (total > 0 && matches.length >= total)) return;

    setIsLoading(true);
    try {
      const response = await getMatches({
        teamId: team.id,
        gameId: queryGameId as string,
        offset,
        limit: LIMIT,
        orderField: "datetime",
        orderDirection: "DESC",
      });

      setMatches((prev) => [...prev, ...response.data]);
      setTotal(response.total);
      setOffset((prev) => prev + LIMIT);
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to load matches.");
    } finally {
      setIsLoading(false);
    }
  }, [team, queryGameId, offset]);

  useEffect(() => {
    if (team && queryGameId) {
      setMatches([]);
      setOffset(0);
      setTotal(0);
      fetchMatches(); // Initial fetch
    }
  }, [team, queryGameId]);

  return (
    <div className="max-w-4xl md:mx-auto m-5 p-5">
      <LoadingOverlay isLoading={isLoading} />
      <div className="flex w-full justify-center gap-6 mb-6">
        {team.photoUrl && (
          <img
            src={`${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
            }/files/${team.photoUrl || "shield-default.jpeg"}`}
            alt={`${team.name} logo`}
            className="rounded-full w-24 h-24 object-cover"
          />
        )}
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        {team?.name}
      </h1>
      <div className="p-2">
        <p className="text-sm text-white">Matches: ({total})</p>
      </div>
      {matches.length === 0 && !isLoading ? (
        <p className="text-center text-gray-500">
          No matches found for this team.
        </p>
      ) : (
        <InfiniteScroll
          dataLength={matches.length}
          next={fetchMatches}
          hasMore={matches.length < total}
          loader={<p className="text-center text-gray-500">Loading more...</p>}
          endMessage={
            <p className="text-center text-gray-500">
              No more matches to show.
            </p>
          }
        >
          <ul className="space-y-4">
            {matches.map((match: any) => (
              <li
                key={match.id}
                className="p-4 bg-gray-800 rounded-lg flex flex-col justify-between gap-1 shadow-md hover:bg-gray-700 transition-shadow cursor-pointer"
                onClick={() => router.push(`/t/${team.pageName}/m/${match.id}`)}
              >
                <h2 className="text-lg font-semibold text-white">
                  {match.name}
                </h2>
                <p className="text-sm text-gray-400 italic">
                  {dayjs(match.datetime).format("DD/MM/YYYY HH:mm:ss")}
                </p>
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      )}
    </div>
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

export default TeamMatches;
