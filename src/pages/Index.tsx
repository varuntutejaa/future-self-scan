import { useRef } from "react";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import SymptomForm from "@/components/SymptomForm";
import Footer from "@/components/Footer";

const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Hero onGetStarted={scrollToForm} />
      <HowItWorks />
      <SymptomForm ref={formRef} />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
