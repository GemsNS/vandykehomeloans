import { loginAdmin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <form action={loginAdmin} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lift">
        <p className="eyebrow text-brand-600">
          Broker portal
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Licensed staff only. Set ADMIN_PASSWORD in the environment.
        </p>
        <div className="mt-6 space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required autoFocus />
        </div>
        {params.error ? (
          <p className="mt-3 text-sm text-red-600">That password does not match.</p>
        ) : null}
        <Button type="submit" className="mt-6 w-full">
          Continue
        </Button>
      </form>
    </div>
  );
}
