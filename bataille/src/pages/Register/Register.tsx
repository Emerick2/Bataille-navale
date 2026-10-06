import { useContext, useState } from 'react';
import type { FormEvent } from 'react';
import styles from './Register.module.css';
import { useNavigate } from 'react-router';
import { AuthContext, isAuthSession } from '../../context/AuthContext';

export default function Register() {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [erreur, setErreur] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/auth/signup", {
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
                setErreur("Erreur d'inscription veuillez réesayer !");
                return;
            }

            login(payload);
            navigate("/parties/nouvelle");
        } catch {
            setErreur("Erreur d'inscription veuillez réesayer !");
        }
    }
    
    return (
        <div>
            <div className={styles.container}>
                <h2>Veuillez vous inscire</h2>
                <form action="" onSubmit={handleSubmit} className={styles.form}  method="post">
                    
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
                            S'inscrire
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 
