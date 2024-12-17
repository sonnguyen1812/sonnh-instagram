import React, {useState} from 'react';
import {Page, Layout, LegacyCard, FormLayout, TextField, Button, Icon} from '@shopify/polaris';
import {LogoInstagramIcon} from '@shopify/polaris-icons';

// Dummy data for preview (replace with actual media later)
const dummyMedia = [
  {
    id: 1,
    imageUrl:
      'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTljZGdkbWFsZ2FoMml6aHQxejA4dDZ5eW1xMWlxaDJxcnNzeWg2dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WTL02R1L7YCGUEunFy/giphy.webp'
  },
  {
    id: 2,
    imageUrl:
      'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXcxY2I1OXA3dG5mZGliNHpyNTF3cDE1N3Zvam5yNXF3MWVnZm50biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vBTxCPUwfC6ddBsTbs/giphy.webp'
  },
  {
    id: 3,
    imageUrl:
      'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMThma2hscXVxMDljeHRxNXdzNjljcTJ4eTh1NjFlcTF3aG5lbWd4diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tHIRLHtNwxpjIFqPdV/giphy.webp'
  },
  {
    id: 4,
    imageUrl:
      'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWtnM2hrbHNvZjRvNDB4NHJtMmtzcWs2bTRzZWMzdTYyZzJjbXBsaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/unQ3IJU2RG7DO/giphy.webp'
  },
  {
    id: 5,
    imageUrl:
      'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWtnM2hrbHNvZjRvNDB4NHJtMmtzcWs2bTRzZWMzdTYyZzJjbXBsaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/unQ3IJU2RG7DO/giphy.webp'
  },
  {
    id: 6,
    imageUrl:
      'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWtnM2hrbHNvZjRvNDB4NHJtMmtzcWs2bTRzZWMzdTYyZzJjbXBsaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/unQ3IJU2RG7DO/giphy.webp'
  },
  {
    id: 7,
    imageUrl:
      'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWtnM2hrbHNvZjRvNDB4NHJtMmtzcWs2bTRzZWMzdTYyZzJjbXBsaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/unQ3IJU2RG7DO/giphy.webp'
  },
  {
    id: 8,
    imageUrl:
      'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWtnM2hrbHNvZjRvNDB4NHJtMmtzcWs2bTRzZWMzdTYyZzJjbXBsaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/unQ3IJU2RG7DO/giphy.webp'
  }
];

const Home = () => {
  const [feedTitle, setFeedTitle] = useState('');
  const [postSpacing, setPostSpacing] = useState(10);
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(3);
  const [layout, setLayout] = useState(1); // Default layout

  const handleSaveFeed = () => {
    // Handle saving feed configuration
  };

  const handleInputChange = (setter, min, max) => value => {
    const numericValue = Math.max(min, Math.min(Number(value), max));
    setter(numericValue);
  };

  // Grid Layout Style
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${postSpacing}px`,
    marginTop: '0px'
  };

  // Highlight Layout Style
  const highlightStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gridTemplateRows: 'auto auto',
    gap: `${postSpacing}px`,
    marginTop: '20px'
  };

  const renderGridLayout = () => (
    <div style={gridStyle}>
      {dummyMedia.slice(0, rows * columns).map(media => (
        <div key={media.id} style={{position: 'relative'}}>
          <img
            src={media.imageUrl}
            alt={media.caption}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              color: 'white',
              fontSize: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '2px 5px',
              borderRadius: '4px'
            }}
          >
            {media.caption}
          </div>
        </div>
      ))}
    </div>
  );

  const renderHighlightLayout = () => (
    <div style={highlightStyle}>
      {dummyMedia.slice(0, 5).map((media, index) => (
        <div
          key={media.id}
          style={{
            position: 'relative',
            gridColumn: index === 0 ? 'span 2' : 'span 1',
            gridRow: index === 0 ? 'span 2' : 'span 1'
          }}
        >
          <img
            src={media.imageUrl}
            alt={media.caption}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              objectFit: 'cover',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              color: 'white',
              fontSize: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '2px 5px',
              borderRadius: '4px'
            }}
          >
            {media.caption}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Page fullWidth title="Instagram Feed App">
      <Layout>
        <Layout.Section variant="oneHalf">
          <LegacyCard sectioned>
            <Button variant="primary" icon={<Icon source={LogoInstagramIcon} />}>
              Connect with Instagram
            </Button>
          </LegacyCard>
          <LegacyCard title="Feed Configuration" sectioned>
            <FormLayout>
              <TextField label="Feed Title" value={feedTitle} onChange={setFeedTitle} />
              <TextField
                label="Post Spacing"
                type="number"
                value={postSpacing}
                onChange={handleInputChange(setPostSpacing, 1, 15)}
                min={1}
                max={15}
              />
              <TextField
                label="Layout (1: Grid, 2: Highlight)"
                type="number"
                value={layout}
                onChange={handleInputChange(setLayout, 1, 2)}
                min={1}
                max={2}
              />
              <FormLayout.Group>
                <TextField
                  label="Number of Rows"
                  type="number"
                  value={rows}
                  onChange={handleInputChange(setRows, 1, 12)}
                  min={1}
                  max={12}
                />
                <TextField
                  label="Number of Columns"
                  type="number"
                  value={columns}
                  onChange={handleInputChange(setColumns, 1, 3)}
                  min={1}
                  max={3}
                />
              </FormLayout.Group>
              <Button fullWidth variant="primary" onClick={handleSaveFeed}>
                Save Feed
              </Button>
            </FormLayout>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section>
          <LegacyCard title="Preview" sectioned>
            {layout === 2 ? renderHighlightLayout() : renderGridLayout()}
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Home;
