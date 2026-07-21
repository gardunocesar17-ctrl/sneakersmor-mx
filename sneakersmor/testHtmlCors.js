async function test() {
  const res = await fetch(`https://airfire.com.mx/products/air-force-1-negro-total`);
  console.log("HTML GET Headers:", res.headers.get('access-control-allow-origin'));
}
test();
