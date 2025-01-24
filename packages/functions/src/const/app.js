// packages/functions/src/const/app.js
export const apiPrefix = {
  embed: '/api',
  standalone: '/apiSa'
};

export const getApiPrefix = isEmbedApp => (isEmbedApp ? apiPrefix.embed : apiPrefix.standalone);
