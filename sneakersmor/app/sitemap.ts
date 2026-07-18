import { MetadataRoute } from "next";
import { productos } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sneakersmor.mx";
  const estaticas = ["", "/tienda", "/carrito", "/checkout"].map((ruta) => ({
    url: `${base}${ruta}`,
    lastModified: new Date(),
  }));
  const productosUrls = productos.map((p) => ({
    url: `${base}/producto/${p.slug}`,
    lastModified: new Date(),
  }));
  return [...estaticas, ...productosUrls];
}
