import axios from 'axios'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import routes from '../routes.js'
import { setChannels } from '../slices/channelsSlice.js'
import { setMessages } from '../slices/messagesSlice.js'

import Chat from './Chat.jsx'

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'))

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` }
  }

  return {}
}

const MainPage = () => {

  const channels = useSelector(state => state.channels)
  const messages = useSelector(state => state.messages)
  // Возвращает метод store.dispatch() текущего хранилища
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchChanels = async () => {
      const { data } = await axios.get(routes.channelsPath(), { headers: getAuthHeader() })
      await dispatch(setChannels(data))
      console.log('Main channels is: ', channels)
    }

    const fetchMessages = async () => {
      const { data } = await axios.get(routes.messagesPath(), { headers: getAuthHeader() })
      await dispatch(setMessages(data))
      console.log('Main messages is: ', messages)
    }

    fetchChanels()
    fetchMessages()
  }, [])

  return channels && (
    <Chat />
  )
};

export default MainPage