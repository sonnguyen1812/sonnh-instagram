// packages/scripttag/src/index.js
import ApiManager from './managers/ApiManager';
import DisplayManager from './managers/DisplayManager';

console.log('Instagram Feed Script Starting...');

(async () => {
  try {
    // Tránh load script nhiều lần
    if (window.instaFeedLoaded) {
      console.log('Instagram Feed already loaded');
      return;
    }
    window.instaFeedLoaded = true;

    console.log('Initializing managers...');
    const apiManager = new ApiManager();
    const displayManager = new DisplayManager();

    console.log('Fetching feed data...');
    const {feedConfig, media} = await apiManager.getFeedConfig();

    if (!feedConfig) {
      console.error('No feed config returned');
      return;
    }

    console.log('Feed config:', feedConfig);
    console.log('Media:', media);
    console.log('Initializing display...');

    await displayManager.initialize({
      feedConfig,
      media
    });
    console.log('done');
  } catch (error) {
    console.error('Instagram Feed Error:', error);
  }
})();
