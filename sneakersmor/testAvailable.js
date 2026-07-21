const fs = require('fs');

async function test() {
  const pagePromises = Array.from({ length: 20 }, (_, i) => i + 1).map(page => 
    fetch(`https://airfire.com.mx/products.json?limit=250&page=${page}`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null)
  );
  
  const pages = await Promise.all(pagePromises);
  const allAirfireProducts = pages
    .filter(p => p && p.products)
    .flatMap(p => p.products);
    
  let availableMatches = 0;
  
  const content = fs.readFileSync('./lib/data.ts', 'utf-8');
  const slugs = [...content.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1]);
  
  slugs.forEach(slug => {
    const found = allAirfireProducts.find(p => p.handle === slug);
    if (found) {
      if (found.variants.some(v => v.available)) {
        availableMatches++;
      }
    }
  });
  
  console.log(`Matched ${slugs.length} slugs.`);
  console.log(`Products with at least one available variant: ${availableMatches}`);
}

test();
