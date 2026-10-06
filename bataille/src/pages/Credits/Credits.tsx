import styles from './Credits.module.css'


export default function Credits() {

    return (
        <div className={styles.container}>
            <h1>Crédits</h1>
            <p>Membres de l'équipe :</p>
            <ul className={styles.equipe}>
                <li>Émerick Pacaud</li>
                <li>Armel Zion</li>
                <li>Paul-Elie Kouakou</li>
            </ul>   
            <p>Technologies utilisées :</p>
            <ul className={styles.techno}>
                <li>React</li>
                <li>TypeScript</li>
                <li>Vite</li>
                <li>React Router</li>
                <li>CSS Modules</li>
                <li>Deno</li>
                <li>SQLite</li>
            </ul>          
        </div>
    )
}