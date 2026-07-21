async function test() {
  const res = await fetch("https://sneakersmor-jqdc69mb7-sneakers-mor-mx.vercel.app/api/sync-stock", {
    method: "GET"
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response HTML:", text.substring(0, 200));
}
test();
