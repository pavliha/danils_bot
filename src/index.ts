require('dotenv').config();
import { Telegraf } from 'telegraf';
import {
  columbiaHandler,
  helpHandler,
  payHandler,
  paymentSuccessHandler,
  preCheckoutHandler,
  startHandler
} from './handlers';

export type Brand = {
  key: string;
  name: string;
  imageUrl: string;
  message: string;
};
const bot = new Telegraf(String(process.env.BOT_TOKEN));

bot.use(Telegraf.log());

bot.on('successful_payment', paymentSuccessHandler);

bot.on('pre_checkout_query', preCheckoutHandler);

bot.action('pay', payHandler);

bot.action('columbia', columbiaHandler);

bot.action('start', startHandler);

bot.action('help', helpHandler);

bot.start(startHandler);

bot.help(helpHandler);

bot.launch();
