const fs = require('fs');

async function test() {
  const res = await fetch("https://airfire.com.mx/products/tenis-270-negro-total");
  const html = await res.text();
  
  // Try to find window.inventories specifically
  const invMatch = html.match(/window\.inventories\s*=\s*(\{.*?\});/);
  if (invMatch) {
    try {
      const inventories = JSON.parse(invMatch[1]);
      console.log("Found window.inventories via JSON.parse!");
      console.log(inventories);
    } catch(e) {
      console.log("JSON parse error on inventories", e.message);
    }
  } else {
    console.log("Did not find window.inventories = {...};");
    // Fallback: search for inventory_quantity
    const matches = html.match(/"inventory_quantity":\s*(-?\d+)/g);
    console.log("Raw inventory_quantity matches:", matches);
  }

  const metaMatch = html.match(/var meta = (\{.*?\});/s);
  if (metaMatch) {
    try {
      const meta = JSON.parse(metaMatch[1]);
      const variants = meta.product?.variants || [];
      console.log("Meta variants sample:", variants.slice(0, 2).map(v => ({ id: v.id, title: v.public_title || v.name })));
    } catch(e) {
      console.log("JSON parse error on meta", e.message);
    }
  }
}
test();
