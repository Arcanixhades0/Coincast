import { Button } from "@/components/ui/button";
import { BarChart3, Brain, TrendingUp, PieChart } from "lucide-react";
import { useState } from "react";
import Layout from "@/components/Layout";
import TradingViewChart from "@/components/TradingViewChart";

const Analyze = () => {
  const [activeTab, setActiveTab] = useState("volatility");

  const tabs = [
    { id: "volatility", label: "Volatility Analysis" },
    { id: "correlation", label: "Market Correlation" },
    { id: "momentum", label: "Momentum Indicators" },
    { id: "sentiment", label: "Sentiment Analysis" }
  ];

  return (
    <Layout>
      <div className="min-h-screen px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Page Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Deep Analysis Hub
              </span>
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 animate-scale-in">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={`px-6 py-3 rounded-pill transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-primary glow-subtle"
                    : "glass hover:bg-hover"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* TradingView Advanced Chart */}
          <div className="animate-fade-in py-8">
            <TradingViewChart heightVh={70} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analyze;