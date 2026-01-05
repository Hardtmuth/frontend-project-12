import { useEffect, useRef } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

import { useFormik } from 'formik'
import { object, string } from 'yup'
import { useTranslation } from 'react-i18next'

import { fetchChannels, updateChannel, setActiveChannel, selectors } from '../../slices/channelsSlice.js'
import notify from '../../notifications.js'
import profanityFilter from '../../profanityFilter.js'

const RenameChannelModal = ({ channelId, show, onHide }) => {
  const inputRenameChannelName = useRef()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const channels = useSelector(selectors.selectEntities)
  // const renamedChannelName = Object.values(channels).filter(c => c.id === channelId).map(c => c.name)
  // console.log(renamedChannelName)
  const existingChannels = Object.values(channels).map(c => c.name)

  useEffect(() => {
    if (show && inputRenameChannelName.current) {
      inputRenameChannelName.current.focus()
    }
    console.log('rename channel input ref: ', inputRenameChannelName.current)
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
        .trim(),
    }),
    onSubmit: async (value) => {
      const safeValue = { name: profanityFilter.clean(value.name) }
      // console.log('channelId: ', channelId)
      if (safeValue) {
        try {
          const newChannelData = await dispatch(updateChannel({ id: channelId, editedChannel: safeValue }))
          if (!newChannelData || !newChannelData.payload) {
            notify.networkError()
            return
          }
          dispatch(setActiveChannel(newChannelData.payload))
          console.log('newChannelData', newChannelData.payload)
          formik.resetForm()
          notify.rename()
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
      <Modal.Header closeButton>
        <Modal.Title>{t('headers.rename')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          {/* <Form.Label>{t('areas.name')}</Form.Label> */}
          <Form.Control
            name="name"
            type="text"
            placeholder={t('placeholders.rename')}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            isInvalid={!!formik.errors.name && formik.touched.name}
            autoFocus
            required
            ref={inputRenameChannelName}
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
        <Button variant="primary" onClick={formik.handleSubmit}>
          {t('buttons.send')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RenameChannelModal
