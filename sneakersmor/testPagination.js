async function test() {
  const res = await fetch("https://airfire.com.mx/products.json?limit=250&page=2");
  const data = await res.json();
  console.log("Page 2 products length:", data.products?.length);
  if (data.products?.length > 0) {
    console.log("First product on page 2:", data.products[0].handle);
  }
}
test();
