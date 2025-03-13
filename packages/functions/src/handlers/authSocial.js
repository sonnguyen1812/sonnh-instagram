import App from 'koa';
import apiRouter from '../routes/authSocial';
import createErrorHandler from '../middleware/errorHandler';
import {handleError} from '../services/errorService';

const api = new App();

api.proxy = true;

api.use(createErrorHandler());

const router = apiRouter();

api.use(router.allowedMethods());
api.use(router.routes());

api.on('error', handleError);

export default api;
