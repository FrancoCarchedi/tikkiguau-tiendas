import type { Metadata } from "next";
import { Poppins } from "next/font/google";
// import localFont from "next/font/local";
// ↑ Descomentar cuando se agregue el archivo de fuente Marykate en app/fonts/marykate.woff2
// Ver DOCUMENTACION.md → sección "Fuente Marykate — Acción requerida"
import { Providers } from "./providers";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TikkiGuau® | Collares Personalizados",
  description: "Diseña el collar perfecto para tu perro o gato con TikkiGuau®. Elige entre una variedad de colores, tamaños y estilos para crear un collar único que refleje la personalidad de tu mascota. ¡Haz que tu perro destaque con un collar personalizado de TikkiGuau®!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
