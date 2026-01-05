import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { removeChannel } from '../../slices/channelsSlice.js'
import notify from '../../notifications.js'

const RenameChannelModal = ({ channelId, show, onHide }) => {
  const [isDisabled, setDisabled] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleDelete = async (id) => {
    try {
      setDisabled(true)
      const req = await dispatch(removeChannel({ id }))
      if (!req || !req.payload) {
        notify.networkError()
        return
      }
      notify.delete()
      onHide()
    }
    catch (err) {
      setDisabled(false)
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
      <Modal.Header>
        <Modal.Title>{t('headers.delete')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('content.delete')}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('buttons.cancel')}
        </Button>
        <Button
          disabled={isDisabled}
          variant="danger"
          onClick={() => handleDelete(channelId)}
        >
          {t('buttons.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RenameChannelModal
