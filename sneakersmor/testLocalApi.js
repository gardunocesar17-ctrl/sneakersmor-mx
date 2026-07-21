async function test() {
  try {
    const res = await fetch(`http://localhost:3000/api/scrape-html?slug=tenis-dunk-niebla-blanco-niebla`);
    const json = await res.json();
    console.log("Scrape HTML result:", json);
  } catch (e) {
    console.error("Error calling local API:", e);
  }
}
test();
