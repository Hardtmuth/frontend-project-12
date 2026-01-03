import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { removeChannel } from '../../slices/channelsSlice.js'

const RenameChannelModal = ({ channelId, show, onHide }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

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
        <Modal.Title>{t('headers.delete')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('content.delete')}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('buttons.cancel')}
        </Button>
        <Button variant="danger" onClick={() => handleDelete(channelId)}>{t('buttons.delete')}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RenameChannelModal
