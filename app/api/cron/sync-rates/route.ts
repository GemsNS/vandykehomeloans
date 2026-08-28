import { revalidatePath } from "next/cache";
import { syncNafRates } from "@/lib/naf-rates/sync";

function revalidateRatePages() {
  revalidatePath("/");
  revalidatePath("/purchase");
  revalidatePath("/refinance");
  revalidatePath("/programs/[slug]");
  revalidatePath("/admin/rates");
}

export async function GET(request: Request) {
  const secret = process.env.RATES_SYNC_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (token !== secret) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await syncNafRates({ force: true });
  if (result.ok && !result.skipped) {
    revalidateRatePages();
  }

  return Response.json(result, { status: result.ok ? 200 : 500 });
}
