import {useCallback, useState} from 'react';
import {Toast} from '@shopify/polaris';
import React from 'react';

export default function useActiveToast(defaultState = false, defaultMessage = 'Message sent') {
  const [activeToast, setActiveToast] = useState(defaultState);
  const [msg, setMsg] = useState(defaultMessage);

  const handleActiveToastChange = newMsg => {
    setActiveToast(!activeToast);
    setMsg(newMsg);
  };

  const toastMarkup = activeToast ? (
    <Toast duration={2000} content={msg} onDismiss={handleActiveToastChange} />
  ) : null;

  return {
    activeToast,
    handleActiveToastChange,
    toastMarkup
  };
}
