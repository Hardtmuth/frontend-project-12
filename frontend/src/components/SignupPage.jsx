import { useEffect, useRef } from 'react'
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

  // const [isSignupBtnDisabled, setSignupBtnDisabled] = useState(false)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirm: '',
    },
    validationSchema: object({
      username: string()
        .min(3, `${t('errors.longName')}`)
        .max(20, `${t('errors.longName')}`)
        .trim()
        .required(`${t('errors.requried')}`),
      password: string()
        .min(6, `${t('errors.shortName')}`)
        .trim()
        .required(`${t('errors.requried')}`),
      confirm: string()
        .trim()
        .required(`${t('errors.requried')}`)
        .oneOf([ref('password'), null], `${t('errors.confirm')}`),
    }),
    onSubmit: async (values) => {
      const { username, password } = values
      formik.setSubmitting(false)
      try {
        const res = await axios.post(routes.signupPath(), { username, password })
        localStorage.setItem('userId', JSON.stringify(res.data))
        auth.logIn()
        navigate('/')
      }
      catch (err) {
        // formik.setSubmitting(false)
        if (err.isAxiosError && (err.response.status === 401 || err.response.status === 409)) {
          formik.errors.username = t('errors.exist')
          // setSignupBtnDisabled(false)
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
          <Card.Header className="fw-bold fs-5">{t('headers.signup')}</Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3" controlId="usermane">
                <Form.Label>{t('placeholders.signupUsername')}</Form.Label>
                <Form.Control
                  name="username"
                  type="name"
                  // placeholder={t('placeholders.signupUsername')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  isInvalid={!!formik.errors.username && formik.touched.username}
                  required
                  ref={inputRef}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.username}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="Password">
                <Form.Label>{t('placeholders.password')}</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  // placeholder={t('placeholders.password')}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  autoComplete="current-password"
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.password && formik.touched.password}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="Confirm">
                <Form.Label>{t('placeholders.confirm')}</Form.Label>
                <Form.Control
                  name="confirm"
                  type="password"
                  // placeholder={t('placeholders.confirm')}
                  onChange={formik.handleChange}
                  value={formik.values.confirm}
                  autoComplete="current-password"
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.confirm && formik.touched.confirm}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.confirm}
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" className="float-end ms-2">
                {t('buttons.signup')}
              </Button>
              <Button variant="secondary" type="submit" className="float-end" onClick={() => navigate(-1)}>
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
