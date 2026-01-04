import React, { useState, useEffect } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

import { Formik, useFormik } from 'formik'
import { object, string } from 'yup'
import { useTranslation } from 'react-i18next'

import { fetchChannels, updateChannel, setActiveChannel, selectors } from '../../slices/channelsSlice.js'
import notify from '../../notifications.js'
import profanityFilter from '../../profanityFilter.js'

const RenameChannelModal = ({ channelId, show, onHide }) => {
  const [channelNameError, setchannelNameError] = useState('')

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const channels = useSelector(selectors.selectEntities)
  const existingChannels = Object.values(channels).map(c => c.name)

  const channelSchema = object({
    name: string()
      .min(3, `${t('errors.shortName')}`)
      .max(20, `${t('errors.longName')}`)
      .notOneOf(existingChannels, `${t('errors.channelExist')}`)
      .trim()
      .required()
      .test('profanity-check', `${t('errors.profinity')}`, (value) => {
        return !profanityFilter.check(value || '')
      }),
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
        try {
          const newChannelData = await dispatch(updateChannel({ id: channelId, editedChannel }))
          console.log(newChannelData)
          if (!newChannelData || !newChannelData.payload) {
            notify.networkError()
            return
          }
          dispatch(setActiveChannel({ id: channelId, ...editedChannel }))
          // console.log('newChannelData', newChannelData.payload)
          notify.rename()
          onHide()
        }
        catch (err) {
          console.log(err.message)
          notify.networkError()
          return
        }
        // dispatch(setActiveChannel({ id: channelId, ...editedChannel }))
        // console.log('newChannelData', newChannelData.payload)
        // notify.rename()
        // onHide()
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
        <Modal.Title>{t('headers.rename')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Control
              name="name"
              type="name"
              placeholder={t('placeholders.rename')}
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={channelNameError}
              required
              // ref={inputRef}
            />
            <Form.Control.Feedback type="invalid">
              {channelNameError}
            </Form.Control.Feedback>
          </Form>
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('buttons.cancel')}
        </Button>
        <Button variant="primary" onClick={formik.handleSubmit}>
          {t('buttons.send')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RenameChannelModal
