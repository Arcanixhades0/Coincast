import Layout from "@/components/Layout";
import TradingViewWidget from "@/components/TradingViewWidget";
import MagicBento, { ParticleCard } from "@/components/MagicBento";
import ShinyText from "@/components/ShinyText";

const Markets = () => {
  const cryptoData = [
    {
      symbol: "COINBASE:BTCUSD|1D",
      glowColor: "255, 255, 255"
    },
    {
      symbol: "FOREXCOM:ETHUSD|1D",
      glowColor: "255, 255, 255"
    },
    {
      symbol: "TRADENATION:SOLANA|1D",
      glowColor: "255, 255, 255"
    },
    {
      symbol: "COINBASE:XRPUSD|1D",
      glowColor: "255, 255, 255"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen px-4 py-16">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight">
              <ShinyText text="Live Markets" disabled={false} speed={3} />
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time cryptocurrency charts and market data
            </p>
          </div>

          {/* TradingView Widgets with MagicBento Effects */}
          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={400}
            particleCount={8}
            glowColor="255, 255, 255"
          >
            {cryptoData.map((crypto, index) => (
              <ParticleCard
                key={crypto.symbol}
                className="card card--border-glow"
                style={{
                  backgroundColor: "#0F0F0F",
                  "--glow-color": crypto.glowColor,
                } as React.CSSProperties}
                particleCount={6}
                glowColor={crypto.glowColor}
                enableTilt={true}
                clickEffect={true}
                enableMagnetism={true}
              >
                <div className="card__content h-full w-full">
                  <TradingViewWidget 
                    symbol={crypto.symbol} 
                    height="100%" 
                  />
                </div>
              </ParticleCard>
            ))}
          </MagicBento>
        </div>
      </div>
    </Layout>
  );
};

export default Markets;