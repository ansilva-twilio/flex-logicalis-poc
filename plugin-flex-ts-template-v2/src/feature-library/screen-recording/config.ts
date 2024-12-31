import { getFeatureFlags } from '../../utils/configuration';
import ScreenRecordingConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.screen_recording as ScreenRecordingConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
