import { Telegraf, Context } from 'telegraf';
import {
  brandHandler,
  helpHandler,
  payHandler,
  paymentSuccessHandler,
  preCheckoutHandler,
  startHandler
} from './handlers';
import brand from './brand';

const bot = new Telegraf(String(process.env.BOT_TOKEN));

bot.on('successful_payment', paymentSuccessHandler);

bot.on('pre_checkout_query', preCheckoutHandler);

bot.action('start', startHandler);

bot.action('help', helpHandler);

bot.on('callback_query', async (ctx: Context) => {
  const query = (ctx.callbackQuery as any).data as string;
  const brands = await brand.all();
  if (brands[query]) return brandHandler(ctx, query);
  if (query.includes('pay:')) {
    const brandName = query.split(':')[1] as string;
    return payHandler(ctx, brandName);
  }
});

bot.start(startHandler);

bot.help(helpHandler);

export default bot;
