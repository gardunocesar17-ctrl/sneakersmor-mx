async function test() {
  const pagesPromises = [1, 2, 3].map(page => 
    fetch(`https://airfire.com.mx/products.json?limit=250&page=${page}`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
  );
  const pages = await Promise.all(pagesPromises);
  const allAirfireProducts = pages.filter(p => p && p.products).flatMap(p => p.products);
  
  const found = allAirfireProducts.find(p => p.handle === 'tenis-dunk-niebla-blanco-niebla');
  console.log("Total Airfire products scraped:", allAirfireProducts.length);
  console.log("Found Niebla:", !!found);
}
test();
