import React from 'react';
import {LegacyCard, TextContainer, ButtonGroup, Button, Icon} from '@shopify/polaris';
import {LogoInstagramIcon} from '@shopify/polaris-icons';

export const InstagramConnect = ({
  isUserConnected,
  connecting,
  loggingOut,
  userInfo,
  onConnect,
  onLogout
}) => {
  return (
    <LegacyCard sectioned>
      <TextContainer>
        <p>Connect your Instagram account to display your posts in your store</p>
      </TextContainer>
      <div style={{marginTop: '16px'}}>
        <ButtonGroup>
          <Button
            variant="primary"
            loading={connecting}
            disabled={isUserConnected}
            icon={<Icon source={LogoInstagramIcon} />}
            onClick={onConnect}
          >
            {isUserConnected && userInfo?.username
              ? `Connected to @${userInfo.username}`
              : 'Connect with Instagram'}
          </Button>

          {isUserConnected && (
            <Button destructive onClick={onLogout} loading={loggingOut}>
              Logout
            </Button>
          )}
        </ButtonGroup>
      </div>
    </LegacyCard>
  );
};
