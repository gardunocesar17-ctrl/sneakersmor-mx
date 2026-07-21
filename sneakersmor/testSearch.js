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
    
  const keyword = '9060';
  const found = allAirfireProducts.filter(p => p.title.toLowerCase().includes(keyword));
  console.log(`Products matching ${keyword}:`, found.map(f => f.handle));
}
test();
