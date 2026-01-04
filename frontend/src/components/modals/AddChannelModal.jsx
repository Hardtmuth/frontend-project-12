import React, { useEffect, useRef } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

import { Formik, useFormik } from 'formik'
import { object, string } from 'yup'
import { useTranslation } from 'react-i18next'

import { fetchChannels, addChannel, setActiveChannel, selectors } from '../../slices/channelsSlice.js'
import notify from '../../notifications.js'
import profanityFilter from '../../profanityFilter.js'

const AddChannelModal = ({ show, onHide }) => {
  // const [channelNameError, setChannelNameError] = useState('')
  const inputChannelName = useRef()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const channels = useSelector(selectors.selectEntities)
  const existingChannels = Object.values(channels).map(c => c.name)

  useEffect(() => {
    if (show && inputChannelName.current) {
      inputChannelName.current.focus()
    }
    console.log('add channel input ref: ', inputChannelName.current)
  }, [show])

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: object({
      name: string()
        .min(3, `${t('errors.shortName')}`)
        .max(20, `${t('errors.longName')}`)
        .notOneOf(existingChannels, `${t('errors.channelExist')}`)
        .trim()
        .required(),
    }),
    onSubmit: async (value) => {
      const safeValue = { name: profanityFilter.clean(value.name) }
      if (safeValue) {
        try {
          const newChannelData = await dispatch(addChannel(safeValue))
          if (!newChannelData || !newChannelData.payload) {
            notify.networkError()
            return
          }
          dispatch(setActiveChannel(newChannelData.payload))
          console.log('newChannelData', newChannelData.payload)
          notify.add()
          formik.resetForm()
          onHide()
        }
        catch (err) {
          console.log(err.message)
          notify.networkError()
          return
        }
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
      <Modal.Header>
        <Modal.Title>{t('headers.add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Label>{t('areas.name')}</Form.Label>
          <Form.Control
            name="name"
            type="text"
            // placeholder={t('placeholders.add')}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            isInvalid={!!formik.errors.name && formik.touched.name}
            required
            ref={inputChannelName}
            autoFocus
            aria-label={t('areas.name')}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.name}
          </Form.Control.Feedback>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={
            () => {
              formik.resetForm()
              onHide()
            }
          }
        >
          {t('buttons.cancel')}
        </Button>
        <Button variant="primary" onClick={formik.handleSubmit}>{t('buttons.send')}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddChannelModal
