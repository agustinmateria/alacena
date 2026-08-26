import { NextResponse } from "next/server";
import { generarAdelanto } from "@/lib/llm";
import { validarDatosFormulario } from "@/lib/validacion";

export async function POST(req) {
  const datos = await req.json();

  const errorValidacion = validarDatosFormulario(datos);
  if (errorValidacion) {
    return NextResponse.json({ error: errorValidacion }, { status: 400 });
  }

  try {
    const adelanto = await generarAdelanto(datos);
    return NextResponse.json(adelanto);
  } catch (error) {
    console.error("Error generando el adelanto:", error);
    return NextResponse.json(
      { error: "No pudimos generar el adelanto. Intentá de nuevo." },
      { status: 500 }
    );
  }
}
