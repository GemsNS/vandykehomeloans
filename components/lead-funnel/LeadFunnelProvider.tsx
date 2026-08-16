"use client";

import * as React from "react";

type LeadFunnelContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const LeadFunnelContext = React.createContext<LeadFunnelContextValue | null>(null);

export function LeadFunnelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(() => ({ open, setOpen }), [open]);
  return <LeadFunnelContext.Provider value={value}>{children}</LeadFunnelContext.Provider>;
}

export function useLeadFunnel() {
  const ctx = React.useContext(LeadFunnelContext);
  if (!ctx) {
    throw new Error("useLeadFunnel must be used within LeadFunnelProvider");
  }
  return ctx;
}
