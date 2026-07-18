import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://sneakersmor.mx"),
  title: {
    default: "SneakersMor.MX — Sneakers al mayoreo y menudeo",
    template: "%s · SneakersMor.MX",
  },
  description:
    "Tienda de sneakers en México. Catálogo variado, envíos a todo el país y paquetes de emprendimiento para venta al mayoreo.",
  openGraph: {
    title: "SneakersMor.MX",
    description: "Sneakers al mayoreo y menudeo, envíos a todo México.",
    url: "https://sneakersmor.mx",
    siteName: "SneakersMor.MX",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SneakersMor.MX",
    description: "Sneakers al mayoreo y menudeo, envíos a todo México.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${inter.variable} ${bricolage.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-ember text-chalk px-3 py-2 z-[100]">
                Saltar al contenido
              </a>
              <Header />
              <CartDrawer />
              <main id="contenido">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
