import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { Formik, useFormik } from 'formik'
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap'
import { PlusLg } from 'react-bootstrap-icons'
import { useSelector, useDispatch } from 'react-redux'
import '../styles/Chat.css'
import { setActiveChannel } from '../slices/channelsSlice.js'
import { sendMessage, addMessage } from '../slices/messagesSlice.js'
import { io } from 'socket.io-client'
import { SERVER } from '../routes.js'

const socket = io(SERVER, {
  transports: ['websocket'],
  withCredentials: true,
})

const Chat = () => {
  const inputRef = useRef()
  const messagesEndRef = useRef(null)
  const dispatch = useDispatch()

  const channels = useSelector(state => state.channels)
  const activeChannelId = channels.activeChannel.id

  const messages = useSelector(state => state.messages)
  const currentChannelMessages = messages.filter(m => m.channelId === activeChannelId)
  const messageCounter = `${currentChannelMessages.length} сообщений` /* TODO add i18n */


  const selectedRoom = `#${channels.activeChannel.name}`

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const renderMessages = () => {
    return currentChannelMessages.length > 0
      ? currentChannelMessages.map((m) => {
          const { id, body, username } = m
          return (
            <li key={id}>
              <b>
                {username}
              </b>
              :
              {body}
            </li>
          )
        })
      : null
  }

  const setRoom = (room) => {
    dispatch(setActiveChannel({ id: room.id, name: room.name }))
  }

  const renderRoomsList = (rooms) => {
    return rooms.length
      ? rooms.map((room) => {
          const liClasses = cn({ active: room.name === channels.activeChannel.name })
          return <li className={liClasses} key={room.id} onClick={() => setRoom(room)}>{`# ${room.name}`}</li> // TODO add remove button on new channels
        })
      : null
  }

  useEffect(() => {
    inputRef.current.focus()
    const handleNewMessage = (payload) => {
      // console.log(payload)
      dispatch(addMessage(payload))
    }
    socket.on('newMessage', handleNewMessage)
    return () => socket.off('newMessage', handleNewMessage)
  }, [dispatch])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (body) => {
      const { token, username } = JSON.parse(localStorage.userId)
      const payload = { token, username, body: body.message, channelId: channels.activeChannel.id }
      dispatch(sendMessage(payload))
      formik.values.message = ''
    },
  })

  return (
    <Formik>
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
              {renderRoomsList(channels.list)}
            </ul>
          </Col>
          <Col className="h-100 g-0 mh-100">
            <div className="h-100 bg-light mb-4 p-1 shadow-sm">
              <h6>{selectedRoom}</h6>
              <p className="counter">{messageCounter}</p>
            </div>
            <div className="messagebox" style={{ overflowY: 'auto' }}>
              {renderMessages()}
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
                  /* isInvalid={authFailed} */
                  required
                  ref={inputRef}
                />
                <Button id="button-addon" onClick={formik.handleSubmit}>
                  Отправить
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    </Formik>
  )
}

export default Chat
