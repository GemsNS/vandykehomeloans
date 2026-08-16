import { RateTickerBar } from "@/components/layout/RateTickerBar";
import { getFeaturedRates, getLatestRateUpdate } from "@/lib/data/queries";

export async function RateTicker() {
  const rates = await getFeaturedRates();
  const updatedAt = await getLatestRateUpdate(rates);

  return (
    <RateTickerBar
      rates={rates.map((rate) => ({
        productName: rate.productName,
        rate: rate.rate,
        weeklyChange: rate.weeklyChange,
      }))}
      updatedAt={updatedAt}
    />
  );
}
