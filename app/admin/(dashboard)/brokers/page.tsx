import { BrokersManager } from "@/components/admin/BrokersManager";
import { getAllBrokers } from "@/lib/data/queries";

export default async function AdminBrokersPage() {
  const brokers = await getAllBrokers();
  return <BrokersManager brokers={brokers} />;
}
