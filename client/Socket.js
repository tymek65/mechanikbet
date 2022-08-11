import io from 'socket.io-client';
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_URL;
export default io(ENDPOINT);
