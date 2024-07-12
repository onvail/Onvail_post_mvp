import {AGORA_APP_ID, AGORA_APP_CERTIFICATE} from '@env';
import {RtcTokenBuilder, RtcRole} from 'agora-token';

// Get the value of the environment variable AGORA_APP_ID. Make sure you set this variable to the App ID you obtained from Agora console.
const appId = AGORA_APP_ID;
// Get the value of the environment variable AGORA_APP_CERTIFICATE. Make sure you set this variable to the App certificate you obtained from Agora console
const appCertificate = AGORA_APP_CERTIFICATE;
// Replace channelName with the name of the channel you want to join
const channelName = 'onvail';
// Set streaming permissions
const role = RtcRole.PUBLISHER;
// Token validity time in seconds
const tokenExpirationInSecond = 3600 * 24;
// The validity time of all permissions in seconds
const privilegeExpirationInSecond = 3600 * 24;

console.log('App Id:', appId);
console.log('App Certificate:', appCertificate);
if (
  appId === undefined ||
  appId === '' ||
  appCertificate === undefined ||
  appCertificate === ''
) {
  console.log(
    'Need to set environment variable AGORA_APP_ID and AGORA_APP_CERTIFICATE',
  );
  process.exit(1);
}

// Generate Token

export const generateTokenWithUid = (uuid: number) => {
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uuid,
    role,
    tokenExpirationInSecond,
    privilegeExpirationInSecond,
  );
  return token;
};
