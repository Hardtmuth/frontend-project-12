import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { removeChannel } from '../../slices/channelsSlice.js'
import notify from '../../notifications.js'

const RenameChannelModal = ({ channelId, show, onHide }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleDelete = async (id) => {
    try {
      const req = await dispatch(removeChannel({ id }))
      if (!req || !req.payload) {
        notify.networkError()
        return
      }
      notify.delete()
      onHide()
    }
    catch (err) {
      console.log(err.message)
      notify.networkError()
      return
    }
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
