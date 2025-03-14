import React from 'react';
import {LegacyCard, FormLayout, TextField, Button} from '@shopify/polaris';

export const FeedConfig = ({feedConfig, loading, onConfigChange, onSave}) => {
  return (
    <LegacyCard sectioned title="FEED CONFIGURATION">
      <FormLayout>
        <TextField
          label="Feed Title"
          value={feedConfig.title}
          onChange={value => onConfigChange('title', value)}
        />
        <TextField
          label="Post Spacing"
          type="number"
          value={feedConfig.spacing}
          onChange={value => onConfigChange('spacing', Math.min(Math.max(Number(value), 1), 15))}
          min={1}
          max={15}
        />
        <TextField
          label="Layout (1: Grid, 2: Highlight)"
          type="number"
          value={feedConfig.layout}
          onChange={value => onConfigChange('layout', Math.min(Math.max(Number(value), 1), 2))}
          min={1}
          max={2}
        />
        <FormLayout.Group>
          <TextField
            label="Number of Rows"
            type="number"
            value={feedConfig.rows}
            onChange={value => onConfigChange('rows', Math.min(Math.max(Number(value), 1), 12))}
            min={1}
            max={12}
          />
          <TextField
            label="Number of Columns"
            type="number"
            value={feedConfig.columns}
            onChange={value => onConfigChange('columns', Math.min(Math.max(Number(value), 1), 3))}
            min={1}
            max={3}
          />
        </FormLayout.Group>
        <Button fullWidth variant="primary" loading={loading} onClick={onSave}>
          Save Feed
        </Button>
      </FormLayout>
    </LegacyCard>
  );
};
