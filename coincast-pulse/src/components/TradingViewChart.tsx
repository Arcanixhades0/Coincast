import { useEffect, useRef } from "react";

type TradingViewChartProps = {
  heightVh?: number;
};

const TradingViewChart = ({ heightVh = 70 }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous widget
    containerRef.current.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    widgetContainer.style.height = "calc(100% - 32px)";
    widgetContainer.style.width = "100%";

    const copyright = document.createElement("div");
    copyright.className = "tradingview-widget-copyright";
    const link = document.createElement("a");
    link.href = "https://www.tradingview.com/symbols/BINANCE-BTCUSD/?exchange=BINANCE";
    link.rel = "noopener nofollow";
    link.target = "_blank";
    const span = document.createElement("span");
    span.className = "blue-text";
    span.textContent = "BTCUSD chart by TradingView";
    link.appendChild(span);
    copyright.appendChild(link);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    const config = {
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: "D",
      locale: "en",
      save_image: true,
      style: "1",
      symbol: "BINANCE:BTCUSD",
      theme: "dark",
      timezone: "Etc/UTC",
      backgroundColor: "#0F0F0F",
      gridColor: "rgba(242, 242, 242, 0.06)",
      watchlist: [],
      withdateranges: false,
      compareSymbols: [
        { symbol: "TRADENATION:SOLANA", position: "SameScale" },
        { symbol: "FOREXCOM:ETHUSD", position: "SameScale" },
        { symbol: "BITSTAMP:XRPUSD", position: "SameScale" },
      ],
      studies: [],
      autosize: false,
      height: heightVh * 10,
    } as const;
    script.innerHTML = JSON.stringify(config);

    containerRef.current.appendChild(widgetContainer);
    containerRef.current.appendChild(copyright);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ height: `${heightVh}vh`, width: "100%" }}
    />
  );
};

export default TradingViewChart;


