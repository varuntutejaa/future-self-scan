import { Zap, Lock, Activity, FileText } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-Time Analysis",
    description: "Get instant risk assessments powered by state-of-the-art language models.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your health data is encrypted and never stored beyond your session.",
  },
  {
    icon: Activity,
    title: "Multi-Disease Screening",
    description: "Screen for cardiovascular, metabolic, respiratory, and more conditions simultaneously.",
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Downloadable risk reports with evidence-based recommendations.",
  },
];

const Features = () => {
  return (
    <section className="bg-secondary/50 py-24">
      <div className="container">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Why <span className="text-gradient">MediPredict</span>
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            Built on the latest advances in medical AI research
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-5 rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-display font-semibold text-card-foreground">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
