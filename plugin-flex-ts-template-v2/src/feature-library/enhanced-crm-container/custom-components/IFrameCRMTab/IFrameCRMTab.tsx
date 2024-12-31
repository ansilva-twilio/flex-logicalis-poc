import React, { useState, useRef } from 'react';
import { IconButton, ITask } from '@twilio/flex-ui';

import { IFrameRefreshButtonStyledDiv } from './IFrameCRMTab.Styles';
import { getUrl, displayUrlWhenNoTasks } from '../../config';
import { replaceStringAttributes } from '../../../../utils/helpers';

export interface Props {
  task: ITask;
}

export const IFrameCRMTab = ({ task }: Props) => {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const [iFrameKey, setIframeKey] = useState(0 as number);

  const handleOnClick = () => {
    setIframeKey(Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER + 1)));
  };

  let url = replaceStringAttributes(task ? getUrl() : displayUrlWhenNoTasks(), task);
  if (url.indexOf('?') === -1) {
    url = `${url}?token=${encodeURIComponent(window.Twilio.Flex.Manager.getInstance().user.token)}`;
  } else {
    url = `${url}&token=${encodeURIComponent(window.Twilio.Flex.Manager.getInstance().user.token)}`;
  }

  return (
    <>
      <IFrameRefreshButtonStyledDiv onClick={handleOnClick}>
        <IconButton variant="primary" icon="Loading" />
      </IFrameRefreshButtonStyledDiv>
      <iframe key={iFrameKey} src={url} ref={iFrameRef} />
    </>
  );
};
