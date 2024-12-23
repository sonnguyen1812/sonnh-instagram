// packages/functions/src/controllers/clientApiController.js
import {getFeedConfigByShopDomain} from '@functions/repositories/instagramRepository';

export const getFeed = async ctx => {
  try {
    const {shopDomain} = ctx.query;
    console.log('Client API shopDomain:', shopDomain);

    if (!shopDomain) {
      throw new Error('Shop domain is required');
    }

    const feedConfig = await getFeedConfigByShopDomain(shopDomain);
    console.log('Client API feedConfig:', feedConfig); // Thêm log này

    ctx.body = {
      data: {
        feedConfig
      },
      success: true
    };
  } catch (err) {
    console.error('Get feed error:', err);
    ctx.status = 404;
    ctx.body = {
      data: {},
      success: false
    };
  }
};
