import type { Broker, Rate } from "@/db/schema";
import { PEOPLE } from "@/lib/company";

/** NAF published these at 9:00AM PT on 8/18/2026. */
const publishedAt = new Date("2026-08-18T16:00:00.000Z");

function rate(
  id: string,
  productName: string,
  interest: string,
  apr: string,
  termYears: number,
  productType: Rate["productType"],
  loanPurpose: "purchase" | "refinance",
  isFeatured = false,
): Rate {
  return {
    id,
    productName,
    rate: interest,
    apr,
    termYears,
    points: "1.00",
    productType,
    loanPurpose,
    isFeatured,
    weeklyChange: "0.000",
    updatedAt: publishedAt,
  };
}

export const FALLBACK_RATES: Rate[] = [
  rate("rate-30-fixed-purchase", "30-Year Fixed", "6.625", "6.740", 30, "conventional", "purchase", true),
  rate("rate-15-fixed-purchase", "15-Year Fixed", "6.125", "6.316", 15, "conventional", "purchase"),
  rate("rate-fha-30-purchase", "FHA 30-Year Fixed", "6.250", "7.287", 30, "fha", "purchase", true),
  rate("rate-va-30-purchase", "VA 30-Year Fixed", "6.250", "6.681", 30, "va", "purchase", true),
  rate("rate-fha-arm-purchase", "5/1 FHA ARM", "6.250", "7.144", 30, "arm", "purchase"),
  rate("rate-va-arm-purchase", "5/1 VA ARM", "6.250", "6.454", 30, "arm", "purchase"),
  rate("rate-30-fixed-refi", "30-Year Fixed", "6.625", "6.740", 30, "conventional", "refinance"),
  rate("rate-15-fixed-refi", "15-Year Fixed", "6.125", "6.316", 15, "conventional", "refinance"),
  rate("rate-fha-30-refi", "FHA 30-Year Fixed", "6.250", "7.287", 30, "fha", "refinance"),
  rate("rate-va-30-refi", "VA 30-Year Fixed", "6.250", "6.412", 30, "va", "refinance"),
  rate("rate-fha-arm-refi", "5/1 FHA ARM", "6.250", "7.144", 30, "arm", "refinance"),
];

export const FALLBACK_BROKERS: Broker[] = [
  {
    id: "broker-anthony",
    name: PEOPLE.anthony.name,
    title: PEOPLE.anthony.title,
    nmlsId: PEOPLE.anthony.nmlsId,
    email: PEOPLE.anthony.email,
    phone: PEOPLE.anthony.phone,
    bio: PEOPLE.anthony.bio,
    avatarUrl: null,
    licenseStates: PEOPLE.anthony.licenseStates,
    active: true,
    createdAt: publishedAt,
  },
  {
    id: "broker-gonzalo",
    name: PEOPLE.gonzalo.name,
    title: PEOPLE.gonzalo.title,
    nmlsId: PEOPLE.gonzalo.nmlsId,
    email: PEOPLE.gonzalo.email,
    phone: PEOPLE.gonzalo.phone,
    bio: PEOPLE.gonzalo.bio,
    avatarUrl: null,
    licenseStates: PEOPLE.gonzalo.licenseStates,
    active: true,
    createdAt: publishedAt,
  },
];
