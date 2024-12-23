// packages/scripttag/src/managers/DisplayManager.js
import InstagramFeed from '../components/InstagramFeed/InstagramFeed';
import React from 'react';
import {render} from 'preact';

export default class DisplayManager {
  constructor() {
    this.feedConfig = null;
    this.media = [];
    this.shopifyDomain = 'https://' + Shopify.shop;
  }

  async initialize({feedConfig, media}) {
    this.feedConfig = feedConfig;
    this.media = media;
    const container = this.insertContainer();

    if (!container) {
      console.error('Failed to create container');
      return;
    }

    try {
      this.display({
        feedConfig,
        media
      });
    } catch (error) {
      console.error('Display error:', error);
    }
  }

  display({feedConfig, media}) {
    const container = document.querySelector('#avada-instagram-feed');
    render(<InstagramFeed config={feedConfig} media={media} preview={false} />, container);
  }

  insertContainer() {
    const feedEl = document.createElement('div');
    feedEl.id = 'avada-instagram-feed';
    feedEl.classList.add('avada-instagram-feed__wrapper');

    const targetEl = document.querySelector('body').firstChild;
    if (targetEl) {
      targetEl.parentNode.insertBefore(feedEl, targetEl);
    }

    return feedEl;
  }
}
