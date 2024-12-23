// packages/assets/src/components/InstagramFeed/InstagramFeed.js
import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {LegacyCard, SkeletonDisplayText, Spinner} from '@shopify/polaris';

const LAYOUT_TYPES = {
  GRID: 1,
  HIGHLIGHT: 2
};

const MediaItem = memo(({item, index, config}) => {
  const isHighlight = config.layout === LAYOUT_TYPES.HIGHLIGHT && index === 0;

  return (
    <div
      style={{
        position: 'relative',
        cursor: 'pointer',
        paddingBottom: '100%',
        ...(isHighlight && {
          gridColumn: 'span 2',
          gridRow: 'span 2'
        })
      }}
      className="instagram-feed__item"
    >
      <img
        src={item.imageUrl}
        alt={item.caption || ''}
        style={{
          position: 'absolute',
          width: '100%',
          height: isHighlight ? '100%' : 'auto',
          objectFit: isHighlight ? 'cover' : 'contain',
          borderRadius: '8px'
        }}
        loading="lazy" // Lazy load images
        onError={e => {
          e.target.src = 'fallback-image.jpg'; // Fallback image if load fails
          console.error(`Failed to load image: ${item.imageUrl}`);
        }}
      />
      <div
        className="overlay"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '12px',
          opacity: 0,
          transition: 'opacity 0.2s'
        }}
      >
        <p className="time">{item.timestamp}</p>
      </div>
    </div>
  );
});

const LoadingState = memo(() => (
  <div style={{padding: '20px', textAlign: 'center'}}>
    <Spinner size="large" />
    <SkeletonDisplayText size="small" />
  </div>
));

const ErrorState = memo(({error}) => (
  <div
    style={{
      padding: '20px',
      textAlign: 'center',
      color: 'var(--p-text-critical)'
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
  const gridStyle = React.useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
      gap: `${config.spacing}px`
    }),
    [config.columns, config.spacing]
  );

  const highlightStyle = React.useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      gridTemplateRows: 'auto auto',
      gap: `${config.spacing}px`
    }),
    [config.spacing]
  );

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (!media.length) {
      return <p style={{textAlign: 'center'}}>No media to display</p>;
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
      <LegacyCard title={'Preview'} sectioned>
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
