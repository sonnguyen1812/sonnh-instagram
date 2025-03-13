// packages/functions/src/controllers/instagramController.js
import {getCurrentShop} from '@functions/helpers/auth';
import {
  getFeedConfig,
  updateFeedConfig,
  addOrUpdateAuth,
  addOrUpdateMedia,
  getAuth,
  getMedia,
  disconnectAuth
} from '../repositories/instagramRepository';
import Shopify from 'shopify-api-node';
import {dummyMedia} from '../const/dummyMedia';
import {getShopById} from '@avada/shopify-auth';
import {upsertMetaField} from '@functions/services/metafieldService';
import {META_FIELD_NAMESPACE} from '../const/metafields';
import IgApi from '../helpers/igApi';
import {encryptToken} from '../helpers/utils/hashToken';

const igApi = new IgApi();

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

    const shopify = new Shopify({
      shopName: shop.shopifyDomain,
      accessToken: shop.accessToken
    });

    const existingMetafields = await shopify.metafield.list({});
    // const deletePromises = existingMetafields
    //   .filter(field => ['media_list', 'feed_config'].includes(field.key))
    //   .map(field => shopify.metafield.delete(field.id));
    // await Promise.all(deletePromises);
    // console.log('Old metafields deleted successfully');

    await upsertMetaField({
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
    });

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

export const connectInstagram = async ctx => {
  try {
    const shopId = getCurrentShop(ctx);
    if (!shopId) {
      throw new Error('Shop ID is required');
    }

    const authUrl = await igApi.authInstagram(shopId);

    ctx.body = {
      success: true,
      authUrl,
      state: authUrl.split('state=')[1]
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: err.message
    };
  }
};

export const handleCallback = async ctx => {
  try {
    const {code, state} = ctx.query;

    if (!code) {
      throw new Error('Code is required');
    }

    if (!state) {
      throw new Error('State is required');
    }
    // Lấy token từ Instagram
    const token = await igApi.retrieveToken(code);

    if (!token.success) {
      throw new Error('Error: ' + token.error);
    }

    const accessTokenEncrypted = encryptToken(token.long_token);

    const userInfo = await igApi.getMe(token.long_token);

    // Lưu thông tin auth trước
    await addOrUpdateAuth({
      permissions: token.permissions,
      accessToken: accessTokenEncrypted,
      expiresIn: token.expires_in,
      shopId: state,
      userId: userInfo.data.user_id,
      username: userInfo.data.username
    });

    const mediaData = await igApi.getMedia(token.long_token, token.user_id);

    if (mediaData.error) {
      console.log('mediaData error: ', mediaData.error);
      throw new Error(mediaData.error);
    }

    await addOrUpdateMedia({
      userId: userInfo.data.user_id,
      username: userInfo.data.username,
      shopId: state,
      mediaList: mediaData.data.data
    });

    const shop = await getShopById(state);

    const shopify = new Shopify({
      shopName: shop.shopifyDomain,
      accessToken: shop.accessToken
    });

    // Lưu vào metafield
    await upsertMetaField({
      shopId: state,
      shopDomain: shop.shopifyDomain,
      accessToken: shop.accessToken,
      namespace: META_FIELD_NAMESPACE,
      key: 'media_list',
      value: mediaData.data.data
    });

    const allNewMetafields = await shopify.metafield.list({
      namespace: META_FIELD_NAMESPACE
    });
    console.log('Newest metafields:', allNewMetafields);

    ctx.body = `
      <html>
        <body>
          <script>
            window.onload = function() {
              if (window.opener) {
                window.opener.postMessage({ type: 'instagram_connected', success: true }, '*');
                window.close();
              }
            }
          </script>
          <div style="text-align: center; padding: 20px;">
            <h3>Connection successful!</h3>
            <p>You can close this window now.</p>
          </div>
        </body>
      </html>
    `;
  } catch (err) {
    ctx.body = `
      <html>
        <body>
          <script>
            window.onload = function() {
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'instagram_connected', 
                  success: false, 
                  error: '${err.message}'
                }, '*');
                setTimeout(() => window.close(), 5000);
              }
            }
          </script>
          <div style="text-align: center; padding: 20px; color: red;">
            <h3>Connection failed</h3>
            <p>${err.message}</p>
            <p>This window will close automatically in 5 seconds.</p>
          </div>
        </body>
      </html>
    `;
  }
};

export const getUserInfo = async ctx => {
  try {
    const shopId = getCurrentShop(ctx);
    const userInfo = await getAuth(shopId);
    console.log('userInfo: ', userInfo);
    ctx.body = {
      success: true,
      data: userInfo
    };
  } catch (err) {
    ctx.status = 500;
  }
};

export const getMediaInfo = async ctx => {
  try {
    const shopId = getCurrentShop(ctx);
    const media = await getMedia(shopId);
    ctx.body = {
      success: true,
      data: media
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: err.message
    };
  }
};

export const disconnectInstagram = async ctx => {
  try {
    const shopId = getCurrentShop(ctx);
    await disconnectAuth(shopId);
    ctx.body = {
      success: true,
      message: 'Instagram disconnected successfully'
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: err.message
    };
  }
};
