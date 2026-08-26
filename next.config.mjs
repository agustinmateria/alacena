/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fija la raíz del proyecto para Turbopack. Sin esto, si hay un
  // package-lock.json en una carpeta superior (fuera del repo), Next.js
  // tira un warning de "root ambiguo" al buildear.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
