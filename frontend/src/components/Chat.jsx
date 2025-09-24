import React from 'react'
import cn from 'classnames'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import './Chat.css'

const containerCalsses = cn('h-100', 'my-4', 'rounded', 'shadow')
const leftColCalsses = cn('h-100', 'col-md-2', 'border-end', 'bg-light')
const rightColClasses = cn('h-100', 'g-0')
const roomHeaderClasses = cn('h-100', 'bg-light', 'mb-4', 'p-1', 'shadow-sm')

const selectedRoom = '#general'
const messageCounter = '0 сообщений'

const Chat = () => {
  const content = useSelector(state => state.main.data)


  const renderRoomsList = (rooms) => {
    const data = JSON.parse(rooms) // FIX do parsing here?
    if (data.length !== 0) { // FIX revrite from IF condition
      return data.map((room) => {
        const isActive = true // TODO How check active? from state
        const liClasses = cn({ active: isActive })
        return <li className={liClasses} key={room.id}>{`# ${room.name}`}</li> // TODO do click action and remove button
      })
    }
    return <></>
  }

  return (
    <Container className={containerCalsses} fluid="md">
      <Row>
        <Col className={leftColCalsses}>
          <div className='d-flex justify-content-between mt-4 mb-5 pb-3'>
            <b>Каналы</b>
          <Button className='p-0 btn btn-group-vertical'>
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-plus-square"
            >
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
            </svg>
            <span className='visually-hidden'>+</span>
          </Button>
          </div>
          <ul>
            {renderRoomsList(content)}
          </ul>
        </Col>
        <Col className={rightColClasses}>
          <div className={roomHeaderClasses}>
            <h6>{selectedRoom}</h6>
            <p className='counter'>{messageCounter}</p>
          </div>
          <p>Main Content</p>{/* TODO Message box */}
          <p>{content}</p>{/* TODO Input box */}

        </Col>
      </Row>
    </Container>
  )
}

export default Chat;
