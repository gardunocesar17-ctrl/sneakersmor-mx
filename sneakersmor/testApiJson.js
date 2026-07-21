async function test() {
  const res = await fetch("https://airfire.com.mx/products.json?limit=250");
  const data = await res.json();
  const product = data.products.find(p => p.handle === 'tenis-270-negro-total');
  if (product) {
    console.log("Found product!");
    const variant225 = product.variants.find(v => v.title === '22.5');
    console.log("Variant 22.5 available:", variant225?.available);
  } else {
    console.log("Product not found in page 1");
  }
}
test();
