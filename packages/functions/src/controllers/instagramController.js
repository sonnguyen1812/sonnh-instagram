// packages/functions/src/controllers/instagramController.js
import {getCurrentShop} from '@functions/helpers/auth';
import {getFeedConfig, updateFeedConfig} from '../repositories/instagramRepository';
import Shopify from 'shopify-api-node';
import {dummyMedia} from '../const/dummyMedia';
import {getShopById} from '@avada/shopify-auth';
import {upsertMetaField} from '@functions/services/metafieldService';
import {META_FIELD_NAMESPACE} from '../const/metafields';

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

    if (!data) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Data is required'
      };
      return;
    }

    const resdata = await updateFeedConfig(shopId, data);
    console.log('data after update feed: ', resdata);

    const shop = await getShopById(shopId);
    console.log('Shop info:', {
      shopId,
      shopDomain: shop.shopifyDomain,
      hasAccessToken: !!shop.accessToken
    });

    const shopify = new Shopify({
      shopName: shop.shopifyDomain,
      accessToken: shop.accessToken
    });

    const existingMetafields = await shopify.metafield.list({});
    console.log('Old metafields:', existingMetafields);
    // const deletePromises = existingMetafields
    //   .filter(field => ['media_list', 'feed_config'].includes(field.key))
    //   .map(field => shopify.metafield.delete(field.id));
    // await Promise.all(deletePromises);
    // console.log('Old metafields deleted successfully');

    await Promise.all([
      upsertMetaField({
        shopId,
        shopDomain: shop.shopifyDomain, // Thêm shopDomain
        accessToken: shop.accessToken, // Thêm accessToken
        namespace: META_FIELD_NAMESPACE,
        key: 'feed_config',
        value: {
          columns: data.columns || 3,
          layout: data.layout || 1,
          rows: data.rows || 2,
          spacing: data.spacing || 10,
          title: data.title || 'Instagram Feed'
        }
      }),
      upsertMetaField({
        shopId,
        shopDomain: shop.shopifyDomain, // Thêm shopDomain
        accessToken: shop.accessToken, // Thêm accessToken
        namespace: META_FIELD_NAMESPACE,
        key: 'media_list',
        value: dummyMedia
      })
    ]);

    const allNewMetafields = await shopify.metafield.list({
      namespace: META_FIELD_NAMESPACE
    });
    console.log('Newest metafields:', allNewMetafields);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'feed is updated!',
      data: resdata
    };

    console.log('data: ', resdata);
  } catch (err) {
    console.error('Error updating feed:', err);
    ctx.status = 400;
    ctx.body = {
      data: {},
      success: false,
      error: err.message || 'An error occurred while updating feed'
    };
  }
};
