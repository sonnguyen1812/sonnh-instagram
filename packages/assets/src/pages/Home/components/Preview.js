import React from 'react';
import InstagramFeed from '@assets/components/InstagramFeed/InstagramFeed';

export const Preview = ({mediaInfo, feedConfig, loading, fetchedMediaInfo, isUserConnected}) => {
  return (
    <div className="feed-preview">
      <InstagramFeed
        media={mediaInfo?.mediaList || []}
        config={feedConfig}
        preview={true}
        loading={loading || (!fetchedMediaInfo && isUserConnected)}
      />
    </div>
  );
};
