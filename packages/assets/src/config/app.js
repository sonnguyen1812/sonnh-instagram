// packages/assets/src/config/app.js
import appRoute from '@assets/const/app';

export const isEmbeddedApp = process.env.IS_EMBEDDED_APP === 'yes';
export const routePrefix = isEmbeddedApp ? appRoute.embed : appRoute.standalone;

export const prependRoute = url => routePrefix + url;
export const removeRoute = url => (isEmbeddedApp ? url.replace(routePrefix, '') : url);

