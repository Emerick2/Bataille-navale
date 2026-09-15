import styles from './login.module.css'

export default function Login() {
    return (
        <div>
            <div className={styles.container}>
                <h2>Veuillez vous connectez !</h2> 
                <form action="" className={styles.form} method="post"> 
                    <div>
                        <label htmlFor="">Email</label>
                        <input type="email" className={styles.input}></input>
                    </div>

                    <div>
                        <label htmlFor="">Mot De Passe</label>
                        <input type="password" className={styles.input}></input>
                    </div>
                </form>

                <div>
                    <button className={styles.boutton}>
                        Se connecter
                    </button>
                </div>
            </div>
        </div>
    )
}