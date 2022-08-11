import io from "socket.io-client";
const ENDPOINT = "http://localhost:4299";
export default io(ENDPOINT);
