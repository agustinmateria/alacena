import Link from "next/link";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata = {
  title: "Alacena — Tu menú semanal, sin pensarlo",
  description:
    "Contanos cuántos son, qué no comen, tu presupuesto y tu tiempo. Alacena arma tu menú semanal y la lista de compras.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div aria-hidden="true" className="grain-overlay" />
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
          {children}
        </main>
        <footer className="border-t border-border/70 py-8 text-center text-xs text-muted-foreground">
          Alacena — proyecto didáctico ·{" "}
          <Link href="/estado" className="underline underline-offset-4 hover:text-foreground">
            Estado de la configuración
          </Link>
        </footer>
      </body>
    </html>
  );
}
