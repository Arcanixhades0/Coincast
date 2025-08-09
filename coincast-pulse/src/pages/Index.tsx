import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Dither from "@/components/Dither";
import TextType from "@/components/TextType";



const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="fixed inset-0 -z-10">
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
      
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Hero Text */}
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
              <TextType 
                text="Your Crypto Compass"
                typingSpeed={75}
                loop={false}
                showCursor={true}
                hideCursorAfterComplete={true}
                cursorCharacter="|"
                className="text-white"
              />
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              <TextType 
                text="Navigate the complex world of cryptocurrency with precision and confidence. Our advanced analytics provide clarity in the chaos of digital markets."
                typingSpeed={50}
                loop={false}
                showCursor={true}
                hideCursorAfterComplete={true}
                cursorCharacter="|"
                className="text-white/90"
                initialDelay={2000}
              />
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button
              onClick={() => navigate("/predictions")}
              className="px-8 py-6 text-lg font-medium text-white
                       bg-white/10 backdrop-blur-md border border-white/20
                       hover:bg-white/20 hover:border-white/30 
                       transition-all duration-500 rounded-full hover:scale-105
                       shadow-2xl shadow-black/25
                       relative overflow-hidden
                       before:absolute before:inset-0 before:rounded-full
                       before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
                       before:translate-x-[-100%] hover:before:translate-x-[100%] 
                       before:transition-transform before:duration-700 before:ease-out"
            >
              Explore Predictions
            </Button>
            
            <Button
              onClick={() => navigate("/markets")}
              variant="outline"
              className="px-8 py-6 text-lg font-medium text-white hover:text-white
                       bg-white/5 backdrop-blur-md border border-white/15
                       hover:bg-white/15 hover:border-white/25 
                       transition-all duration-500 rounded-full hover:scale-105
                       shadow-2xl shadow-black/25
                       relative overflow-hidden
                       before:absolute before:inset-0 before:rounded-full
                       before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
                       before:translate-x-[-100%] hover:before:translate-x-[100%] 
                       before:transition-transform before:duration-700 before:ease-out"
            >
              View Markets
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;