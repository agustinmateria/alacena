import Link from "next/link";
import { XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Pago cancelado — Alacena",
};

export default function PaginaCancelado() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-muted">
              <XCircle className="size-7 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">Cancelaste el pago</CardTitle>
            <CardDescription className="max-w-sm text-balance">
              No te cobramos nada. Tu adelanto gratis sigue ahí si querés volver a intentarlo.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/" className={cn(buttonVariants({ variant: "default" }))}>
              Volver a intentarlo
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
