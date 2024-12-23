// src/managers/ApiManager.js
import makeRequest from '../helpers/api/makeRequest';

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
        media: [
          {
            id: 1,
            imageUrl: 'https://picsum.photos/400',
            caption: 'Test image 1',
            timestamp: '2 days ago'
          },
          {
            id: 2,
            imageUrl: 'https://picsum.photos/401',
            caption: 'Test image 2',
            timestamp: '3 days ago'
          },
          {
            id: 3,
            imageUrl: 'https://picsum.photos/401',
            caption: 'Test image 2',
            timestamp: '3 days ago'
          },
          {
            id: 4,
            imageUrl: 'https://picsum.photos/401',
            caption: 'Test image 2',
            timestamp: '3 days ago'
          },
          {
            id: 5,
            imageUrl: 'https://picsum.photos/401',
            caption: 'Test image 2',
            timestamp: '3 days ago'
          },
          {
            id: 6,
            imageUrl: 'https://picsum.photos/401',
            caption: 'Test image 2',
            timestamp: '3 days ago'
          },
          {
            id: 7,
            imageUrl: 'https://picsum.photos/401',
            caption: 'Test image 2',
            timestamp: '3 days ago'
          },
          {
            id: 8,
            imageUrl: 'https://picsum.photos/401',
            caption: 'Test image 2',
            timestamp: '3 days ago'
          }
        ]
      };
    } catch (error) {
      console.error('API Error:', error);
      return {feedConfig: null, media: []};
    }
  };
}
