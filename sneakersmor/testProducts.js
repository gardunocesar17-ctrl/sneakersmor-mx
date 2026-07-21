async function test() {
  const res = await fetch("https://airfire.com.mx/products.json?limit=1");
  const data = await res.json();
  console.log(JSON.stringify(data.products[0].variants, null, 2));
}
test();
