import { revalidatePath } from "next/cache";

export function revalidateRatePages(): void {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/programs");
  revalidatePath("/va-loans");
  revalidatePath("/fha-loans");
  revalidatePath("/calculators");
  revalidatePath("/admin/rates");
}
