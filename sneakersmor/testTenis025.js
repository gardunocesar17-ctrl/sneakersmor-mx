async function test() {
  const pagesPromises = [1, 2, 3, 4, 5, 6].map(page => 
    fetch(`https://airfire.com.mx/products.json?limit=250&page=${page}`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
  );
  const pages = await Promise.all(pagesPromises);
  const allAirfireProducts = pages.filter(p => p && p.products).flatMap(p => p.products);
  
  const product = allAirfireProducts.find(p => p.handle === 'tenis-025-plata-blanco-negro');
  if (product) {
    console.log("Found:", product.handle);
  } else {
    console.log("NOT FOUND in 6 pages");
    
    // Check if it exists at all
    const directRes = await fetch(`https://airfire.com.mx/products/tenis-025-plata-blanco-negro.js`);
    console.log("Direct fetch status:", directRes.status);
  }
}
test();
