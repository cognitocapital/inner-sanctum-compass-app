import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileText, Loader2, LogOut, ShieldAlert, Stethoscope, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (mode: "html" | "json") => {
    setExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("export-clinical-report");
      if (error) throw error;
      const stamp = new Date().toISOString().slice(0, 10);

      if (mode === "html") {
        const blob = new Blob([data.html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `phoenix-clinical-report-${stamp}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Clinical report downloaded", {
          description: "Open in any browser, then Print → Save as PDF.",
        });
      } else {
        const blob = new Blob([JSON.stringify(data.report, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `phoenix-data-${stamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Raw data exported", {
          description: "Structured JSON for clinical systems.",
        });
      }
    } catch (e: any) {
      toast.error("Export failed", { description: e?.message ?? "Try again." });
    } finally {
      setExporting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const canDelete = confirm.trim().toUpperCase() === "DELETE";

  const handleDelete = async () => {
    if (!canDelete) return;
    setBusy(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      toast.success("Account deleted", {
        description: "All your data has been permanently erased.",
      });
      await signOut();
      navigate("/", { replace: true });
    } catch (e: any) {
      toast.error("Could not delete account", {
        description: e?.message ?? "Please try again.",
      });
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Link
        to="/dashboard"
        className="fixed top-5 left-5 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:bg-white/20"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16 space-y-10">
        <header>
          <p className="text-[10px] tracking-[0.45em] uppercase text-orange-300/70 mb-2">
            Settings
          </p>
          <h1 className="font-serif text-4xl">Your Account</h1>
          <p className="text-white/50 mt-2 text-sm">{user?.email}</p>
        </header>

        {/* Clinical export */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
          <div className="flex items-start gap-3">
            <Stethoscope className="h-5 w-5 text-orange-300 mt-0.5" />
            <div>
              <h2 className="font-serif text-xl text-white">For your medical team</h2>
              <p className="text-sm text-white/60 mt-1">
                Download a clinical report containing your assessments
                (PHQ-9, GAD-7, GOSE, etc.), session activity, recent daily
                check-ins, and Phoenix observations (your reflections).
                Share it with your neurologist, OT, SLT or care coordinator.
              </p>
              <p className="text-xs text-white/40 mt-2 italic">
                Educational summary only — not a diagnostic record.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => handleExport("html")}
              disabled={exporting}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-[0_8px_30px_-8px_rgba(251,146,60,0.5)]"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Clinical Report (HTML / Print-to-PDF)
            </Button>
            <Button
              onClick={() => handleExport("json")}
              disabled={exporting}
              variant="outline"
              className="bg-white/[0.04] border-white/15 text-white hover:bg-white/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Raw Data (JSON)
            </Button>
          </div>
        </section>

        {/* Sign out */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-white">Sign out</h2>
            <p className="text-sm text-white/60 mt-1">End your current session.</p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="bg-white/[0.04] border-white/15 text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </section>

        {/* Danger zone */}
        <section className="rounded-2xl border border-red-500/25 bg-red-500/[0.04] p-6 space-y-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-red-400 mt-0.5" />
            <div>
              <h2 className="font-serif text-xl text-red-200">Delete account</h2>
              <p className="text-sm text-white/60 mt-1">
                Permanently erases your profile, journal entries, check-ins,
                quests, brain scans, AI companion history and all progress.
                This cannot be undone.
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-red-500/90 hover:bg-red-500 text-white border-0"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete my account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-950 border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-serif">
                  Delete your account?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-white/60">
                  This will permanently remove every record tied to your
                  account — journal entries, brain scans, progress, check-ins
                  and AI conversations. There is no recovery.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-2 py-2">
                <Label
                  htmlFor="confirm"
                  className="text-[10px] tracking-[0.3em] uppercase text-white/50"
                >
                  Type DELETE to confirm
                </Label>
                <Input
                  id="confirm"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="DELETE"
                  className="bg-white/[0.04] border-white/15 text-white"
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setConfirm("")}
                  className="bg-white/[0.04] border-white/15 text-white hover:bg-white/10"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={!canDelete || busy}
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Permanently delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </div>
  );
};

export default Settings;