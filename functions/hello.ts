import { Handler, HandlerEvent } from '@netlify/functions';
import bot from '../src/bot';

export const handler: Handler = async (event: HandlerEvent) => {
  try {
    if (!event.body) {
      return {
        statusCode: 403,
        body: 'request is not valid'
      };
    }
    console.log(event.body);
    await bot.handleUpdate(JSON.parse(event.body!));
    return {
      statusCode: 200,
      body: 'hello world'
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err
    };
  }
};
