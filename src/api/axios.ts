import axios from 'axios';
import requestInteceptor from './interceptor/requestInterceptor';
import responseInteceptor from './interceptor/responseInterceptor';
import errorInteceptor from './interceptor/errorInterceptor';
import {BASE_URL} from '@env';

// Create instance called instance
let axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  config => requestInteceptor(config),
  error => errorInteceptor(axiosInstance, error),
);

axiosInstance.interceptors.response.use(
  response => responseInteceptor(response),
  error => errorInteceptor(axiosInstance, error),
);

export const instance = axiosInstance;
