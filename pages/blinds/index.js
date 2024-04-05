import { useState, useEffect } from "react";
import { BsArrowUpCircleFill, BsArrowDownCircleFill } from "react-icons/bs";
import { HiMinusCircle } from "react-icons/hi2";
import Head from "next/head";
import styles from "../../styles/Home.module.css";

const titulo = "Poker Shark";
const descricao = "O poker mais sanguinário do Grand Splendor";
const imagemPrincipal = "/poker-shark-bg.jpeg";
const domain = "poker-shark.vercel.app";

const TimerBox = ({ value, label, bgColor = "bg-orange-700" }) => {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex justify-center items-center border border-white rounded-md sm:p-6 p-4 ${bgColor} bg-opacity-50 w-[70px] sm:w-[150px]`}
      >
        <div
          suppressHydrationWarning
          className="w-full flex items-center justify-center text-3xl md:text-5xl font-semibold text-white"
        >
          {value}
        </div>
      </div>
      <div className="w-full flex items-center justify-center text-[10px] sm:text-[18px] text-white">
        {label}
      </div>
    </div>
  );
};

export default function Home() {
  const [initialValue, setInitialValue] = useState("");
  const [increaseAmount, setIncreaseAmount] = useState("");
  const [increaseDuration, setIncreaseDuration] = useState("");
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [currentBlind, setCurrentBlind] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    if (initialValue && increaseAmount && increaseDuration) {
      setHasStarted(true);
      let totalTimeSeconds = parseInt(increaseDuration) * 60;

      setCurrentBlind(parseInt(initialValue));

      const minutes = Math.floor(totalTimeSeconds / 60);
      const seconds = totalTimeSeconds % 60;

      setTimerMinutes(minutes);
      setTimerSeconds(seconds);

      const id = setInterval(() => {
        if (totalTimeSeconds > 0) {
          totalTimeSeconds -= 1;
        } else {
          setCurrentBlind((prevBlind) => prevBlind + parseInt(increaseAmount));
          totalTimeSeconds = parseInt(increaseDuration) * 60;
        }

        const minutes = Math.floor(totalTimeSeconds / 60);
        const seconds = totalTimeSeconds % 60;

        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }, 1000);

      setIntervalId(id);
    }
  };

  const handleReset = () => {
    setTimerMinutes(0);
    setTimerSeconds(0);
    setCurrentBlind(0);
    clearInterval(intervalId);
    setHasStarted(false);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  const formatValue = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  const getBgColor = (timerMinutes, timerSeconds) => {
    // check if that's 10 percent of the increaseDuration
    const totalSeconds = parseInt(increaseDuration) * 60;
    // if thats 10 percent of less then return bg-red
    if (timerMinutes === 0 && timerSeconds <= totalSeconds * 0.1) {
      return "bg-red-500";
    } else if (timerMinutes === 0 && timerSeconds <= totalSeconds * 0.2) {
      return "bg-amber";
    } else {
      return "bg-green-700";
    }
  };

  const getTextColor = (timerMinutes, timerSeconds) => {
    // check if that's 10 percent of the increaseDuration
    const totalSeconds = parseInt(increaseDuration) * 60;
    // if thats 10 percent of less then return bg-red
    if (timerMinutes === 0 && timerSeconds <= totalSeconds * 0.1) {
      return "text-red-500";
    } else if (timerMinutes === 0 && timerSeconds <= totalSeconds * 0.2) {
      return "text-amber";
    } else {
      return "text-green-500";
    }
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
          {!hasStarted && (
            <div className="flex flex-col items-center justify-center p-5 md:p-10 w-full">
              <input
                className="w-full md:w-[350px] h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                type="number"
                placeholder="Valor Inicial (Reais)"
                value={initialValue}
                onChange={(e) => setInitialValue(e.target.value)}
              />
              <input
                className="w-full md:w-[350px] h-10 mt-3 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                type="number"
                placeholder="Valor do Aumento (Reais)"
                value={increaseAmount}
                onChange={(e) => setIncreaseAmount(e.target.value)}
              />
              <input
                className="w-full md:w-[350px] h-10 mt-3 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                type="number"
                placeholder="Duração dos Blinds (minutos)"
                value={increaseDuration}
                onChange={(e) => setIncreaseDuration(e.target.value)}
              />
              <button
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handleStart}
              >
                Iniciar
              </button>
            </div>
          )}
          {hasStarted && (
            <div className="flex flex-col items-center justify-center p-5 md:p-10 w-full">
              <div className="flex justify-items-center items-center mt-6 gap-2">
                <TimerBox
                  key={"MINUTOS"}
                  value={formatValue(timerMinutes)}
                  label={"MINUTOS".toUpperCase()}
                  bgColor={getBgColor(timerMinutes, timerSeconds)}
                />
                <TimerBox
                  key={"SEGUNDOS"}
                  value={formatValue(timerSeconds)}
                  label={"SEGUNDOS".toUpperCase()}
                  bgColor={getBgColor(timerMinutes, timerSeconds)}
                />
              </div>
              <div className="flex justify-items-center items-center mt-6 gap-10">
                <div className="flex flex-col justify-center items-center">
                  <span
                    className={`text-1xl md:text-2xl font-bold ${getTextColor(
                      timerMinutes,
                      timerSeconds
                    )}`}
                  >
                    R$ {currentBlind},00
                  </span>
                  <span
                    className={`text-sm font-bold ${getTextColor(
                      timerMinutes,
                      timerSeconds
                    )}`}
                  >
                    Small Blind
                  </span>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <span
                    className={`text-2xl md:text-4xl font-bold ${getTextColor(
                      timerMinutes,
                      timerSeconds
                    )}`}
                  >
                    R$ {currentBlind * 2},00
                  </span>
                  <span
                    className={`text-sm font-bold ${getTextColor(
                      timerMinutes,
                      timerSeconds
                    )}`}
                  >
                    Big Blind
                  </span>
                </div>
              </div>
              <button
                className="mt-7 px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={handleReset}
              >
                Reiniciar
              </button>
            </div>
          )}
        </section>
        <section className="flex flex-row items-center justify-center p-10 md: p-20"></section>
      </main>
    </div>
  );
}
