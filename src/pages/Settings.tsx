import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldAlert, Trash2 } from "lucide-react";
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