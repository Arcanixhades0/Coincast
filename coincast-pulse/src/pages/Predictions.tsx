import { useState, useEffect } from "react";
import { TrendingUp, ArrowRight, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import TargetCursor from "@/components/TargetCursor";
import TextPressure from "@/components/TextPressure";
import { MLApiService, PredictionResponse } from "@/services/mlApi";

type PredictionStep = "intro" | "coin-selection" | "timeframe-selection" | "results";
type Coin = "Bitcoin" | "Ethereum" | "Solana" | "XRP";
type Timeframe = "1 day" | "1 week" | "1 month" | "3 months";

const Predictions = () => {
  const [currentStep, setCurrentStep] = useState<PredictionStep>("intro");
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);

  const coins: Coin[] = ["Bitcoin", "Ethereum", "Solana", "XRP"];
  const timeframes: Timeframe[] = ["1 day", "1 week", "1 month", "3 months"];

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const health = await MLApiService.getHealth();
      setIsApiConnected(health.models_loaded);
      setApiError(null);
    } catch (error) {
      setIsApiConnected(false);
      setApiError("ML API is not available. Please ensure the backend server is running.");
    }
  };

  const handlePredict = () => {
    setCurrentStep("coin-selection");
  };

  const handleCoinSelect = (coin: Coin) => {
    setSelectedCoin(coin);
    setCurrentStep("timeframe-selection");
  };

  const handleTimeframeSelect = async (timeframe: Timeframe) => {
    setSelectedTimeframe(timeframe);
    setIsPredicting(true);
    setApiError(null);
    
    try {
      // Convert timeframe to API format
      const apiTimeframe = convertTimeframeToApi(timeframe);
      
      // Make prediction
      const result = await MLApiService.predictPrice(apiTimeframe);
      setPredictionResult(result);
      setCurrentStep("results");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Prediction failed");
      setCurrentStep("results");
    } finally {
      setIsPredicting(false);
    }
  };

  const convertTimeframeToApi = (timeframe: Timeframe): string => {
    const conversionMap: Record<Timeframe, string> = {
      "1 day": "1d",
      "1 week": "1w", 
      "1 month": "1m",
      "3 months": "3m",
    };
    return conversionMap[timeframe];
  };

  const resetPrediction = () => {
    setCurrentStep("intro");
    setSelectedCoin(null);
    setSelectedTimeframe(null);
    setIsPredicting(false);
    setPredictionResult(null);
    setApiError(null);
  };

  return (
    <Layout>
      <div className="min-h-screen px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Custom cursor only during interactive steps */}
          {(currentStep === "coin-selection" || currentStep === "timeframe-selection" || currentStep === "results") && (
            <TargetCursor spinDuration={2} hideDefaultCursor={true} />
          )}
          
          {/* API Status Indicator */}
          {isApiConnected !== null && (
            <div className="flex justify-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                isApiConnected 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}>
                {isApiConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    ML API Connected
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    ML API Disconnected
                  </>
                )}
              </div>
            </div>
          )}

          {/* Page Header - Only show on intro step */}
          {currentStep === "intro" && (
            <>
              <div className="text-center space-y-6 animate-fade-in">
                <div style={{position: 'relative', height: '200px'}}>
                  <TextPressure
                    text="The Refraction Chamber"
                    flex={true}
                    alpha={false}
                    stroke={false}
                    width={true}
                    weight={true}
                    italic={true}
                    textColor="#ffffff"
                    strokeColor="#ff0000"
                    minFontSize={48}
                  />
                </div>
              </div>

              {/* Description Text */}
              <div className="text-center space-y-6 animate-fade-in" style={{ fontFamily: 'Figtree', fontWeight: '900' }}>
                <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed max-w-4xl mx-auto drop-shadow-lg">
                  Explore algorithm-based forecasts for leading cryptocurrencies.
                </p>
                <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed max-w-4xl mx-auto drop-shadow-md">
                  Our ML models analyze trends and patterns to suggest potential price movements.
                </p>
                <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-4xl mx-auto drop-shadow-sm">
                  Use insights wisely—predictions are speculative, not financial advice.
                </p>
              </div>
            </>
          )}

          {/* Main Content */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              {currentStep === "intro" && (
                <div className="animate-fade-in grid place-items-center">
                  <button
                    onClick={handlePredict}
                    disabled={!isApiConnected}
                    className={`px-12 py-6 text-xl font-bold text-white cursor-target
                              bg-white/10 backdrop-blur-md border border-white/20 rounded-full
                              hover:bg-white/20 hover:border-white/30 
                              transition-all duration-500 hover:scale-105
                              shadow-2xl shadow-black/25
                              relative overflow-hidden
                              before:absolute before:inset-0 before:rounded-full
                              before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
                              before:translate-x-[-100%] hover:before:translate-x-[100%] 
                              before:transition-transform before:duration-700 before:ease-out
                              ${!isApiConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ fontFamily: 'Figtree', fontWeight: '900' }}
                  >
                    <span className="relative z-10">
                      {isApiConnected ? "Predict" : "ML API Unavailable"}
                    </span>
                  </button>
                </div>
              )}

              {currentStep === "coin-selection" && (
                <div className="space-y-8 animate-fade-in" style={{ fontFamily: 'Figtree', fontWeight: '900' }}>
                  <h2 className="text-3xl font-bold text-white text-center mb-8">
                    Select a Cryptocurrency
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    {coins.map((coin) => (
                      <button
                        key={coin}
                        onClick={() => handleCoinSelect(coin)}
                        className="p-6 text-lg font-semibold text-white cursor-target
                                 bg-white/10 backdrop-blur-md border border-white/20 rounded-full
                                 hover:bg-white/20 hover:border-white/30 
                                 transition-all duration-500 hover:scale-105
                                 shadow-2xl shadow-black/25
                                 relative overflow-hidden
                                 before:absolute before:inset-0 before:rounded-full
                                 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
                                 before:translate-x-[-100%] hover:before:translate-x-[100%] 
                                 before:transition-transform before:duration-700 before:ease-out"
                      >
                        <span className="relative z-10">{coin}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === "timeframe-selection" && (
                <div className="space-y-8 animate-fade-in" style={{ fontFamily: 'Figtree', fontWeight: '900' }}>
                  <h2 className="text-3xl font-bold text-white text-center mb-8">
                    Select Timeframe for {selectedCoin}
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {timeframes.map((timeframe) => (
                      <button
                        key={timeframe}
                        onClick={() => handleTimeframeSelect(timeframe)}
                        className="p-4 text-lg font-semibold text-white cursor-target
                                 bg-white/10 backdrop-blur-md border border-white/20 rounded-full
                                 hover:bg-white/20 hover:border-white/30 
                                 transition-all duration-500 hover:scale-105
                                 shadow-2xl shadow-black/25
                                 relative overflow-hidden
                                 before:absolute before:inset-0 before:rounded-full
                                 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
                                 before:translate-x-[-100%] hover:before:translate-x-[100%] 
                                 before:transition-transform before:duration-700 before:ease-out"
                      >
                        <span className="relative z-10">{timeframe}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isPredicting && (
                <div className="text-center space-y-8 animate-fade-in" style={{ fontFamily: 'Figtree', fontWeight: '900' }}>
                  <div className="flex justify-center">
                    <div className="p-6 rounded-full bg-gradient-primary/20 glow-subtle animate-pulse">
                      <Sparkles className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    Analyzing Market Patterns...
                  </h2>
                  <p className="text-xl text-white/80">
                    Our AI is processing historical data and market indicators
                  </p>
                </div>
              )}

              {currentStep === "results" && (
                <div className="space-y-8 animate-fade-in" style={{ fontFamily: 'Figtree', fontWeight: '900' }}>
                  <h2 className="text-3xl font-bold text-white text-center mb-8">
                    Prediction Results
                  </h2>
                  
                  {apiError ? (
                    <div className="glass rounded-2xl p-8 glow-subtle border border-red-500/30">
                      <div className="text-center space-y-4">
                        <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
                        <h3 className="text-2xl font-bold text-red-400">Prediction Failed</h3>
                        <p className="text-lg text-white/80">{apiError}</p>
                        <button
                          onClick={checkApiHealth}
                          className="px-6 py-3 text-white bg-red-500/20 border border-red-500/30 rounded-full hover:bg-red-500/30 transition-all duration-300"
                        >
                          Retry Connection
                        </button>
                      </div>
                    </div>
                  ) : predictionResult ? (
                    <div className="space-y-6">
                      {/* Predicted Price */}
                      <div className="glass rounded-2xl p-8 glow-subtle">
                        <h3 className="text-2xl font-bold text-white mb-4 text-center">
                          Predicted Price
                        </h3>
                        <div className="text-center">
                          <div className="text-5xl font-bold text-primary mb-2 bg-transparent inline-block">
                            {MLApiService.formatPrice(predictionResult.predicted_price)}
                          </div>
                          <p className="text-lg text-white/80">
                            {selectedCoin} in {selectedTimeframe}
                          </p>
                        </div>
                      </div>

                      {/* Current Price */}
                      <div className="glass rounded-2xl p-8 glow-subtle">
                        <h3 className="text-2xl font-bold text-white mb-4 text-center">
                          Current Price
                        </h3>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-400 mb-2 bg-transparent inline-block">
                            {MLApiService.formatPrice(predictionResult.current_price)}
                          </div>
                          <p className="text-lg text-white/80">
                            Current {selectedCoin} price
                          </p>
                        </div>
                      </div>

                      {/* Confidence Score */}
                      <div className="glass rounded-2xl p-8 glow-subtle">
                        <h3 className="text-2xl font-bold text-white mb-4 text-center">
                          Confidence Score
                        </h3>
                        <div className="text-center">
                          <div className="text-5xl font-bold text-blue-400 mb-2 bg-transparent inline-block">
                            {MLApiService.formatConfidence(predictionResult.confidence)}
                          </div>
                          <p className="text-lg text-white/80">
                            Model confidence level
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="text-center pt-8">
                    <button
                      onClick={resetPrediction}
                      className="px-8 py-4 text-lg font-semibold text-white
                               bg-white/10 backdrop-blur-md border border-white/20 rounded-full
                               hover:bg-white/20 hover:border-white/30 
                               transition-all duration-500 hover:scale-105
                               shadow-2xl shadow-black/25
                               relative overflow-hidden
                               before:absolute before:inset-0 before:rounded-full
                               before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
                               before:translate-x-[-100%] hover:before:translate-x-[100%] 
                               before:transition-transform before:duration-700 before:ease-out"
                    >
                      <span className="relative z-10">Make Another Prediction</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Predictions;