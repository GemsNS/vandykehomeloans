"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useLeadFunnel } from "@/components/lead-funnel/LeadFunnelProvider";

export function ApplyNowButton({
  children = "Apply Now",
  ...props
}: ButtonProps) {
  const { setOpen } = useLeadFunnel();
  return (
    <Button type="button" onClick={() => setOpen(true)} {...props}>
      {children}
    </Button>
  );
}
