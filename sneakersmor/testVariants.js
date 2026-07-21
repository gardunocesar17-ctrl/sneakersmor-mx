const fs = require('fs');

async function test() {
  const pagePromises = Array.from({ length: 2 }, (_, i) => i + 1).map(page => 
    fetch(`https://airfire.com.mx/products.json?limit=250&page=${page}`)
      .then(res => res.ok ? res.json() : null)
  );
  
  const pages = await Promise.all(pagePromises);
  const products = pages[0].products;
  const p = products[0];
  console.log("Sample product variants:", p.variants.slice(0, 2));
}
test();
