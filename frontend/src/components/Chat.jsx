import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { Formik, useFormik } from 'formik'
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useSelector, useDispatch } from 'react-redux'
import './Chat.css'
import { setActiveChannel } from '../slices/channelsSlice.js'
import { sendMessage } from '../slices/messagesSlice.js'


const Chat = () => {
  //console.log('State is: ', useSelector(state => state))
  const inputRef = useRef()
  const dispatch = useDispatch()

  const channels = useSelector(state => state.channels)
  // console.log('Chat channels is: ', channels)

  const messages = useSelector(state => state.messages)
  // console.log('Chat messages is: ', messages)

  const selectedRoom = `#${channels.activeChannel.name}`
  const messageCounter = `${messages.length} сообщений` /* TODO add i18n */

  const renderRoomsList = (rooms) => {
    return rooms.length ?
      rooms.map((room) => {
        const liClasses = cn({ active: room.name === channels.activeChannel.name })
        return <li className={liClasses} key={room.id} onClick={() => dispatch(setActiveChannel({ id: room.id, name: room.name }))}>{`# ${room.name}`}</li> // TODO add remove button on new channels
      }) : null
  }

  useEffect(() => {
      inputRef.current.focus()
    }, [])

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (body) => {
      const { token, username } = JSON.parse(localStorage.userId)
      const payload = { token, username, body: body.message, channelId: channels.activeChannel.id }
      dispatch(sendMessage(payload))
    },
  })


  return (
    <Formik>
    <Container className='h-100 my-4 rounded shadow' fluid='md'>
      <Row>
        <Col className='col-md-2 border-end bg-light'>
          <div className='d-flex justify-content-between mt-4 mb-5 pb-3'>
            <b>Каналы</b>
          <Button className='p-0 btn btn-group-vertical'>
            <i className="bi bi-plus-lg px-1"></i>
          </Button>
          </div>
          <ul>
            {renderRoomsList(channels.list)}
          </ul>
        </Col>
        <Col className='h-100 g-0'>
          <div className='h-100 bg-light mb-4 p-1 shadow-sm'>
            <h6>{selectedRoom}</h6>
            <p className='counter'>{messageCounter}</p>
          </div>
          <div className='messagebox'>
            <b>admin</b>: test message
            <br />
            <b>user</b>: retest
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
            <Button id="button-addon2" onClick={formik.handleSubmit}>
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

export default Chat;
