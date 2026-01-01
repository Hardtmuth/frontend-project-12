import React from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { Formik, useFormik } from 'formik'

const AddChannelModal = ({ show, onHide }) => {
  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    onSubmit: value => console.log(value),
  })

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
              name="channelName"
              type="name"
              placeholder="Введите имя для новвого канала"
              onChange={formik.handleChange}
              value={formik.values.username}
              // isInvalid={authFailed}
              required
              // ref={inputRef}
            />
          </Form>
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary">Добавить</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddChannelModal
