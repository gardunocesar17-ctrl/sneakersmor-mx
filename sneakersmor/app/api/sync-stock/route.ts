import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { productos } from '@/lib/data';

export async function GET() {
  try {
    const invRef = doc(db, "store", "inventory");
    const invSnap = await getDoc(invRef);
    const purchased = invSnap.exists() ? invSnap.data() : {};

    let actualizadosCount = 0;

    // Procesamos en lotes de 5 para no saturar ni hacer timeout rápido
    const chunkSize = 5;
    for (let i = 0; i < productos.length; i += chunkSize) {
      const chunk = productos.slice(i, i + chunkSize);
      
      await Promise.all(chunk.map(async (localProduct) => {
        try {
          const res = await fetch(`https://airfire.com.mx/products/${localProduct.slug}`);
          if (!res.ok) {
            // Si el producto ya no existe en la página, ponemos todo en stock 0
            localProduct.tallas.forEach(t => {
              purchased[`${localProduct.id}-${t.talla}`] = t.stock;
              actualizadosCount++;
            });
            return;
          }
          const html = await res.text();
          
          // Extraer cantidades exactas del HTML usando Regex sobre window.inventories
          // formato esperado en HTML de Shopify: "id_variante": {"inventory_quantity": 2}
          const exactQuantities: Record<string, number> = {};
          
          // Primero buscamos el objeto meta de la variante para saber los IDs y títulos
          const metaMatch = html.match(/var meta = (\{.*?\});/s);
          if (metaMatch) {
            const meta = JSON.parse(metaMatch[1]);
            const variants = meta.product?.variants || [];
            
            // Luego buscamos las cantidades de inventario en todo el HTML
            const invRegex = /"(\d+)":\s*\{\s*"inventory_management"[^}]+"inventory_quantity":\s*(-?\d+)/g;
            let invMatch;
            const scrapedInv: Record<string, number> = {};
            while ((invMatch = invRegex.exec(html)) !== null) {
              scrapedInv[invMatch[1]] = parseInt(invMatch[2]);
            }

            localProduct.tallas.forEach(tallaObj => {
              const key = `${localProduct.id}-${tallaObj.talla}`;
              
              // Buscar el ID de la variante que corresponde a esta talla
              const variant = variants.find((v: any) => v.public_title === tallaObj.talla || v.name?.includes(tallaObj.talla) || v.option1 === tallaObj.talla);
              
              if (variant) {
                const exactStock = scrapedInv[variant.id] !== undefined ? scrapedInv[variant.id] : (variant.inventory_quantity || 0);
                // Si el stock exacto es menor a 0 (ej. sobrevendido), lo tratamos como 0
                const safeStock = Math.max(0, exactStock);
                
                // Calculamos el offset (purchased) para que la tienda muestre exactamente safeStock
                // La fórmula es: stock_real = stock_original - purchased
                // Por lo tanto: purchased = stock_original - stock_real
                purchased[key] = tallaObj.stock - safeStock;
                actualizadosCount++;
              } else {
                // Variante no encontrada en Airfire, marcamos como agotado
                purchased[key] = tallaObj.stock;
                actualizadosCount++;
              }
            });
          }
        } catch (e) {
          console.error(`Error procesando ${localProduct.slug}:`, e);
        }
      }));
    }

    await setDoc(invRef, purchased);

    return NextResponse.json({ 
      success: true, 
      message: "Inventario sincronizado con éxito",
      productosRevisados: productos.length,
      variantesSincronizadas: actualizadosCount
    });
  } catch (error: any) {
    console.error("Error sincronizando stock:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
