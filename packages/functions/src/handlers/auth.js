// packages/functions/src/handlers/auth.js
import App from 'koa';
import 'isomorphic-fetch';
import {contentSecurityPolicy, shopifyAuth} from '@avada/core';
import shopifyConfig from '@functions/config/shopify';
import render from 'koa-ejs';
import path from 'path';
import createErrorHandler from '@functions/middleware/errorHandler';
import firebase from 'firebase-admin';
import appConfig from '@functions/config/app';
import {getShopByShopifyDomain} from '@avada/shopify-auth';
import {
  addFeedConfig,
  getFeedConfigByShopDomain
} from '@functions/repositories/instagramRepository';
import defaultFeedConfig from '@functions/const/defaultFeedConfig';
import {scriptTagCreate} from '@functions/services/scriptTagService';

if (firebase.apps.length === 0) {
  firebase.initializeApp();
}

// Initialize all demand configuration for an application
const app = new App();
app.proxy = true;

render(app, {
  cache: true,
  debug: false,
  layout: false,
  root: path.resolve(__dirname, '../../views'),
  viewExt: 'html'
});
app.use(createErrorHandler());
app.use(contentSecurityPolicy(true));

// Register all routes for the application
app.use(
  shopifyAuth({
    // accessTokenKey: shopifyConfig.accessTokenKey,
    apiKey: shopifyConfig.apiKey,
    firebaseApiKey: shopifyConfig.firebaseApiKey,
    scopes: shopifyConfig.scopes,
    secret: shopifyConfig.secret,
    successRedirect: '/embed',
    initialPlan: {
      id: 'free',
      name: 'Free',
      price: 0,
      trialDays: 0,
      features: {}
    },
    hostName: appConfig.baseUrl,
    isEmbeddedApp: true,
    afterInstall: async ctx => {
      try {
        // const shopifyDomain = ctx.state.shopify.shop;
        // const shop = await getShopByShopifyDomain(shopifyDomain);
        console.log('After install:');
        const {shop: shopDomain} = ctx.state.shopify;
        console.log('shopDomain:', shopDomain);
        const shop = await getShopByShopifyDomain(shopDomain);
        console.log('shop:', shop);

        await Promise.all([
          addFeedConfig({shopDomain: shopDomain, shopId: shop.id, addInfo: defaultFeedConfig})
        ]);

        const savedConfig = await getFeedConfigByShopDomain(shopDomain);
        console.log('Saved feed config:', savedConfig);
      } catch (err) {
        console.log(err);
      }
    },
    afterLogin: async ctx => {
      try {
        // const shopifyDomain = ctx.state.shopify.shop;
        // const shop = await getShopByShopifyDomain(shopifyDomain);
        console.log('After login:');
        const {shop: shopDomain} = ctx.state.shopify;
        console.log('shopDomain:', shopDomain);
        const shop = await getShopByShopifyDomain(shopDomain);
        console.log('shop:', shop);

        // await scriptTagCreate({shopName: shopDomain, accessToken: shop.accessToken});
      } catch (err) {
        console.log(err);
      }
    },
    afterThemePublish: ctx => {
      // Publish assets when theme is published or changed here
      return (ctx.body = {
        success: true
      });
    }
  }).routes()
);

// Handling all errors
app.on('error', err => {
  console.error(err);
});

export default app;
