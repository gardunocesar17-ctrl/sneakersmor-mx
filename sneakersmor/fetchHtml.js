async function test() {
  const res = await fetch("https://airfire.com.mx/products/tenis-max-90-gris-blanco");
  const html = await res.text();
  const fs = require('fs');
  fs.writeFileSync('airfire_product.html', html);
  console.log("Saved to airfire_product.html");
}
test();
