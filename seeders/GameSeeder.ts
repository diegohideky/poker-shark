import "reflect-metadata";
import { DataSource } from "typeorm";
import { Game } from "@entities/Game";

export const GameSeeder = async (dataSource: DataSource) => {
  const gameRepository = dataSource.getRepository(Game);

  const games = [
    { name: "Poker Texas Hold'em No Limit", nickname: "NLH", type: "CASH" },
    {
      name: "Poker Texas Hold'em No Limit",
      nickname: "NLH",
      type: "TOURNAMENT",
    },
    { name: "Poker Pot Limit Omaha", nickname: "PLO", type: "CASH" },
    { name: "Poker Pot Limit Omaha", nickname: "PLO", type: "TOURNAMENT" },
  ];

  for (const game of games) {
    let newGame = null;
    const existingGame = await gameRepository.findOneBy({
      name: game.name,
      nickname: game.nickname,
      type: game.type,
    });

    if (existingGame) {
      // Update existing game
      await gameRepository.save(existingGame);
      console.log(`Updated game: ${existingGame.name}`);
    } else {
      const data = gameRepository.create({
        name: game.name,
        nickname: game.nickname,
        type: game.type,
      });
      newGame = await gameRepository.save(data);
      console.log(`Created game: ${newGame.name}`);
    }
  }
};
