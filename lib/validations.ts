import { z } from "zod";
import { LEAD_STATUSES } from "@/db/schema";

export const leadFunnelSchema = z.object({
  loanType: z.enum(["Purchase", "Refinance", "Cash-Out"]),
  propertyType: z.enum(["Single Family", "Condo", "Townhouse", "Multi-Family", "Manufactured"]),
  timeline: z.enum(["0-30 days", "30-90 days", "3-6 months", "6+ months", "Just researching"]),
  propertyValue: z.coerce.number().positive("Enter an estimated property value"),
  loanAmount: z.coerce.number().positive("Enter an estimated loan amount"),
  creditScoreTier: z.enum(["760+", "720-759", "680-719", "640-679", "Below 640"]),
  incomeSource: z.enum(["W-2", "Self-employed", "Retirement", "Mixed / Other"]),
  firstName: z.string().min(1, "First name is required").max(80),
  lastName: z.string().min(1, "Last name is required").max(80),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(10, "Enter a 10-digit phone number")
    .transform((value) => value.replace(/\D/g, "")),
});

export type LeadFunnelValues = z.infer<typeof leadFunnelSchema>;

export const rateFormSchema = z.object({
  id: z.string().uuid().optional(),
  productName: z.string().min(2).max(80),
  rate: z.coerce.number().min(0).max(30),
  apr: z.coerce.number().min(0).max(30),
  termYears: z.coerce.number().int().min(1).max(40),
  points: z.coerce.number().min(0).max(10),
  productType: z.enum(["conventional", "fha", "va", "usda", "jumbo", "arm"]),
  isFeatured: z.coerce.boolean().optional(),
  weeklyChange: z.coerce.number().min(-5).max(5),
});

export type RateFormValues = z.infer<typeof rateFormSchema>;

export const brokerFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(80),
  title: z.string().min(2).max(80),
  nmlsId: z.string().min(3).max(20),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  bio: z.string().max(800).optional().or(z.literal("")),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  licenseStates: z.string().max(120).optional().or(z.literal("")),
  active: z.coerce.boolean().optional(),
});

export type BrokerFormValues = z.infer<typeof brokerFormSchema>;

export const leadStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(LEAD_STATUSES),
  assignedBrokerId: z.string().uuid().nullable().optional(),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});
