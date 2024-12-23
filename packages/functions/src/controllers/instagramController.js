// packages/functions/src/controllers/instagramController.js
import {getCurrentShop} from '@functions/helpers/auth';
import {getFeedConfig, updateFeedConfig} from '../repositories/instagramRepository';

export const getFeed = async ctx => {
  try {
    const shopId = getCurrentShop(ctx);
    const config = await getFeedConfig(shopId);

    ctx.status = 200;
    ctx.body = {
      data: config,
      success: true
    };
  } catch (err) {
    ctx.status = 404;
    console.log(err);
    ctx.body = {
      data: {},
      success: false
    };
  }
};

export const updateFeed = async ctx => {
  try {
    const shopId = getCurrentShop(ctx);
    const {data} = ctx.req.body;
    console.log('Update feed data:', data);

    const res = await updateFeedConfig(shopId, data);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: res
    };
  } catch (err) {
    ctx.status = 400;
    console.log(err);
    ctx.body = {
      data: {},
      success: false
    };
  }
};
