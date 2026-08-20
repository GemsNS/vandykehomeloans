"use client";

import { useEffect } from "react";
import { CONTACT } from "@/lib/company";

export function RedirectToNafPrequal() {
  useEffect(() => {
    window.location.replace(CONTACT.preQual);
  }, []);
  return null;
}
