async function test() {
  const res = await fetch(`https://airfire.com.mx/products.json?limit=250&page=1`);
  const json = await res.json();
  const product = json.products.find(p => p.handle === 'tenis-dunk-niebla-blanco-niebla');
  if (product) {
    product.variants.forEach(v => {
      console.log(`Variant title: ${v.title}, ID: ${v.id}, typeof ID: ${typeof v.id}`);
    });
  }
}
test();
