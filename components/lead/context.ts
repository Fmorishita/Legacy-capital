"use client";

import { createContext, useContext } from "react";
import type { LeadProject } from "@/lib/projects";
import type { LeadDefaults } from "./LeadForm";

export type LeadKind = "prices" | "visit" | "plan" | "model" | "study" | "floorplan";

export type LeadRequest = LeadDefaults & {
  kind: LeadKind;
  origin: string;
  title?: string;
  subtitle?: string;
};

type Ctx = {
  openLead: (req: LeadRequest) => void;
  /** Proyecto de la página; sin él (página principal) los formularios preguntan cuál le interesa */
  project?: LeadProject;
};

export const LeadContext = createContext<Ctx>({ openLead: () => {} });

export function useLead() {
  return useContext(LeadContext);
}
