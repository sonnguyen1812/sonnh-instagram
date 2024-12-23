// packages/functions/src/handlers/clientApi.js
import App from 'koa';
import router from '@functions/routes/clientApi';
import {handleError} from '@functions/services/errorService';
import cors from '@koa/cors';

const api = new App();

api.proxy = true;

api.use(cors());
api.use(router.allowedMethods());
api.use(router.routes());

api.on('error', handleError);

export default api;
