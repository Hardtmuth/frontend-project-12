import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, useFormik } from 'formik'
import { Form, Button, Container, Card } from 'react-bootstrap'
import axios from 'axios';
import './AuthPage.css'

const AuthPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const myStorage = window.localStorage

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2))  // TODO rewrite to axios
    },
  })

  return (
    <Formik>
      <Container max-width="300px">
        <Card>
          <Card.Header>Войти</Card.Header>
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
            />
          </Form.Group>
          <Button variant="primary" type="submit" className='float-end'>
            Войти
          </Button>
        </Form>
          </Card.Body>
          </Card>
      </Container>
    </Formik>
  )
}

export default AuthPage
