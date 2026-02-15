import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card py-10">
    <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-display font-semibold text-foreground">MediPredict</span>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        ⚠️ This tool provides AI-generated risk assessments only, not medical diagnoses. Always consult a healthcare professional.
      </p>
      <p className="text-xs text-muted-foreground">© 2026 MediPredict</p>
    </div>
  </footer>
);

export default Footer;
