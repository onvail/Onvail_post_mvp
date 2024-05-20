import {BASE_URL} from '@env';
import {io} from 'socket.io-client';

const socket = io.connect(BASE_URL);

socket.on('connect', () => {
  console.log('socket id', socket.id);
});
export default socket;
