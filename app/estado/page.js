import { connection } from "next/server";
import Link from "next/link";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { estadoVariablesEntorno } from "@/lib/variables-entorno";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Estado de la configuración — Alacena",
  description: "Qué variables de entorno están cargadas y cuáles faltan.",
};

function esLink(donde) {
  return donde.startsWith("http");
}

export default async function PaginaEstado() {
  // Espera a que llegue el pedido del usuario antes de renderizar. Sin
  // esto, Next.js armaría la página una sola vez durante el build y
  // mostraría siempre el estado de ese momento.
  await connection();

  const variables = estadoVariablesEntorno();
  const faltantes = variables.filter((v) => !v.configurada);
  const listas = variables.length - faltantes.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium tracking-wide text-primary">
          Diagnóstico
        </span>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Estado de la configuración
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Esta página te dice qué claves ya cargaste y cuáles faltan. Solo
          muestra si cada una existe o no. El valor nunca se muestra acá.
        </p>
      </div>

      {faltantes.length === 0 ? (
        <Alert className="text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 />
          <AlertTitle>Todo listo</AlertTitle>
          <AlertDescription>
            Las {variables.length} variables están cargadas.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <XCircle />
          <AlertTitle>
            Faltan {faltantes.length} de {variables.length}
          </AlertTitle>
          <AlertDescription>
            Cargá las que están en rojo. En Vercel: Settings → Environment
            Variables. Después hacé un redeploy, si no la app sigue con los
            valores viejos.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Variables de entorno</CardTitle>
          <CardDescription>
            {listas} de {variables.length} configuradas.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <ul className="divide-y divide-border/70 border-y border-border/70">
            {variables.map((variable) => (
              <li
                key={variable.nombre}
                className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-6"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <code className="font-mono text-sm font-medium break-all text-foreground">
                    {variable.nombre}
                  </code>
                  <p className="text-sm text-muted-foreground">{variable.para}</p>
                  {esLink(variable.donde) ? (
                    <a
                      href={variable.donde}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                    >
                      Dónde se saca
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground/80">{variable.donde}</p>
                  )}
                </div>

                <div className="shrink-0">
                  {variable.configurada ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full bg-emerald-500"
                      />
                      Configurada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full bg-destructive"
                      />
                      Falta
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
