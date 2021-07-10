
export const createInvoice = (id: number) => ({
  chat_id: id, // Unique identifier of the target chat or username of the target channel
  provider_token: process.env.PROVIDER_TOKEN as string, // token issued via bot @SberbankPaymentBot
  start_parameter: 'get_access', // Unique parameter for deep links. If you leave this field blank, forwarded copies of the forwarded message will have a Pay button that allows multiple users to pay directly from the forwarded message using the same account. If not empty, redirected copies of the sent message will have a URL button with a deep link to the bot (instead of a payment button) with a value used as an initial parameter.
  title: 'Купон Columbia', // Product name, 1-32 characters
  description: 'Скину купон после оплаты', // Product description, 1-255 characters
  currency: 'UAH', // ISO 4217 Three-Letter Currency Code
  prices: [{ label: 'Купон от Columbia', amount: 10 * 100 }], // Price breakdown, serialized list of components in JSON format 100 kopecks * 100 = 100 rubles
  payload: {
    // The payload of the invoice, as determined by the bot, 1-128 bytes. This will not be visible to the user, use it for your internal processes.
    unique_id: `${id}_${Number(new Date())}`,
    provider_token: process.env.PROVIDER_TOKEN as string
  } as any
});
