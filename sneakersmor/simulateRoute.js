const { productos } = require('./lib/data.ts');

async function test() {
  const pagePromises = Array.from({ length: 3 }, (_, i) => i + 1).map(page => 
    fetch(`https://airfire.com.mx/products.json?limit=250&page=${page}`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null)
  );
  const pages = await Promise.all(pagePromises);
  const allAirfireProducts = pages.filter(p => p && p.products).flatMap(p => p.products);
  
  const localProduct = productos.find(p => p.slug === 'tenis-new-balance-9060-black-castlerock-importado') || productos[0];
  console.log("Testing with product:", localProduct.slug);
  
  const airfireProduct = allAirfireProducts.find(p => p.handle === localProduct.slug);
  if (!airfireProduct) {
    console.log("Not found in allAirfireProducts!");
    return;
  }
  
  const res = await fetch(`https://airfire.com.mx/products/${localProduct.slug}`);
  const html = await res.text();
  
  const invRegex = /"(\d+)":\s*\{\s*"inventory_management"[^}]+"inventory_quantity":\s*(-?\d+)/g;
  let invMatch;
  const scrapedInv = {};
  while ((invMatch = invRegex.exec(html)) !== null) {
    scrapedInv[invMatch[1]] = parseInt(invMatch[2]);
  }
  
  console.log("Scraped Inventory from HTML:", scrapedInv);
  
  localProduct.tallas.forEach(tallaObj => {
    const variant = airfireProduct.variants.find(v => v.title === tallaObj.talla || v.option1 === tallaObj.talla);
    if (!variant || !variant.available) {
      console.log(`Size ${tallaObj.talla} -> No variant or not available`);
    } else {
      const exactStock = scrapedInv[variant.id] !== undefined ? Math.max(0, scrapedInv[variant.id]) : 1;
      const purchased = tallaObj.stock - exactStock;
      const finalStock = Math.max(0, tallaObj.stock - purchased);
      console.log(`Size ${tallaObj.talla} -> variant.id: ${variant.id}, scraped: ${scrapedInv[variant.id]}, final stock: ${finalStock}`);
    }
  });
}
test();
