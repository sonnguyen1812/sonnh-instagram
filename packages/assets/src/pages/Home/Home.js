// pages/Home/Home.js
import React, {useState} from 'react';
import {Page, Layout, LegacyCard, FormLayout, TextField, Button, Icon} from '@shopify/polaris';
import {LogoInstagramIcon} from '@shopify/polaris-icons';
import InstagramFeed from '../../components/InstagramFeed/InstagramFeed';

const Home = () => {
  const [config, setConfig] = useState({
    title: '',
    layout: 1,
    columns: 3,
    rows: 2,
    spacing: 10
  });

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

  const handleInputChange = (field, min, max) => value => {
    const numericValue = Math.max(min, Math.min(Number(value), max));
    setConfig(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleTitleChange = value => {
    setConfig(prev => ({
      ...prev,
      title: value
    }));
  };

  return (
    <Page fullWidth title="Instagram Feed App">
      <Layout>
        <Layout.Section variant={'oneHalf'}>
          <LegacyCard sectioned>
            <Button variant="primary" icon={<Icon source={LogoInstagramIcon} />}>
              Connect with Instagram
            </Button>
          </LegacyCard>

          <LegacyCard sectioned>
            <FormLayout>
              <TextField label="Feed Title" value={config.title} onChange={handleTitleChange} />
              <TextField
                label="Post Spacing"
                type="number"
                value={config.spacing}
                onChange={handleInputChange('spacing', 1, 15)}
                min={1}
                max={15}
              />
              <TextField
                label="Layout (1: Grid, 2: Highlight)"
                type="number"
                value={config.layout}
                onChange={handleInputChange('layout', 1, 2)}
                min={1}
                max={2}
              />
              <FormLayout.Group>
                <TextField
                  label="Number of Rows"
                  type="number"
                  value={config.rows}
                  onChange={handleInputChange('rows', 1, 12)}
                  min={1}
                  max={12}
                />
                <TextField
                  label="Number of Columns"
                  type="number"
                  value={config.columns}
                  onChange={handleInputChange('columns', 1, 3)}
                  min={1}
                  max={3}
                />
              </FormLayout.Group>
              <Button fullWidth variant="primary">
                Save Feed
              </Button>
            </FormLayout>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section>
          <InstagramFeed media={dummyMedia} config={config} preview={true} />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Home;
