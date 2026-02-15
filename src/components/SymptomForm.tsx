import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const riskFactors = [
  "Smoking", "Diabetes", "High Blood Pressure", "Obesity",
  "Family History of Heart Disease", "Sedentary Lifestyle",
  "High Cholesterol", "Excessive Alcohol",
];

const SymptomForm = forwardRef<HTMLDivElement>((_, ref) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [form, setForm] = useState({
    age: "",
    gender: "",
    symptoms: "",
    history: "",
    factors: [] as string[],
  });

  const toggleFactor = (factor: string) => {
    setForm((prev) => ({
      ...prev,
      factors: prev.factors.includes(factor)
        ? prev.factors.filter((f) => f !== factor)
        : [...prev.factors, factor],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.age || !form.gender || !form.symptoms) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    // Simulated AI analysis (replace with actual LLM call later)
    await new Promise((r) => setTimeout(r, 2500));

    const riskLevel = form.factors.length > 3 ? "High" : form.factors.length > 1 ? "Moderate" : "Low";
    setResult(
      `Based on your profile (age ${form.age}, ${form.gender}), reported symptoms, and ${form.factors.length} risk factor(s), your preliminary risk assessment indicates a **${riskLevel} Risk** level.\n\nKey findings:\n• Symptom correlation analysis completed\n• ${form.factors.length} modifiable risk factors identified\n• Recommended: Consult a healthcare professional for comprehensive evaluation\n\n⚠️ This is an AI-generated preliminary assessment and not a medical diagnosis.`
    );
    setIsLoading(false);
  };

  return (
    <section ref={ref} className="bg-background py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Health Risk <span className="text-gradient">Assessment</span>
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            Fill in your details below for an AI-powered risk analysis
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <Card className="border-border bg-card p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Age + Gender */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g. 35"
                    min={1}
                    max={120}
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <Label htmlFor="symptoms">Current Symptoms *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe your symptoms in detail (e.g., persistent cough for 2 weeks, chest discomfort...)"
                  rows={3}
                  value={form.symptoms}
                  onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                />
              </div>

              {/* Medical History */}
              <div className="space-y-2">
                <Label htmlFor="history">Medical History</Label>
                <Textarea
                  id="history"
                  placeholder="Any pre-existing conditions, surgeries, or medications..."
                  rows={2}
                  value={form.history}
                  onChange={(e) => setForm({ ...form, history: e.target.value })}
                />
              </div>

              {/* Risk Factors */}
              <div className="space-y-3">
                <Label>Risk Factors</Label>
                <div className="grid grid-cols-2 gap-3">
                  {riskFactors.map((factor) => (
                    <label
                      key={factor}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-secondary"
                    >
                      <Checkbox
                        checked={form.factors.includes(factor)}
                        onCheckedChange={() => toggleFactor(factor)}
                      />
                      <span className="text-sm text-foreground">{factor}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 bg-primary text-primary-foreground shadow-glow hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4" />
                    Analyze Risk
                  </>
                )}
              </Button>
            </form>

            {/* Result */}
            {result && (
              <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
                <h3 className="mb-3 flex items-center gap-2 font-display font-semibold text-foreground">
                  <Activity className="h-5 w-5 text-primary" />
                  Assessment Result
                </h3>
                <div className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                  {result}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
});

SymptomForm.displayName = "SymptomForm";

export default SymptomForm;
