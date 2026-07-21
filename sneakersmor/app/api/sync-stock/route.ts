import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { productos } from "@/lib/data";

export const dynamic = 'force-dynamic'; // EVITA QUE VERCEL CACHEE ESTA RUTA
export const maxDuration = 60; // Para Vercel Pro

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const offsetStr = searchParams.get('offset') || '0';
    const offset = parseInt(offsetStr, 10);
    const limit = 30; // Max products to scrape per request

    const invRef = doc(db, "store", "inventory");
    const invSnap = await getDoc(invRef);
    const purchased = invSnap.exists() ? invSnap.data() : {};

    let actualizadosCount = 0;
    
    // Obtener TODAS las páginas (Airfire solo tiene ~480 productos, así que con 3 páginas de 250 es suficiente)
    const pagePromises = Array.from({ length: 3 }, (_, i) => i + 1).map(page => 
      fetch(`https://airfire.com.mx/products.json?limit=250&page=${page}`, { cache: 'no-store' })
        .then(res => res.ok ? res.json() : null)
        .catch(() => null)
    );
    
    const pages = await Promise.all(pagePromises);
    const allAirfireProducts = pages
      .filter(p => p && p.products)
      .flatMap(p => p.products);

    // Cruzar el catálogo
    const productsToScrape: any[] = [];
    
    productos.forEach((localProduct: any) => {
      const airfireProduct = allAirfireProducts.find(p => p.handle === localProduct.slug);
      let needsScraping = false;
      
      localProduct.tallas.forEach((tallaObj: any) => {
        const key = `${localProduct.id}-${tallaObj.talla}`;
        if (airfireProduct) {
          const variant = airfireProduct.variants.find(
            (v: any) => v.title === tallaObj.talla || v.option1 === tallaObj.talla
          );
          if (!variant || !variant.available) {
            purchased[key] = tallaObj.stock;
            actualizadosCount++;
          } else {
            needsScraping = true;
          }
        } else {
          purchased[key] = tallaObj.stock;
          actualizadosCount++;
        }
      });
      
      if (needsScraping) {
        productsToScrape.push(localProduct);
      }
    });

    // Scraping por offset
    const isFinished = offset + limit >= productsToScrape.length;
    const currentBatch = productsToScrape.slice(offset, offset + limit);

    await Promise.all(currentBatch.map(async (localProduct: any) => {
      try {
        const res = await fetch(`https://airfire.com.mx/products/${localProduct.slug}`, { cache: 'no-store' });
        if (!res.ok) return;
        const html = await res.text();
        
        const airfireProduct = allAirfireProducts.find(p => p.handle === localProduct.slug);
        if (!airfireProduct) return;
        const variants = airfireProduct.variants;
        
        const invRegex = /"(\d+)":\s*\{\s*"inventory_management"[^}]+"inventory_quantity":\s*(-?\d+)/g;
        let invMatch;
        const scrapedInv: Record<string, number> = {};
        while ((invMatch = invRegex.exec(html)) !== null) {
          scrapedInv[invMatch[1]] = parseInt(invMatch[2]);
        }

        localProduct.tallas.forEach((tallaObj: any) => {
          const key = `${localProduct.id}-${tallaObj.talla}`;
          const variant = variants.find((v: any) => v.title === tallaObj.talla || v.option1 === tallaObj.talla);
          
          if (variant && variant.available) {
            const exactStock = scrapedInv[variant.id] !== undefined ? Math.max(0, scrapedInv[variant.id]) : 1;
            purchased[key] = tallaObj.stock - exactStock;
            actualizadosCount++;
          }
        });
      } catch (e) {
        console.error(`Error procesando ${localProduct.slug}:`, e);
      }
    }));

    await setDoc(invRef, purchased);

    return NextResponse.json({ 
      success: true, 
      message: "Inventario sincronizado (Lote)",
      productosTotales: productos.length,
      productosRevisados: currentBatch.length,
      variantesAgotadasPorProveedor: actualizadosCount,
      isFinished,
      nextOffset: offset + limit
    });
  } catch (error: any) {
    console.error("Error sincronizando stock:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
