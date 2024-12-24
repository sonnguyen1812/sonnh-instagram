// src/managers/ApiManager.js
import makeRequest from '../helpers/api/makeRequest';
import dummyMedia from '../components/const/dummyMedia';

export default class ApiManager {
  getFeedConfig = async () => {
    return this.getApiData();
  };

  getApiData = async () => {
    try {
      const shopifyDomain = window.Shopify?.shop;
      if (!shopifyDomain) {
        console.error('Shop domain not found');
        return {feedConfig: null, media: []};
      }

      // Get base URL từ script tag
      const scriptTag =
        document.currentScript || document.querySelector('script[src*="instagram-feed"]');
      const scriptUrl = scriptTag?.src || '';
      const baseUrl = scriptUrl.split('/scripttag')[0]; // Extract base URL

      console.log('Base URL:', baseUrl);
      console.log('Shop domain:', shopifyDomain);

      const response = await makeRequest(
        `${baseUrl}/clientApi/instagram/feed?shopDomain=${shopifyDomain}`
      );

      console.log('API Response:', response);

      return {
        feedConfig: response?.data?.feedConfig,
        media: dummyMedia
      };
    } catch (error) {
      console.error('API Error:', error);
      return {feedConfig: null, media: []};
    }
  };
}
