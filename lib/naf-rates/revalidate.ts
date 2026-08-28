import { revalidatePath } from "next/cache";

export function revalidateRatePages(): void {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/purchase");
  revalidatePath("/refinance");
  revalidatePath("/programs", "layout");
  revalidatePath("/admin/rates");
}
