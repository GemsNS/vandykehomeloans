import { RatesManager } from "@/components/admin/RatesManager";
import { getRates } from "@/lib/data/queries";

export default async function AdminRatesPage() {
  const rates = await getRates();
  return <RatesManager rates={rates} />;
}
