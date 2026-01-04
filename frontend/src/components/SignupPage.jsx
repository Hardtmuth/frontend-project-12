import React, { useEffect, useRef, useState } from 'react'
import { Formik, useFormik } from 'formik'
import { Form, Button, Container, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { object, string, ref } from 'yup'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

import routes from '../routes.js'
import useAuth from '../hooks/index.js'

const SignupPage = () => {
  const navigate = useNavigate()
  const inputRef = useRef()
  const auth = useAuth()
  const { t } = useTranslation()

  const [signupFailedUsername, setSignupFailedUsername] = useState(false)
  const [signupFailedPassword, setSignupFailedPassword] = useState(false)
  const [signupFailedConfirm, setSignupFailedConfirm] = useState(false)
  const [isSignupBtnDisabled, setSignupBtnDisabled] = useState(false)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const channelSchema = object({
    username: string()
      .min(3, `${t('errors.shortName')}`)
      .max(20, `${t('errors.longName')}`)
      .trim()
      .required(),
    password: string()
      .min(6, `${t('errors.shortName')}`)
      .trim()
      .required(),
    confirm: string()
      .trim()
      .required()
      .oneOf([ref('password'), null], `${t('errors.confirm')}`),
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirm: '',
    },
    onSubmit: async (values) => {
      setSignupFailedUsername(false)
      setSignupFailedPassword(false)
      setSignupFailedConfirm(false)
      console.log('values is: ', values)
      const newUserData = async () => {
        try {
          const result = await channelSchema.validate(values, { abortEarly: false })
          return result
        }
        catch (error) {
          const fieldErrors = {}
          error.inner.forEach((err) => {
            fieldErrors[err.path] = err.message
          })
          console.log('fieldErrors is: ', fieldErrors)
          setSignupFailedUsername(fieldErrors.username)
          setSignupFailedPassword(fieldErrors.password)
          setSignupFailedConfirm(fieldErrors.confirm)
        }
      }
      const userData = await newUserData()
      if (userData !== undefined) {
        const { username, password } = userData
        setSignupBtnDisabled(true)
        try {
          const res = await axios.post(routes.signupPath(), { username, password })
          localStorage.setItem('userId', JSON.stringify(res.data))
          auth.logIn()
          navigate('/')
        }
        catch (err) {
          formik.setSubmitting(false)
          if (err.isAxiosError && (err.response.status === 401 || err.response.status === 409)) {
            setSignupFailedUsername(t('errors.exist'))
            setSignupBtnDisabled(false)
            inputRef.current.select()
            return
          }
          throw err
        }
      }
      console.log('validated data: ', userData)
    },
  })

  return (
    <Formik>
      <Container max-width="300px">
        <Card>
          <Card.Header className="fw-bold fs-5">{t('headers.signup')}</Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3" controlId="usermane">
                {/* <Form.Label>Username</Form.Label> */}
                <Form.Control
                  name="username"
                  type="name"
                  placeholder={t('placeholders.signupUsername')}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  isInvalid={signupFailedUsername}
                  required
                  ref={inputRef}
                />
                <Form.Control.Feedback type="invalid">
                  {signupFailedUsername}
                </Form.Control.Feedback>
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
                  isInvalid={signupFailedPassword}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {signupFailedPassword}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="Confirm">
                {/* <Form.Label>Password</Form.Label> */}
                <Form.Control
                  name="confirm"
                  type="password"
                  placeholder={t('placeholders.confirm')}
                  onChange={formik.handleChange}
                  value={formik.values.confirm}
                  autoComplete="current-password"
                  isInvalid={signupFailedConfirm}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {signupFailedConfirm}
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" className="float-end ms-2" disabled={isSignupBtnDisabled}>
                {t('buttons.signup')}
              </Button>
              <Button variant="secondary" type="submit" className="float-end" onClick={() => navigate(-1)} disabled={isSignupBtnDisabled}>
                {t('buttons.back')}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Formik>
  )
}

export default SignupPage
