import React, {memo, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {LegacyCard, SkeletonDisplayText, Spinner} from '@shopify/polaris';

const LAYOUT_TYPES = {
  GRID: 1,
  HIGHLIGHT: 2
};

// Hàm chuyển đổi dữ liệu từ Instagram API sang định dạng component
const formatInstagramMedia = mediaItem => {
  // Kiểm tra nếu đã là format cũ (từ dummy data)
  if (mediaItem.type && mediaItem.mediaUrl) {
    return mediaItem;
  }

  // Format từ Instagram API
  return {
    id: mediaItem.id,
    type: mediaItem.media_type?.toLowerCase() === 'video' ? 'video' : 'image',
    mediaUrl: mediaItem.media_url,
    posterUrl: mediaItem.thumbnail_url || mediaItem.media_url,
    caption: mediaItem.caption,
    postDate: mediaItem.timestamp,
    permalink: mediaItem.permalink
  };
};

const MediaItem = memo(({item, index, config}) => {
  const imageRef = useRef(null);
  const isHighlight = config.layout === LAYOUT_TYPES.HIGHLIGHT && index === 0;

  // Format item nếu cần
  const formattedItem = formatInstagramMedia(item);

  useEffect(() => {
    if (imageRef.current) {
      const img = new Image();
      img.src = formattedItem.type === 'video' ? formattedItem.posterUrl : formattedItem.mediaUrl;
      img.onload = () => {
        if (imageRef.current) {
          imageRef.current.src =
            formattedItem.type === 'video' ? formattedItem.posterUrl : formattedItem.mediaUrl;
        }
      };
    }
  }, [formattedItem]);

  return (
    <div
      className={`instagram-feed__item ${isHighlight ? 'instagram-feed__item--highlight' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '100%',
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: '#f6f6f6'
      }}
    >
      <img
        ref={imageRef}
        alt={formattedItem.caption || ''}
        className="instagram-feed__image"
        loading="lazy"
        decoding="async"
        fetchpriority={index < 4 ? 'high' : 'low'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      {formattedItem.type === 'video' && (
        <div
          className="instagram-feed__video-indicator"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          Video
        </div>
      )}
      <div
        className="instagram-feed__overlay"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          color: 'white',
          padding: '20px 12px 12px',
          opacity: 1
        }}
      >
        <p style={{margin: 0, fontSize: '13px'}}>
          {formattedItem.postDate ? new Date(formattedItem.postDate).toLocaleDateString() : ''}
        </p>
      </div>
    </div>
  );
});

MediaItem.displayName = 'MediaItem';

const LoadingState = memo(() => (
  <div
    className="instagram-feed__loading"
    style={{
      padding: '20px',
      textAlign: 'center',
      minHeight: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Spinner size="large" />
    <SkeletonDisplayText size="small" />
  </div>
));

LoadingState.displayName = 'LoadingState';

const ErrorState = memo(({error}) => (
  <div
    className="instagram-feed__error"
    style={{
      padding: '20px',
      textAlign: 'center',
      color: 'var(--p-text-critical)',
      minHeight: '100px'
    }}
  >
    <p>Failed to load Instagram feed: {error}</p>
  </div>
));

ErrorState.displayName = 'ErrorState';

const InstagramFeed = ({
  media = [],
  config = {
    title: '',
    layout: LAYOUT_TYPES.GRID,
    columns: 3,
    rows: 2,
    spacing: 10
  },
  preview = false,
  loading = false,
  error = null
}) => {
  const gridStyle = React.useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
      gap: `${config.spacing}px`,
      minHeight: '200px',
      contain: 'content'
    }),
    [config.columns, config.spacing]
  );

  const highlightStyle = React.useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      gridTemplateRows: 'auto auto',
      gap: `${config.spacing}px`,
      minHeight: '200px',
      contain: 'content'
    }),
    [config.spacing]
  );

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (!media || !media.length) {
      return (
        <div className="instagram-feed__empty" style={{minHeight: '100px', textAlign: 'center'}}>
          No media to display
        </div>
      );
    }

    return (
      <div style={config.layout === LAYOUT_TYPES.HIGHLIGHT ? highlightStyle : gridStyle}>
        {config.layout === LAYOUT_TYPES.HIGHLIGHT
          ? media
              .slice(0, 5)
              .map((item, index) => (
                <MediaItem key={item.id} item={item} index={index} config={config} />
              ))
          : media
              .slice(0, config.rows * config.columns)
              .map((item, index) => (
                <MediaItem key={item.id} item={item} index={index} config={config} />
              ))}
      </div>
    );
  };

  if (preview) {
    return (
      <LegacyCard title="Preview" sectioned>
        {renderContent()}
      </LegacyCard>
    );
  }

  return renderContent();
};

InstagramFeed.propTypes = {
  media: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      // Chấp nhận cả hai format
      type: PropTypes.string,
      media_type: PropTypes.string,
      mediaUrl: PropTypes.string,
      media_url: PropTypes.string,
      thumbnail_url: PropTypes.string,
      posterUrl: PropTypes.string,
      caption: PropTypes.string,
      postDate: PropTypes.string,
      timestamp: PropTypes.string,
      permalink: PropTypes.string
    })
  ),
  config: PropTypes.shape({
    title: PropTypes.string,
    layout: PropTypes.oneOf([LAYOUT_TYPES.GRID, LAYOUT_TYPES.HIGHLIGHT]),
    columns: PropTypes.number,
    rows: PropTypes.number,
    spacing: PropTypes.number
  }),
  preview: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.string
};

MediaItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  config: PropTypes.object.isRequired
};

ErrorState.propTypes = {
  error: PropTypes.string.isRequired
};

export default memo(InstagramFeed);
