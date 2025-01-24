// packages/functions/src/presenters/shopPresenter.js
/**
 * Strip access token by default
 *
 * @param {Shop} data
 * @returns {*}
 */
export default function presentShop(data) {
  // eslint-disable-next-line no-unused-vars
  const {accessToken, ...shop} = data;

  return shop;
}
