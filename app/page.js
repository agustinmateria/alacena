import { FormularioAlacena } from "@/components/formulario-alacena";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium tracking-wide text-primary">
          Menú semanal · 1 minuto
        </span>
        <h1 className="font-heading text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          Armá tu menú semanal sin pensarlo
        </h1>
        <p className="max-w-md text-muted-foreground">
          Cuatro datos, un adelanto gratis con lunes y martes, y la semana completa
          por email si te gustó.
        </p>
      </div>

      <FormularioAlacena />
    </div>
  );
}
