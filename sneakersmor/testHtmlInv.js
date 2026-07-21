async function test() {
  const localProduct = {
    slug: 'tenis-dunk-niebla-blanco-niebla',
    tallas: [{ talla: "22", stock: 80 }]
  };
  
  const res = await fetch(`https://airfire.com.mx/products/${localProduct.slug}`);
  const html = await res.text();
  
  const invRegex = /"(\d+)":\s*\{\s*"inventory_management"[^}]+"inventory_quantity":\s*(-?\d+)/g;
  let invMatch;
  const scrapedInv = {};
  while ((invMatch = invRegex.exec(html)) !== null) {
    scrapedInv[invMatch[1]] = parseInt(invMatch[2]);
  }
  
  console.log("Scraped from HTML:", scrapedInv);
}
test();
