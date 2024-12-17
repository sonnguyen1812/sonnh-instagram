import React from 'react';
import {Card, IndexTable, Layout, Page, useIndexResourceState, Text, Button} from '@shopify/polaris';
import useFetchApi from '@assets/hooks/api/useFetchApi';

/**
 * Just render a sample page
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function Samples() {
  return <Page title="Sơn có đẹp trai không?" primaryAction={<Button variant="primary">Có</Button>}></Page>;
}
