import { Navbar, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import useAuth from '../hooks/index.js'

const Header = () => {
  const auth = useAuth()
  const { t } = useTranslation()

  const handleExit = () => {
    console.log('Exit')
    auth.logOut()
  }
  return (
    <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
      <Navbar.Brand href="/" className="mx-4">{t('headers.brand')}</Navbar.Brand>
      {
        auth.loggedIn
          ? <Button type="submit" className="mx-4" onClick={handleExit}>{t('buttons.logout')}</Button>
          : null
      }
    </Navbar>
  )
}

export default Header
