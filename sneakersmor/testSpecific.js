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
    
  const product = allAirfireProducts.find(p => p.handle === 'tenis-max-90-dia-de-muertos-importado');
  if (product) {
    console.log("Found product:", product.title);
    const availableVariants = product.variants.filter(v => v.available);
    console.log("Available sizes:", availableVariants.map(v => v.title));
  } else {
    console.log("Product not found on Airfire.");
  }
}
test();
