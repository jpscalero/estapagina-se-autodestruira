import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "Esta Página Se Autodestruirá en 24 Horas",
  description: "Lee y envía mensajes anónimos. Si la página no recibe ningún mensaje nuevo durante 24 horas consecutivas, todos los mensajes y la base de datos se autodestruirán para siempre.",
  keywords: ["autodestrucción", "mensajes anónimos", "chat anónimo", "24 horas", "secreto", "this page will self destruct"],
  authors: [{ name: "jpscalero" }],
  openGraph: {
    title: "Esta Página Se Autodestruirá 💣",
    description: "Si nadie escribe un mensaje en 24 horas, la página se borrará para siempre. ¿Qué quieres decir antes de que sea demasiado tarde?",
    url: "https://estapagina-se-autodestruira.vercel.app", // Adjust if using custom domain
    siteName: "Esta Página Se Autodestruirá",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Esta Página Se Autodestruirá 💣",
    description: "Si nadie escribe en 24 horas, la página se borrará para siempre. Escribe algo anónimo.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google94551efdfd402df3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
