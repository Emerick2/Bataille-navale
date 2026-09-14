import { NavLink } from "react-router";
import NavbarStyle from './Navbar.module.css';

const classeLien = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${NavbarStyle.lien} ${NavbarStyle.actif}` : NavbarStyle.lien;

const Navbar = () => {
    return (
        <nav className={NavbarStyle.nav}>
            <span className={NavbarStyle.marque}>Bataille<span>·</span>Navale</span>
            <NavLink to="/" end className={classeLien}>Accueil</NavLink>
            <NavLink to="/parties" end className={classeLien}>Mes parties</NavLink>
            <NavLink to="/parties/nouvelle" className={classeLien}>Nouvelle partie</NavLink>
            <NavLink to="/historique" className={classeLien}>Historique</NavLink>
            <NavLink to="/connexion" className={classeLien}>Connexion</NavLink>
            <NavLink to="/inscription" className={classeLien}>Inscription</NavLink>
        </nav>
    );
};

export default Navbar;