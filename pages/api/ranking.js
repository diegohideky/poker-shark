import * as googleApi from "../../libs/googleapi";

const formatMoney = (number) => {
  const money = number.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  return money;
};

function parseRanking(values) {
  const data = values.reduce((acc, curr) => {
    const [name, score, matches] = curr;
    const rawScore = +score.replace("R$ ", "").replace(",", "");

    if (!+matches) return acc;

    acc.push({
      name,
      score: rawScore,
      formattedScore: formatMoney(rawScore),
      matches: +matches,
    });

    return acc;
  }, []);

  const ranking = data.sort((a, b) => b.score - a.score);

  return ranking;
}

export default async function handler(req, res) {
  try {
    const currentValues = await googleApi.getSheetData(
      process.env.CURRENT_RANKING_RANGE
    );
    const lastValues = await googleApi.getSheetData(
      process.env.PREVIOUS_RANKING_RANGE
    );

    const currentRanking = parseRanking(currentValues);
    const lastRanking = parseRanking(lastValues);

    currentRanking.forEach((ranking, index) => {
      ranking.position = index + 1;
      const lastRankingIndex = lastRanking.findIndex(
        (item) => item.name === ranking.name
      );
      ranking.coins = (ranking.score + currentRanking[0].matches * 105) * 100;

      ranking.positionDiff = Math.abs(lastRankingIndex + 1 - ranking.position);

      if (lastRankingIndex === -1) {
        ranking.status = "same";
      } else if (lastRankingIndex > index) {
        ranking.status = "up";
      } else if (lastRankingIndex < index) {
        ranking.status = "down";
      } else {
        ranking.status = "same";
      }

      ranking.lastScore =
        lastRankingIndex === -1 ? 0 : lastRanking[lastRankingIndex].score;
      ranking.lastFormattedScore =
        lastRankingIndex === -1
          ? formatMoney(0)
          : lastRanking[lastRankingIndex].formattedScore;
      ranking.lastPosition = lastRankingIndex === -1 ? 0 : lastRankingIndex + 1;
      ranking.lastScoreDiff = ranking.score - ranking.lastScore;
      ranking.lastCoins =
        (ranking.lastScore + lastRanking[0].matches * 105) * 100;
    });

    res.status(200).json(currentRanking);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}
