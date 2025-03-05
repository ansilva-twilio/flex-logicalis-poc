import { getFeatureFlags } from '../../utils/configuration';
import SnowReturnTaskConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.snow_return_task as SnowReturnTaskConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
