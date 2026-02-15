import { ClipboardList, Brain, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Input Your Data",
    description:
      "Enter symptoms, medical history, lifestyle factors, and demographics through our guided assessment.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description:
      "Our LLM processes your data against vast medical knowledge to identify patterns and risk indicators.",
  },
  {
    icon: BarChart3,
    title: "Risk Report",
    description:
      "Receive a detailed risk breakdown with actionable insights and recommended next steps.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-background py-24">
      <div className="container">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            Three simple steps to understand your health risk profile
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative rounded-2xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </div>
              <step.icon className="mb-5 h-10 w-10 text-primary" />
              <h3 className="mb-3 font-display text-lg font-semibold text-card-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
