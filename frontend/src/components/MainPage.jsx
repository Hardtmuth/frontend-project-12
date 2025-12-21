import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchChannels } from '../slices/channelsSlice.js'
import { fetchMessages } from '../slices/messagesSliceEA.js'

import Chat from './Chat.jsx'

const MainPage = () => {
  /* const dispatch = useDispatch()

  useEffect(() => {
    fetchChannels()
    fetchMessages()
  }, [dispatch]) */

  return (
    <Chat />
  )
}

export default MainPage
