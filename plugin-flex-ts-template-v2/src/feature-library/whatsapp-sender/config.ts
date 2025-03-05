import { getFeatureFlags } from '../../utils/configuration';
import WhatsappSenderConfig from './types/ServiceConfiguration';

const { enabled = false, whatsappNumber = '' } = (getFeatureFlags()?.features?.whatsapp_sender as WhatsappSenderConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getWhatsappNumber = () => {
  return whatsappNumber;
};