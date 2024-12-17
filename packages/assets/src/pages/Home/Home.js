import React, {useState} from 'react';
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Button,
  LegacyCard,
  Icon
} from '@shopify/polaris';
import {LogoInstagramIcon} from '@shopify/polaris-icons';

// Dummy data for preview (replace with actual media later)
const dummyMedia = [
  {id: 1, imageUrl: 'https://via.placeholder.com/150', caption: 'Image 1'},
  {id: 2, imageUrl: 'https://via.placeholder.com/150', caption: 'Image 2'},
  {id: 3, imageUrl: 'https://via.placeholder.com/150', caption: 'Image 3'},
  {id: 4, imageUrl: 'https://via.placeholder.com/150', caption: 'Image 4'},
  {id: 5, imageUrl: 'https://via.placeholder.com/150', caption: 'Image 5'},
  {id: 6, imageUrl: 'https://via.placeholder.com/150', caption: 'Image 6'},
  {id: 7, imageUrl: 'https://via.placeholder.com/150', caption: 'Image 7'},
  {id: 8, imageUrl: 'https://via.placeholder.com/150', caption: 'Image 8'}
];

const Home = () => {
  const [feedTitle, setFeedTitle] = useState('');
  const [postSpacing, setPostSpacing] = useState(10);
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(4);
  const [layout, setLayout] = useState(4); // Default layout

  const handleSaveFeed = () => {
    // Handle saving feed configuration
  };

  // Generate grid styles based on rows, columns, spacing, and layout
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns:
      layout === 1 ? '1fr' : layout === 2 ? 'repeat(2, 1fr)' : `repeat(${columns}, 1fr)`, // Layout: 1 => 1 column, 2 => 2 columns, else use columns
    gap: `${postSpacing}px`, // Set gap between items
    marginTop: '20px'
  };

  // Adjust grid based on row and layout configuration
  const rowStyle = {
    gridTemplateRows: `repeat(${rows}, auto)` // Set number of rows dynamically
  };

  return (
    <Page fullWidth title="Instagram Feed App">
      <Layout>
        <Layout.Section variant={'oneHalf'}>
          <LegacyCard sectioned>
            <Button variant={'primary'} icon={<Icon source={LogoInstagramIcon} />}>
              Connect with Instagram
            </Button>
          </LegacyCard>
          <LegacyCard title="Feed Configuration" sectioned>
            <FormLayout>
              <TextField
                label="Feed Title"
                type={'text'}
                value={feedTitle}
                onChange={setFeedTitle}
              />
              <TextField
                label="Post Spacing"
                type={'number'}
                value={postSpacing}
                onChange={setPostSpacing}
              />
              <TextField label="Layout" type="number" value={layout} onChange={setLayout} />
              <FormLayout.Group>
                <TextField label="Number of Rows" type="number" value={rows} onChange={setRows} />
                <TextField
                  label="Number of Columns"
                  type="number"
                  value={columns}
                  onChange={setColumns}
                />
              </FormLayout.Group>
              <Button fullWidth variant={'primary'} onClick={handleSaveFeed}>
                Save Feed
              </Button>
            </FormLayout>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section>
          <LegacyCard title="Preview" sectioned>
            <div style={{...gridStyle, ...rowStyle}}>
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
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Home;
