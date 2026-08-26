@AGENTS.md

# Alacena — mapa del proyecto

Proyecto didáctico para una clase en vivo. La UI está terminada. Hay
cinco integraciones sin implementar, marcadas con `// TODO:`.

## Regla número uno para agentes

**No implementes los `// TODO:` a menos que el usuario lo pida de forma
explícita para ese hueco puntual.** Los huecos son el ejercicio de la
clase. Si te piden "arreglá esto" o "hacé que ande", preguntá primero si
quieren que completes un TODO. Trabajar en otra parte del repo (estilos,
copy, componentes, la página `/estado`) es libre.

## Stack

- Next.js 16 · App Router · React 19
- JavaScript, sin TypeScript, a propósito. No conviertas archivos a `.ts`.
- Tailwind CSS v4 (config en `app/globals.css`, sin `tailwind.config`)
- shadcn/ui sobre Base UI (`@base-ui/react`), en `components/ui/`
- Stripe · Resend · Gemini (vía el SDK de `openai` apuntando al endpoint
  compatible de Google)
- Sin base de datos y sin autenticación

## Versión de Next.js

Este repo usa una versión de Next.js con cambios respecto de lo que
podés tener memorizado. **Antes de escribir código de Next, leé la guía
correspondiente en `node_modules/next/dist/docs/`.** Ejemplo concreto ya
usado en el repo: para render por request se usa `await connection()` de
`next/server`, no `export const dynamic`.

## Rutas

| Ruta | Archivo | Qué hace |
|---|---|---|
| `/` | `app/page.js` | Formulario, adelanto gratis, botón de pago |
| `/estado` | `app/estado/page.js` | Diagnóstico: qué variables de entorno faltan |
| `/exito` | `app/exito/page.js` | Vuelta desde Stripe tras pagar |
| `/cancelado` | `app/cancelado/page.js` | Vuelta desde Stripe sin pagar |
| `POST /api/adelanto` | `app/api/adelanto/route.js` | Devuelve lunes y martes |
| `POST /api/checkout` | `app/api/checkout/route.js` | Devuelve la URL de pago |
| `POST /api/webhooks/stripe` | `app/api/webhooks/stripe/route.js` | Recibe el aviso de pago |

## Dónde está cada cosa

```
lib/llm.js                todo el contacto con el LLM pasa por acá
lib/enviar-plan.js         todo el envío de email pasa por acá
lib/opciones.js            valores de los selects (fuente única de verdad)
lib/validacion.js          validación de los datos del formulario
lib/variables-entorno.js   lista de env vars, la consume /estado
lib/utils.js               helper `cn()`

components/formulario-alacena.jsx   client component, el único con estado
components/resultado-pago.jsx        las 3 pantallas de /exito
components/site-header.jsx           header
components/ui/                       shadcn, no editar salvo pedido
```

## Flujo de datos

1. El usuario completa el formulario en el cliente.
2. `POST /api/adelanto` valida y pide al LLM dos días. Se muestran gratis.
3. `POST /api/checkout` valida y crea la sesión de pago. Como no hay base
   de datos, **los cuatro campos del formulario viajan dentro de la
   sesión de Stripe**.
4. Stripe redirige a `/exito`, que verifica el pago del lado del servidor.
5. En paralelo, Stripe llama a `/api/webhooks/stripe`. Ahí se recuperan
   los datos del formulario, se genera la semana completa y se envía el
   email.

## Convenciones

- **Idioma:** código, nombres de archivo, funciones, variables, comentarios
  y textos de UI, todo en español rioplatense (voseo: "armá", "tocá").
  Los nombres de archivo van en `kebab-case`.
- **Degradación elegante:** si falta una API key, la app no rompe. Devuelve
  datos de ejemplo (`lib/llm.js`) o un mensaje claro. Mantené ese
  comportamiento en cualquier código nuevo.
- **Secretos:** las claves se leen solo con `process.env` del lado del
  servidor. Nunca hardcodear una clave. Nunca exponer el *valor* de una
  variable en la UI ni en una respuesta de API — `/estado` muestra solo
  si existe o no.
- **Validación:** todo endpoint que reciba datos del formulario llama a
  `validarDatosFormulario()` antes de tocar una API externa.
- **Server vs client:** por defecto server components. `"use client"` solo
  donde hace falta estado o eventos. Hoy el único es
  `components/formulario-alacena.jsx`.
- **Imports:** alias `@/` para la raíz (configurado en `jsconfig.json`).
- **Estilos:** clases de Tailwind y tokens de tema (`text-muted-foreground`,
  `bg-card`, `border-border`). No uses colores literales salvo los estados
  verde/rojo de `/estado`, que ya están puestos.
- **Webhooks:** el body de un webhook de Stripe se lee con `req.text()`,
  nunca con `req.json()`.

## Variables de entorno

`GEMINI_API_KEY` · `RESEND_API_KEY` · `STRIPE_SECRET_KEY` ·
`STRIPE_WEBHOOK_SECRET` · `NEXT_PUBLIC_BASE_URL`

Detalle y links en `.env.example` y en el README. Si agregás o sacás una
variable, actualizá los tres lugares: `.env.example`,
`lib/variables-entorno.js` y el README.

## Comandos

```bash
npm run dev     # desarrollo
npm run build   # build de producción
npm run lint    # eslint
```

Tanto `dev` como `build` tienen que funcionar sin ningún archivo `.env`
presente. Si un cambio tuyo rompe eso, es un bug.
