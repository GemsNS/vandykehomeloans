import { LeadsManager } from "@/components/admin/LeadsManager";
import { getAllBrokers, getLeads } from "@/lib/data/queries";

export default async function AdminLeadsPage() {
  const [leads, brokers] = await Promise.all([getLeads(), getAllBrokers()]);
  return <LeadsManager leads={leads} brokers={brokers} />;
}
