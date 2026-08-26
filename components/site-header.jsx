import Link from "next/link";
import { ChefHat } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ChefHat className="size-4.5" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Alacena
          </span>
        </Link>
        <p className="hidden text-sm text-muted-foreground sm:block">
          Tu menú semanal, sin pensarlo
        </p>
      </div>
    </header>
  );
}
