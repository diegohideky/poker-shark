// pages/t/[pageName]/new-match.tsx
import { GetServerSideProps } from "next";
import { getTeamsByPageName } from "@services/teams";
import { getGames } from "@services/games";
import { createMatch } from "@services/matches";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod";
import { toast } from "react-toastify";
import { GameTypes } from "@entities/Game";

const matchSchema = z.object({
  gameId: z.string().nonempty("Game Type is required"),
  datetime: z.date(),
  name: z.string().min(1, "Match Name is required"),
  gameType: z.string().nonempty("Game Type is required"),
});

interface TeamProps {
  team: {
    id: string;
    name: string;
    photoUrl?: string;
    description?: string;
    pageName: string;
  } | null;
}

const NewMatchPage: React.FC<TeamProps> = ({ team }) => {
  const navigate = useRouter();
  const gameTypes = Object.values(GameTypes);
  const [gameType, setGameType] = useState<string>(gameTypes[0]);
  const [gameId, setGameId] = useState<string>("");
  const [games, setGames] = useState<{ id: string; name: string }[]>([]);
  const [datetime, setDatetime] = useState<Date>(new Date());
  const [name, setName] = useState<string>(
    `Poker Table ${new Date().toISOString().split("T")[0]}`
  );

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data } = await getGames({});
        setGames(data);
        setGameId(data[0]?.id || "");
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, [team]);

  if (!team) {
    return <div>Team not found</div>;
  }

  const handleSubmit = async () => {
    try {
      const validatedData = matchSchema.parse({
        gameId,
        datetime,
        name,
        gameType,
      });
      const result = await createMatch({
        teamId: team.id,
        gameId: validatedData.gameId,
        datetime: validatedData.datetime,
        name: validatedData.name,
      });
      toast.success("Match created successfully!");
      navigate.push(`/t/${team.pageName}/m/${result.id}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error("Failed to create match. Please try again.");
      }
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <Head>
        <title>{team.name} - New Match</title>
        <meta name="description" content={`New Match for ${team.name}`} />
      </Head>

      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 sm:p-8">
        {/* Team Info and Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            {team.photoUrl && (
              <img
                src={`${
                  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
                }/files/${team.photoUrl || "shield-default.jpeg"}`}
                alt={team.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <span className="text-lg font-semibold text-center sm:text-left">
              {team.name}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => navigate.push(`/t/${team.pageName}/players`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white w-full sm:w-auto"
            >
              Players
            </button>
            <button
              onClick={() => navigate.push(`/t/${team.pageName}/ranking`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white w-full sm:w-auto"
            >
              Ranking
            </button>
            <button
              onClick={() => navigate.push(`/t/${team.pageName}/matches`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white w-full sm:w-auto"
            >
              Matches
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
          Create New Match
        </h1>

        {/* Form Fields */}
        <div className="grid gap-6">
          {/* Game Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game
            </label>
            <select
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          {/* Game Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game Type
            </label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {gameTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match Date
            </label>
            <DatePicker
              selected={datetime}
              onChange={(date: Date) => setDatetime(date)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Match Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md"
          >
            Create Match
          </button>
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageName } = context.params as { pageName: string };

  const team = await getTeamsByPageName(pageName);
  return { props: { team: team || null } };
};

export default NewMatchPage;
