import type { Instrument } from "../types";
import { phq9 } from "./phq9";
import { gad7 } from "./gad7";
import { rpq } from "./rpq";
import { pcl5 } from "./pcl5";
import { nsi } from "./nsi";

export const INSTRUMENTS: Record<string, Instrument> = {
  PHQ9: phq9,
  GAD7: gad7,
  RPQ: rpq,
  PCL5: pcl5,
  NSI: nsi,
};

/** Ordered list for the battery dashboard. GOSE handled separately (interview format). */
export const BATTERY_ORDER = ["RPQ", "NSI", "PHQ9", "GAD7", "PCL5"] as const;

export { phq9, gad7, rpq, pcl5, nsi };
