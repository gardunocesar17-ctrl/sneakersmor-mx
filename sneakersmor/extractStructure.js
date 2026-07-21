const fs = require('fs');

async function test() {
  const res = await fetch("https://airfire.com.mx/products/tenis-270-negro-total");
  const html = await res.text();
  
  // Find where "inventory_quantity": 7 is located
  const idx = html.indexOf('"inventory_quantity": 7');
  if (idx > -1) {
    const context = html.substring(idx - 150, idx + 100);
    console.log("Context around inventory_quantity: 7:");
    console.log(context);
  } else {
    console.log("Not found 7");
  }

  // Also check if variant ID 44044051874093 (size 23.5) is near it!
  const idx2 = html.indexOf('44044051874093');
  if (idx2 > -1) {
    const context2 = html.substring(idx2 - 50, idx2 + 200);
    console.log("Context around variant ID 23.5:");
    console.log(context2);
  }
}
test();
