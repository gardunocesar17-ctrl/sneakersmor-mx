import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configura Mercado Pago usando el Access Token proporcionado
const client = new MercadoPagoConfig({ accessToken: 'TEST-7057558401748503-071817-a3f64a7b30dd115fa97bcc73058efc55-361368601' });

export async function POST(request: Request) {
  try {
    const { items, datos } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    // Crear los items para la preferencia basados en los del carrito
    const preferenceItems = items.map((item: any) => ({
      id: item.productId,
      title: `${item.nombre} - Talla ${item.talla}`,
      unit_price: Number(item.precio),
      quantity: Number(item.cantidad),
      currency_id: 'MXN',
    }));

    // Calcular subtotal y envío
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.precio * item.cantidad), 0);
    const envio = subtotal > 0 && subtotal < 1500 ? 149 : 0;

    if (envio > 0) {
      preferenceItems.push({
        id: 'ENVIO',
        title: 'Costo de envío',
        unit_price: envio,
        quantity: 1,
        currency_id: 'MXN',
      });
    }

    // Usaremos origin para determinar si estamos en localhost o en producción
    const origin = request.headers.get('origin') || "http://localhost:3000";

    const body = {
      items: preferenceItems,
      payer: {
        name: datos?.nombre || "Cliente",
        email: datos?.email || "test@test.com",
      },
      // URLs a donde redirigirá MercadoPago después de pagar
      back_urls: {
        success: `${origin}/checkout?status=success`,
        failure: `${origin}/checkout?status=failure`,
        pending: `${origin}/checkout?status=pending`,
      }
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    return NextResponse.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error("Error creando preferencia de Mercado Pago:", error);
    return NextResponse.json({ error: "No se pudo crear la preferencia de pago" }, { status: 500 });
  }
}
