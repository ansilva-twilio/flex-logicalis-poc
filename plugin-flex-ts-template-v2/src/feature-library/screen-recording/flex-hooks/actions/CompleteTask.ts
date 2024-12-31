import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import * as config from '../../config';
import { ScreenRecorder } from '../../custom-components/ScreenRecorder';
import { uploadToS3 } from 'feature-library/screen-recording/custom-components/UploadToS3';

export const actionEvent = FlexActionEvent.after;
export const actionName = FlexAction.CompleteTask;

export const actionHook = async function stopRecording(flex: typeof Flex, _manager: Flex.Manager) {
    if (config.isFeatureEnabled()) {
        flex.Actions.addListener(`${actionEvent}${actionName}`, async ({ task }) => {
            const recording = await ScreenRecorder.getInstance().stopRecording();
            console.log(recording);
        
            //const recordingUrl = await uploadToS3(recording, task.taskSid);
            //task.setAttributes({ ...task.attributes, recordingUrl });
        });
    }
};
