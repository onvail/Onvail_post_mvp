import {instance} from './axios';

interface ApiInterface {
  data?: any;
  url?: string;
  requiresToken?: boolean;
  query?: any;
  extraData?: any;
  refine?: any;
  type?: string;
  authorization?: boolean;
  deviceName?: boolean;
  confirmOtp?: string;
  accountUuid?: string;
  content_type?: string;
}

const generateHeaders = ({
  authorization,
  deviceName,
  confirmOtp,
  accountUuid,
  extraData,
  type,
  content_type,
}: {
  authorization?: boolean;
  deviceName?: boolean;
  confirmOtp?: string;
  accountUuid?: string;
  extraData?: any;
  type?: string;
  content_type?: string;
}) => {
  const headers: any = {};
  if (authorization) {
    headers.authorization = true;
  }
  if (deviceName) {
    headers.deviceName = true;
  }
  if (confirmOtp !== undefined) {
    headers['Confirm-otp'] = confirmOtp;
  }
  if (accountUuid !== undefined) {
    headers.Account = accountUuid;
  }
  if (extraData) {
    headers.extraData = extraData;
  }
  if (type) {
    headers.type = type;
  }
  if (content_type) {
    headers['content-type'] = content_type;
  }
  return headers;
};

const ensureUrl = (url?: string) => url ?? '';

export default {
  post: ({
    data,
    url,
    authorization,
    deviceName,
    confirmOtp,
    accountUuid,
    extraData,
    type,
    content_type,
  }: ApiInterface) => {
    return instance(ensureUrl(url), {
      method: 'POST',
      data,
      headers: generateHeaders({
        authorization,
        deviceName,
        confirmOtp,
        accountUuid,
        extraData,
        type,
        content_type,
      }),
    });
  },

  put: ({
    data,
    url,
    authorization,
    deviceName,
    confirmOtp,
    accountUuid,
    extraData,
    type,
    content_type,
  }: ApiInterface) => {
    return instance(ensureUrl(url), {
      method: 'PUT',
      data,
      headers: generateHeaders({
        authorization,
        deviceName,
        confirmOtp,
        accountUuid,
        extraData,
        type,
        content_type,
      }),
    });
  },

  patch: ({
    data,
    url,
    authorization,
    deviceName,
    confirmOtp,
    accountUuid,
    extraData,
    type,
    content_type,
  }: ApiInterface) => {
    return instance(ensureUrl(url), {
      method: 'PATCH',
      data,
      headers: generateHeaders({
        authorization,
        deviceName,
        confirmOtp,
        accountUuid,
        extraData,
        type,
        content_type,
      }),
    });
  },

  get: ({
    data,
    url,
    authorization,
    deviceName,
    confirmOtp,
    accountUuid,
    extraData,
    type,
    content_type,
  }: ApiInterface) => {
    return instance(ensureUrl(url), {
      method: 'GET',
      data,
      headers: generateHeaders({
        authorization,
        deviceName,
        confirmOtp,
        accountUuid,
        extraData,
        type,
        content_type,
      }),
    });
  },

  delete: ({
    data,
    url,
    authorization,
    deviceName,
    confirmOtp,
    accountUuid,
    extraData,
    type,
    content_type,
  }: ApiInterface) => {
    return instance(ensureUrl(url), {
      method: 'DELETE',
      data,
      headers: generateHeaders({
        authorization,
        deviceName,
        confirmOtp,
        accountUuid,
        extraData,
        type,
        content_type,
      }),
    });
  },
};
