// Per-environment app identity (development / staging / production).
// The base settings live in app.json; this file only changes name and ids.
import type { ConfigContext, ExpoConfig } from 'expo/config';

const variant = process.env.APP_VARIANT ?? 'development';
const production = variant === 'production';
const staging = variant === 'staging';
const baseId = 'com.splitthebill.app';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: production ? 'Split the Bill' : staging ? 'Split the Bill (Staging)' : 'Split the Bill (Dev)',
  slug: 'split-the-bill',
  ios: {
    ...config.ios,
    bundleIdentifier: production ? baseId : `${baseId}.${variant}`,
  },
  android: {
    ...config.android,
    package: production ? baseId : `${baseId}.${variant}`,
  },
  extra: { ...config.extra, appVariant: variant },
});
