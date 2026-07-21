const fs = require('fs');
const content = fs.readFileSync('./lib/data.ts', 'utf-8');
const regex = /"talla":\s*"([^"]+)"/g;
let match;
const counts = {};
while ((match = regex.exec(content)) !== null) {
  const t = match[1];
  counts[t] = (counts[t] || 0) + 1;
}
console.log(counts);
