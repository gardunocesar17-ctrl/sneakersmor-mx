const fs = require('fs');
const html = fs.readFileSync('airfire_product.html', 'utf-8');

// Shopify sometimes exposes inventory in a variable like `variant.inventory_quantity` inside a script tag
const matches = html.match(/"inventory_quantity":\s*(\d+)/g);
if (matches) {
  console.log("Found inventory quantities in HTML:");
  console.log(matches.slice(0, 20));
} else {
  console.log("No inventory_quantity found in HTML.");
}

// Or maybe it's in a window object
const scriptMatch = html.match(/var meta = (\{.*?\});/s);
if (scriptMatch) {
  console.log("Found meta object");
}
