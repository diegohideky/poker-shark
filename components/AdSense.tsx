import Script from "next/script";

const AdSense = ({ pId }) => {
  console.log("entrei: ", pId);
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};

export default AdSense;
