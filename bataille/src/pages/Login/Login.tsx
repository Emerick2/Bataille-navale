import { useContext, useState } from 'react'
import styles from './Login.module.css'
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext, isAuthSession } from '../../context/AuthContext'

export default function Login() {
    const [email, setEmail] = useState(""); 
    const [motDePasse, setMotDePasse] = useState("");
    const [erreur, setErreur] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
            e.preventDefault();
    
        try {
            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: motDePasse
                }) 
            })

            const payload: unknown = await response.json();
            if (!response.ok || !isAuthSession(payload)) {
                setErreur("Erreur de connexion veuillez réesayer !");
                return;
            }

            login(payload);
            navigate("/parties");
        } catch {
            setErreur("Erreur de connexion veuillez réesayer !");
        }
        }
    return (
        <div>
            <div className={styles.container}>
                <h2>Veuillez vous connectez !</h2> 
                <form action="" onSubmit={handleSubmit} className={styles.form} method="post"> 
                    <div>
                        <label htmlFor="">Email</label>
                        <input 
                            type="email" className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="">Mot De Passe</label>
                        <input 
                            type="password" className={styles.input}
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                        />
                    </div>
                
                    <div>
                        {erreur && <p>{erreur}</p>}
                        <button className={styles.boutton}>
                            Se connecter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}