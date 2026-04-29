import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "patient" | "clinician" | "admin" | "researcher";

export function useUserRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setRoles([]); setLoading(false); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (!cancelled) {
        setRoles((data ?? []).map((r: any) => r.role as AppRole));
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  return { roles, isClinician: roles.includes("clinician"), isAdmin: roles.includes("admin"), loading };
}

export interface PatientLink {
  id: string;
  patient_id: string;
  clinician_id: string | null;
  invite_code: string;
  status: "pending" | "active" | "revoked" | "expired";
  consent_scope: Record<string, boolean>;
  invited_at: string;
  accepted_at: string | null;
  expires_at: string;
}

function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${out.slice(0, 4)}-${out.slice(4)}`;
}

export function usePatientLinks() {
  const { user } = useAuth();
  const [links, setLinks] = useState<PatientLink[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("patient_clinician_links")
      .select("*")
      .eq("patient_id", user.id)
      .order("invited_at", { ascending: false });
    setLinks((data ?? []) as any);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const createInvite = async (consent: Record<string, boolean>) => {
    if (!user) return null;
    const invite_code = generateCode();
    const { data, error } = await supabase
      .from("patient_clinician_links")
      .insert({ patient_id: user.id, invite_code, consent_scope: consent, status: "pending" })
      .select()
      .single();
    if (!error) await refresh();
    return { data, error };
  };

  const revoke = async (id: string) => {
    await supabase
      .from("patient_clinician_links")
      .update({ status: "revoked", revoked_at: new Date().toISOString() })
      .eq("id", id);
    await refresh();
  };

  return { links, loading, createInvite, revoke, refresh };
}

export interface ClinicianPatient {
  link_id: string;
  patient_id: string;
  display_name: string | null;
  accepted_at: string | null;
  consent_scope: Record<string, boolean>;
}

export function useClinicianCaseload() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<ClinicianPatient[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    const { data: linkRows } = await supabase
      .from("patient_clinician_links")
      .select("id, patient_id, accepted_at, consent_scope")
      .eq("clinician_id", user.id)
      .eq("status", "active");
    const ids = (linkRows ?? []).map((r: any) => r.patient_id);
    let profileMap = new Map<string, string | null>();
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", ids);
      (profs ?? []).forEach((p: any) => profileMap.set(p.id, p.display_name));
    }
    setPatients(
      (linkRows ?? []).map((r: any) => ({
        link_id: r.id,
        patient_id: r.patient_id,
        display_name: profileMap.get(r.patient_id) ?? null,
        accepted_at: r.accepted_at,
        consent_scope: r.consent_scope ?? {},
      })),
    );
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const acceptInvite = async (code: string) => {
    if (!user) return { error: new Error("Not signed in") };
    const normalized = code.trim().toUpperCase();
    const { data: row, error: findErr } = await supabase
      .from("patient_clinician_links")
      .select("id, status, expires_at")
      .eq("invite_code", normalized)
      .maybeSingle();
    if (findErr || !row) return { error: new Error("Invite code not found") };
    if (row.status !== "pending") return { error: new Error(`Invite is ${row.status}`) };
    if (new Date(row.expires_at) < new Date()) return { error: new Error("Invite expired") };
    const { error } = await supabase
      .from("patient_clinician_links")
      .update({ clinician_id: user.id, status: "active", accepted_at: new Date().toISOString() })
      .eq("id", row.id);
    if (!error) await refresh();
    return { error };
  };

  return { patients, loading, refresh, acceptInvite };
}

export interface ClinicianAlert {
  id: string;
  patient_id: string;
  alert_type: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string | null;
  metadata: Record<string, any>;
  acknowledged_at: string | null;
  created_at: string;
}

export function useClinicianAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<ClinicianAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("clinician_alerts")
      .select("*")
      .eq("clinician_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setAlerts((data ?? []) as any);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const acknowledge = async (id: string) => {
    await supabase
      .from("clinician_alerts")
      .update({ acknowledged_at: new Date().toISOString() })
      .eq("id", id);
    await refresh();
  };

  return { alerts, loading, refresh, acknowledge };
}