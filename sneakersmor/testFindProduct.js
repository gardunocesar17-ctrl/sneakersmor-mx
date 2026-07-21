async function test() {
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`https://airfire.com.mx/products.json?limit=250&page=${page}`);
    const data = await res.json();
    const product = data.products?.find(p => p.handle === 'tenis-270-negro-total');
    if (product) {
      console.log(`Found product on page ${page}!`);
      const variant = product.variants.find(v => v.title === '23.5');
      console.log("Variant 23.5:", variant);
      return;
    }
  }
  console.log("Product not found anywhere!");
}
test();
