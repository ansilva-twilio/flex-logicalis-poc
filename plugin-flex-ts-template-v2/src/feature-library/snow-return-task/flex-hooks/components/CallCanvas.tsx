import * as Flex from '@twilio/flex-ui';
import { FlexComponent } from '../../../../types/feature-loader';
import { ReturnTaskMessagingCanvas } from '../../custom-components/ReturnTaskMessagingCanvas';

export const componentName = FlexComponent.CallCanvas;
export const componentHook = function replaceMessagingCanvasForReturnTasks(flex: typeof Flex, _manager: Flex.Manager) {
  flex.MessagingCanvas.Content.replace(<ReturnTaskMessagingCanvas key='snow-return-messaging-canvas' />, {
    sortOrder: -1,
    if: (props: any) => { 
      const task = flex.TaskHelper.getTaskFromConversationSid(props.sid);
      return (task && task.attributes?.taskType === 'ServiceNowReturnTask') ? true : false;
    } 
  });
};
