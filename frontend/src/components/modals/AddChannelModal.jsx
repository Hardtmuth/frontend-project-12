import React, { useState, useEffect } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

import { Formik, useFormik } from 'formik'
import { object, string } from 'yup'
import { useTranslation } from 'react-i18next'

import { fetchChannels, addChannel, setActiveChannel, selectors } from '../../slices/channelsSlice.js'
import notify from '../../notifications.js'

const AddChannelModal = ({ show, onHide }) => {
  const [channelNameError, setChannelNameError] = useState('')
  // const inputChannelName = useRef()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const channels = useSelector(selectors.selectEntities)
  const existingChannels = Object.values(channels).map(c => c.name)

  /* useEffect(() => {
    inputChannelName.current.focus()
  }, []) */

  const channelSchema = object({
    name: string()
      .min(3, `${t('errors.shortName')}`)
      .max(20, `${t('errors.longName')}`)
      .notOneOf(existingChannels, `${t('errors.channelExist')}`)
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
          setChannelNameError('')
          const result = await channelSchema.validate(value)
          return result
        }
        catch (err) {
          console.log(err.message)
          setChannelNameError(err.message)
        }
      }
      const res = await newChannelName()
      console.log('RES is: ', res)
      if (res) {
        try {
          const newChannelData = await dispatch(addChannel(res))
          if (!newChannelData || !newChannelData.payload) {
            notify.networkError()
            return
          }
          dispatch(setActiveChannel(newChannelData.payload))
          console.log('newChannelData', newChannelData.payload)
          notify.add()
          onHide()
        }
        catch (err) {
          console.log(err.message)
          notify.networkError()
          return
        }
      }
      else {
        console.log('RES is ni valid: ', res)
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
        <Modal.Title>{t('headers.add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Control
              name="name"
              type="name"
              placeholder={t('placeholders.add')}
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={channelNameError}
              required
              // ref={inputChannelName}
            />
            <Form.Control.Feedback type="invalid">
              {channelNameError}
            </Form.Control.Feedback>
          </Form>
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('buttons.close')}
        </Button>
        <Button variant="primary" onClick={formik.handleSubmit}>{t('buttons.add')}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddChannelModal
