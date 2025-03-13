// packages/functions/src/routes/api.js
import * as sampleController from '@functions/controllers/sampleController';
import * as shopController from '@functions/controllers/shopController';
import * as subscriptionController from '@functions/controllers/subscriptionController';
import * as appNewsController from '@functions/controllers/appNewsController';

import {
  getFeed,
  updateFeed,
  connectInstagram,
  getUserInfo,
  getMediaInfo,
  disconnectInstagram
} from '../controllers/instagramController';

import Router from 'koa-router';
import {getApiPrefix} from '@functions/const/app';

export default function apiRouter(isEmbed = false) {
  const router = new Router({prefix: getApiPrefix(isEmbed)});

  router.get('/samples', sampleController.exampleAction);
  router.get('/shops', shopController.getUserShops);
  router.get('/subscription', subscriptionController.getSubscription);
  router.get('/appNews', appNewsController.getList);

  // feed config
  router.get('/instagram/feed', getFeed);
  router.put('/instagram/feed', updateFeed);

  router.get('/instagram/connect', connectInstagram);
  router.get('/instagram/user', getUserInfo);
  router.get('/instagram/media', getMediaInfo);
  router.post('/instagram/disconnect', disconnectInstagram);

  return router;
}
