import { useContext, useState } from 'react'
import { PlayerContext, type Player } from '../../context/PlayerContext'
import stylesNewGame from './NewGame.module.css'
import { useNavigate } from 'react-router'
import {ConnexionALaPartie} from '../../GridFunctionality/ReadingAndWritingTheAPIGrid'

const NewGame = () => {
    const [opponentEmail, setOpponentEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { player, setPlayer } = useContext(PlayerContext)
    const navigate = useNavigate()

    if (!player) {
        return (
            <div className={stylesNewGame.loadingCard}>
                <p className={stylesNewGame.loadingEyebrow}>Connexion au commandement</p>
                <p className={stylesNewGame.loadingText}>Chargement du joueur...</p>
                <div className={stylesNewGame.loadingBar} />
            </div>
        )
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        if (opponentEmail.length >= 3){
            event.preventDefault()
            setErrorMessage('')
            setIsSubmitting(true)

            try {
                const newPlayer : Player | null = await ConnexionALaPartie(undefined, player, opponentEmail);

                if (newPlayer != null) {
                    setPlayer(newPlayer);
                    navigate("/parties");
                } else {
                    setErrorMessage("Impossible de lancer ou rejoindre la partie.");
                }
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Une erreur est survenue.");
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    return (
        <div className={stylesNewGame.page}>
            <p className={stylesNewGame.eyebrow}>Commande navale / 01</p>
            <h1 className={stylesNewGame.titre}>Nouvelle partie</h1>

            <div className={stylesNewGame.card}>
                <form className={stylesNewGame.form} onSubmit={handleSubmit}>
                    <label htmlFor="opponentEmail">
                        E-mail de l’adversaire
                    </label>

                    <input
                        className={stylesNewGame.input}
                        type="email"
                        id="opponentEmail"
                        value={opponentEmail}
                        onChange={(event) => setOpponentEmail(event.target.value)}
                        required
                    />

                    {errorMessage !== '' && (
                        <p className={stylesNewGame.errorMessage}>{errorMessage}</p>
                    )}

                    <button
                        className={stylesNewGame.button}
                        type="submit"
                        disabled={isSubmitting || opponentEmail.trim() === ''}
                    >
                        {isSubmitting ? 'Création...' : 'Créer la partie'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default NewGame