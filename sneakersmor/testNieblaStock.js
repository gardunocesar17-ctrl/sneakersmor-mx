async function test() {
  const slug = 'tenis-dunk-niebla-blanco-niebla';
  const res = await fetch(`https://airfire.com.mx/products/${slug}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
  });
  const html = await res.text();
  
  const invRegex = /"(\d+)":\s*\{\s*"inventory_management"[^}]+"inventory_quantity":\s*(-?\d+)/g;
  let invMatch;
  const scrapedInv = {};
  while ((invMatch = invRegex.exec(html)) !== null) {
    scrapedInv[invMatch[1]] = parseInt(invMatch[2]);
  }
  
  console.log("Scraped Inventory:", scrapedInv);
  
  const jsonRes = await fetch(`https://airfire.com.mx/products/${slug}.js`);
  const json = await jsonRes.json();
  
  if (json.variants) {
    json.variants.forEach(v => {
      console.log(`Size: ${v.title}, ID: ${v.id}, Scraped Stock: ${scrapedInv[v.id]}`);
    });
  }
}
test();
