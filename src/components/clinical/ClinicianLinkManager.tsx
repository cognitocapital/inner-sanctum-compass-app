import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Copy, Stethoscope, ShieldCheck, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { usePatientLinks } from "@/hooks/use-clinician";
import { format } from "date-fns";

export function ClinicianLinkManager() {
  const { links, loading, createInvite, revoke } = usePatientLinks();
  const [creating, setCreating] = useState(false);
  const [scope, setScope] = useState({
    assessments: true,
    red_flags: true,
    checkins: true,
    journal: false,
  });

  const handleCreate = async () => {
    setCreating(true);
    const result = await createInvite(scope);
    setCreating(false);
    if (result?.error) toast.error("Could not create invite", { description: result.error.message });
    else toast.success("Invite code created", { description: "Share with your clinician — expires in 14 days." });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Invite code copied");
  };

  return (
    <Card className="bg-card/40 backdrop-blur border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Stethoscope className="h-4 w-4 text-amber-400" />
          Share with your clinician
        </CardTitle>
        <CardDescription className="text-xs">
          Generate a one-time invite code. Your clinician enters it in their portal to view the data you allow below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 rounded-md border border-border/40 bg-background/30 p-3">
          <div className="text-xs font-semibold text-muted-foreground">Consent scope</div>
          {[
            { k: "assessments", label: "Validated assessments (RPQ, PHQ-9, GAD-7, PCL-5, NSI, GOSE)" },
            { k: "red_flags", label: "Safety red-flag events" },
            { k: "checkins", label: "Daily check-ins" },
            { k: "journal", label: "Journal entries marked as shared" },
          ].map((row) => (
            <label key={row.k} className="flex items-center gap-2 text-xs cursor-pointer">
              <Checkbox
                checked={(scope as any)[row.k]}
                onCheckedChange={(v) => setScope((s) => ({ ...s, [row.k]: !!v }))}
              />
              <span>{row.label}</span>
            </label>
          ))}
        </div>

        <Button onClick={handleCreate} disabled={creating} className="w-full" size="sm">
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
          Generate invite code
        </Button>

        <div className="space-y-2">
          {loading ? (
            <div className="text-xs text-muted-foreground">Loading…</div>
          ) : links.length === 0 ? (
            <div className="text-xs text-muted-foreground">No active invites or links yet.</div>
          ) : (
            links.map((link) => (
              <div key={link.id} className="flex items-center justify-between gap-2 rounded-md border border-border/40 bg-background/20 p-2 text-xs">
                <div className="flex flex-col">
                  <code className="font-mono text-sm tracking-wider">{link.invite_code}</code>
                  <span className="text-muted-foreground">
                    {link.status === "pending" && `Pending · expires ${format(new Date(link.expires_at), "MMM d")}`}
                    {link.status === "active" && link.accepted_at && `Active since ${format(new Date(link.accepted_at), "MMM d, yyyy")}`}
                    {link.status === "revoked" && "Revoked"}
                    {link.status === "expired" && "Expired"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-[10px]">{link.status}</Badge>
                  {link.status === "pending" && (
                    <Button size="icon" variant="ghost" onClick={() => copyCode(link.invite_code)} className="h-7 w-7">
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                  {(link.status === "pending" || link.status === "active") && (
                    <Button size="icon" variant="ghost" onClick={() => revoke(link.id)} className="h-7 w-7 text-destructive">
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}