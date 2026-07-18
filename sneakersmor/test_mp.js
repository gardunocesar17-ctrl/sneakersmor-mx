const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({ accessToken: 'TEST-7057558401748503-071817-a3f64a7b30dd115fa97bcc73058efc55-361368601' });

async function run() {
  try {
    const body = {
      items: [
        {
          id: "123",
          title: "Tenis de prueba",
          unit_price: 1000,
          quantity: 1,
          currency_id: 'MXN',
        }
      ],
      payer: {
        name: "Cesar",
        email: "gardunocesar17@gmail.com",
      },
      back_urls: {
        success: "http://localhost:3000/checkout?status=success",
        failure: "http://localhost:3000/checkout?status=failure",
        pending: "http://localhost:3000/checkout?status=pending",
      }
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    console.log("Success:", result.init_point);
  } catch (error) {
    console.error("Error from MercadoPago SDK:");
    console.error(error);
    if (error.cause) {
      console.error(error.cause);
    }
  }
}

run();
