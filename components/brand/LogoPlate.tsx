import Image from "next/image";
import logo from "@/public/brand/vandyke-home-loans-logo.png";
import { cn } from "@/lib/utils";

/**
 * The supplied logo artwork, which already sits on its own navy plate. Framed with a
 * gold hairline so the plate reads as intentional against surrounding navy surfaces.
 * Static import so the URL stays correct under the demo build's basePath.
 */
export function LogoPlate({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={logo}
      alt="VanDyke Home Loans — trusted advice, smart solutions, home loans made easy"
      priority={priority}
      sizes="(max-width: 640px) 80vw, 420px"
      className={cn(
        "h-auto rounded-board border border-brand-500/25 shadow-lift",
        className,
      )}
    />
  );
}
