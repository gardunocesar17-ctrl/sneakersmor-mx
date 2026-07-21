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
    
  let matchCount = 0;
  
  // Read data.ts directly to avoid import errors
  const content = fs.readFileSync('./lib/data.ts', 'utf-8');
  // Simple regex to extract slugs
  const slugs = [...content.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1]);
  
  slugs.forEach(slug => {
    const found = allAirfireProducts.find(p => p.handle === slug);
    if (found) matchCount++;
  });
  
  console.log(`Matched ${matchCount} out of ${slugs.length} products by slug/handle.`);
}

test();
