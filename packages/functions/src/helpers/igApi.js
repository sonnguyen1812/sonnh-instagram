import {params} from 'firebase-functions/v1';
import axios from 'axios';

const IG_GRAPH_BASE_URL = 'https://graph.instagram.com';
const IG_API_BASE_URL = 'https://api.instagram.com';
const IG_WEB_BASE_URL = 'https://www.instagram.com';

class IgApi {
  constructor() {
    this.clientId = process.env.INSTAGRAM_CLIENT_ID;
    this.clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    this.redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  }

  async authInstagram(shopId) {
    const authURL = `${IG_WEB_BASE_URL}/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=instagram_business_basic,instagram_business_manage_comments&response_type=code&state=${shopId}`;
    return authURL;
  }

  async retrieveToken(code) {
    const requestBody = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    };

    try {
      const url = `${IG_API_BASE_URL}/oauth/access_token?${requestBody}`;
      const data = await axios.post(url, requestBody, headers);

      const shortToken = data.data.access_token;

      const retrieveLongToken = await this.retrieveLongToken(shortToken);

      return {
        user_id: data.data.user_id,
        permissions: data.data.permissions,
        long_token: retrieveLongToken.data.access_token,
        expires_in: retrieveLongToken.data.expires_in,
        success: true
      };
    } catch (e) {
      return {
        success: false,
        error: e.message
      };
    }
  }

  async retrieveLongToken(access_token) {
    const requestParams = new URLSearchParams({
      grant_type: 'ig_exchange_token',
      client_secret: this.clientSecret,
      access_token
    });
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    };

    try {
      const url = `${IG_GRAPH_BASE_URL}/access_token?${requestParams}`;
      const data = await axios.get(url, headers);

      return data;
    } catch (e) {
      return {access_token: false};
    }
  }

  async refreshToken(refresh_token) {
    const requestBody = new URLSearchParams({
      grant_type: 'ig_refresh_token',
      access_token: refresh_token
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    };

    try {
      const data = await axios.get(`${IG_GRAPH_BASE_URL}/refresh_access_token`, {
        params: requestBody,
        headers
      });

      return data;
    } catch (e) {
      return {
        success: false,
        error: e.message
      };
    }
  }

  async getMe(access_token) {
    const data = await axios.get(`${IG_GRAPH_BASE_URL}/v22.0/me`, {
      params: {
        fields: 'user_id,username',
        access_token
      }
    });

    return data;
  }

  async getMedia(access_token, user_id) {
    try {
      const data = await axios.get(`${IG_GRAPH_BASE_URL}/v22.0/${user_id}/media`, {
        params: {
          fields:
            'username,name,id,media_type,media_url,thumbnail_url,comments_count,like_count,caption,timestamp,permalink',
          access_token
        }
      });

      return data;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getMediaUrl(access_token, mediaId) {
    try {
      const data = await axios.get(`${IG_GRAPH_BASE_URL}/${mediaId}`, {
        params: {
          fields:
            'media_url,caption,is_shared_to_feed,id,media_type,permalink,thumbnail_url,timestamp,username',
          access_token
        }
      });

      if (!data.media_url) {
        throw new Error('An error occurred while fetching media URL');
      }

      return data.media_url;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default IgApi;
