import React from 'react'
import { Formik, useFormik } from 'formik'
import { Form, Button, Container } from 'react-bootstrap'
import './AuthPage.css'

const AuthPage = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2))
    },
  })

  return (
    <Formik>
      <Container max-width="300px">
        <h1>This is Auth Page</h1>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="usermane">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              type="name"
              placeholder="Username"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="Password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </Formik>
  )
}

export default AuthPage
