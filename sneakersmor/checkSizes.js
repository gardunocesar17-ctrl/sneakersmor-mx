const fs = require('fs');
const content = fs.readFileSync('./lib/data.ts', 'utf-8');
const tallas = new Set();
const regex = /talla:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  tallas.add(match[1]);
}
console.log(Array.from(tallas).sort());
