const XLSX = require('xlsx');

// Import from built JS or just read the TS file?
// Actually, it's easier to just use ts-node to run this script.
import { productos } from './lib/data';

async function generateExcel() {
  console.log("Generando Excel...");
  
  // 1. Fetch Airfire products to get their exact prices
  let airfireProducts: any[] = [];
  try {
    let page = 1;
    let hasMore = true;
    while(hasMore) {
      const res = await fetch(`https://airfire.com.mx/products.json?limit=250&page=${page}`);
      const data = await res.json();
      if(data.products && data.products.length > 0) {
        airfireProducts = [...airfireProducts, ...data.products];
        page++;
      } else {
        hasMore = false;
      }
    }
  } catch(e) {
    console.error("Error fetching airfire:", e);
  }

  const rows: any[] = [];
  
  productos.forEach(p => {
    const airfireProd = airfireProducts.find(ap => ap.handle === p.slug);
    // Airfire price is usually in variants[0].price
    const airfirePrice = airfireProd && airfireProd.variants.length > 0 ? Number(airfireProd.variants[0].price) : 0;
    
    p.tallas.forEach(t => {
      rows.push({
        Nombre: p.nombre,
        Coleccion: p.coleccion,
        Foto: p.imagenes[0] || "",
        Talla: t.talla,
        "Precio Airfire": airfirePrice,
        "Precio SneakersMor": p.precio,
        "Precio de Venta": "", 
        Ganancia: 0 // Will be replaced by formula later
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Add formulas for the "Ganancia" column
  // Ganancia is column H (index 7). Precio Airfire is column E (index 4). Precio de Venta is column G (index 6)
  // Row index starts at 2 (since 1 is headers)
  for (let i = 0; i < rows.length; i++) {
    const rowIndex = i + 2;
    const cellRef = XLSX.utils.encode_cell({ c: 7, r: i + 1 }); // H2, H3, etc.
    worksheet[cellRef] = {
      t: 'n',
      f: `G${rowIndex}-E${rowIndex}` // =Precio de Venta - Precio Airfire
    };
  }

  // Set column widths for better readability
  worksheet['!cols'] = [
    { wch: 40 }, // Nombre
    { wch: 15 }, // Coleccion
    { wch: 50 }, // Foto
    { wch: 10 }, // Talla
    { wch: 15 }, // Precio Airfire
    { wch: 20 }, // Precio SneakersMor
    { wch: 18 }, // Precio de Venta
    { wch: 15 }  // Ganancia
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

  const desktopPath = "C:\\Users\\mi_pc\\Downloads\\Control_Ventas_SneakersMor.xlsx";
  XLSX.writeFile(workbook, desktopPath);
  console.log(`Excel guardado en: ${desktopPath}`);
}

generateExcel();
