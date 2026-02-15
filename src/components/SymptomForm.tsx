import { useState, forwardRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, Loader2, X, AlertTriangle, Download, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateReport } from "@/lib/generateReport";

type RiskResult = {
  disease: string;
  risk: number;
  level: "low" | "moderate" | "high";
  note: string;
};

type PatientInfo = {
  name: string;
  age: string;
  gender: string;
  bloodGroup: string;
  weight: string;
  height: string;
  pastDiseases: string;
  medications: string;
  allergies: string;
  familyHistory: string;
  lifestyle: string[];
};

const lifestyleOptions = [
  "Smoking", "Alcohol Consumption", "Sedentary Lifestyle",
  "High Stress", "Poor Diet", "Lack of Sleep",
];

const SymptomForm = forwardRef<HTMLDivElement>((_, ref) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"info" | "upload" | "results">("info");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RiskResult[] | null>(null);
  const [patient, setPatient] = useState<PatientInfo>({
    name: "", age: "", gender: "", bloodGroup: "",
    weight: "", height: "", pastDiseases: "", medications: "",
    allergies: "", familyHistory: "", lifestyle: [],
  });

  const updatePatient = (key: keyof PatientInfo, value: string) =>
    setPatient((p) => ({ ...p, [key]: value }));

  const toggleLifestyle = (item: string) =>
    setPatient((p) => ({
      ...p,
      lifestyle: p.lifestyle.includes(item)
        ? p.lifestyle.filter((l) => l !== item)
        : [...p.lifestyle, item],
    }));

  const handleNext = () => {
    if (!patient.name || !patient.age || !patient.gender) {
      toast({ title: "Please fill in required fields (Name, Age, Gender)", variant: "destructive" });
      return;
    }
    setStep("upload");
  };

  const handleFile = (f: File) => {
    const allowed = ["application/pdf", "text/plain", "image/png", "image/jpeg",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(f.type)) {
      toast({ title: "Unsupported file type", description: "Please upload a PDF, DOCX, TXT, or image.", variant: "destructive" });
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 20MB.", variant: "destructive" });
      return;
    }
    setFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const analyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setResults(null);

    await new Promise((r) => setTimeout(r, 3000));

    const simulated: RiskResult[] = [
      { disease: "Type 2 Diabetes", risk: 72, level: "high", note: "Elevated glucose markers detected in transcript" },
      { disease: "Cardiovascular Disease", risk: 45, level: "moderate", note: "Borderline cholesterol and blood pressure indicators" },
      { disease: "Chronic Kidney Disease", risk: 18, level: "low", note: "Kidney function markers within normal range" },
      { disease: "Hypertension", risk: 61, level: "high", note: "Consistent elevated blood pressure readings noted" },
      { disease: "Respiratory Conditions", risk: 12, level: "low", note: "No significant respiratory markers found" },
    ];
    setResults(simulated.sort((a, b) => b.risk - a.risk));
    setIsLoading(false);
    setStep("results");
  };

  const handleDownload = () => {
    if (!results) return;
    generateReport(patient, results);
    toast({ title: "Report downloaded!", description: "Your risk assessment PDF has been saved." });
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
            {step === "info" && <>Patient <span className="text-gradient">Assessment</span></>}
            {step === "upload" && <>Upload <span className="text-gradient">Transcript</span></>}
            {step === "results" && <>Risk <span className="text-gradient">Report</span></>}
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            {step === "info" && "Fill in your details for a comprehensive risk assessment"}
            {step === "upload" && "Upload your medical reports or lab results"}
            {step === "results" && "Your AI-powered disease risk analysis"}
          </p>

          {/* Step indicators */}
          <div className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-2">
            {["info", "upload", "results"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  step === s ? "bg-primary text-primary-foreground" :
                  ["info", "upload", "results"].indexOf(step) > i ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                {i < 2 && <div className={`h-0.5 w-8 transition-colors ${
                  ["info", "upload", "results"].indexOf(step) > i ? "bg-primary/40" : "bg-border"
                }`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <Card className="border-border bg-card p-8 shadow-card">

            {/* STEP 1: Patient Info */}
            {step === "info" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">Personal Information</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" placeholder="John Doe" value={patient.name}
                      onChange={(e) => updatePatient("name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input id="age" type="number" placeholder="35" min={1} max={120}
                      value={patient.age} onChange={(e) => updatePatient("age", e.target.value)} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select value={patient.gender} onValueChange={(v) => updatePatient("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Group</Label>
                    <Select value={patient.bloodGroup} onValueChange={(v) => updatePatient("bloodGroup", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" placeholder="70" value={patient.weight}
                      onChange={(e) => updatePatient("weight", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" placeholder="175" value={patient.height}
                    onChange={(e) => updatePatient("height", e.target.value)} className="sm:max-w-[200px]" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pastDiseases">Past Diseases / Conditions</Label>
                  <Textarea id="pastDiseases" rows={2}
                    placeholder="e.g., Asthma, Diabetes diagnosed 2019, Thyroid disorder..."
                    value={patient.pastDiseases} onChange={(e) => updatePatient("pastDiseases", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea id="medications" rows={2}
                    placeholder="e.g., Metformin 500mg daily, Lisinopril 10mg..."
                    value={patient.medications} onChange={(e) => updatePatient("medications", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Known Allergies</Label>
                  <Input id="allergies" placeholder="e.g., Penicillin, Peanuts..."
                    value={patient.allergies} onChange={(e) => updatePatient("allergies", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="familyHistory">Family Medical History</Label>
                  <Textarea id="familyHistory" rows={2}
                    placeholder="e.g., Father — heart disease, Mother — type 2 diabetes..."
                    value={patient.familyHistory} onChange={(e) => updatePatient("familyHistory", e.target.value)} />
                </div>

                <div className="space-y-3">
                  <Label>Lifestyle Risk Factors</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {lifestyleOptions.map((item) => (
                      <label key={item} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-secondary">
                        <Checkbox checked={patient.lifestyle.includes(item)} onCheckedChange={() => toggleLifestyle(item)} />
                        <span className="text-sm text-foreground">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button size="lg" className="w-full gap-2 bg-primary text-primary-foreground shadow-glow hover:bg-primary/90" onClick={handleNext}>
                  Continue to Upload
                </Button>
              </div>
            )}

            {/* STEP 2: Upload */}
            {step === "upload" && (
              <div className="space-y-6">
                <button onClick={() => setStep("info")} className="text-sm text-primary hover:underline">
                  ← Back to patient info
                </button>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all ${
                    isDragging ? "border-primary bg-primary/5" :
                    file ? "border-primary/40 bg-primary/5" :
                    "border-border hover:border-primary/40 hover:bg-secondary/50"
                  }`}
                >
                  {file ? (
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button onClick={() => setFile(null)}
                        className="ml-4 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="mb-2 font-semibold text-foreground">Drag & drop your transcript here</p>
                      <p className="mb-4 text-sm text-muted-foreground">PDF, DOCX, TXT, or image — up to 20MB</p>
                      <label>
                        <input type="file" className="hidden" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                        <span className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                          Browse Files
                        </span>
                      </label>
                    </>
                  )}
                </div>

                <Button size="lg" className="w-full gap-2 bg-primary text-primary-foreground shadow-glow hover:bg-primary/90"
                  disabled={!file || isLoading} onClick={analyze}>
                  {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />Analyzing...</>) : (<><FileText className="h-4 w-4" />Analyze Risk</>)}
                </Button>
              </div>
            )}

            {/* STEP 3: Results */}
            {step === "results" && results && (
              <div className="space-y-6">
                {/* Patient summary */}
                <div className="rounded-xl border border-border bg-secondary/50 p-5">
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Patient Summary</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> <span className="font-medium text-foreground">{patient.name}</span></p>
                    <p><span className="text-muted-foreground">Age:</span> <span className="font-medium text-foreground">{patient.age}</span></p>
                    <p><span className="text-muted-foreground">Gender:</span> <span className="font-medium text-foreground capitalize">{patient.gender}</span></p>
                    {patient.bloodGroup && <p><span className="text-muted-foreground">Blood Group:</span> <span className="font-medium text-foreground">{patient.bloodGroup}</span></p>}
                  </div>
                </div>

                {/* Risk bars */}
                <div className="space-y-5">
                  <h3 className="font-display text-lg font-semibold text-foreground">Disease Risk Breakdown</h3>
                  {results.map((r) => (
                    <div key={r.disease} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{r.disease}</span>
                        <span className={`text-sm font-bold ${riskColor(r.level)}`}>{r.risk}%</span>
                      </div>
                      <Progress value={r.risk} className={`h-2.5 ${progressColor(r.level)}`} />
                      <p className="text-xs text-muted-foreground">{r.note}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    This is an AI-generated preliminary risk assessment. It is <strong>not a medical diagnosis</strong>. Please consult a healthcare professional.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button size="lg" className="flex-1 gap-2 bg-primary text-primary-foreground shadow-glow hover:bg-primary/90" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                    Download Report (PDF)
                  </Button>
                  <Button size="lg" variant="outline" className="flex-1" onClick={() => { setStep("info"); setFile(null); setResults(null); }}>
                    New Assessment
                  </Button>
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
