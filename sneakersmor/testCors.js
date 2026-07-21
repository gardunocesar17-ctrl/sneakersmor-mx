async function test() {
  const res = await fetch(`https://airfire.com.mx/products.json?limit=1`, { method: 'OPTIONS' });
  console.log("CORS Headers:", res.headers.get('access-control-allow-origin'));
  const res2 = await fetch(`https://airfire.com.mx/products.json?limit=1`);
  console.log("GET Headers:", res2.headers.get('access-control-allow-origin'));
}
test();
