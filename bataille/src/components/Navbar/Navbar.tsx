import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { AuthContext } from '../../context/AuthContext'
import NavbarStyle from './Navbar.module.css'

const classeLien = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${NavbarStyle.lien} ${NavbarStyle.actif}` : NavbarStyle.lien

const Navbar = () => {
  const { status, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={NavbarStyle.nav}>
      <span className={NavbarStyle.marque}>Bataille<span>·</span>Navale</span>
      <NavLink to="/" end className={classeLien}>Accueil</NavLink>
      <NavLink to="/credits" className={classeLien}>Crédits</NavLink>

      {status === 'authenticated' ? (
        <>
          <NavLink to="/parties" end className={classeLien}>Mes parties</NavLink>
          <NavLink to="/parties/nouvelle" className={classeLien}>Nouvelle partie</NavLink>
          <NavLink to="/historique" className={classeLien}>Historique</NavLink>
          <button
            type="button"
            className={NavbarStyle.lien}
            onClick={handleLogout}
            style={{ background: 'none', border: 0, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Déconnexion
          </button>
        </>
      ) : status === 'anonymous' ? (
        <div className={NavbarStyle.navBarRight}>
          <NavLink to="/connexion" className={classeLien}>Connexion</NavLink>
          <NavLink to="/inscription" className={classeLien}>Inscription</NavLink>
        </div>
      ) : null}

    </nav>
  )
}

export default Navbar;