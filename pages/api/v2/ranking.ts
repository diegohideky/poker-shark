import dataSource from "@db/data-source";
import { Match } from "@entities/Match";
import { MatchPlayer } from "@entities/MatchPlayer";
import { authMiddleware } from "@middleware/authMiddleware";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { teamId, gameId, unit } = req.query as {
    teamId: string;
    gameId: string;
    unit: "week" | "month" | "year";
    amount: string; // numeric string
  };

  const repository = dataSource.getRepository(Match);
  const matchPlayerRepository = dataSource.getRepository(MatchPlayer);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  if (!teamId || !gameId) {
    return res.status(400).json({
      message: "TeamId and gameId are required parameters.",
    });
  }

  let startDate = null;
  let endDate = null;

  if (unit) {
    startDate = dayjs().startOf(unit).toDate();
    endDate = dayjs().endOf(unit).toDate();
  }

  const lastMatchQuery = repository
    .createQueryBuilder("match")
    .where("match.teamId = :teamId", { teamId })
    .andWhere("match.gameId = :gameId", { gameId });

  if (startDate && endDate) {
    lastMatchQuery.andWhere("match.datetime BETWEEN :startDate AND :endDate", {
      startDate,
      endDate,
    });
  }

  const lastMatch = await lastMatchQuery
    .orderBy("match.datetime", "DESC")
    .limit(1)
    .getOne();

  if (!lastMatch) {
    return res
      .status(404)
      .json({ message: "Last match not found or has no players." });
  }

  const penultimateMatchQuery = repository
    .createQueryBuilder("match")
    .where("match.teamId = :teamId", { teamId })
    .andWhere("match.gameId = :gameId", { gameId });

  if (startDate) {
    penultimateMatchQuery.andWhere("match.datetime >= :startDate", {
      startDate,
    });
  }

  penultimateMatchQuery.andWhere("match.datetime < :endDate", {
    endDate: lastMatch.datetime,
  });

  const penultimateMatch = await penultimateMatchQuery
    .orderBy("match.datetime", "DESC")
    .limit(1)
    .getOne();

  if (!penultimateMatch) {
    return res
      .status(404)
      .json({ message: "Penultimate match not found or has no players." });
  }

  const currentRankingQuery = await matchPlayerRepository
    .createQueryBuilder("mp")
    .innerJoin("mp.match", "m")
    .innerJoin("m.game", "g")
    .innerJoin("mp.user", "u")
    .where("m.teamId = :teamId", { teamId })
    .andWhere("m.gameId = :gameId", { gameId });

  if (startDate) {
    currentRankingQuery.andWhere("m.datetime >= :startDate", { startDate });
  }

  const currentRanking = await currentRankingQuery
    .andWhere("m.datetime <= :endDate", { endDate: lastMatch.datetime })
    .select([
      'u.id AS "userId"',
      "MAX(u.name) AS name",
      "SUM(mp.score) AS score",
      "COUNT(mp.id) AS matches",
    ])
    .groupBy("u.id")
    .orderBy("score", "DESC")
    .getRawMany();

  const previousRankingQuery = await matchPlayerRepository
    .createQueryBuilder("mp")
    .innerJoin("mp.match", "m")
    .innerJoin("m.game", "g")
    .innerJoin("mp.user", "u")
    .where("m.teamId = :teamId", { teamId })
    .andWhere("m.gameId = :gameId", { gameId });

  if (startDate) {
    previousRankingQuery.andWhere("m.datetime >= :startDate", { startDate });
  }

  const previousRanking = await previousRankingQuery
    .andWhere("m.datetime <= :endDate", {
      endDate: penultimateMatch.datetime,
    })
    .select([
      'u.id AS "userId"',
      "MAX(u.name) AS name",
      "SUM(mp.score) AS score",
      "COUNT(mp.id) AS matches",
    ])
    .groupBy("u.id")
    .orderBy("score", "DESC")
    .getRawMany();

  const ranking = currentRanking.map((current, index) => {
    const previousIndex = previousRanking.findIndex(
      (prev) => prev.userId === current.userId
    );

    const previous =
      previousIndex === -1 ? { score: 0 } : previousRanking[previousIndex];

    const score = Number(current.score);
    const lastScore = Number(previous.score);
    const scoreDiff = score - lastScore;

    const positionDiff = Math.abs(previousIndex + 1 - (index + 1)); // (Logic for position diff would need extra steps.)
    let status = "same";
    if (previousIndex === -1) {
      status = "same";
    } else if (previousIndex > index) {
      status = "up";
    } else if (previousIndex < index) {
      status = "down";
    } else {
      status = "same";
    }

    return {
      name: current.name,
      score: score / 100,
      formattedScore: score / 100, // Formats as R$ 1.614,00
      matches: Number(current.matches),
      position: index + 1,
      coins: Math.round((score / 100) * 400), // Example logic for coins
      positionDiff,
      status,
      lastScore: lastScore / 100,
      lastFormattedScore: lastScore / 100,
      lastPosition: null, // Placeholder for previous position logic
      lastScoreDiff: scoreDiff / 100,
      lastCoins: Math.round((lastScore / 100) * 400),
    };
  });

  return res.status(200).json({ ranking });
}

export default dbMiddleware(authMiddleware(handler));
