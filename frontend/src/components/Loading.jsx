import { Container, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Loading = () => {
  const { t } = useTranslation()

  return (
    <Container max-width="300px">
      <Card>
        <Card.Header className="fw-bold fs-5">{t('headers.warning')}</Card.Header>
        <Card.Body className="text-center fs-1">
          {t('content.loading')}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Loading
