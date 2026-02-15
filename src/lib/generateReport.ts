import jsPDF from "jspdf";

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

type RiskResult = {
  disease: string;
  risk: number;
  level: "low" | "moderate" | "high";
  note: string;
};

export function generateReport(patient: PatientInfo, results: RiskResult[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const addLine = (text: string, size = 10, bold = false) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, pageWidth - 40);
    doc.text(lines, 20, y);
    y += lines.length * (size * 0.5) + 4;
  };

  // Header
  doc.setFillColor(20, 80, 80);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("MediPredict", 20, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("AI-Powered Disease Risk Assessment Report", 20, 28);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 20, 36);

  doc.setTextColor(30, 30, 30);
  y = 52;

  // Patient Info
  addLine("PATIENT INFORMATION", 13, true);
  y += 2;

  doc.setDrawColor(20, 80, 80);
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);
  y += 6;

  const info = [
    ["Name", patient.name],
    ["Age", patient.age],
    ["Gender", patient.gender],
    ...(patient.bloodGroup ? [["Blood Group", patient.bloodGroup]] : []),
    ...(patient.weight ? [["Weight", `${patient.weight} kg`]] : []),
    ...(patient.height ? [["Height", `${patient.height} cm`]] : []),
  ];

  info.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${label}:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), 70, y);
    y += 6;
  });

  if (patient.pastDiseases) { y += 2; addLine(`Past Diseases: ${patient.pastDiseases}`); }
  if (patient.medications) { addLine(`Medications: ${patient.medications}`); }
  if (patient.allergies) { addLine(`Allergies: ${patient.allergies}`); }
  if (patient.familyHistory) { addLine(`Family History: ${patient.familyHistory}`); }
  if (patient.lifestyle.length) { addLine(`Lifestyle Factors: ${patient.lifestyle.join(", ")}`); }

  y += 8;

  // Risk Results
  addLine("DISEASE RISK ANALYSIS", 13, true);
  y += 2;
  doc.line(20, y, pageWidth - 20, y);
  y += 8;

  results.forEach((r) => {
    // Risk bar background
    const barWidth = 100;
    const barX = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(r.disease, barX, y);

    const levelColor = r.level === "high" ? [220, 38, 38] : r.level === "moderate" ? [14, 130, 180] : [20, 130, 100];
    doc.setTextColor(levelColor[0], levelColor[1], levelColor[2]);
    doc.text(`${r.risk}%`, pageWidth - 20, y, { align: "right" });
    doc.setTextColor(30, 30, 30);
    y += 5;

    // Bar
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(barX, y, barWidth, 5, 2, 2, "F");
    doc.setFillColor(levelColor[0], levelColor[1], levelColor[2]);
    doc.roundedRect(barX, y, (r.risk / 100) * barWidth, 5, 2, 2, "F");
    y += 9;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(r.note, barX, y);
    doc.setTextColor(30, 30, 30);
    y += 10;

    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });

  // Disclaimer
  y += 5;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(18, y - 2, pageWidth - 36, 22, 3, 3, "F");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const disclaimer = "⚠ DISCLAIMER: This is an AI-generated preliminary risk assessment and does not constitute a medical diagnosis. Always consult a qualified healthcare professional for proper evaluation, diagnosis, and treatment recommendations.";
  const dLines = doc.splitTextToSize(disclaimer, pageWidth - 44);
  doc.text(dLines, 22, y + 4);

  doc.save(`MediPredict_Report_${patient.name.replace(/\s+/g, "_")}.pdf`);
}
