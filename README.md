# Alacena 🥘

Alacena arma tu menú de la semana. Le contás cuántos son en casa, qué no
comen, cuánta plata querés gastar y cuánto tiempo tenés para cocinar, y
te devuelve un plan de comidas y la lista de compras.

Es el proyecto de una clase en vivo. La pantalla ya está hecha. Lo que
falta son cinco integraciones con servicios externos (pagos, email e
inteligencia artificial), y eso es lo que se completa en clase.

---

## 1. Ponerlo online (Deploy)

Apretá este botón. Te va a pedir crear una cuenta en Vercel (gratis) y
copiar este proyecto a tu propio GitHub. En unos minutos tenés tu app
funcionando en internet, con su propia dirección.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/agustinmateria/menu-semanal)

**No te va a pedir ninguna clave.** Eso es a propósito. Primero se pone
online, después se cargan las claves. Ver el [punto 5](#5-cómo-cargar-las-claves-en-vercel).

Mientras no haya claves cargadas, la app igual funciona: muestra un menú
de ejemplo en vez de romperse.

---

## 2. Correrlo en tu computadora

### Requisitos

Necesitás **Node.js versión 20 o más nueva**. Node.js es el programa que
hace funcionar la app en tu computadora.

Para ver qué versión tenés, abrí una terminal y escribí:

```bash
node -v
```

Si te dice `v20.` o un número más alto, estás bien. Si te dice menos que
eso, o si te dice que no encuentra el comando, bajalo de
[nodejs.org](https://nodejs.org) (la opción **LTS**).

Si usás `nvm` o `fnm`, escribí `nvm use` dentro de la carpeta y te pone
sola la versión correcta (está anotada en el archivo `.nvmrc`).

### Los comandos

Copiá y pegá esto en la terminal, uno por uno:

```bash
git clone https://github.com/agustinmateria/menu-semanal.git
cd menu-semanal
npm install
cp .env.example .env.local
npm run dev
```

Qué hace cada uno:

| Comando | Qué hace |
|---|---|
| `git clone ...` | Baja una copia del proyecto a tu computadora. |
| `cd menu-semanal` | Te mete adentro de la carpeta del proyecto. |
| `npm install` | Baja las piezas que el proyecto necesita para andar. Tarda un rato la primera vez. |
| `cp .env.example .env.local` | Crea tu archivo de claves, vacío por ahora. |
| `npm run dev` | Enciende la app. |

Cuando termine, abrí **http://localhost:3000** en el navegador.

Para apagarla, volvé a la terminal y apretá `Ctrl` + `C`.

---

## 3. Las claves (variables de entorno)

### Qué es una variable de entorno

Es una clave secreta que la app necesita para hablar con otro servicio.
Por ejemplo, para mandar un email, la app le tiene que demostrar a Resend
que sos vos. Eso se hace con una clave.

Esas claves **no se escriben dentro del código**. Se guardan aparte, en
un archivo llamado `.env.local`. Ese archivo nunca se sube a GitHub, así
nadie te roba las claves.

El archivo `.env.example` sí se sube, pero va vacío: es solo la lista de
qué claves hacen falta.

⚠️ **Nunca pegues una clave dentro de un archivo `.js`.** Siempre van en
`.env.local`.

### Las cinco claves

| Clave | Para qué sirve | De dónde se saca |
|---|---|---|
| `GEMINI_API_KEY` | Le pide a la inteligencia artificial de Google que arme el menú. | https://aistudio.google.com/apikey |
| `RESEND_API_KEY` | Manda el email con el menú completo. | https://resend.com/api-keys |
| `STRIPE_SECRET_KEY` | Cobra el pago y después verifica que se haya pagado. | https://dashboard.stripe.com/test/apikeys |
| `STRIPE_WEBHOOK_SECRET` | Comprueba que el aviso de "ya te pagaron" venga de Stripe de verdad. | https://dashboard.stripe.com/test/webhooks |
| `NEXT_PUBLIC_BASE_URL` | La dirección de tu app, para volver a ella después de pagar. | En tu computadora: `http://localhost:3000`. Online: la dirección que te dio Vercel. |

Sobre `STRIPE_WEBHOOK_SECRET`: esta clave **todavía no existe** cuando
deployás. Se genera después, cuando creás el webhook en Stripe. Por eso
el botón de deploy no la pide.

### Cómo saber cuáles te faltan

Abrí **`/estado`** en tu app (por ejemplo
`http://localhost:3000/estado`). Es una tabla con las cinco claves:
verde si está cargada, roja si falta.

Esa página nunca muestra el valor de una clave. Solo te dice si existe o
no.

Si algo no anda, mirá `/estado` antes que nada.

---

## 4. Los cinco huecos del código (TODO)

Estos son los cinco lugares que se completan en clase. Cada uno ya tiene
el código de ejemplo escrito y comentado arriba, listo para descomentar y
ajustar.

| # | Archivo | Línea | Qué integración va ahí |
|---|---|---|---|
| 1 | [`lib/llm.js`](lib/llm.js#L26) | 26 | Llamada a la inteligencia artificial (Gemini) para armar el menú. |
| 2 | [`lib/enviar-plan.js`](lib/enviar-plan.js#L43) | 43 | Envío del email con el plan completo (Resend). |
| 3 | [`app/api/checkout/route.js`](app/api/checkout/route.js#L22) | 22 | Creación del link de pago (Stripe Checkout). |
| 4 | [`app/api/webhooks/stripe/route.js`](app/api/webhooks/stripe/route.js#L23) | 23 | Verificación de la firma del webhook y envío del plan tras el pago. |
| 5 | [`app/exito/page.js`](app/exito/page.js#L31) | 31 | Verificación del pago en la pantalla de éxito. |

Las líneas son aproximadas: si editás el archivo, se mueven. Para
encontrarlos rápido, buscá el texto `TODO:` en tu editor.

---

## 5. Cómo cargar las claves en Vercel

1. Entrá a [vercel.com](https://vercel.com) y abrí tu proyecto.
2. Arriba, tocá **Settings**.
3. En el menú de la izquierda, tocá **Environment Variables**.
4. En **Key** escribí el nombre de la clave (por ejemplo
   `GEMINI_API_KEY`). En **Value** pegá el valor.
5. Tocá **Save**.
6. Repetí para cada clave.

### ⚠️ Hay que redeployar

Vercel **no** aplica las claves nuevas solas. La app sigue andando con
las de antes hasta que la vuelvas a publicar.

Para redeployar:

1. Andá a la solapa **Deployments**.
2. En el deploy de más arriba, tocá el botón de los tres puntos `···`.
3. Elegí **Redeploy** y confirmá.

Esperá a que termine, después abrí `/estado` en tu app. Ahí tienen que
aparecer en verde las claves que cargaste.

---

## 6. Cómo está armado el proyecto

```
app/
  page.js                       la pantalla principal: formulario y adelanto
  estado/page.js                 la tabla de claves configuradas
  exito/page.js                  a dónde volvés después de pagar
  cancelado/page.js              a dónde volvés si cancelás el pago
  api/adelanto/route.js          arma el adelanto gratis (lunes y martes)
  api/checkout/route.js          arma el link de pago
  api/webhooks/stripe/route.js   escucha el aviso de pago de Stripe
lib/
  llm.js                        habla con la inteligencia artificial
  enviar-plan.js                 manda el email
  opciones.js                    las opciones de los desplegables
  validacion.js                  revisa que los datos del formulario estén bien
  variables-entorno.js           la lista de claves que usa /estado
components/
  formulario-alacena.jsx         el formulario
  resultado-pago.jsx             las pantallas de resultado del pago
  site-header.jsx                el encabezado
  ui/                            botones, tarjetas y demás piezas visuales
```

No hay base de datos ni cuentas de usuario. Los datos del formulario
viajan adentro del pago de Stripe, y vuelven de ahí cuando llega el aviso
de que se pagó.

---

## Herramientas que usa

Next.js · React · Tailwind CSS · shadcn/ui · Stripe (pagos) · Resend
(email) · Gemini (inteligencia artificial).

Está escrito en JavaScript, no en TypeScript, a propósito.
