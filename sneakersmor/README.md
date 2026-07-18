# SneakersMor.MX

Base de tienda online construida con Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion.
Catálogo, filtros, buscador, ficha de producto con galería premium, carrito, checkout y panel
administrador, todo funcionando con **datos de muestra** para que puedas ver la arquitectura completa
en acción y sustituirla por tu contenido real.

## Identidad de marca

- **Paleta**: piedra/asfalto como base (`stone` claro / `asphalt` oscuro), acento "ember" (naranja
  ceniza, `#FF5024`) para CTAs, "jungle" (verde) como color secundario — un guiño a Cuernavaca,
  "ciudad de la eterna primavera".
- **Tipografía**: Bricolage Grotesque (display) + Inter (texto) + IBM Plex Mono (SKU, specs,
  etiquetas técnicas).
- **Elemento de firma**: la "etiqueta de caja" (`.box-label` en `styles/globals.css`) — el motivo
  de barras laterales imita la etiqueta impresa en el costado de una caja de tenis, y se repite en
  tarjetas de producto, secciones y tablas del admin.
- **Modo claro/oscuro** vía `lib/theme-context.tsx`, persistente en `localStorage`.

## Estructura

```
app/
  layout.tsx          Providers, fuentes, header/footer, metadata SEO
  page.tsx             Home: hero, destacados, nuevos, más vendidos, marcas, colecciones,
                        mayoreo, opiniones, Instagram, FAQ (en Footer), newsletter (en Footer)
  tienda/page.tsx      Catálogo con filtros (marca, categoría, talla, precio), búsqueda y orden
  producto/[slug]/     Ficha de producto: galería premium + specs + relacionados
  carrito/page.tsx     Carrito con cupón y cálculo de envío
  checkout/page.tsx    Checkout con datos de envío y selección Stripe / Mercado Pago
  admin/page.tsx       Dashboard + CRUD de productos + pedidos + usuarios (datos de muestra)
  sitemap.ts, robots.ts
components/            Header, Footer, ProductCard, ProductGallery, CartDrawer, Hero, etc.
lib/
  types.ts             Modelo de datos del catálogo
  data.ts              CATÁLOGO DE MUESTRA — sustituir por tu contenido real
  cart-context.tsx      Estado global del carrito
  theme-context.tsx     Estado global del tema
```

## Sustituir el catálogo de muestra por el tuyo

Todo el catálogo vive en `lib/data.ts`, tipado con `lib/types.ts` (`Product`). Mientras conectas
una base de datos real, puedes editar ese archivo directamente con tus modelos, tallas, colores,
precios y — cuando las tengas — tus fotografías (propias o con licencia legítima; los `picsum.photos`
actuales son solo relleno visual).

## Conectar backend de producción (siguiente fase)

Este entregable es la base de frontend + arquitectura. Para producción completa conecta:

1. **Base de datos**: Prisma + PostgreSQL. Define un `schema.prisma` a partir de `lib/types.ts`,
   corre `prisma migrate`, y sustituye las funciones de `lib/data.ts` por consultas (`prisma.product.findMany()`, etc.).
2. **Imágenes**: Cloudinary (o similar) para subida y transformación de imágenes del admin.
3. **Pagos**: Stripe (`@stripe/stripe-js` + API routes en `app/api/`) y/o Mercado Pago SDK — el
   checkout ya tiene la UI y el punto de conexión marcado en `app/checkout/page.tsx`.
4. **Autenticación del admin**: agrega NextAuth o Clerk para proteger `/admin` (hoy es público, solo
   para revisión).
5. **Hosting**: Vercel (recomendado para Next.js) + variables de entorno para las llaves de Stripe /
   Mercado Pago / base de datos.

## Correr localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Notas

- El checkout simula el pago (no procesa cobros reales) hasta que conectes Stripe/Mercado Pago.
- El panel admin guarda cambios solo en memoria del navegador (se pierden al recargar) hasta que
  conectes la base de datos.
- Cupón de prueba en el carrito: `MOR10` (10% de descuento).
