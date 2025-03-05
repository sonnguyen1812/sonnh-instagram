// packages/scripttag/src/managers/DisplayManager.js
import InstagramFeed from '../components/InstagramFeed/InstagramFeed';
import React from 'react';
import {render} from 'preact';
import {insertAfter} from '../helpers/insertHelpers';

export default class DisplayManager {
  constructor() {
    this.feedConfig = null;
    this.media = [];
    this.shopifyDomain = 'https://' + Shopify.shop;
  }

  async initialize({feedConfig, media}) {
    this.feedConfig = feedConfig;
    this.media = media;
    console.log('Initializing DisplayManager...', feedConfig, media);
    const container = this.insertContainer();
    console.log('Container:', container);

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
    const container = this.insertContainer();
    console.log('render');
    if (container) {
      render(
        <InstagramFeed config={feedConfig} media={media} preview={false} />,
        document.getElementById('instagram-feed-container')
      );
    } else {
      console.error('Instagram Feed container not found');
    }
  }

  insertContainer() {
    const feedEl = document.createElement('div');
    const targetEl = document.querySelector('body').firstChild;
    if (targetEl) {
      insertAfter(feedEl, targetEl);
    }

    return feedEl;
  }
}
