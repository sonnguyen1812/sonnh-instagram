// packages/assets/src/pages/Home/Home.js
import React, {useState, useEffect} from 'react';
import {
  Frame,
  Page,
  Layout,
  LegacyCard,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer
} from '@shopify/polaris';
import {LogoInstagramIcon} from '@shopify/polaris-icons';
import useActiveToast from '@assets/hooks/toast/useActiveToast';
import useModal from '@assets/hooks/popup/useModal';
import useGetApi from '@assets/hooks/api/useGetApi';
import {api} from '@assets/helpers';
import {FeedConfig} from './components/FeedConfig';
import {InstagramConnect} from './components/InstagramConnect';
import {Preview} from './components/Preview';

export default function Home() {
  const {toastMarkup, handleActiveToastChange} = useActiveToast(false, '');
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [isMediaConnected, setIsMediaConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);

  // Get feed config từ API sử dụng useGetApi hook
  const {data: feedConfig, setData: setFeedConfig, fetched, setFetched} = useGetApi({
    url: '/instagram/feed',
    onSuccess: () => {
      setIsInitialLoading(false);
    }
  });

  const {data: userInfo, setData: setUserInfo, fetched: fetchedUserInfo} = useGetApi({
    url: '/instagram/user',
    onSuccess: data => {
      if (data) {
        setIsUserConnected(true);
      }
    }
  });

  const {data: mediaInfo, setData: setMediaInfo, fetched: fetchedMediaInfo} = useGetApi({
    url: '/instagram/media',
    onSuccess: data => {
      if (data && data.mediaList && data.mediaList.length > 0) {
        setIsMediaConnected(true);
      }
    }
  });

  // Thêm timeout để đảm bảo không đợi quá lâu
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isInitialLoading) {
        setIsInitialLoading(false);
      }
    }, 2000); // Tối đa 2 giây chờ đợi

    return () => clearTimeout(timeoutId);
  }, [isInitialLoading]);

  // Lắng nghe message từ popup
  useEffect(() => {
    const handleMessage = event => {
      if (event.data && event.data.type === 'instagram_connected') {
        if (event.data.success) {
          handleActiveToastChange('Successfully connected Instagram', 'success');
          setIsUserConnected(true);
          setRefreshingData(true);
          refreshInstagramData();
        } else {
          handleActiveToastChange(
            `Failed to connect Instagram: ${event.data.error || 'Unknown error'}`,
            'error'
          );
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Refresh Instagram data
  const refreshInstagramData = async () => {
    try {
      setRefreshingData(true);

      // Fetch user info
      const userResponse = await api('/instagram/user', {
        method: 'GET'
      });
      if (userResponse.success) {
        setUserInfo(userResponse.data);
        setIsUserConnected(true);
      }

      // Fetch media
      const mediaResponse = await api('/instagram/media', {
        method: 'GET'
      });
      if (mediaResponse.success) {
        setMediaInfo(mediaResponse.data);
        setIsMediaConnected(true);
      }
    } catch (error) {
      console.error('Error refreshing Instagram data:', error);
      handleActiveToastChange('Error loading Instagram data', 'error');
    } finally {
      setRefreshingData(false);
    }
  };

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
    primaryAction: {
      content: 'Save',
      loading: loading,
      onAction: handleSaveFeed
    }
  });

  const handleFeedConfigChange = (key, value) => {
    setFetched(false);
    setFeedConfig(prevConfig => ({
      ...prevConfig,
      [key]: value
    }));
  };

  const handleConnectInstagram = async () => {
    try {
      setConnecting(true);
      const res = await api('/instagram/connect', {
        method: 'GET'
      });

      if (res?.authUrl) {
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const popup = window.open(
          res.authUrl,
          'instagram_auth',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup || popup.closed) {
          throw new Error('Popup was blocked. Please allow popups and try again.');
        }
      }
    } catch (err) {
      console.error('Connect Instagram error:', err);
      handleActiveToastChange('Failed to connect Instagram');
    } finally {
      setConnecting(false);
    }
  };

  // Hàm xử lý khi xác nhận logout
  const handleConfirmLogout = async () => {
    try {
      setLoggingOut(true);

      // Gọi API disconnect
      await api('/instagram/disconnect', {
        method: 'POST'
      });

      // Reset trạng thái
      setIsUserConnected(false);
      setIsMediaConnected(false);
      setUserInfo(null);
      setMediaInfo(null);

      handleActiveToastChange('Successfully disconnected from Instagram', 'success');
      closeLogoutModal();
    } catch (err) {
      console.error('Disconnect Instagram error:', err);
      handleActiveToastChange('Failed to disconnect from Instagram', 'error');
    } finally {
      setLoggingOut(false);
    }
  };

  // Modal xác nhận logout
  const {modal: logoutModal, openModal: openLogoutModal, closeModal: closeLogoutModal} = useModal({
    title: 'Disconnect Instagram',
    content:
      'Are you sure you want to disconnect your Instagram account? Your feed will no longer display your Instagram posts.',
    primaryAction: {
      content: 'Disconnect',
      destructive: true,
      loading: loggingOut,
      onAction: handleConfirmLogout
    }
  });

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
              <InstagramConnect
                isUserConnected={isUserConnected}
                connecting={connecting}
                loggingOut={loggingOut}
                userInfo={userInfo}
                onConnect={handleConnectInstagram}
                onLogout={openLogoutModal}
              />

              <FeedConfig
                feedConfig={feedConfig}
                loading={loading}
                onConfigChange={handleFeedConfigChange}
                onSave={openModal}
              />
            </Layout.Section>

            <Layout.Section>
              <Preview
                mediaInfo={mediaInfo}
                feedConfig={feedConfig}
                loading={refreshingData}
                fetchedMediaInfo={fetchedMediaInfo}
                isUserConnected={isUserConnected}
              />
            </Layout.Section>
          </Layout>
          {toastMarkup}
        </Page>
        {modal}
        {logoutModal}
      </Frame>
    </div>
  );
}
