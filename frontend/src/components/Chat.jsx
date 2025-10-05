import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { Formik, useFormik } from 'formik'
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useSelector, useDispatch } from 'react-redux'
import './Chat.css'
import { sendMessage } from '../slices/messagesSlice.js'

const containerCalsses = cn('h-100', 'my-4', 'rounded', 'shadow')
const leftColCalsses = cn('col-md-2', 'border-end', 'bg-light')
const rightColClasses = cn('h-100', 'g-0')
const roomHeaderClasses = cn('h-100', 'bg-light', 'mb-4', 'p-1', 'shadow-sm')

const selectedRoom = '#general'
const messageCounter = '0 сообщений'

const Chat = () => {
  const inputRef = useRef()
  const dispatch = useDispatch()

  const channels = useSelector(state => state.channels)
  console.log('Chat channels is: ', channels)

  const messages = useSelector(state => state.messages)
  console.log('Chat messages is: ', messages)

  const renderRoomsList = (rooms) => {
    return rooms.length ?
      rooms.map((room) => {
        const liClasses = cn({ active: room.name === 'general' })
        return <li className={liClasses} key={room.id}>{`# ${room.name}`}</li> // TODO do click action and remove button
      }) : null
  }

  useEffect(() => {
      inputRef.current.focus()
    }, [])

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (values) => {
      console.log('Sended message: ', values)
      /* TODO POST message */
      await dispatch(sendMessage())
    },
  })


  return (
    <Formik>
    <Container className={containerCalsses} fluid="md">
      <Row>
        <Col className={leftColCalsses}>
          <div className='d-flex justify-content-between mt-4 mb-5 pb-3'>
            <b>Каналы</b>
          <Button className='p-0 btn btn-group-vertical'>
            <i className="bi bi-plus-lg px-1"></i>
          </Button>
          </div>
          <ul>
            {renderRoomsList(channels)}
          </ul>
        </Col>
        <Col className={rightColClasses}>
          <div className={roomHeaderClasses}>
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
            <Button id="button-addon2">
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
