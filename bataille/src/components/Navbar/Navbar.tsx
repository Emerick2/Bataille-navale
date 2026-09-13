import { NavLink, Link } from "react-router";
import NavbarStyle from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className={NavbarStyle.nav}>
            {/* NavLink pour la page d'accueil avec gestion de la classe active */}
            <NavLink 
                to="/" 
                end 
                className={({ isActive }) =>
                    isActive ? `${NavbarStyle.lien} ${NavbarStyle.actif}` : NavbarStyle.lien
                }
            >
                Accueil
            </NavLink>

           
            <Link to="/parties">parties</Link>
            <Link to="/parties/nouvelle">nouvelle_parties</Link>
            
            
            <Link to="/parties/:id">ecran de jeu</Link>
            
            <Link to="/historique">historique</Link>
            <Link to="/connexion">connexion</Link>
            <Link to="/inscription">inscription</Link>
        </nav>
    );
};

export default Navbar;
