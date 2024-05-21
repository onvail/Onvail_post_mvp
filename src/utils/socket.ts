import {BASE_URL} from '@env';
import {io} from 'socket.io-client';

const socket = io.connect(BASE_URL);

socket.on('connect', () => {});
export default socket;
