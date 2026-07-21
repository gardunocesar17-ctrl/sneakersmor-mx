const XLSX = require('xlsx');

const data = [
  { p: "Tenis 270 Negro Total", t: 26.5, l: 427.00, d: 0.10, cost: 384.30 },
  { p: "Tenis Smb Vino Blanco", t: 23, l: 555.00, d: 0.10, cost: 499.50 },
  { p: "Tenis New Balance 9060 Blanco Total", t: 23, l: 899.00, d: 0.10, cost: 809.10 },
  { p: "Tenis 270 Blanco Negro Negro", t: 25.5, l: 439.00, d: 0.20, cost: 351.20 },
  { p: "Tenis Dunk Blanco Negro Negro", t: 28.5, l: 585.00, d: 0.20, cost: 468.00 },
  { p: "Tenis Dunk Blanco Negro Negro", t: 26.5, l: 585.00, d: 0.20, cost: 468.00 },
  { p: "Tenis 270 Blanco Total", t: 27.5, l: 475.00, d: 0.20, cost: 380.00 },
  { p: "Tenis 275 Blanco Negro", t: 25.5, l: 489.00, d: 0.20, cost: 391.20 },
  { p: "Tenis Dunk Low Blanco Cielo", t: 27.5, l: 657.00, d: 0.20, cost: 525.60 },
];

const rows = [];
data.forEach((item, index) => {
  rows.push({
    "Foto": "", // Leave blank for manual image pasting
    "#": index + 1,
    "Producto": item.p,
    "Talla": item.t,
    "Precio Lista ($)": item.l,
    "Descuento (%)": item.d,
    "Descuento ($)": item.l * item.d,
    "Costo Unitario Pagado ($)": item.cost,
    "Cantidad": 1,
    "Costo Total ($)": item.cost,
    "Ganancia Deseada por Par ($)": 500,
    "Precio de Venta Sugerido ($)": item.cost + 500,
    "Ganancia Total ($)": 0, // Formula later
    "Margen Real (%)": 0,    // Formula later
    "PRECIO VENDIDOS": ""    // Blank for manual input
  });
});

const worksheet = XLSX.utils.json_to_sheet(rows);

// Add Formulas
// Column mappings (1-indexed based on row, 0-indexed for cols)
// A: Foto
// B: #
// C: Producto
// D: Talla
// E: Precio Lista
// F: Descuento %
// G: Descuento $
// H: Costo Unitario
// I: Cantidad
// J: Costo Total (=H*I)
// K: Ganancia Deseada
// L: Precio Sugerido (=J+K)
// M: Ganancia Total (=O-J) (where O is PRECIO VENDIDOS)
// N: Margen Real (=M/O)
// O: PRECIO VENDIDOS

for (let i = 0; i < data.length; i++) {
  const r = i + 2; // Row index (1 is header)
  
  // Costo Total = Costo Unitario * Cantidad
  worksheet[`J${r}`] = { t: 'n', f: `H${r}*I${r}` };
  
  // Precio de Venta Sugerido = Costo Total + Ganancia Deseada
  worksheet[`L${r}`] = { t: 'n', f: `J${r}+K${r}` };
  
  // Ganancia Total = PRECIO VENDIDOS - Costo Total (Only if PRECIO VENDIDOS is not empty)
  worksheet[`M${r}`] = { t: 'n', f: `IF(O${r}="", 0, O${r}-J${r})` };
  
  // Margen Real = Ganancia Total / PRECIO VENDIDOS
  worksheet[`N${r}`] = { t: 'n', f: `IF(O${r}="", 0, M${r}/O${r})` };
  
  // Format percentage for F and N
  if(!worksheet[`F${r}`].z) worksheet[`F${r}`].z = '0.0%';
  worksheet[`N${r}`].z = '0.0%';
  
  // Currency formats
  ['E','G','H','J','K','L','M','O'].forEach(col => {
    if(worksheet[`${col}${r}`]) {
      worksheet[`${col}${r}`].z = '$#,##0.00';
    }
  });
}

// Add Total Row at the bottom
const lastRow = data.length + 2;
worksheet[`C${lastRow}`] = { t: 's', v: 'TOTAL' };
worksheet[`I${lastRow}`] = { t: 'n', f: `SUM(I2:I${lastRow-1})` };
worksheet[`J${lastRow}`] = { t: 'n', f: `SUM(J2:J${lastRow-1})`, z: '$#,##0.00' };
worksheet[`M${lastRow}`] = { t: 'n', f: `SUM(M2:M${lastRow-1})`, z: '$#,##0.00' };
worksheet[`O${lastRow}`] = { t: 'n', f: `SUM(O2:O${lastRow-1})`, z: '$#,##0.00' };

worksheet['!ref'] = `A1:O${lastRow}`;

// Set column widths
worksheet['!cols'] = [
  { wch: 10 }, // Foto
  { wch: 5 },  // #
  { wch: 35 }, // Producto
  { wch: 8 },  // Talla
  { wch: 15 }, // Precio Lista
  { wch: 15 }, // Descuento %
  { wch: 15 }, // Descuento $
  { wch: 25 }, // Costo Unitario Pagado
  { wch: 10 }, // Cantidad
  { wch: 15 }, // Costo Total
  { wch: 25 }, // Ganancia Deseada
  { wch: 25 }, // Precio Sugerido
  { wch: 18 }, // Ganancia Total
  { wch: 18 }, // Margen Real
  { wch: 18 }  // PRECIO VENDIDOS
];

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Control Ventas");

const desktopPath = "C:\\Users\\mi_pc\\Downloads\\Inventario_Fisico_SneakersMor.xlsx";
XLSX.writeFile(workbook, desktopPath);
console.log(`Excel guardado en: ${desktopPath}`);
