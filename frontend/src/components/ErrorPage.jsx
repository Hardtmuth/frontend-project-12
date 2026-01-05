import { Button, Container, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ErrorPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Container max-width="300px">
      <Card>
        <Card.Header className="fw-bold fs-5">{t('headers.error')}</Card.Header>
        <Card.Body className="text-center fs-1">
          {t('errors.notfound')}
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" type="submit" className="float-end" onClick={() => navigate(-1)}>
            {t('buttons.back')}
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  )
}

export default ErrorPage
