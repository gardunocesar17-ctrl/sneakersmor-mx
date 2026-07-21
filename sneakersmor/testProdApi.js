async function test() {
  try {
    const res = await fetch(`https://sneakersmor-mx.vercel.app/api/scrape-html?slug=tenis-dunk-niebla-blanco-niebla`);
    const json = await res.json();
    console.log("Prod API result:", json);
  } catch (e) {
    console.error("Error calling prod API:", e);
  }
}
test();
