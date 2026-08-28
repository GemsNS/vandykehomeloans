export type NafLoanPurpose = "purchase" | "refinance";

export type NafParsedRate = {
  productName: string;
  rate: string;
  apr: string;
  points: string;
  pointsLabel: string;
  loanPurpose: NafLoanPurpose;
  termYears: number;
  productType: "conventional" | "fha" | "va" | "arm";
};

export type NafPublishedMeta = {
  asOf: string;
  pointsLabel: string;
  syncedAt: string;
};

export type NafSyncResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  asOf?: string;
  updated?: number;
  error?: string;
};
