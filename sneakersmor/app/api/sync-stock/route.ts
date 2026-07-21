// Update to trigger Vercel build
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { productos } from "@/lib/data";

export const dynamic = 'force-dynamic'; // EVITA QUE VERCEL CACHEE ESTA RUTA
export const maxDuration = 60; // Para Vercel Pro (no afecta en hobby, pero ayuda si tienen pro)

export async function GET(request: Request) {
  try {
    const invRef = doc(db, "store", "inventory");
    const invSnap = await getDoc(invRef);
    const purchased = invSnap.exists() ? invSnap.data() : {};

    let actualizadosCount = 0;
    let allAirfireProducts: any[] = [];
    let page = 1;
    let hasMore = true;

    // 1. Obtenemos TODOS los productos rápidamente desde el JSON (tarda < 1 segundo)
    while (hasMore && page <= 20) {
      const res = await fetch(`https://airfire.com.mx/products.json?limit=250&page=${page}`, { cache: 'no-store' });
      if (!res.ok) break;
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        allAirfireProducts = [...allAirfireProducts, ...data.products];
        page++;
      } else {
        hasMore = false;
      }
    }

    // Identificamos qué productos de Airfire realmente están disponibles (stock > 0)
    // Para no hacer web scraping innecesario.
    const productsToScrape: any[] = [];
    
    // Primero, cruzamos el catálogo rápido
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
            // Si la variante NO existe o NO está disponible, stock = 0
            purchased[key] = tallaObj.stock;
            actualizadosCount++;
          } else {
            // Si SÍ está disponible, NECESITAMOS raspar el HTML para saber la cantidad exacta
            needsScraping = true;
          }
        } else {
          // Modelo completo eliminado en Airfire
          purchased[key] = tallaObj.stock;
          actualizadosCount++;
        }
      });
      
      if (needsScraping) {
        productsToScrape.push(localProduct);
      }
    });

    // 2. Ahora SOLO raspamos el HTML de los que SÍ tienen stock, en lotes de 15
    const chunkSize = 15;
    for (let i = 0; i < productsToScrape.length; i += chunkSize) {
      const chunk = productsToScrape.slice(i, i + chunkSize);
      
      await Promise.all(chunk.map(async (localProduct: any) => {
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
              // Si la pudimos raspar, usamos el número exacto. Si falló el scrapeo por algún motivo, asumimos que al menos hay 1 (ya que available = true)
              const exactStock = scrapedInv[variant.id] !== undefined ? Math.max(0, scrapedInv[variant.id]) : 1;
              purchased[key] = tallaObj.stock - exactStock;
              actualizadosCount++;
            }
          });
        } catch (e) {
          console.error(`Error procesando ${localProduct.slug}:`, e);
        }
      }));
    }

    await setDoc(invRef, purchased);

    return NextResponse.json({ 
      success: true, 
      message: "Inventario sincronizado con éxito",
      productosTotales: productos.length,
      productosRevisados: productsToScrape.length,
      variantesAgotadasPorProveedor: actualizadosCount
    });
  } catch (error: any) {
    console.error("Error sincronizando stock:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
