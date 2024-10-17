import { useEffect } from "react";

const AdBanner = ({ dataAdSlot, dataAdFormat, dataFullWidthResponsive }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error({ error });
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8784501639"
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-width-responsive={dataFullWidthResponsive}
    ></ins>
  );
};

export default AdBanner;
