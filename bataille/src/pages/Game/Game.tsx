import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { PlayerContext } from '../../context/PlayerContext'

type GameData = {
    id: number
    creatorId: number
    minPlayers: number
    maxPlayers: number
    status: string
    state?: string
    currentTurnUserId?: number
}

const Game = () => {
    const { id } = useParams()
    const { player } = useContext(PlayerContext)

    const [game, setGame] = useState<GameData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const loadGame = async () => {
            if (!id || !player) {
                setErrorMessage('Partie ou joueur introuvable.')
                setIsLoading(false)
                return
            }

            try {
                setErrorMessage('')
                setIsLoading(true)

                const response = await fetch(`http://localhost:8000/games/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: player.playerHeaders.Authorization,
                    },
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Impossible de charger la partie.')
                }

                setGame(data)
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message)
                } else {
                    setErrorMessage('Une erreur inconnue est survenue.')
                }
            } finally {
                setIsLoading(false)
            }
        }

        loadGame()
    }, [id, player])

    if (isLoading) {
        return <h1>Chargement de la partie...</h1>
    }

    if (errorMessage !== '') {
        return <h1>{errorMessage}</h1>
    }

    if (!game) {
        return <h1>Aucune partie trouvée.</h1>
    }

    return (
        <div>
            <h1>Écran de jeu</h1>
            <p>Identifiant de la partie : {game.id}</p>
            <p>Statut : {game.status}</p>
            <p>Créateur : {game.creatorId}</p>
            <p>Tour actuel : {game.currentTurnUserId}</p>
            <p>{player?.userId === game.currentTurnUserId ? "C'est ton tour." : "Ce n'est pas ton tour."}</p>
        </div>
    )
}

export default Game