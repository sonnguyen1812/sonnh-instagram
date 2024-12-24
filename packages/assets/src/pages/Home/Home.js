// packages/assets/src/pages/Home/Home.js
import React, {useState} from 'react';
import {
  Frame,
  Page,
  Layout,
  LegacyCard,
  FormLayout,
  TextField,
  Button,
  Icon,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer
} from '@shopify/polaris';
import {LogoInstagramIcon} from '@shopify/polaris-icons';
import InstagramFeed from '@avada/scripttag/src/components/InstagramFeed/InstagramFeed';
import useActiveToast from '@assets/hooks/toast/useActiveToast';
import useModal from '@assets/hooks/popup/useModal';
import useGetApi from '@assets/hooks/api/useGetApi';
import {api} from '@assets/helpers';
import defaultFeedConfig from '@functions/const/defaultFeedConfig';
import dummyMedia from '@avada/scripttag/src/components/const/dummyMedia';

export default function Home() {
  const {toastMarkup, handleActiveToastChange} = useActiveToast(false, '');
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Get feed config từ API sử dụng useGetApi hook
  const {data: feedConfig, setData: setFeedConfig, fetched, setFetched} = useGetApi({
    url: '/instagram/feed',
    defaultData: defaultFeedConfig,
    onSuccess: () => {
      setIsInitialLoading(false);
    }
  });

  // Handle save feed config
  const handleSaveFeed = async () => {
    try {
      if (fetched) {
        handleActiveToastChange('Your feed settings have not changed');
        closeModal();
        return;
      }

      setLoading(true);
      const res = await api('/instagram/feed', {
        method: 'PUT',
        body: {data: feedConfig}
      });

      if (res && res.data) {
        setFeedConfig(prevConfig => ({
          ...prevConfig,
          ...res.data
        }));

        setFetched(true);
        closeModal();
        handleActiveToastChange('Save successfully');
      }
    } catch (err) {
      console.error('Save feed settings error:', err);
      handleActiveToastChange('Save failed');
    } finally {
      setLoading(false);
    }
  };

  // Modal confirm save
  const {modal, openModal, closeModal} = useModal({
    title: 'Save change',
    content: 'Do you want to update your feed settings?',
    confirmAction: handleSaveFeed,
    primaryAction: {
      content: 'Save',
      loading: loading,
      onAction: handleSaveFeed
    }
  });

  const handleFeedConfigChange = (key, value) => {
    setFetched(false);
    setFeedConfig(prevConfig => {
      const newConfig = {
        ...prevConfig,
        [key]: value
      };
      console.log('Feed config after change:', newConfig);
      return newConfig;
    });
  };

  // Loading skeleton component
  const SkeletonContent = () => {
    return (
      <Layout>
        <Layout.Section variant={'oneHalf'}>
          <LegacyCard sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section>
          <LegacyCard>
            <LegacyCard.Section>
              <TextContainer>
                <SkeletonDisplayText size="small" />
              </TextContainer>
            </LegacyCard.Section>
            <LegacyCard.Section>
              <SkeletonBodyText lines={3} />
            </LegacyCard.Section>
            <LegacyCard.Section>
              <SkeletonBodyText lines={3} />
            </LegacyCard.Section>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    );
  };

  if (isInitialLoading) {
    return (
      <Frame>
        <Page fullWidth title="Instagram Feed App">
          <SkeletonContent />
        </Page>
      </Frame>
    );
  }

  return (
    <div style={{marginBottom: '50px'}}>
      <Frame>
        <Page
          fullWidth
          title="Instagram Feed App"
          subtitle="Configure how your Instagram feed will display"
        >
          <Layout>
            <Layout.Section variant={'oneHalf'}>
              <LegacyCard sectioned>
                <Button variant="primary" icon={<Icon source={LogoInstagramIcon} />}>
                  Connect with Instagram
                </Button>
              </LegacyCard>

              <LegacyCard sectioned title="FEED CONFIGURATION">
                <FormLayout>
                  <TextField
                    label="Feed Title"
                    value={feedConfig.title}
                    onChange={value => handleFeedConfigChange('title', value)}
                  />
                  <TextField
                    label="Post Spacing"
                    type="number"
                    value={feedConfig.spacing}
                    onChange={value =>
                      handleFeedConfigChange('spacing', Math.min(Math.max(Number(value), 1), 15))
                    }
                    min={1}
                    max={15}
                  />
                  <TextField
                    label="Layout (1: Grid, 2: Highlight)"
                    type="number"
                    value={feedConfig.layout}
                    onChange={value =>
                      handleFeedConfigChange('layout', Math.min(Math.max(Number(value), 1), 2))
                    }
                    min={1}
                    max={2}
                  />
                  <FormLayout.Group>
                    <TextField
                      label="Number of Rows"
                      type="number"
                      value={feedConfig.rows}
                      onChange={value =>
                        handleFeedConfigChange('rows', Math.min(Math.max(Number(value), 1), 12))
                      }
                      min={1}
                      max={12}
                    />
                    <TextField
                      label="Number of Columns"
                      type="number"
                      value={feedConfig.columns}
                      onChange={value =>
                        handleFeedConfigChange('columns', Math.min(Math.max(Number(value), 1), 3))
                      }
                      min={1}
                      max={3}
                    />
                  </FormLayout.Group>
                  <Button
                    fullWidth
                    variant="primary"
                    loading={loading}
                    onClick={() => openModal()}
                  >
                    Save Feed
                  </Button>
                </FormLayout>
              </LegacyCard>
            </Layout.Section>

            <Layout.Section>
              <div className="feed-preview">
                <InstagramFeed media={dummyMedia} config={feedConfig} preview={true} shopifyMode={true} />
              </div>
            </Layout.Section>
          </Layout>
          {toastMarkup}
        </Page>
        {modal}
      </Frame>
    </div>
  );
}
