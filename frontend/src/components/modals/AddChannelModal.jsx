import React, { useState, useEffect } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { Formik, useFormik } from 'formik'
import { object, string } from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import { fetchChannels, addChannel, selectors } from '../../slices/channelsSlice.js'

const AddChannelModal = ({ show, onHide }) => {
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
      const res = await newChannelName()
      console.log('RES is: ', res)
      res ? dispatch(addChannel(res)) : console.log('RES is ni valid: ', res)
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
        <Modal.Title>Добавить Канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Control
              name="name"
              type="name"
              placeholder="Введите имя для нового канала"
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
        <Button variant="primary" onClick={formik.handleSubmit}>Добавить</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddChannelModal
