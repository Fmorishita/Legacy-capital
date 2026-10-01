"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { useLead } from "@/components/lead/LeadProvider";

export function VdmAudienceCta({ label }: { label: string }) {
  const { openLead } = useLead();
  return (
    <button type="button" className="btn btn-primary" onClick={() => openLead({ kind: "prices", origin: "vdm-para-ti" })}>
      {label}
      <ArrowRight className="size-4" weight="bold" aria-hidden />
    </button>
  );
}
