import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { removeChannel } from '../../slices/channelsSlice.js'

const RenameChannelModal = ({ channelId, show, onHide }) => {
  const dispatch = useDispatch()

  const handleDelete = (id) => {
    dispatch(removeChannel({ id }))
    onHide()
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Удалить Канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Вы уверены что хотите удалить канал и все сообщения в нем?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отменить
        </Button>
        <Button variant="danger" onClick={() => handleDelete(channelId)}>Удалить</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RenameChannelModal
