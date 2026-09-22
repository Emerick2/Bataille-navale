import { useContext, useState } from 'react'
import styles from './Login.module.css'
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import {PlayerContext, type GameData, type Player} from '../../context/PlayerContext';

export default function Login() {
    const [email, setEmail] = useState(""); 
    const [motDePasse, setMotDePasse] = useState("");
    const [token, setToken] = useState("");
    const [erreur, setErreur] = useState("");
    const navigate = useNavigate();
    const { player, setPlayer } = useContext(PlayerContext);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
            e.preventDefault();
    
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

            const data = await response.json(); 
            const playerHeaders = { Authorization: `Bearer ${data.token}` }
            const player : Player = {
                player : null,
                playerHeaders: playerHeaders,
                userId: data.user.id,
            }
            setPlayer(player);

            if (response.ok) {
                setToken(data.token);
                navigate("/parties")
                console.log("Connexion réussie !")
            } else {
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