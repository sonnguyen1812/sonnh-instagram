// packages/scripttag/src/components/InstagramFeed/InstagramFeed.js
import React, {memo, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {LegacyCard, SkeletonDisplayText, Spinner} from '@shopify/polaris';

const LAYOUT_TYPES = {
  GRID: 1,
  HIGHLIGHT: 2
};

const MediaItem = memo(({item, index, config}) => {
  const imageRef = useRef(null);
  const isHighlight = config.layout === LAYOUT_TYPES.HIGHLIGHT && index === 0;

  useEffect(() => {
    if (imageRef.current) {
      const img = new Image();
      img.src = item.imageUrl;
      img.onload = () => {
        if (imageRef.current) {
          imageRef.current.src = item.imageUrl;
        }
      };
    }
  }, [item.imageUrl]);

  return (
    <div
      className={`instagram-feed__item ${isHighlight ? 'instagram-feed__item--highlight' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        overflow: 'hidden'
      }}
    >
      <div
        className="instagram-feed__placeholder"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f6f6f6',
          position: 'absolute'
        }}
      />
      <img
        ref={imageRef}
        alt={item.caption || ''}
        className="instagram-feed__image"
        width="100%"
        height="100%"
        loading="lazy"
        decoding="async"
        fetchpriority={index < 4 ? 'high' : 'low'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: isHighlight ? 'cover' : 'contain',
          borderRadius: '8px'
        }}
        onError={e => {
          e.target.src = 'fallback-image.jpg';
          console.error(`Failed to load image: ${item.imageUrl}`);
        }}
      />
      <div
        className="instagram-feed__overlay"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '12px',
          opacity: 0,
          transition: 'opacity 0.2s',
          transform: 'translateZ(0)'
        }}
      >
        <p className="time">{item.timestamp}</p>
      </div>
    </div>
  );
});

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
  const containerRef = useRef(null);

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
    if (!media.length) {
      return (
        <div className="instagram-feed__empty" style={{minHeight: '100px', textAlign: 'center'}}>
          No media to display
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        style={config.layout === LAYOUT_TYPES.HIGHLIGHT ? highlightStyle : gridStyle}
      >
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

// PropTypes validation
InstagramFeed.propTypes = {
  media: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      imageUrl: PropTypes.string.isRequired,
      caption: PropTypes.string,
      timestamp: PropTypes.string
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
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    imageUrl: PropTypes.string.isRequired,
    caption: PropTypes.string,
    timestamp: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired,
  config: PropTypes.object.isRequired
};

ErrorState.propTypes = {
  error: PropTypes.string.isRequired
};

// Memo các components để tránh re-render không cần thiết
export default memo(InstagramFeed);
