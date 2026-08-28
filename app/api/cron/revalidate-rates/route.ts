import { revalidateRatePages } from "@/lib/naf-rates/revalidate";

export async function GET(request: Request) {
  const secret = process.env.RATES_SYNC_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (token !== secret) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  revalidateRatePages();
  return Response.json({ ok: true, revalidated: true });
}
