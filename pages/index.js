import { useEffect, useState } from "react";
import Script from "next/script";
import { BsArrowUpCircleFill, BsArrowDownCircleFill } from "react-icons/bs";
import { HiMinusCircle } from "react-icons/hi2";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import RankingBadge from "../components/rankingBadge";
import { PLAYERS } from "../libs/items";

const titulo = "Poker Shark";
const descricao = "O poker mais sanguinário do Grand Splendor";
const imagemPrincipal = "/poker-shark-bg.jpeg";
const domain = "poker-shark.vercel.app";
const addsId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

export default function Home() {
  const [ranking, setRanking] = useState([]);
  const [filteredRanking, setFilteredRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/ranking")
      .then((res) => res.json())
      .then((data) => {
        setRanking(data);
        setFilteredRanking(data);
      })
      .catch((err) => console.log({ err }))
      .finally(() => setLoading(false));
  }, []);

  const getTextColor = (number) => {
    if (number > 0) {
      return "text-green-500";
    } else if (number < 0) {
      return "text-red-500";
    }

    return "text-white";
  };

  const onSearch = (event) => {
    const { value } = event.target;

    if (!value) return setFilteredRanking(ranking);

    const filtered = ranking.filter((item) =>
      item.name.toLowerCase().includes(value.trim().toLowerCase())
    );

    setFilteredRanking(filtered);
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
        {/* <script async src={addsId} crossorigin="anonymous"></script> */}
        <Script
          async
          src={addsId}
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
        {/* <script
          async
          src="https://fundingchoicesmessages.google.com/i/pub-7385654632311141?ers=1"
          nonce="cn-c7BvDYD7vna5ZCo66zg"
        ></script> */}

        <Script
          async
          src="https://fundingchoicesmessages.google.com/i/pub-7385654632311141?ers=1"
          strategy="afterInteractive"
          nonce="cn-c7BvDYD7vna5ZCo66zg"
        />

        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                  function signalGooglefcPresent() {
                      if (!window.frames['googlefcPresent']) {
                          if (document.body) {
                              const iframe = document.createElement('iframe');
                              iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
                              iframe.style.display = 'none';
                              iframe.name = 'googlefcPresent';
                              document.body.appendChild(iframe);
                          } else {
                              setTimeout(signalGooglefcPresent, 0);
                          }
                      }
                  }
                  signalGooglefcPresent();
              })();
          `,
          }}
        />
      </Head>

      <main>
        <section
          className={`${styles.bannerWrap} flex flex-col justify-evenly h-[500px] p-4`}
        >
          <div className={`${styles.bannerLogo}`} />
          <div
            className={`${styles.bannerContent} ${styles.title} flex items-center justify-center`}
          >
            Poker Shark
          </div>
        </section>

        <section>
          {/* add an input search using tailwind */}
          <div className="flex flex-row items-center justify-center p-5 md:p-10 w-full">
            <input
              className="w-full md:w-[350px] h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
              type="text"
              placeholder="Digite o nome do caga tronco"
              onChange={onSearch}
            />
          </div>
        </section>

        {loading ? (
          <section className="flex flex-row items-center justify-center p-10 md: p-20">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </section>
        ) : (
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
                        className="w-40 h-40 relative md:ml-5"
                        src={
                          PLAYERS[item.name]
                            ? PLAYERS[item.name].image
                            : "/players/Default.png"
                        }
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
                      <h1
                        className={`text-1xl md:text-2xl font-bold ${getTextColor(
                          item.score
                        )}`}
                      >
                        {item.formattedScore}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
