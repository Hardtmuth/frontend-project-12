import axios from 'axios'
import React, { useEffect, useState } from 'react'
import routes from '../routes.js'

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'))

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` }
  }

  return {}
}

const MainPage = () => {
  const [content, setContent] = useState('')
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() })
      setContent(`<h1>${JSON.stringify(data)}<h1/><p>${JSON.stringify(getAuthHeader())}</p>`)
    }

    fetchContent()
  }, [])

  return content && <p>{content}</p>
};

export default MainPage