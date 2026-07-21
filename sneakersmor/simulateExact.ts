import { productos } from './lib/data.ts';

async function test() {
  const pagePromises = Array.from({ length: 3 }, (_, i) => i + 1).map(page => 
    fetch(`https://airfire.com.mx/products.json?limit=250&page=${page}`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null)
  );
  const pages = await Promise.all(pagePromises);
  const allAirfireProducts = pages.filter(p => p && p.products).flatMap(p => p.products);
  
  let matchCount = 0;
  for (const localProduct of productos) {
    const airfireProduct = allAirfireProducts.find(p => p.handle === localProduct.slug);
    if (!airfireProduct) continue;
    
    // Found a match
    matchCount++;
    if (matchCount > 1) continue; // Just test the first matching product
    
    console.log("Testing with product:", localProduct.slug);
    const res = await fetch(`https://airfire.com.mx/products/${localProduct.slug}`);
    const html = await res.text();
    
    const invRegex = /"(\d+)":\s*\{\s*"inventory_management"[^}]+"inventory_quantity":\s*(-?\d+)/g;
    let invMatch;
    const scrapedInv: Record<string, number> = {};
    while ((invMatch = invRegex.exec(html)) !== null) {
      scrapedInv[invMatch[1]] = parseInt(invMatch[2]);
    }
    
    console.log("Scraped Inventory from HTML length:", Object.keys(scrapedInv).length);
    console.log("Airfire Variants length:", airfireProduct.variants.length);
    
    localProduct.tallas.forEach((tallaObj: any) => {
      const variant = airfireProduct.variants.find((v: any) => v.title === tallaObj.talla || v.option1 === tallaObj.talla);
      if (!variant || !variant.available) {
        console.log(`Size ${tallaObj.talla} -> No variant or not available`);
      } else {
        const exactStock = scrapedInv[variant.id] !== undefined ? Math.max(0, scrapedInv[variant.id]) : 1;
        const purchased = tallaObj.stock - exactStock;
        const finalStock = Math.max(0, tallaObj.stock - purchased);
        console.log(`Size ${tallaObj.talla} -> variant.id: ${variant.id}, scraped: ${scrapedInv[variant.id]}, exactStock: ${exactStock}, final stock: ${finalStock}`);
      }
    });
  }
}
test();
