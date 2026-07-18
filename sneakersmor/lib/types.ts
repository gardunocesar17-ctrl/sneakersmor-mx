export interface ProductVariant {
  talla: string; // MX
  stock: number;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  nombre: string;
  marca: string;
  coleccion: string;
  genero: "Hombre" | "Mujer" | "Unisex";
  categoria: string;
  precio: number;
  precioAnterior?: number;
  colores: string[];
  colorPrincipal: string;
  imagenes: string[];
  descripcion: string;
  materiales: string;
  tipoSuela: string;
  peso: string;
  incluyeCaja: boolean;
  garantiaDias: number;
  envioDiasHabiles: string;
  fabricacion: string;
  cuidados: string;
  tallas: ProductVariant[];
  destacado?: boolean;
  nuevoIngreso?: boolean;
  masVendido?: boolean;
  enOferta?: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  nombre: string;
  imagen: string;
  precio: number;
  talla: string;
  cantidad: number;
  maxStock: number;
}
