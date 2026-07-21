const fs = require('fs');

async function getInventories(slug) {
  const res = await fetch(`https://airfire.com.mx/products/${slug}`);
  const html = await res.text();
  
  // Find window.inventories or similar object
  // It usually looks like {"variant_id": {"inventory_quantity": 1, ...}}
  const regex = /"(\d+)":\s*\{\s*"inventory_management"[^}]+"inventory_quantity":\s*(\d+)/g;
  
  const inventories = {};
  let match;
  while ((match = regex.exec(html)) !== null) {
    inventories[match[1]] = parseInt(match[2]);
  }
  return inventories;
}

getInventories("tenis-max-90-gris-blanco").then(console.log);
