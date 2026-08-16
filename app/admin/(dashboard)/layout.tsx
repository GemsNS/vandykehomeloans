import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { isDatabaseConfigured } from "@/db";

export const dynamic = "force-dynamic";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminShell>
      {!isDatabaseConfigured ? (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          DATABASE_URL is not set. Public pages use demo rates and brokers. Admin writes require
          Postgres.
        </p>
      ) : null}
      {children}
    </AdminShell>
  );
}
