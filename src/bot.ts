import { Telegraf, Context } from 'telegraf';
import {
  brandHandler,
  helpHandler,
  payHandler,
  paymentSuccessHandler,
  preCheckoutHandler,
  startHandler
} from './handlers';
import { brands } from './data';

const bot = new Telegraf(String(process.env.BOT_TOKEN));

bot.use(Telegraf.log());

bot.on('successful_payment', paymentSuccessHandler);

bot.on('pre_checkout_query', preCheckoutHandler);

bot.on('callback_query', (ctx: Context) => {
  const query = (ctx.callbackQuery as any).data as string;
  if (brands[query]) return brandHandler(ctx, query);
  if (query.includes('pay:')) {
    const brandName = query.split(':')[1] as string;
    return payHandler(ctx, brandName);
  }
});

bot.action('start', startHandler);

bot.action('help', helpHandler);

bot.start(startHandler);

bot.help(helpHandler);

export default bot;
