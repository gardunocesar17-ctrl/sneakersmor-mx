async function test() {
  try {
    const res = await fetch(`https://sneakersmor-mx.vercel.app/api/scrape-html?slug=tenis-025-plata-blanco-negro`);
    const json = await res.json();
    console.log("Prod API result for Tenis 025:", json);
  } catch (e) {
    console.error("Error calling prod API:", e);
  }
}
test();
