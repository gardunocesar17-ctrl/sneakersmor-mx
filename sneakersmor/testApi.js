async function test() {
  const res = await fetch("https://airfire.com.mx/products/tenis-max-90-gris-blanco.js");
  const data = await res.json();
  const sizes = data.variants.map(v => ({ title: v.title, inventory_quantity: v.inventory_quantity, available: v.available }));
  console.log(sizes);
}
test();
