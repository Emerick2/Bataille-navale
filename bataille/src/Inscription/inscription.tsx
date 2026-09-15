import styles from './inscription.module.css';

export default function Inscription() {
    return (
        <div>
            <div className={styles.container}>
                <h2>Veuillez vous inscire</h2>
                <form action="" className={styles.form} method="post">
                    <div>
                        <label htmlFor="">Nom</label>
                        <input type="text" className={styles.input}></input>
                    </div>

                    <div>
                        <label htmlFor="">Prénom</label>
                        <input type="text" className={styles.input}></input>
                    </div>

                    <div>
                        <label htmlFor="">Email</label>
                        <input type="email" className={styles.input}></input>
                    </div>

                    <div>
                        <label htmlFor="">Mot De Passe</label>
                        <input type="password" className={styles.input}></input>
                    </div>

                    <div>
                        <button className={styles.boutton}>
                            S'inscrire
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}