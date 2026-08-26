import Link from "next/link";
import { CheckCircle2, HelpCircle, AlertTriangle, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ESTILOS_POR_TIPO = {
  confirmado: {
    icono: CheckCircle2,
    claseIcono: "text-emerald-600 dark:text-emerald-400",
    claseFondo: "bg-emerald-50 dark:bg-emerald-950/30",
    titulo: "¡Pago confirmado!",
  },
  no_verificado: {
    icono: HelpCircle,
    claseIcono: "text-amber-600 dark:text-amber-400",
    claseFondo: "bg-amber-50 dark:bg-amber-950/30",
    titulo: "Todavía no pudimos confirmar el pago",
  },
  error: {
    icono: AlertTriangle,
    claseIcono: "text-destructive",
    claseFondo: "bg-destructive/10",
    titulo: "Hubo un problema al verificar el pago",
  },
};

/**
 * Muestra uno de los tres estados posibles de la pantalla de éxito.
 * Nunca muestra el plan acá: solo confirma el pago y avisa que llega
 * por email (o explica qué pasó si algo no salió bien).
 */
export function ResultadoPago({ estado }) {
  const { tipo, mensaje, email } = estado;
  const config = ESTILOS_POR_TIPO[tipo] ?? ESTILOS_POR_TIPO.error;
  const Icono = config.icono;

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className={`mb-2 flex size-14 items-center justify-center rounded-full ${config.claseFondo}`}>
          <Icono className={`size-7 ${config.claseIcono}`} />
        </div>
        <CardTitle className="text-xl">{config.titulo}</CardTitle>
        <CardDescription className="max-w-sm text-balance">
          {tipo === "confirmado" && (
            <>
              Estamos armando tu menú de 7 días y tu lista de compras.
              Te los mandamos por email{email ? <> a <strong>{email}</strong></> : ""} en los
              próximos minutos.
            </>
          )}
          {tipo === "no_verificado" && (mensaje || "No encontramos una confirmación de pago para esta sesión.")}
          {tipo === "error" && (mensaje || "No pudimos verificar el pago. Si ya pagaste, escribinos.")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {tipo === "confirmado" && (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <Mail className="size-4 shrink-0" />
            Revisá tu bandeja de entrada (y la carpeta de spam, por las dudas).
          </div>
        )}
        <Link
          href="/"
          className={cn(buttonVariants({ variant: tipo === "confirmado" ? "outline" : "default" }))}
        >
          Volver al inicio
        </Link>
      </CardContent>
    </Card>
  );
}
