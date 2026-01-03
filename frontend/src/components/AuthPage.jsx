import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, useFormik } from 'formik'
import { Form, Button, Container, Card } from 'react-bootstrap'
import axios from 'axios'
import '../styles/AuthPage.css'
import useAuth from '../hooks/index.js'
import routes from '../routes.js'

const AuthPage = () => {
  const auth = useAuth()
  const [authFailed, setAuthFailed] = useState(false)
  const inputRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false)

      try {
        const res = await axios.post(routes.loginPath(), values)
        localStorage.setItem('userId', JSON.stringify(res.data))
        auth.logIn()
        navigate('/')
      }
      catch (err) {
        formik.setSubmitting(false)
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true)
          inputRef.current.select()
          return
        }
        throw err
      }
    },
  })

  return (
    <Formik>
      <Container max-width="300px">
        <Card>
          <Card.Header className="fw-bold fs-5">Hexlet Chat</Card.Header>
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
                  isInvalid={authFailed}
                  required
                  ref={inputRef}
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
                  isInvalid={authFailed}
                  required
                />
                <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" className="float-end">
                Войти
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer>
            <span className="d-flex justify-content-center">
              Нет аккаунта?
              <a href="/signup">Регистрация</a>
            </span>
          </Card.Footer>
        </Card>
      </Container>
    </Formik>
  )
}

export default AuthPage
