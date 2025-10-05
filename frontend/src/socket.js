import { io } from "socket.io-client"

const socket = io('http://localhost:5002')

socket.emit()

socket.on('newMessage', (payload) => {
  console.log(payload); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
});