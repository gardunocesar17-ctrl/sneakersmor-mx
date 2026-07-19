import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { productos } from '@/lib/data';

export async function GET() {
  try {
    let allAirfireProducts: any[] = [];
    let page = 1;
    let hasMore = true;

    // Obtenemos los productos del proveedor (Airfire) usando la API oculta de Shopify
    while (hasMore) {
      const res = await fetch(`https://airfire.com.mx/products.json?limit=250&page=${page}`);
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        allAirfireProducts = [...allAirfireProducts, ...data.products];
        page++;
      } else {
        hasMore = false;
      }
    }

    // Obtenemos nuestro inventario actual de Firebase
    const invRef = doc(db, "store", "inventory");
    const invSnap = await getDoc(invRef);
    const purchased = invSnap.exists() ? invSnap.data() : {};

    let agotadosCount = 0;

    // Comparamos nuestro catálogo local con el del proveedor
    productos.forEach(localProduct => {
      const airfireProduct = allAirfireProducts.find((p: any) => p.handle === localProduct.slug);
      
      localProduct.tallas.forEach(tallaObj => {
        const key = `${localProduct.id}-${tallaObj.talla}`;
        
        if (airfireProduct) {
          const variant = airfireProduct.variants.find(
            (v: any) => v.title === tallaObj.talla || v.option1 === tallaObj.talla
          );
          
          if (!variant || !variant.available) {
            // El proveedor ya NO tiene esta talla disponible.
            // Marcamos como agotado en nuestra tienda igualando "purchased" al stock original
            purchased[key] = tallaObj.stock; 
            agotadosCount++;
          }
          // Si SÍ está disponible en el proveedor, no hacemos nada.
          // Dejamos que nuestro contador de 'purchased' local siga funcionando normal.
        } else {
          // El modelo completo fue eliminado de la página del proveedor
          purchased[key] = tallaObj.stock;
          agotadosCount++;
        }
      });
    });

    // Guardamos la actualización en Firebase
    await setDoc(invRef, purchased);

    return NextResponse.json({ 
      success: true, 
      message: "Inventario sincronizado con éxito",
      productosRevisados: productos.length,
      variantesAgotadasPorProveedor: agotadosCount
    });
  } catch (error: any) {
    console.error("Error sincronizando stock:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
