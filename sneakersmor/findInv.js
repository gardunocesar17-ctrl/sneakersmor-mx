const fs = require('fs');
const html = fs.readFileSync('airfire_product.html', 'utf-8');
const regex = /\{[^}]*"inventory_quantity":\s*(\d+)[^}]*\}/g;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(match[0]);
  break; // just print the first one
}
