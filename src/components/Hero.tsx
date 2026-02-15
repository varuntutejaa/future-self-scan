import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-medical.jpg";

const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-hero">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="AI-powered medical analysis visualization"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-hero opacity-80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Nav */}
        <nav className="container flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-display text-xl font-bold text-primary-foreground">
              MediPredict
            </span>
          </div>
          <Button variant="outline" className="border-primary/30 bg-primary/10 text-primary-foreground hover:bg-primary/20" onClick={onGetStarted}>
            Get Started
          </Button>
        </nav>

        {/* Hero content */}
        <div className="container flex flex-1 items-center pb-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary opacity-0 animate-fade-up">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
              Powered by Advanced LLMs
            </div>
            <h1 className="mb-6 font-display text-5xl font-extrabold leading-tight tracking-tight text-primary-foreground opacity-0 animate-fade-up [animation-delay:100ms] md:text-6xl lg:text-7xl">
              AI-Driven{" "}
              <span className="text-gradient">Disease Risk</span>{" "}
              Prediction
            </h1>
            <p className="mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground opacity-0 animate-fade-up [animation-delay:200ms]">
              Leverage cutting-edge large language models to analyze symptoms,
              medical history, and risk factors for early disease detection.
            </p>
            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-up [animation-delay:300ms]">
              <Button
                size="lg"
                className="gap-2 bg-primary text-primary-foreground shadow-glow hover:bg-primary/90"
                onClick={onGetStarted}
              >
                Start Assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
