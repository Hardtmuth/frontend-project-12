import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, useFormik } from 'formik'
import { Form, Button, Container, Card } from 'react-bootstrap'
import { ToastContainer, Bounce } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import '../styles/AuthPage.css'
import useAuth from '../hooks/index.js'
import routes from '../routes.js'
import notify from '../notifications.js'

const AuthPage = () => {
  const auth = useAuth()
  const inputRef = useRef()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [authFailed, setAuthFailed] = useState(false)
  const [isLoginBtnDisabled, setLoginBtnDisables] = useState(false)

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
      setLoginBtnDisables(true)
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
          setLoginBtnDisables(false)
          inputRef.current.select()
          return
        }
        notify.networkError()
        throw err
      }
    },
  })

  return (
    <Formik>
      <Container max-width="300px">
        <Card>
          <Card.Header className="fw-bold fs-5">{t('headers.brand')}</Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3" controlId="usermane">
                {/* <Form.Label>Username</Form.Label> */}
                <Form.Control
                  name="username"
                  type="name"
                  placeholder={t('placeholders.username')}
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
                  placeholder={t('placeholders.password')}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  autoComplete="current-password"
                  isInvalid={authFailed}
                  required
                />
                <Form.Control.Feedback type="invalid">{t('errors.auth')}</Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" className="float-end" disabled={isLoginBtnDisabled}>
                {t('buttons.login')}
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer>
            <span className="d-flex justify-content-center">
              {t('footer.text')}
              <a href="/signup">{t('footer.href')}</a>
            </span>
          </Card.Footer>
        </Card>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
      </Container>
    </Formik>
  )
}

export default AuthPage
