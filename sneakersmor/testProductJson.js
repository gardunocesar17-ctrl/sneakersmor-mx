async function test() {
  const res = await fetch(`https://airfire.com.mx/products/tenis-dunk-niebla-blanco-niebla.js`);
  const json = await res.json();
  console.log("JSON keys:", Object.keys(json));
  if (json.variants) {
    console.log("Variants inventory:", json.variants.map(v => ({ title: v.title, inventory_quantity: v.inventory_quantity })));
  }
}
test();
