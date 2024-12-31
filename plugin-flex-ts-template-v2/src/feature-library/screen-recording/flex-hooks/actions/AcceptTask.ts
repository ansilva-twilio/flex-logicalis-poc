import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import * as config from '../../config';
import { ScreenRecorder } from '../../custom-components/ScreenRecorder';

export const actionEvent = FlexActionEvent.after;
export const actionName = FlexAction.AcceptTask;

export const actionHook = async function startRecording(flex: typeof Flex, _manager: Flex.Manager) {
    if (config.isFeatureEnabled()) {
        flex.Actions.addListener(`${actionEvent}${actionName}`, async ({ task }) => {
            await ScreenRecorder.getInstance().startRecording();
        });
    }
};
