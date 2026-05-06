import type { Metadata } from "next";
import { Poppins } from "next/font/google";
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
  openGraph: {
    title: "TikkiGuau® | Collares Personalizados",
    description: "Diseña el collar perfecto para tu perro o gato con TikkiGuau®. Elige entre una variedad de colores, tamaños y estilos para crear un collar único que refleje la personalidad de tu mascota. ¡Haz que tu perro destaque con un collar personalizado de TikkiGuau®!",
    url: "https://app.tikkiguau.com",
    siteName: "TikkiGuau® | Collares Personalizados",
    images: [
      {
        url: "https://app.tikkiguau.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Collares personalizados para perros y gatos de TikkiGuau®",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
