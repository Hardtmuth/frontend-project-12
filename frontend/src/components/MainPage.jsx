import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer, Bounce } from 'react-toastify'
import { Container, Row, Col, Button, Form, InputGroup, Dropdown } from 'react-bootstrap'
import { PlusLg } from 'react-bootstrap-icons'
import cn from 'classnames'
import '../styles/Chat.css'

import Loading from './Loading.jsx'

import { useFormik } from 'formik'
import { io } from 'socket.io-client'
import { useTranslation } from 'react-i18next'
import { SERVER } from '../routes.js'
import notify from '../notifications.js'

import { fetchChannels, setActiveChannel, selectors } from '../slices/channelsSlice.js'
import { fetchMessages, addM, addMessage, messagesSelectors } from '../slices/messagesSlice.js'

import AddChannelModal from './modals/AddChannelModal.jsx'
import RenameChannelModal from './modals/RenameChannelModal.jsx'
import DeleteChannelModal from './modals/DeleteChannelModal.jsx'

import profanityFilter from '../profanityFilter.js'

const socket = io(SERVER, {
  transports: ['websocket'],
  withCredentials: true,
})

const Chat = () => {
  const inputMessageRef = useRef()
  const messagesEndRef = useRef(null)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const channels = useSelector(selectors.selectEntities)
  const activeChannel = useSelector(state => state.channels.activeChannel || { id: '1', name: 'general' })
  // const selectedChannel = `# ${activeChannel.name}`
  const selectedChannel = activeChannel
    ? `# ${activeChannel.name}`
    : t('content.noChannelSelected')

  const messages = useSelector(messagesSelectors.selectEntities)
  // const messagesStatus = useSelector(state => state.messages.status)

  const count = Object.values(messages).filter(m => m.channelId === activeChannel.id).length
  const messageCounter = t('content.messages', { count })

  const [showAddChannelModal, setShowAddChannelModal] = useState(false)
  const [showRenameChannelModal, setShowRenameChannelModal] = useState(false)
  const [showDeleteChannelModal, setShowDeleteChannelModal] = useState(false)
  const [isSendBtnDisabled, setSendBtnDisabled] = useState(false)

  const handleClose = () => {
    setShowAddChannelModal(false)
    dispatch(fetchChannels())
  }
  const handleRenameClose = () => {
    setShowRenameChannelModal(false)
    dispatch(fetchChannels())
    console.log(activeChannel)
  }
  const handleDeleteClose = () => {
    setShowDeleteChannelModal(false)
    dispatch(fetchChannels())
    dispatch(setActiveChannel({ id: '1', name: 'genegal' }))
    console.log(activeChannel)
  }
  const handleShow = () => setShowAddChannelModal(true)
  const handleReanameShow = () => setShowRenameChannelModal(true)
  const handleDeleteShow = () => setShowDeleteChannelModal(true)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const setRoom = (room) => {
    const payload = { id: room.id, name: room.name }
    dispatch(setActiveChannel(payload))
  }

  const renderRoomsList = (rooms) => {
    const channelsList = Object.values(rooms)
    return channelsList.length
      ? channelsList.map((room) => {
          const liClasses = cn({ active: room.name === activeChannel.name })
          return room.removable
            ? (
                <Dropdown key={room.id} className="w-100">
                  <li
                    className={liClasses}
                    onClick={() => setRoom(room)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Button variant="outline-dark">{`# ${room.name}`}</Button>
                  </li>
                  <Dropdown.Toggle
                    as={Button}
                    variant="outline-dark"
                    size="sm"
                    className="p-1 channel-list"
                    aria-label={t('areas.control')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                  </Dropdown.Toggle>
                  <Dropdown.Menu data-testid={t('areas.control')}>
                    <Dropdown.Item eventKey="1" onClick={handleDeleteShow} aria-label={t('areas.delete')}>{t('buttons.delete')}</Dropdown.Item>
                    <Dropdown.Item eventKey="2" onClick={handleReanameShow} aria-label={t('areas.rename')}>{t('buttons.rename')}</Dropdown.Item>
                  </Dropdown.Menu>
                  <RenameChannelModal show={showRenameChannelModal} onHide={handleRenameClose} channelId={room.id} />
                  <DeleteChannelModal show={showDeleteChannelModal} onHide={handleDeleteClose} channelId={room.id} />
                </Dropdown>

              )
            : (
                <li
                  key={room.id}
                  className={liClasses}
                  onClick={() => setRoom(room)}
                >
                  <Button variant="outline-dark">{`# ${room.name}`}</Button>
                </li>
              )
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
      // console.log('be4 send message active channel is: ', activeChannel)
      const filteredMessage = profanityFilter.clean(body.message)
      const payload = { username, body: filteredMessage, channelId: activeChannel.id.toString() }
      setSendBtnDisabled(true)
      try {
        const reqAddMessage = await dispatch(addMessage(payload))
        if (!reqAddMessage || !reqAddMessage.payload) {
          notify.networkError()
          setTimeout(() => setSendBtnDisabled(false), 5000)
          return
        }
        formik.resetForm()
        setSendBtnDisabled(false)
      }
      catch (err) {
        console.log('addMessage Error: ', err.message)
        notify.networkError()
        return
      }
    },
  })

  /* if (messagesStatus !== 'succeeded') {
    return <Loading />
  } */

  return (
    <Container className="h-100 my-4 rounded shadow" fluid="md">
      <Row>
        <Col className="col-md-2 border-end bg-light">
          <div className="d-flex justify-content-between mt-4 mb-5 pb-3">
            <b>{t('content.channels')}</b>
            <Button
              className="p-0 btn btn-group-vertical"
              onClick={handleShow}
              aria-label={t('areas.add')}
            >
              {t('buttons.plus')}
              {/* <PlusLg className="mx-1" /> */}
            </Button>
            <AddChannelModal show={showAddChannelModal} onHide={handleClose} />
          </div>
          <ul>
            {renderRoomsList(channels)}
          </ul>
        </Col>
        <Col className="h-100 g-0 mh-100">
          <div className="h-100 bg-light mb-4 p-1 shadow-sm">
            <h6>{selectedChannel}</h6>
            <p className="counter">{messageCounter}</p>
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
                aria-label={t('areas.message')}
                placeholder={t('placeholders.message')}
                onChange={formik.handleChange}
                value={formik.values.message}
                required
                ref={inputMessageRef}
              />
              <Button id="button-addon" onClick={formik.handleSubmit} disabled={isSendBtnDisabled}>
                {t('buttons.send')}
              </Button>
              {/* <Button onClick={notify.test}>
                Toast test
              </Button> */}
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </Container>
  )
}

export default Chat
