import { useState, useEffect } from "react";
import Head from "next/head";
import { FiPause, FiPlay } from "react-icons/fi";
import { FaArrowRotateRight } from "react-icons/fa6";
import { GrConfigure } from "react-icons/gr";
import { FaRegClock } from "react-icons/fa6";
import { BLINDS } from "../../libs/items";
import styles from "../../styles/Home.module.css";

const titulo = "Poker Shark's Clock";
const descricao =
  "Configure seus blinds para o seu torneio e comece a chacina NHAC!!!";
const imagemPrincipal = "/poker-shark-bg.jpeg";
const domain = "poker-shark.vercel.app";

const TimerBox = ({ value, label, bgColor = "bg-orange-700" }) => {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex justify-center items-center border border-white rounded-md sm:p-6 p-4 ${bgColor} transition ease-in-out bg-opacity-50 w-[70px] sm:w-[150px] sm:w-[200px] md:w-[200px] h-[70px] sm:h-[150px] md:h-[200px]`}
      >
        <div
          suppressHydrationWarning
          className="w-full flex items-center justify-center text-3xl sm:text-5xl md:text-8xl font-semibold text-white"
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
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [blinds, setBlinds] = useState([...BLINDS]);
  const [currentBlindIndex, setCurrentBlindIndex] = useState(0);
  const [hasPaused, setHasPaused] = useState(false);

  const playClock = (remainingMinutes, remainingSeconds) => {
    setHasStarted(true);
    setHasPaused(false);

    let totalTimeSeconds;

    if (remainingMinutes || remainingSeconds) {
      totalTimeSeconds = remainingMinutes * 60 + remainingSeconds;
      setTimerMinutes(remainingMinutes);
      setTimerSeconds(remainingSeconds);
    } else {
      totalTimeSeconds = blinds[currentBlindIndex].duration * 60;
      const minutes = Math.floor(totalTimeSeconds / 60);
      const seconds = totalTimeSeconds % 60;

      setTimerMinutes(minutes);
      setTimerSeconds(seconds);
    }

    const id = setInterval(() => {
      if (totalTimeSeconds > 0) {
        totalTimeSeconds -= 1;
      } else {
        totalTimeSeconds = blinds[currentBlindIndex].duration * 60;
        setCurrentBlindIndex((prev) => prev + 1);
      }

      const minutes = Math.floor(totalTimeSeconds / 60);
      const seconds = totalTimeSeconds % 60;

      setTimerMinutes(minutes);
      setTimerSeconds(seconds);
    }, 1000);

    setIntervalId(id);
  };

  const handleStart = () => {
    if (
      blinds.some(
        (blind) => blind.smallError || blind.bigError || blind.durationError
      )
    ) {
      alert("Preencha todos os campos");
      return;
    }

    playClock();
  };

  const handleConfigure = () => {
    setTimerMinutes(0);
    setTimerSeconds(0);
    setCurrentBlindIndex(0);
    clearInterval(intervalId);
    setHasStarted(false);
  };

  const handleRestart = () => {
    setTimerMinutes(0);
    setTimerSeconds(0);
    setCurrentBlindIndex(0);
    clearInterval(intervalId);
    setHasStarted(false);
    clearInterval(intervalId);
    setCurrentBlindIndex(0);
    playClock();
  };

  const handlePause = () => {
    clearInterval(intervalId);
    setHasPaused(true);
  };

  const handleUnpause = () => {
    playClock(timerMinutes, timerSeconds);
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
    const totalSeconds = blinds[currentBlindIndex].duration * 60;
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
    const totalSeconds = blinds[currentBlindIndex].duration * 60;
    // if thats 10 percent of less then return bg-red
    if (timerMinutes === 0 && timerSeconds <= totalSeconds * 0.1) {
      return "text-red-500";
    } else if (timerMinutes === 0 && timerSeconds <= totalSeconds * 0.2) {
      return "text-amber";
    } else {
      return "text-green-500";
    }
  };

  const onChange = (value, field, index) => {
    blinds[index][field] = value;

    if (!+value) {
      blinds[index][`${field}Error`] = "Preencha este campo";
    } else {
      blinds[index][`${field}Error`] = null;
    }

    setBlinds([...blinds]);
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
            Poker Shark's Clock
          </div>
        </section>
        <section>
          {!hasStarted && (
            <div className="flex flex-col items-center justify-center p-5 md:p-10 w-full gap-2">
              <div className="flex flex-row justify-center items-center gap-2 text-white">
                <span className="w-full md:w-[50px]">Level</span>
                <span className="w-full md:w-[150px]">Small</span>
                <span className="w-full md:w-[150px]">Big</span>
                <span className="w-full md:w-[150px]">Duration (min)</span>
              </div>
              {blinds.map((blind, index) => (
                <div className="flex flex-row gap-2 items-center" key={index}>
                  <span className="w-full md:w-[50px] text-white">
                    {index + 1} -{" "}
                  </span>
                  <input
                    className={`${
                      blind.smallError ? "border-red-500 border-[3px]" : ""
                    } w-full md:w-[150px] h-10 px-3 border rounded-lg`}
                    type="number"
                    placeholder="Small"
                    value={blind.small}
                    onChange={(e) => onChange(e.target.value, "small", index)}
                  />
                  <input
                    className={`${
                      blind.bigError ? "border-red-500 border-[3px]" : ""
                    } w-full md:w-[150px] h-10 px-3 border rounded-lg`}
                    type="number"
                    placeholder="Big"
                    value={blind.big}
                    onChange={(e) => onChange(e.target.value, "big", index)}
                  />
                  <input
                    className={`${
                      blind.durationError ? "border-red-500 border-[3px]" : ""
                    } w-full md:w-[150px] h-10 px-3 border rounded-lg`}
                    type="number"
                    placeholder="Duration"
                    value={blind.duration}
                    onChange={(e) =>
                      onChange(e.target.value, "duration", index)
                    }
                  />
                </div>
              ))}
              <button
                className="flex flex-row items-center gap-2 min-w-[110px] mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handleStart}
              >
                <FaRegClock />
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
              <div className="flex justify-items-center items-center mt-6 gap-10 py-10">
                <div className="flex flex-col justify-center items-center">
                  <span
                    className={`text-2xl md:text-[70px] font-bold transition ease-in-out ${getTextColor(
                      timerMinutes,
                      timerSeconds
                    )}`}
                  >
                    {blinds[currentBlindIndex].small} /{" "}
                    {blinds[currentBlindIndex].big}
                  </span>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <button
                  className="flex flex-row items-center transition ease-in-out gap-2 min-w-[110px] mt-7 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 hover:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  onClick={handleConfigure}
                >
                  <GrConfigure />
                  Configurar
                </button>

                {!hasPaused ? (
                  <button
                    className="flex flex-row items-center transition ease-in-out gap-2 min-w-[110px] mt-7 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 hover:outline-none"
                    onClick={handlePause}
                  >
                    <FiPause />
                    Pausar
                  </button>
                ) : (
                  <button
                    className="flex flex-row items-center transition ease-in-out gap-2 min-w-[110px] mt-7 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 hover:outline-none"
                    onClick={handleUnpause}
                  >
                    <FiPlay />
                    Continuar
                  </button>
                )}
                <button
                  className="flex flex-row items-center transition ease-in-out gap-2 min-w-[110px] mt-7 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 hover:outline-none"
                  onClick={handleRestart}
                >
                  <FaArrowRotateRight />
                  Recomeçar
                </button>
              </div>
            </div>
          )}
        </section>
        <section className="flex flex-row items-center justify-center p-10 md:p-20"></section>
      </main>
    </div>
  );
}
