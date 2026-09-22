import { useContext, useState } from 'react'
import { PlayerContext } from '../../context/PlayerContext'
import stylesNewGame from './NewGame.module.css'
import { useNavigate } from 'react-router'

const NewGame = () => {
    const [opponentEmail, setOpponentEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { player } = useContext(PlayerContext)
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

    const createGame = async () => {
        const response = await fetch('http://localhost:8000/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: player.playerHeaders.Authorization,
            },
            body: JSON.stringify({
                minPlayers: 2,
                maxPlayers: 2,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Impossible de créer la partie.')
        }

        return data
    }

    const inviteOpponent = async (gameId: number) => {
        const response = await fetch(`http://localhost:8000/games/${gameId}/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: player.playerHeaders.Authorization,
            },
            body: JSON.stringify({
                email: opponentEmail,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Impossible d’inviter cet adversaire.')
        }

        return data
    }

    const startGame = async (gameId: number) => {
        const response = await fetch(`http://localhost:8000/games/${gameId}/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: player.playerHeaders.Authorization,
            },
            body: JSON.stringify({
                state: '',
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Impossible de démarrer la partie.')
        }

        return data
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setErrorMessage('')
        setIsSubmitting(true)

        try {
            const createdGame = await createGame()
            const gameId = createdGame.id

            console.log('ID de la partie :', gameId)

            const gameWithOpponent = await inviteOpponent(gameId)
            console.log('Partie après invitation :', gameWithOpponent)

            const startedGame = await startGame(gameId)
            console.log('Partie démarrée :', startedGame)
            navigate(`/parties/${startedGame.id}`, { replace: true })
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            } else {
                setErrorMessage('Une erreur inconnue est survenue.')
            }
        } finally {
            setIsSubmitting(false)
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