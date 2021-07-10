import { Context } from 'telegraf';
import { brands } from './data';
import { createInvoice } from './createInvoice';

export const startHandler = (ctx: Context) =>
  ctx.reply('Продам купоны для известных брендов', {
    reply_markup: {
      inline_keyboard: [Object.values(brands).map((brand) => ({ text: brand.name, callback_data: brand.key }))]
    }
  });

export const helpHandler = (ctx: Context) => ctx.reply('При возникновении вопросов свяжитесь с @danilnaprimer');

export const brandHandler = (ctx: Context, brandName: string) => {
  return ctx.replyWithPhoto(
    { url: brands[brandName].imageUrl },
    {
      reply_markup: {
        inline_keyboard: [[{ text: 'Купить', callback_data: `pay:${brandName}` }]]
      },
      caption: brands[brandName].message
    }
  );
};

export const paymentSuccessHandler = (ctx: Context) =>
  ctx.reply('Оплата прошла успешно. Ваш купон: \n COLU-FPA4-IDQH-QXUE', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Купить еще', callback_data: 'columbia' },
          { text: 'Поддержка', callback_data: 'help' }
        ]
      ]
    }
  });

export const preCheckoutHandler = (ctx: Context) => ctx.answerPreCheckoutQuery(true);

export const payHandler = (ctx: Context, brandName: string) => {
  return ctx.replyWithInvoice(createInvoice(ctx.from!.id, brands[brandName]));
};
