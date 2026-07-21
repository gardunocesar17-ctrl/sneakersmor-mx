async function test() {
  const pagePromises = Array.from({ length: 3 }, (_, i) => i + 1).map(page => 
    fetch(`https://airfire.com.mx/products.json?limit=250&page=${page}`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null)
  );
  
  const pages = await Promise.all(pagePromises);
  const allAirfireProducts = pages
    .filter(p => p && p.products)
    .flatMap(p => p.products);
    
  const product = allAirfireProducts.find(p => p.handle === 'tenis-dunk-niebla-blanco-niebla');
  if (product) {
    console.log("Found product:", product.title);
    product.variants.forEach(v => {
      console.log(`Variant title: ${v.title}, available: ${v.available}`);
    });
  } else {
    console.log("Product not found");
  }
}
test();
