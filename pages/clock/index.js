import { useState, useEffect } from "react";
import Head from "next/head";
import { FiPause, FiPlay } from "react-icons/fi";
import { FaArrowRotateRight, FaTrash } from "react-icons/fa6";
import { GrCaretNext, GrCaretPrevious, GrConfigure } from "react-icons/gr";
import { FaRegClock } from "react-icons/fa6";
import { LuMegaphone, LuMegaphoneOff } from "react-icons/lu";
import { IoIosAdd } from "react-icons/io";
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
        className={`flex justify-center items-center border border-white rounded-md sm:p-6 p-4 ${bgColor} transition ease-in-out bg-opacity-50 w-[150px] sm:w-[150px] sm:w-[200px] md:w-[200px] h-[150px] sm:h-[150px] md:h-[200px]`}
      >
        <div
          suppressHydrationWarning
          className="w-full flex items-center justify-center text-7xl sm:text-7xl md:text-8xl font-semibold text-white"
        >
          {value}
        </div>
      </div>
      <div className="w-full flex items-center justify-center text-[15px] sm:text-[18px] text-white">
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
  const [hasAlarm, setHasAlarm] = useState(false);

  const getCurrentMinAndSeconds = (blind) => {
    const totalTimeSeconds = blind.duration * 60;
    const minutes = Math.floor(totalTimeSeconds / 60);
    const seconds = totalTimeSeconds % 60;
    return { totalTimeSeconds, minutes, seconds };
  };

  const playClock = (remainingMinutes, remainingSeconds) => {
    let totalTimeSeconds;

    if (remainingMinutes || remainingSeconds) {
      totalTimeSeconds = remainingMinutes * 60 + remainingSeconds;
      setTimerMinutes(remainingMinutes);
      setTimerSeconds(remainingSeconds);
    } else {
      const result = getCurrentMinAndSeconds(blinds[currentBlindIndex]);
      totalTimeSeconds = result.totalTimeSeconds;

      setTimerMinutes(result.minutes);
      setTimerSeconds(result.seconds);
    }

    setHasStarted(true);
    setHasPaused(false);

    const id = setInterval(() => {
      if (totalTimeSeconds > 0) {
        totalTimeSeconds -= 1;
      } else {
        totalTimeSeconds = blinds[currentBlindIndex].duration * 60;
        setCurrentBlindIndex((prev) => prev + 1);
      }

      if (hasAlarm && totalTimeSeconds === 10) {
        const audioElement = document.getElementById("myAudio");
        if (audioElement) {
          audioElement.play();
        }
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

  const handleConfigure = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearInterval(intervalId);
    setTimerMinutes(0);
    setTimerSeconds(0);
    setCurrentBlindIndex(0);
    setHasStarted(false);
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearInterval(intervalId);

    setHasPaused(true);
    if (currentBlindIndex > 0) {
      setCurrentBlindIndex((prev) => prev - 1);
      const { minutes, seconds } = getCurrentMinAndSeconds(
        blinds[currentBlindIndex - 1]
      );
      setTimerMinutes(minutes);
      setTimerSeconds(seconds);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearInterval(intervalId);
    setHasPaused(true);
    if (currentBlindIndex < blinds.length - 1) {
      setCurrentBlindIndex((prev) => prev + 1);
      const { minutes, seconds } = getCurrentMinAndSeconds(
        blinds[currentBlindIndex + 1]
      );
      setTimerMinutes(minutes);
      setTimerSeconds(seconds);
    }
  };

  const handleRestart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearInterval(intervalId);
    const { minutes, seconds } = getCurrentMinAndSeconds(
      blinds[currentBlindIndex]
    );
    setTimerMinutes(minutes);
    setTimerSeconds(seconds);
    setHasStarted(false);
    playClock();
  };

  const handlePause = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearInterval(intervalId);
    setHasPaused(true);
  };

  const handleUnpause = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    const totalSeconds = blinds[currentBlindIndex].duration * 60;
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

  const handleRemoveBlind = (index) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newBlinds = blinds.filter((blind, i) => i !== index);
    setBlinds([...newBlinds]);
  };

  const handleAddNewBlind = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBlinds([
      ...blinds,
      {
        small: 0,
        big: 0,
        duration: 0,
        smallError: "Preencha os campos",
        bigError: "Preencha os campos",
        durationError: "Preencha os campos",
      },
    ]);
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
          <audio id="myAudio" src="/alarm.wav" type="audio/wav" />
          {!hasStarted && (
            <div className="flex flex-col items-center justify-center p-5 md:p-10 w-full gap-2">
              <div className="flex flex-row justify-center items-center gap-2 text-white w-full md:max-w-[700px]">
                <span className="w-full md:w-[130px] text-[9px] md:text-sm">
                  Nível
                </span>
                <span className="w-full text-[9px] md:text-sm">Small</span>
                <span className="w-full text-[9px] md:text-sm">Big</span>
                <span className="w-full text-[9px] md:text-sm">
                  Duração (min)
                </span>
                <span className="w-full md:w-[130px] text-[9px] md:text-sm"></span>
              </div>

              {blinds.map((blind, index) => (
                <div
                  className="flex flex-row justify-center items-center gap-2 w-full  md:max-w-[700px]"
                  key={index}
                >
                  <span className="w-full md:w-[130px] text-white">
                    {index + 1} -{" "}
                  </span>
                  <input
                    className={`${
                      blind.smallError ? "border-red-500 border-[3px]" : ""
                    } w-full h-10 px-3 border rounded-lg`}
                    type="number"
                    placeholder="Small"
                    value={blind.small}
                    onChange={(e) => onChange(e.target.value, "small", index)}
                  />
                  <input
                    className={`${
                      blind.bigError ? "border-red-500 border-[3px]" : ""
                    } w-full h-10 px-3 border rounded-lg`}
                    type="number"
                    placeholder="Big"
                    value={blind.big}
                    onChange={(e) => onChange(e.target.value, "big", index)}
                  />
                  <input
                    className={`${
                      blind.durationError ? "border-red-500 border-[3px]" : ""
                    } w-full h-10 px-3 border rounded-lg`}
                    type="number"
                    placeholder="Duration"
                    value={blind.duration}
                    onChange={(e) =>
                      onChange(e.target.value, "duration", index)
                    }
                  />
                  <button
                    className="w-[90px] flex flex-row items-center transition ease-in-out gap-2 p-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-700 hover:outline-none"
                    onClick={handleRemoveBlind(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <div className="mt-3 flex flex-row gap-2 items-center justify-evenly p-2 w-full">
                <button
                  className={`flex flex-row items-center transition ease-in-out p-3 bg-white text-black rounded-full hover:bg-gray-500 hover:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ${
                    !hasAlarm && "opacity-50"
                  }`}
                  onClick={() => setHasAlarm(!hasAlarm)}
                >
                  {hasAlarm ? <LuMegaphone /> : <LuMegaphoneOff />}
                </button>
                <button
                  className="flex flex-row items-center gap-2 min-w-[110px] px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={handleStart}
                >
                  <FaRegClock />
                  Iniciar
                </button>
                <button
                  className={`flex flex-row items-center transition ease-in-out p-3 bg-white text-black rounded-full hover:bg-gray-500 hover:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
                  onClick={handleAddNewBlind}
                >
                  <IoIosAdd />
                </button>
              </div>
            </div>
          )}
          {hasStarted && (
            <div className="flex flex-col items-center justify-center p-5 md:p-20 w-full">
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
              <div className="flex justify-items-center items-center mt-6 gap-10 py-2 md:py-10">
                <div className="flex flex-col justify-center items-center">
                  <span
                    className={`text-4xl md:text-[70px] font-bold transition ease-in-out ${getTextColor(
                      timerMinutes,
                      timerSeconds
                    )}`}
                  >
                    {blinds[currentBlindIndex].small} /{" "}
                    {blinds[currentBlindIndex].big}
                  </span>
                </div>
              </div>
              <div className="flex flex-row gap-2 mt-7">
                <button
                  className={`flex flex-row items-center transition ease-in-out p-6 bg-white text-black rounded-full hover:bg-gray-500 hover:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ${
                    currentBlindIndex === 0 && "opacity-50"
                  }`}
                  onClick={handlePrevious}
                  disabled={currentBlindIndex === 0}
                >
                  <GrCaretPrevious />
                </button>

                {!hasPaused ? (
                  <button
                    className="flex flex-row items-center transition ease-in-out gap-2 p-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-700 hover:outline-none"
                    onClick={handlePause}
                  >
                    <FiPause />
                  </button>
                ) : (
                  <button
                    className="flex flex-row items-center transition ease-in-out gap-2 p-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-700 hover:outline-none"
                    onClick={handleUnpause}
                  >
                    <FiPlay />
                  </button>
                )}

                <button
                  className={`flex flex-row items-center transition ease-in-out gap-2 p-6 bg-white text-black rounded-full hover:bg-gray-500 hover:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ${
                    currentBlindIndex === blinds.length - 1 && "opacity-50"
                  }`}
                  onClick={handleNext}
                  disabled={currentBlindIndex === blinds.length - 1}
                >
                  <GrCaretNext />
                </button>
              </div>
              <div className="flex flex-row gap-2 mt-7">
                <button
                  className="flex flex-row items-center transition ease-in-out gap-2  p-4 bg-white text-black rounded-full hover:bg-gray-500 hover:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  onClick={handleConfigure}
                >
                  <GrConfigure />
                </button>

                <button
                  className={`flex flex-row items-center transition ease-in-out p-4 bg-white text-black rounded-full hover:bg-gray-500 hover:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ${
                    !hasAlarm && "opacity-50"
                  }`}
                  onClick={() => setHasAlarm(!hasAlarm)}
                >
                  {hasAlarm ? <LuMegaphone /> : <LuMegaphoneOff />}
                </button>

                <button
                  className="flex flex-row items-center transition ease-in-out gap-2 p-4 bg-white text-black rounded-full hover:bg-gray-500 hover:outline-none"
                  onClick={handleRestart}
                >
                  <FaArrowRotateRight />
                </button>
              </div>
              <div className="flex flex-col gap-2 mt-8 border border-white p-4 rounded-lg transition ease-in-out duration-300">
                <span className="text-white">
                  Nível: {currentBlindIndex + 1}
                </span>
                <span className="text-white">
                  Duração: {blinds[currentBlindIndex].duration} minutos
                </span>
                <span className="text-white">
                  Próximo: {blinds[currentBlindIndex + 1]?.small || "-"} /{" "}
                  {blinds[currentBlindIndex + 1]?.big || "-"}
                </span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
