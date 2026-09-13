import Navbar from "../../components/Navbar/Navbar"
import { Outlet } from "react-router";
import LayoutStyle from './Layout.module.css'
const Layout  = () => {
    return (
        <div className={LayoutStyle.page}>
            <Navbar />
            <main className={LayoutStyle.contenu}>
                <Outlet />
            </main>
        </div>
    )
}


export default Layout