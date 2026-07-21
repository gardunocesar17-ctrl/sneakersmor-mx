import { productos } from './lib/data';
console.log(Array.from(new Set(productos.flatMap(p => p.tallas.map(t => t.talla)))).sort());
