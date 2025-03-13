import Router from 'koa-router';
import {handleCallback} from '../controllers/instagramController';

export default function apiRouter() {
  const router = new Router({prefix: '/authSocial'});

  router.get('/instagram/callback', handleCallback);
  return router;
}
