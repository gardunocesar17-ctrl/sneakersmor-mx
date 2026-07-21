const fs = require('fs');

async function test() {
  const res = await fetch("https://airfire.com.mx/products/tenis-270-negro-total");
  const html = await res.text();
  
  const exactQuantities = {};
  
  const metaMatch = html.match(/var meta = (\{.*?\});/s);
  if (metaMatch) {
    const meta = JSON.parse(metaMatch[1]);
    const variants = meta.product?.variants || [];
    console.log("Found", variants.length, "variants in meta.");
    
    const invRegex = /"(\d+)":\s*\{\s*"inventory_management"[^}]+"inventory_quantity":\s*(-?\d+)/g;
    let invMatch;
    const scrapedInv = {};
    while ((invMatch = invRegex.exec(html)) !== null) {
      scrapedInv[invMatch[1]] = parseInt(invMatch[2]);
    }
    console.log("Scraped", Object.keys(scrapedInv).length, "inventories from HTML.");
    
    // Simulate finding talla 23.5
    const tallaStr = "23.5";
    const variant = variants.find(v => v.public_title === tallaStr || (v.name && v.name.includes(tallaStr)) || v.option1 === tallaStr);
    
    if (variant) {
      console.log("Found variant for 23.5:", variant.id);
      const exactStock = scrapedInv[variant.id] !== undefined ? scrapedInv[variant.id] : (variant.inventory_quantity || 0);
      console.log("Calculated exact stock:", exactStock);
    } else {
      console.log("Variant 23.5 not found in meta!");
    }
  } else {
    console.log("Meta not found!");
  }
}
test();
