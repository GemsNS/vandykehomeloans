"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { CONTACT } from "@/lib/company";

export function ApplyNowButton({
  children = "Apply Now",
  ...props
}: ButtonProps) {
  const { asChild: _asChild, type: _type, ...rest } = props;
  return (
    <Button asChild {...rest}>
      <a href={CONTACT.preQual} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}
