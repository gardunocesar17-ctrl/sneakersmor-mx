async function test() {
  console.log("Fetching live API...");
  const res = await fetch("https://sneakersmor-jqdc69mb7-sneakers-mor-mx.vercel.app/api/sync-stock", {
    method: "GET"
  });
  const data = await res.json();
  console.log("Response:", data);
}
test();
