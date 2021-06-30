require('dotenv').config()
import { Telegraf } from 'telegraf';

const bot = new Telegraf(String(process.env.BOT_TOKEN))


const getInvoice = (id:number) => ({
  chat_id: id, // Unique identifier of the target chat or username of the target channel
  provider_token: process.env.PROVIDER_TOKEN as string, // token issued via bot @SberbankPaymentBot
  start_parameter: 'get_access', // Unique parameter for deep links. If you leave this field blank, forwarded copies of the forwarded message will have a Pay button that allows multiple users to pay directly from the forwarded message using the same account. If not empty, redirected copies of the sent message will have a URL button with a deep link to the bot (instead of a payment button) with a value used as an initial parameter.
  title: 'Данилу на лапу', // Product name, 1-32 characters
  description: 'Скину купоны после оплаты', // Product description, 1-255 characters
  currency: 'UAH', // ISO 4217 Three-Letter Currency Code
  prices: [{ label: 'Купон от Columbia', amount: 10 * 100 }], // Price breakdown, serialized list of components in JSON format 100 kopecks * 100 = 100 rubles
  payload: { // The payload of the invoice, as determined by the bot, 1-128 bytes. This will not be visible to the user, use it for your internal processes.
    unique_id: `${id}_${Number(new Date())}`,
    provider_token: process.env.PROVIDER_TOKEN as string
  } as any
})

bot.use(Telegraf.log())

bot.hears('pay', (ctx) => {  // this is a handler for a specific text, in this case it is "pay"
  return ctx.replyWithInvoice(getInvoice(ctx.from.id)) //  replyWithInvoice method for invoicing
})

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true)) // response to a preliminary request for payment

bot.on('successful_payment', async (ctx, next) => { // reply in case of positive payment
  await ctx.reply('COLU-FPA4-IDQH-QXUE')
})

bot.action('columbia', (ctx, next) => {
  ctx.replyWithInvoice(getInvoice(ctx.from!.id))
})

bot.action('adidas', (ctx, next) => {
  ctx.reply('ADID-FPA4-IDQH-QXUE');
})

bot.action('nike', (ctx, next) => {
  ctx.reply('NIKE-FPA4-IDQH-QXUE');
})


bot.start((ctx) => {
  console.log({ ctx })
  return ctx.reply('Продам купоны Columbia, Adidas, Nike',{
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Columbia', callback_data: 'columbia' },
          { text: 'Adidas', callback_data: 'adidas' },
          { text: 'Nike', callback_data: 'nike' },
        ],
      ]
    }
  });
})


bot.launch()
