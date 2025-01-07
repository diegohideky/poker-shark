import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { MatchPlayer } from "@entities/MatchPlayer";
import { Game } from "@entities/Game";
import Typography from "@components/Typography";
import LoadingOverlay from "@components/LoadingOverlay";
import { getGames } from "@services/games";
import { getHistory } from "@services/history";
import { formatScore } from "@libs/format";
import { getTextColor } from "@libs/utils";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip
);

const CareerPage = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [limit] = useState(10);
  const [history, setHistory] = useState<MatchPlayer[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesResponse = await getGames({});
        setGames(gamesResponse.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const params = { teamId: null, gameId, offset: 0, limit };
      const response = await getHistory(params);
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching match history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [gameId]);

  const handleSelectGameId = (id: string) => {
    setGameId(gameId === id ? null : id);
  };

  const chartData = {
    labels: history
      .slice()
      .reverse()
      .map((match) => dayjs(match.match.datetime).format("DD/MM/YY")),
    datasets: [
      {
        label: "Score Over Time",
        data: history
          .slice()
          .reverse()
          .map((match) => match.score / 100),
        borderColor: "rgb(34, 197, 94, 0.2)",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        fill: true,
        tension: 0.0,
      },
    ],
  };

  return (
    <div className="p-6 text-white">
      <LoadingOverlay isLoading={isLoading} />
      <Typography variant="title" className="mb-4 text-white">
        Career
      </Typography>

      <section className="flex flex-row items-center justify-center py-5">
        {games.map((game) => (
          <button
            key={game.id}
            className={`flex flex-row items-center justify-center gap-2 p-2 md:p-2 w-full bg-blue-500 hover:bg-blue-600 ${
              gameId === game.id ? "bg-blue-600" : ""
            }`}
            onClick={() => handleSelectGameId(game.id)}
          >
            <span className="text-1xl md:text-2xl font-bold text-white">
              {game.nickname} {game.type.split("")[0]}
            </span>
          </button>
        ))}
      </section>

      <div className="mb-6">
        {history.length > 0 ? (
          <div className="bg-gray-800 p-4 rounded-lg">
            <Line data={chartData} />
          </div>
        ) : (
          <p className="text-gray-400">
            No data available for the selected filters.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {history.map((matchPlayer) => (
          <div
            key={matchPlayer.matchId}
            className="flex flex-row justify-between bg-gray-800 rounded-md hover:bg-gray-700 p-4 gap-2"
          >
            <div className="flex items-center gap-2">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
                }/files/${
                  matchPlayer.match.team.photoUrl || "shield-default.jpeg"
                }`}
                alt={`${matchPlayer.match.team.name} logo`}
                className="w-6 h-6 rounded-full border-2"
              />
              <span className="text-xs">{matchPlayer.match.team.name}</span>
            </div>
            <div>{dayjs(matchPlayer.match.datetime).format("DD/MM/YYYY")}</div>
            <div>
              {matchPlayer.match.game.nickname} -{" "}
              {matchPlayer.match.game.type.split("")[0]}
            </div>
            <div className={getTextColor(matchPlayer.score)}>
              {formatScore(matchPlayer.score)}
            </div>
            <div>{matchPlayer.position}º</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerPage;
