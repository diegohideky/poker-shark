// pages/t/[pageName]/new-match.tsx
import { GetServerSideProps } from "next";
import { getTeamsByPageName } from "@services/teams";
import { getGames } from "@services/games"; // Import your getGames function
import { createMatch } from "@services/matches"; // Import your createMatch function
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod"; // Import Zod
import { toast } from "react-toastify"; // Import a notification library if desired
import { GameTypes } from "@entities/Game";

// Define Zod schema for validation
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
  const [total, setTotal] = useState<number>(0);
  const [datetime, setDatetime] = useState<Date>(new Date());
  const [name, setName] = useState<string>(
    `Poker Table ${new Date().toISOString().split("T")[0]}`
  );

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { total, data } = await getGames({});
        setGames(data);
        setTotal(total);
        setGameId(data[0].id);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, [team]);

  if (!team) {
    return <div>Team not found</div>;
  }

  const handleGameIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGameId(e.target.value);
  };

  const handleGameTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGameType(e.target.value);
  };

  const handleMatchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Validate form data using Zod
      const validatedData = matchSchema.parse({
        gameId,
        datetime,
        name,
        gameType,
      });

      // Call createMatch function with the validated data
      const result = await createMatch({
        teamId: team.id,
        gameId: validatedData.gameId,
        datetime: validatedData.datetime,
        name: validatedData.name,
      });

      // Redirect or show success message
      toast.success("Match created successfully!");
      navigate.push(`/t/${team.pageName}/m/${result.id}`);
    } catch (error) {
      console.log({ error });
      if (error instanceof z.ZodError) {
        // Handle validation errors
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        // Handle other errors
        console.error("Error creating match:", error);
        toast.error("Failed to create match. Please try again.");
      }
    }
  };

  return (
    <>
      <Head>
        <title>{team.name} - New Match</title>
        <meta name="description" content={`New Match for ${team.name}`} />
      </Head>

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          Create New Match for {team.name}
        </h1>

        {/* Game Selector */}
        <div className="mb-4">
          <label
            htmlFor="gameId"
            className="block text-sm font-medium text-gray-700"
          >
            Game
          </label>
          <select
            id="gameId"
            value={gameId}
            onChange={handleGameIdChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a game</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>

        {/* Game Type Selector */}
        <div className="mb-4">
          <label
            htmlFor="gameId"
            className="block text-sm font-medium text-gray-700"
          >
            Type
          </label>
          <select
            id="gameType"
            value={gameType}
            onChange={handleGameTypeChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a type</option>
            {gameTypes.map((gameType) => (
              <option key={gameType} value={gameType}>
                {gameType}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label
            htmlFor="datetime"
            className="block text-sm font-medium text-gray-700"
          >
            Match Date
          </label>
          <DatePicker
            selected={datetime}
            onChange={(date: Date) => setDatetime(date)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Match Name Input */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Match Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={handleMatchNameChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Match
        </button>
      </div>
    </>
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

export default NewMatchPage;
