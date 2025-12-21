import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap'
import { PlusLg } from 'react-bootstrap-icons'
import cn from 'classnames'
import '../styles/Chat.css'

import { useFormik } from 'formik'
import { io } from 'socket.io-client'
import { SERVER } from '../routes.js'

import { fetchChannels, setActiveChannel, selectors } from '../slices/channelsSlice.js'
import { fetchMessages, addM, addMessage, messagesSelectors } from '../slices/messagesSlice.js'

const socket = io(SERVER, {
  transports: ['websocket'],
  withCredentials: true,
})

const Chat = () => {
  const inputMessageRef = useRef()
  const messagesEndRef = useRef(null)
  const dispatch = useDispatch()

  const channels = useSelector(selectors.selectEntities)
  const activeChannel = useSelector(state => state.channels.activeChannel)
  const selectedChannel = `#${activeChannel.name}`

  const messages = useSelector(messagesSelectors.selectEntities)
  const messagesStatus = useSelector(state => state.messages.status)
  // const messageCounter = `${currentChannelMessages.length} сообщений` /* TODO add i18n */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const setRoom = (room) => {
    dispatch(setActiveChannel({ id: room.id, name: room.name }))
  }

  const renderRoomsList = (rooms) => {
    const channelsList = Object.values(rooms)
    return channelsList.length
      ? channelsList.map((room) => {
          const liClasses = cn({ active: room.name === activeChannel.name })
          return <li className={liClasses} key={room.id} onClick={() => setRoom(room)}>{`# ${room.name}`}</li> // TODO add remove button on new channels
        })
      : null
  }

  const renderMessages = (messagesList) => {
    const currentChannelMessages = activeChannel
      ? Object.values(messagesList).filter(m => m.channelId === activeChannel.id)
      : []

    return currentChannelMessages.length > 0
      ? currentChannelMessages.map((m) => {
          const { id, body, username } = m
          return (
            <li key={id}>
              <b>
                {username}
              </b>
              :
              {` ${body}`}
            </li>
          )
        })
      : null
  }

  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (inputMessageRef.current) { // FIX focus input message
      inputMessageRef.current.focus()
    }
    const handleNewMessage = (payload) => {
      dispatch(addM(payload))
    }
    socket.on('newMessage', handleNewMessage)
    return () => socket.off('newMessage', handleNewMessage)
  }, [dispatch])

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (body) => {
      const { username } = JSON.parse(localStorage.userId)
      const payload = { username, body: body.message, channelId: activeChannel.id.toString() }
      dispatch(addMessage(payload))
      formik.values.message = ''
    },
  })

  if (messagesStatus !== 'succeeded') {
    return <div>Загружаем сообщения...</div>
  }

  return (
    <Container className="h-100 my-4 rounded shadow" fluid="md">
      <Row>
        <Col className="col-md-2 border-end bg-light">
          <div className="d-flex justify-content-between mt-4 mb-5 pb-3">
            <b>Каналы</b>
            <Button className="p-0 btn btn-group-vertical">
              <PlusLg className="mx-1" />
            </Button>
          </div>
          <ul>
            {renderRoomsList(channels)}
          </ul>
        </Col>
        <Col className="h-100 g-0 mh-100">
          <div className="h-100 bg-light mb-4 p-1 shadow-sm">
            <h6>{selectedChannel}</h6>
            {/* <p className="counter">{messageCounter}</p> // FIX return message counter */}
          </div>
          <div className="messagebox" style={{ overflowY: 'auto' }}>
            {renderMessages(messages)}
            <div ref={messagesEndRef} />
          </div>
          <Form onSubmit={formik.handleSubmit}>
            <InputGroup className="mb-3">
              <Form.Control
                name="message"
                type="text"
                placeholder="write message"
                onChange={formik.handleChange}
                value={formik.values.message}
                required
                ref={inputMessageRef}
              />
              <Button id="button-addon" onClick={formik.handleSubmit}>
                Отправить
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Chat
