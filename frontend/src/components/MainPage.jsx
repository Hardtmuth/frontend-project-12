import axios from 'axios'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import routes from '../routes.js'
import { setData } from '../slices/mainPageSlice.js'

import Chat from './Chat.jsx'

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'))

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` }
  }

  return {}
}

const MainPage = () => {

  const content = useSelector(state => state.main.data)
  // Возвращает метод store.dispatch() текущего хранилища
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() })
      await dispatch(setData(data))
     // console.log('content is: ', content)
    }

    fetchContent()
  }, [])

  return content && (
    <Chat />
  )
};

export default MainPage