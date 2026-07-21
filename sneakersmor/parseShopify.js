const fs = require('fs');
const html = fs.readFileSync('airfire_product.html', 'utf-8');

// There's usually a script tag with product data:
// var meta = {"product":{"id":..., "variants":[{"id":..., "inventory_quantity":...}]}};
const match = html.match(/var meta = (\{.*?\});/s);
if (match) {
  try {
    const meta = JSON.parse(match[1]);
    const variants = meta.product.variants.map(v => ({ title: v.public_title || v.name, inv: v.inventory_quantity, id: v.id }));
    console.log("Variants from meta:", variants);
  } catch(e) {
    console.log("JSON parse error on meta", e.message);
  }
}

// Or maybe it's in window.ShopifyAnalytics.meta
const match2 = html.match(/window\.ShopifyAnalytics\.meta = (\{.*?\});/s);
if (match2) {
  try {
    const meta2 = JSON.parse(match2[1]);
    const variants2 = meta2.product.variants.map(v => ({ name: v.name, inv: v.inventory_quantity }));
    console.log("Variants from ShopifyAnalytics:", variants2);
  } catch(e) {
    console.log("JSON parse error on ShopifyAnalytics", e.message);
  }
}
