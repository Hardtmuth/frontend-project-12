import React, { useState, useEffect } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { Formik, useFormik } from 'formik'
import { object, string } from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import { fetchChannels, updateChannel, setActiveChannel, selectors } from '../../slices/channelsSlice.js'

const RenameChannelModal = ({ channelId, show, onHide }) => {
  const [channelNameError, setchannelNameError] = useState('')

  const dispatch = useDispatch()
  const channels = useSelector(selectors.selectEntities)
  const existingChannels = Object.values(channels).map(c => c.name)

  const channelSchema = object({
    name: string()
      .min(3)
      .max(20)
      .notOneOf(existingChannels)
      .trim()
      .required(),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (value) => {
      console.log('channelId: ', channelId)
      const newChannelName = async () => {
        try {
          setchannelNameError('')
          const result = await channelSchema.validate(value)
          return result
        }
        catch (err) {
          console.log(err.message)
          setchannelNameError(err.message)
        }
      }
      const editedChannel = await newChannelName()
      console.log('RES is: ', editedChannel)
      if (editedChannel) {
        dispatch(updateChannel({ id: channelId, editedChannel }))
        dispatch(setActiveChannel({ id: channelId, ...editedChannel }))
        // console.log('newChannelData', newChannelData.payload)
        onHide()
      }
      else {
        console.log('RES is ni valid: ', editedChannel)
      }
    },
  })

  useEffect(() => {
    dispatch(fetchChannels())
  }, [dispatch])

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Переименовать Канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Control
              name="name"
              type="name"
              placeholder="Введите новое имя для канала"
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={channelNameError}
              required
              // ref={inputRef}
            />
            <Form.Control.Feedback type="invalid">
              { /* TODO Error messages change to i18n */}
              {channelNameError || 'This field is required.'}
            </Form.Control.Feedback>
          </Form>
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={formik.handleSubmit}>Переименовать</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RenameChannelModal
