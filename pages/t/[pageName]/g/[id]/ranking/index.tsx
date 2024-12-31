// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import CountUp from "react-countup";
import { useRouter } from "next/router";
import { FaRankingStar } from "react-icons/fa6";
import { FaMoneyBillAlt } from "react-icons/fa";
import { BsArrowUpCircleFill, BsArrowDownCircleFill } from "react-icons/bs";
import { HiMinusCircle } from "react-icons/hi2";
import Head from "next/head";
import RankingBadge from "components/rankingBadge";
import AdSense from "components/AdSense";
import { formatMoney } from "libs/format";
import { getRanking } from "@services/ranking";
import { GetServerSideProps } from "next";
import { getTeamsByPageName } from "@services/teams";
import LoadingOverlay from "@components/LoadingOverlay";
import { getGameById } from "@services/games";
import Typography from "@components/Typography";
import { getTextColor } from "@libs/utils";

const titulo = "Poker Shark";
const descricao = "O poker mais sanguinário do Grand Splendor";
const imagemPrincipal = "/poker-shark-bg.jpeg";
const domain = "poker-shark.vercel.app";
const addsId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

const unitOptions = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year", value: "year" },
];

export default function Home({ team }): React.FC<TeamProps> {
  const router = useRouter();
  const { id: queryGameId } = router.query;
  const [ranking, setRanking] = useState([]);
  const [caixinha, setCaixinha] = useState(0);
  const [filteredRanking, setFilteredRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<string>("week");
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);

      try {
        const data = await getRanking({
          teamId: team.id,
          gameId: queryGameId,
          unit: selectedUnit,
        });

        setRanking(data.ranking);
        setFilteredRanking(data.ranking);
        setCaixinha(data.caixinha || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [selectedUnit]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await getGameById(queryGameId);
        setGame(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (queryGameId) {
      fetchGame();
    }
  }, [queryGameId]);

  const onSearch = (event) => {
    const { value } = event.target;

    if (!value) return setFilteredRanking(ranking);

    const filtered = ranking.filter((item) =>
      item.name.toLowerCase().includes(value.trim().toLowerCase())
    );

    setFilteredRanking(filtered);
  };

  const goToPage = () => {
    window.open(
      "https://wolfmaya.com.br/curso-profissionalizante-de-atores-2024-2-presencial/?gad_source=1&gclid=Cj0KCQjw9vqyBhCKARIsAIIcLMGBHYJTDZomEugStk8Q23OwDfGbfA7Z50dRmi2dtyxj6ZzYwMYL8hgaAmp_EALw_wcB",
      "_blank"
    );
  };

  const MoneyCountUp = ({ moneyValue }) => {
    const countUpRef = useRef(null);
    const [startCounting, setStartCounting] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setStartCounting(true);
            observer.disconnect(); // Stop observing after it has started counting
          }
        },
        { threshold: 0.1 } // Adjust the threshold as needed
      );

      if (countUpRef.current) {
        observer.observe(countUpRef.current);
      }

      return () => {
        if (countUpRef.current) {
          observer.unobserve(countUpRef.current);
        }
      };
    }, []);

    return (
      <h1
        ref={countUpRef}
        className={`flex flex-row gap-2 items-center text-1xl md:text-2xl font-bold ${getTextColor(
          moneyValue
        )}`}
      >
        {startCounting && (
          <CountUp
            start={0}
            end={moneyValue}
            formattingFn={(value) => formatMoney(value)}
            decimals={2}
          />
        )}
      </h1>
    );
  };

  return (
    <div>
      <Head>
        <title>{titulo}</title>
        <meta name="description" content={descricao} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={titulo} />
        <meta property="og:description" content={descricao} />
        <meta
          property="og:image"
          content={`https://${domain}/${imagemPrincipal}`}
        />
        <meta property="og:url" content={`https://${domain}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={titulo} />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:title" content={titulo} />
        <meta name="twitter:description" content={descricao} />
        <meta
          name="twitter:image"
          content={`https://${domain}/${imagemPrincipal}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@loja-por-do-sol" />
        <meta name="twitter:creator" content="@loja-por-do-sol" />

        <meta itemProp="name" content={titulo} />
        <meta itemProp="description" content={descricao} />
        <meta
          itemProp="image"
          content={`https://${domain}/${imagemPrincipal}`}
        />
        <meta name="google-adsense-account" content={addsId} />
        <AdSense pId={addsId} />
      </Head>

      <main className="p-5 md:p-10">
        <section className="flex flex-col items-center justify-center py-3 text-white">
          <Typography variant="title" className="text-white">
            {game?.nickname}
          </Typography>
          <h1 className="text-3xl md:text-2xl font-italic">{}</h1>
          <span className="italic">{game?.type}</span>
        </section>

        <section className="flex flex-row items-center justify-center py-5">
          {unitOptions.map((option) => (
            <button
              key={option.value}
              className={`flex flex-row items-center justify-center gap-2 p-2 md:p-2 w-full bg-blue-500 hover:bg-blue-600 ${
                selectedUnit === option.value ? "bg-blue-600" : ""
              }`}
              onClick={() => setSelectedUnit(option.value)}
            >
              <span className="text-1xl md:text-2xl font-bold text-white">
                {option.label}
              </span>
            </button>
          ))}
        </section>

        <section>
          <div className="flex flex-row items-center justify-center w-full">
            <input
              className="w-full md:w-[350px] h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
              type="text"
              placeholder="Search player..."
              onChange={onSearch}
            />
          </div>
        </section>

        <section>
          <div className="flex flex-row items-center justify-center gap-2 p-2 md:p-2 w-full">
            <span className="text-1xl md:text-2xl font-bold text-white">
              Caixinha:
            </span>{" "}
            <MoneyCountUp moneyValue={caixinha} />
          </div>
        </section>

        <LoadingOverlay isLoading={loading} />

        <section className="flex flex-row items-center justify-center p-5">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-8">
              {filteredRanking.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center gap-5 w-full"
                >
                  <div className="flex flex-row items-center justify-center gap-4 relative">
                    <img
                      className="w-40 h-40 relative md:ml-5 rounded-full"
                      src={`${
                        process.env.NEXT_PUBLIC_API_URL ||
                        "http://localhost:3000/api"
                      }/files/${item?.photoUrl || "user-picture-default.avif"}`}
                      alt="Poker Shark"
                    />
                    <RankingBadge
                      position={item.position}
                      className="absolute bottom-0 left-0"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-2">
                      {item.status === "up" && (
                        <>
                          <BsArrowUpCircleFill color="#22c55e" />
                          <h4 className="text-[#22c55e]">
                            {item.positionDiff}
                          </h4>
                        </>
                      )}
                      {item.status === "down" && (
                        <>
                          <BsArrowDownCircleFill color="#ef4444" />
                          <h4 className="text-[#ef4444]">
                            {item.positionDiff}
                          </h4>
                        </>
                      )}
                      {item.status === "same" && (
                        <HiMinusCircle color="#ffffff" />
                      )}
                      <h1 className="text-1xl md:text-2xl font-bold text-white">
                        {item.name}
                      </h1>
                    </div>
                    <MoneyCountUp moneyValue={item.score} />
                    <div className="mt-4 p-2 border-[1px] rounded border-white w-[120px]">
                      <div className="flex flex-col text-white">
                        <small className="flex fle-row gap-2 items-center">
                          {/* <FaCoins /> */}
                          {item.lastFormattedScore}
                        </small>
                        <small className="flex fle-row gap-2 items-center">
                          <FaRankingStar /> {item.lastPosition}º
                        </small>
                        <small
                          className={`flex fle-row gap-2 items-center ${getTextColor(
                            item.lastScoreDiff
                          )}`}
                        >
                          <FaMoneyBillAlt />
                          {item.lastScoreDiff}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

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
