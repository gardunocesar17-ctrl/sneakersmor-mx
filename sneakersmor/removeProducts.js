const fs = require('fs');

const dataFile = 'lib/data.ts';
let content = fs.readFileSync(dataFile, 'utf8');

const match = content.match(/export const productos: Product\[\] = (\[[\s\S]*\]) as Product\[\];/);
if (!match) {
  console.log("Could not find array.");
  process.exit(1);
}
let arrayStr = match[1];
let products = eval(arrayStr);

const initialLength = products.length;

const idsToRemove = [
  "10062745174317", // SERVICIO COD
  "9898832494893",  // Paca 6 Pares
  "9730536276269",  // Paquete 1-30 Pares VIP
  "9689182896429",  // Paquete 1-30 Pares
  "9379589062957"   // Caja 30 Prs.
];

products = products.filter(p => !idsToRemove.includes(p.id));

console.log(`Removed ${initialLength - products.length} products.`);

const newContent = content.replace(match[1], JSON.stringify(products, null, 2));
fs.writeFileSync(dataFile, newContent);
console.log("data.ts updated successfully.");
