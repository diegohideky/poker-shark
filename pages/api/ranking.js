import * as googleApi from "../../libs/googleapi";

const formatMoney = (number) => {
  const money = number.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  return money;
};

export default async function handler(req, res) {
  try {
    const values = await googleApi.getSheetData();

    const data = values.reduce((acc, curr) => {
      const [name, score, matches] = curr;
      const rawScore = +score.replace("R$ ", "");

      acc.push({
        name,
        score: rawScore,
        formattedScore: formatMoney(rawScore),
        matches: +matches,
      });

      return acc;
    }, []);

    const ranking = data.sort((a, b) => b.score - a.score);

    res.status(200).json(ranking);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}
