// packages/functions/src/routes/clientApi.js
import Router from 'koa-router';
import {getFeed} from '@functions/controllers/clientApiController';

const router = new Router({
  prefix: '/clientApi'
});

router.get('/instagram/feed', getFeed);

export default router;
