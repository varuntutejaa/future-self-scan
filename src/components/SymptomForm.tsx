import { useState, forwardRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Loader2, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RiskResult = {
  disease: string;
  risk: number;
  level: "low" | "moderate" | "high";
  note: string;
};

const SymptomForm = forwardRef<HTMLDivElement>((_, ref) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RiskResult[] | null>(null);

  const handleFile = (f: File) => {
    const allowed = ["application/pdf", "text/plain", "image/png", "image/jpeg",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(f.type)) {
      toast({ title: "Unsupported file type", description: "Please upload a PDF, DOCX, TXT, or image file.", variant: "destructive" });
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 20MB.", variant: "destructive" });
      return;
    }
    setFile(f);
    setResults(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const analyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setResults(null);

    // Simulated AI analysis — replace with real LLM call
    await new Promise((r) => setTimeout(r, 3000));

    const simulated: RiskResult[] = [
      { disease: "Type 2 Diabetes", risk: 72, level: "high", note: "Elevated glucose markers detected in transcript" },
      { disease: "Cardiovascular Disease", risk: 45, level: "moderate", note: "Borderline cholesterol and blood pressure indicators" },
      { disease: "Chronic Kidney Disease", risk: 18, level: "low", note: "Kidney function markers within normal range" },
      { disease: "Hypertension", risk: 61, level: "high", note: "Consistent elevated blood pressure readings noted" },
      { disease: "Respiratory Conditions", risk: 12, level: "low", note: "No significant respiratory markers found" },
    ];
    setResults(simulated);
    setIsLoading(false);
  };

  const riskColor = (level: string) => {
    if (level === "high") return "text-destructive";
    if (level === "moderate") return "text-accent";
    return "text-primary";
  };

  const progressColor = (level: string) => {
    if (level === "high") return "[&>div]:bg-destructive";
    if (level === "moderate") return "[&>div]:bg-accent";
    return "[&>div]:bg-primary";
  };

  return (
    <section ref={ref} className="bg-background py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Upload <span className="text-gradient">Medical Transcript</span>
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Upload your medical reports, lab results, or health transcripts and our AI will analyze disease risk percentages
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <Card className="border-border bg-card p-8 shadow-card">
            {/* Upload Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : file
                  ? "border-primary/40 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-secondary/50"
              }`}
            >
              {file ? (
                <div className="flex items-center gap-4">
                  <FileText className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => { setFile(null); setResults(null); }}
                    className="ml-4 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 font-semibold text-foreground">
                    Drag & drop your transcript here
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    PDF, DOCX, TXT, or image — up to 20MB
                  </p>
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                      onChange={onFileInput}
                    />
                    <span className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                      Browse Files
                    </span>
                  </label>
                </>
              )}
            </div>

            {/* Analyze Button */}
            <Button
              size="lg"
              className="mt-6 w-full gap-2 bg-primary text-primary-foreground shadow-glow hover:bg-primary/90"
              disabled={!file || isLoading}
              onClick={analyze}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing Transcript...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Analyze Risk
                </>
              )}
            </Button>

            {/* Results */}
            {results && (
              <div className="mt-8 space-y-5">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Disease Risk Breakdown
                </h3>
                {results
                  .sort((a, b) => b.risk - a.risk)
                  .map((r) => (
                    <div key={r.disease} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{r.disease}</span>
                        <span className={`text-sm font-bold ${riskColor(r.level)}`}>
                          {r.risk}%
                        </span>
                      </div>
                      <Progress value={r.risk} className={`h-2.5 ${progressColor(r.level)}`} />
                      <p className="text-xs text-muted-foreground">{r.note}</p>
                    </div>
                  ))}

                <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-secondary/50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    This is an AI-generated preliminary risk assessment based on your uploaded transcript. It is <strong>not a medical diagnosis</strong>. Please consult a qualified healthcare professional for proper evaluation and treatment.
                  </p>
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
