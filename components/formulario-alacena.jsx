"use client";

import { useState } from "react";
import { Loader2, Sparkles, ShoppingCart, Lock, Sun, MoonStar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { OPCIONES_PRESUPUESTO, OPCIONES_TIEMPO, PERSONAS_MIN, PERSONAS_MAX } from "@/lib/opciones";

export function FormularioAlacena() {
  const [personas, setPersonas] = useState("4");
  const [restricciones, setRestricciones] = useState("");
  const [presupuesto, setPresupuesto] = useState("medio");
  const [tiempo, setTiempo] = useState("hasta_1_hora");

  const [cargandoAdelanto, setCargandoAdelanto] = useState(false);
  const [errorAdelanto, setErrorAdelanto] = useState(null);
  const [adelanto, setAdelanto] = useState(null);

  const [cargandoPago, setCargandoPago] = useState(false);
  const [errorPago, setErrorPago] = useState(null);

  function datosFormulario() {
    return {
      personas: Number(personas),
      restricciones: restricciones.trim(),
      presupuesto,
      tiempo,
    };
  }

  async function generarAdelanto(e) {
    e.preventDefault();
    setCargandoAdelanto(true);
    setErrorAdelanto(null);
    setErrorPago(null);
    setAdelanto(null);

    try {
      const res = await fetch("/api/adelanto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosFormulario()),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorAdelanto(data.error || "No pudimos generar el adelanto. Probá de nuevo.");
        return;
      }
      setAdelanto(data);
    } catch {
      setErrorAdelanto("No pudimos conectar con el servidor. Probá de nuevo.");
    } finally {
      setCargandoAdelanto(false);
    }
  }

  async function irAPagar() {
    setCargandoPago(true);
    setErrorPago(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosFormulario()),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setErrorPago(data.error || "No pudimos iniciar el pago. Probá de nuevo.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setErrorPago("No pudimos conectar con el servidor. Probá de nuevo.");
    } finally {
      setCargandoPago(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="[--card-spacing:--spacing(7)] sm:[--card-spacing:--spacing(8)]">
        <CardHeader>
          <CardTitle>Contanos para quién cocinás</CardTitle>
          <CardDescription>
            Con estos cuatro datos armamos un adelanto gratis de tu menú semanal.
          </CardDescription>
        </CardHeader>
        <form onSubmit={generarAdelanto}>
          <CardContent className="flex flex-col gap-7 pb-7 sm:pb-8">
            <div className="grid gap-2.5">
              <Label htmlFor="personas">Cantidad de personas</Label>
              <Input
                id="personas"
                type="number"
                min={PERSONAS_MIN}
                max={PERSONAS_MAX}
                required
                value={personas}
                onChange={(e) => setPersonas(e.target.value)}
                className="max-w-32"
              />
            </div>

            <div className="grid gap-2.5">
              <Label htmlFor="restricciones">Restricciones o cosas que no comen</Label>
              <Textarea
                id="restricciones"
                placeholder="Ej: sin gluten, sin lácteos, no come carne roja... (opcional)"
                value={restricciones}
                onChange={(e) => setRestricciones(e.target.value)}
                maxLength={300}
                rows={3}
              />
            </div>

            <div className="grid gap-7 sm:grid-cols-2">
              <div className="grid gap-2.5">
                <Label htmlFor="presupuesto">Presupuesto</Label>
                <Select value={presupuesto} onValueChange={setPresupuesto} items={OPCIONES_PRESUPUESTO}>
                  <SelectTrigger id="presupuesto" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPCIONES_PRESUPUESTO.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2.5">
                <Label htmlFor="tiempo">Tiempo para cocinar entre semana</Label>
                <Select value={tiempo} onValueChange={setTiempo} items={OPCIONES_TIEMPO}>
                  <SelectTrigger id="tiempo" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPCIONES_TIEMPO.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {errorAdelanto && (
              <Alert variant="destructive">
                <AlertTitle>No pudimos generar el adelanto</AlertTitle>
                <AlertDescription>{errorAdelanto}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="pb-10 sm:pb-12">
            <Button type="submit" disabled={cargandoAdelanto} className="w-full sm:w-auto">
              {cargandoAdelanto ? (
                <>
                  <Loader2 className="animate-spin" /> Armando tu adelanto...
                </>
              ) : (
                <>
                  <Sparkles /> Generar adelanto gratis
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {adelanto && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-heading text-xl font-medium tracking-tight">Tu adelanto gratis</h2>
            <p className="text-sm text-muted-foreground">
              Lunes y martes, con almuerzo y cena. El resto de la semana llega con el plan completo.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DiaPreview nombre="Lunes" almuerzo={adelanto.lunes?.almuerzo} cena={adelanto.lunes?.cena} />
            <DiaPreview nombre="Martes" almuerzo={adelanto.martes?.almuerzo} cena={adelanto.martes?.cena} />
          </div>

          <Separator />

          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent [--card-spacing:--spacing(7)] sm:[--card-spacing:--spacing(8)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="size-5" />
                Recibí la semana completa
              </CardTitle>
              <CardDescription>
                Los 7 días (almuerzo y cena) más la lista de compras, listos por email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorPago && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>No pudimos iniciar el pago</AlertTitle>
                  <AlertDescription>{errorPago}</AlertDescription>
                </Alert>
              )}
              <Button onClick={irAPagar} disabled={cargandoPago} size="lg" className="w-full sm:w-auto">
                {cargandoPago ? (
                  <>
                    <Loader2 className="animate-spin" /> Iniciando el pago...
                  </>
                ) : (
                  <>
                    <Lock /> Pagar y recibir la semana completa
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function DiaPreview({ nombre, almuerzo, cena }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {nombre}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <div className="flex gap-2">
          <Sun className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium text-muted-foreground">Almuerzo</p>
            <p>{almuerzo}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <MoonStar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium text-muted-foreground">Cena</p>
            <p>{cena}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
