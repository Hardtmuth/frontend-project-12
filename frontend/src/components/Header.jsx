import { Navbar, Button } from 'react-bootstrap'
import useAuth from '../hooks/index.js'

const Header = () => {
  const auth = useAuth()

  const handleExit = () => {
    console.log('Exit')
    auth.logOut()
  }
  return (
    <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
      <Navbar.Brand href="/" className="mx-4">Hexlet Chat</Navbar.Brand>
      {
        auth.loggedIn
          ? <Button type="submit" className="mx-4" onClick={handleExit}>Выйти</Button>
          : null
      }
    </Navbar>
  )
}

export default Header
