"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LeadFunnel } from "@/components/lead-funnel/LeadFunnel";
import { useLeadFunnel } from "@/components/lead-funnel/LeadFunnelProvider";

export function LeadFunnelModal() {
  const { open, setOpen } = useLeadFunnel();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start your application</DialogTitle>
          <DialogDescription>
            Four quick steps. A licensed loan officer follows up with a real quote — not a teaser rate.
          </DialogDescription>
        </DialogHeader>
        <LeadFunnel onComplete={() => undefined} />
      </DialogContent>
    </Dialog>
  );
}
