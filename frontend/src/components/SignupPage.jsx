import React from 'react'
import { Formik, useFormik } from 'formik'
import { Form, Button, Container, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const SignupPage = () => {
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirm: '',
    },
    onSubmit: async (values) => {
      console.log(values)
    },
  })

  return (
    <Formik>
      <Container max-width="300px">
        <Card>
          <Card.Header className="fw-bold fs-5">Регистрация</Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3" controlId="usermane">
                {/* <Form.Label>Username</Form.Label> */}
                <Form.Control
                  name="username"
                  type="name"
                  placeholder="Имя пользователя"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  // isInvalid={authFailed}
                  required
                  // ref={inputRef}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="Password">
                {/* <Form.Label>Password</Form.Label> */}
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Пароль"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  autoComplete="current-password"
                  // isInvalid={authFailed}
                  required
                />
                <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="Confirm">
                {/* <Form.Label>Password</Form.Label> */}
                <Form.Control
                  name="confirm"
                  type="password"
                  placeholder="Подтвердите пароль"
                  onChange={formik.handleChange}
                  value={formik.values.confirm}
                  autoComplete="current-password"
                  // isInvalid={authFailed}
                  required
                />
                <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" className="float-end ms-2">
                Зарегистрироваться
              </Button>
              <Button variant="secondary" type="submit" className="float-end" onClick={() => navigate(-1)}>
                Назад
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Formik>
  )
}

export default SignupPage
