import axios from 'axios'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import routes from '../routes.js'
import { setChannels } from '../slices/channelsSlice.js'
import { getMessages } from '../slices/messagesSlice.js'

import Chat from './Chat.jsx'

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'))

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` }
  }

  return {}
}

const MainPage = () => {
  const channels = useSelector(state => state.channels.list)
  // const messages = useSelector(state => state.messages)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchChanels = async () => {
      const { data } = await axios.get(routes.channelsPath(), { headers: getAuthHeader() })
      await dispatch(setChannels(data))
      // console.log('Main channels is: ', channels)
    }

    const fetchMessages = async () => {
      const { data } = await axios.get(routes.messagesPath(), { headers: getAuthHeader() })
      await dispatch(getMessages(data))
      // console.log('Main messages is: ', messages)
    }

    fetchChanels()
    fetchMessages()
  }, [dispatch])

  return channels && (
    <Chat />
  )
}

export default MainPage
