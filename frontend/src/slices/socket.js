import { io } from "socket.io-client";
import messageSlice from "./messagesSlice.js";
import { useSelector, useDispatch } from 'react-redux'
import React, { useEffect, useRef } from 'react'
import { addMessage } from '../slices/messagesSlice.js'

const socket = io("http://localhost:5001", {
  transports: ['websocket'],
  withCredentials: true
});

export default () => {

  //const dispatch = useDispatch()
  //const messages = useSelector(state => state.messages)

  socket.on("connect", () => {
    console.log("Соединение установлено");
  });
  socket.on("newMessage", (data) => {
    // Диспечеризация действия для обновления состояния
    console.log(data)
    //dispatch(addMessage(data));
  });

  socket.on("disconnect", () => {
    console.log("Соединение разорвано");
  });
};
