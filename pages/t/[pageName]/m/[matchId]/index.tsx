// pages/t/[pageName]/matches/[matchId].tsx
import { GetServerSideProps } from "next";
import dayjs from "dayjs";
import { getTeamsByPageName } from "@services/teams";
import {
  getMatchPlayers,
  updateMatchPlayer,
  createMatchPlayer,
  getMatchById,
} from "@services/matches";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Match } from "@entities/Match";
import { FaClipboard, FaEye, FaPlus } from "react-icons/fa6";
import { showSuccessToast } from "@libs/utils";
import { FaTrophy } from "react-icons/fa";

interface Player {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    photoUrl?: string;
  };
  matchPlayer: {
    id?: string;
    score: number | null;
  } | null;
}

interface TeamProps {
  team: {
    id: string;
    name: string;
    photoUrl?: string;
    description?: string;
    pageName: string;
  } | null;
  matchId: string;
  gameType: string; // Add gameType to props
}

const MatchPage: React.FC<TeamProps> = ({ team, matchId, gameType }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [scores, setScores] = useState<{ [key: string]: string }>({});
  const [match, setMatch] = useState<Match | null>(null);
  const navigate = useRouter();

  const fetchPlayers = async () => {
    if (team) {
      try {
        const { total, data } = await getMatchPlayers(matchId, {});
        setPlayers(data);
        setTotalPlayers(total);

        // Initialize scores state
        const initialScores: { [key: string]: string } = {};
        data.forEach((player: Player) => {
          initialScores[player.id] = formatScore(
            player.matchPlayer?.score ?? 0
          );
        });
        setScores(initialScores);
      } catch (error) {
        console.error("Error fetching match players:", error);
      }
    }
  };

  const getMatch = async () => {
    if (matchId) {
      try {
        const response = await getMatchById(matchId);
        setMatch(response);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [team]);

  useEffect(() => {
    getMatch();
  }, [matchId]);

  const formatScore = (value: number): string => {
    const isNegative = value < 0;
    const absValue = Math.abs(value);
    const formatted = (absValue / 100).toFixed(2).replace(".", ",");
    return isNegative ? `-${formatted}` : formatted;
  };

  const generateRankingText = (): string => {
    const matchDate = match?.datetime
      ? dayjs(match.datetime).format("DD/MM/YYYY")
      : "N/A";

    const playerScores = players
      .map(
        (player) =>
          `${player.user.name} ${scores[player.id].startsWith("-") ? "" : "+"}${
            scores[player.id]
          }`
      )
      .join("\n");

    return `Poker table ${matchDate}\n\n${playerScores}\n\nDiff: ${matchDiff}`;
  };

  const copyToClipboard = () => {
    const rankingText = generateRankingText();
    navigator.clipboard.writeText(rankingText).then(() => {
      showSuccessToast("Ranking copied to clipboard!");
    });
  };

  const handleScoreChange = (playerId: string, inputValue: string) => {
    let isNegative = false;
    if (inputValue.startsWith("-")) {
      isNegative = true;
      inputValue = inputValue.slice(1);
    }

    let onlyNumbers = inputValue.replace(/\D/g, "");

    if (onlyNumbers.length > 10) {
      onlyNumbers = onlyNumbers.slice(0, 10);
    }

    while (onlyNumbers.length < 3) {
      onlyNumbers = "0" + onlyNumbers;
    }

    const formattedValue = `${
      onlyNumbers.slice(0, -2).replace(/^0+/, "") || "0"
    },${onlyNumbers.slice(-2)}`;

    const finalFormattedValue = isNegative
      ? `-${formattedValue}`
      : formattedValue;

    setScores((prevScores) => ({
      ...prevScores,
      [playerId]: finalFormattedValue,
    }));
  };

  const convertToCents = (formattedScore: string): number => {
    const isNegative = formattedScore.startsWith("-");
    const cleanedScore = formattedScore.replace(",", "").replace("-", "");
    const cents = parseInt(cleanedScore, 10);
    return isNegative ? -cents : cents;
  };

  const moveCursorToEnd = (event: React.FocusEvent<HTMLInputElement>) => {
    const input = event.target;
    input.setSelectionRange(input.value.length, input.value.length);
  };

  const handleBlur = async (playerId: string) => {
    const score = convertToCents(scores[playerId]);
    const player = players.find((p) => p.id === playerId);

    if (!player) return;

    if (player.matchPlayer?.id) {
      try {
        await updateMatchPlayer(player.user.id, matchId, score);
        // fetchPlayers();
      } catch (error) {
        console.error(`Error updating match player ${player.id}:`, error);
      }
    } else {
      try {
        await createMatchPlayer(player.user.id, matchId, score);
        // fetchPlayers();
      } catch (error) {
        console.error(`Error creating match player ${player.id}:`, error);
      }
    }
  };

  const matchDiff = useMemo(() => {
    if (gameType === "CASH") {
      return formatScore(
        Object.values(scores).reduce((acc, curr) => {
          console.log({ curr: convertToCents(curr) });
          return acc - convertToCents(curr);
        }, 0)
      );
    }
    return formatScore(0);
  }, [scores]);

  if (!team) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-red-500">Team not found</h1>
      </main>
    );
  }

  const goTo = (path: string) => navigate.push(path);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-900 text-gray-50 p-6">
      <Head>
        <title>{team.name} - Match</title>
        <meta name="description" content={`Match Details for ${team.name}`} />
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

        <div className="flex justify-end space-x-4 p-2">
          {/* New Matches */}
          <button
            onClick={() =>
              goTo(`/t/${team.pageName}/g/${match.gameId}/matches/new`)
            }
            className="flex items-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-full"
          >
            <FaPlus className="mr-1" />
          </button>

          {/* View Matches */}
          <button
            onClick={() =>
              goTo(`/t/${team.pageName}/g/${match.gameId}/matches`)
            }
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-full"
          >
            <FaEye className="mr-1" />
          </button>

          {/* Ranking */}
          <button
            onClick={() =>
              goTo(`/t/${team.pageName}/g/${match.gameId}/ranking`)
            }
            className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-full"
          >
            <FaTrophy className="mr-1" />
          </button>
        </div>

        {/* Match Content */}
        <div className="">
          <div className="flex items-center justify-between py-4">
            <h2 className="text-xl font-semibold">Players ({totalPlayers})</h2>

            <div>
              <p className="font-bold text-lg">
                Diff:{" "}
                <span
                  className={matchDiff.startsWith("-") ? "text-red-500" : ""}
                >
                  {matchDiff}
                </span>
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-full"
            >
              <FaClipboard className="mr-1" />
            </button>
          </div>
          {players.length === 0 ? (
            <p>No players available.</p>
          ) : (
            <ul className="space-y-2">
              {players.map((player) => (
                <li
                  key={player.id}
                  className="p-2 border rounded-md flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    {player.user.photoUrl ? (
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_API_URL ||
                          "http://localhost:3000/api"
                        }/files/${
                          player.user.photoUrl || "user-picture-default.avif"
                        }`}
                        alt={`${player.user.name}'s photo`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm text-gray-500">N/A</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{player.user.name}</p>
                      <p className="text-sm text-gray-500">
                        @{player.user.username}
                      </p>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={scores[player.id]}
                      onChange={(e) =>
                        handleScoreChange(player.id, e.target.value)
                      }
                      onFocus={moveCursorToEnd}
                      onBlur={() => handleBlur(player.id)}
                      className="w-20 border rounded-md p-1 text-center text-black"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageName, matchId } = context.params as {
    pageName: string;
    matchId: string;
  };

  const team = await getTeamsByPageName(pageName);

  if (!team) {
    return { notFound: true };
  }

  const gameType = "CASH"; // Replace with actual logic to fetch game type if needed

  return {
    props: {
      team,
      matchId,
      gameType,
    },
  };
};

export default MatchPage;
