import { Context } from 'telegraf';
import { createInvoice } from './createInvoice';
import { Message } from 'telegraf/typings/core/types/typegram';
import brand from './brand';

export const startHandler = async (ctx: Context) => {
  const brands = await brand.all();
  return ctx.reply('Продам купоны для известных брендов', {
    reply_markup: {
      inline_keyboard: [Object.values(brands).map((brand) => ({ text: brand.name, callback_data: brand.key }))]
    }
  });
};

export const helpHandler = (ctx: Context) => ctx.reply('При возникновении вопросов свяжитесь с @danilnaprimer');

export const brandHandler = async (ctx: Context, brandName: string) => {
  const brands = await brand.all();
  if (brands[brandName].coupons.length === 0) {
    return ctx.reply('Купонов больше нет! Приходите позже');
  }
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

export const paymentSuccessHandler = async (ctx: Context) => {
  const message = (ctx.update as any).message as Message.SuccessfulPaymentMessage;
  const invoicePayloadJson = message.successful_payment.invoice_payload;
  const { brandName } = JSON.parse(invoicePayloadJson);
  const brands = await brand.all();
  const coupon = brands[brandName].coupons[0];
  await brand.removeCoupon(brandName, coupon);
  return ctx.reply(`Оплата прошла успешно. Ваш купон: \n ${coupon}`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Купить еще', callback_data: 'start' },
          { text: 'Поддержка', callback_data: 'help' }
        ]
      ]
    }
  });
};

export const preCheckoutHandler = (ctx: Context) => ctx.answerPreCheckoutQuery(true);

export const payHandler = async (ctx: Context, brandName: string) => {
  const brands = await brand.all();
  console.log(brands, brandName);
  return ctx.replyWithInvoice(createInvoice(ctx.from!.id, brands[brandName]));
};
