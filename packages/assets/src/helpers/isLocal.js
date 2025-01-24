// packages/assets/src/helpers/isLocal.js
const isLocal = import.meta.env.VITE_NODE_ENV === 'development';

export default isLocal;
